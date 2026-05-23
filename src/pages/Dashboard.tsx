import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { LogOut, ShieldCheck, Cpu, AlertTriangle } from 'lucide-react';

interface Team {
  id_kelompok: string;
  nama_kelompok: string;
  deskripsi: string;
}

export default function Dashboard() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  
  // State untuk Custom Modal Konfirmasi
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, teamId: '', teamName: '' });

  useEffect(() => {
    const checkStatusAndFetch = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User tidak ditemukan.");
        setUserEmail(user.email || "");

        const { data: voteData, error: voteError } = await supabase.from('voting').select('*').eq('email_voter', user.email);
        if (voteError) throw voteError;
        if (voteData && voteData.length > 0) { setHasVoted(true); return; }

        const { data: userData, error: userError } = await supabase.from('peserta').select('id_kelompok').eq('email', user.email).single();
        if (userError) throw userError;

        const { data: teamsData, error: teamsError } = await supabase.from('kelompok').select('*').neq('id_kelompok', userData?.id_kelompok || '');
        if (teamsError) throw teamsError;
        setTeams(teamsData || []);

      } catch (err) {
        setErrorMsg((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    checkStatusAndFetch();
  }, []);

  const executeVote = async () => {
    try {
      setConfirmModal(prev => ({ ...prev, isOpen: false })); // Tutup modal dulu
      setLoading(true); // Tampilkan loading sebentar biar kerasa 'memproses'
      
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('voting').insert({ email_voter: user?.email, id_kelompok_voted: confirmModal.teamId });
      
      if (error) throw error;
      setHasVoted(true);
    } catch (err) {
      alert("Sistem mendeteksi anomali. Gagal mengirim suara.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.replace('/login');
  };

  if (loading) return <div className="min-h-[100svh] bg-bwai-bg flex items-center justify-center"><div className="w-10 h-10 border-4 border-bwai-googleBlue border-t-transparent rounded-full animate-spin"></div></div>;

  if (errorMsg) return (
    // ... UI Error Tetap Sama ...
    <div className="min-h-[100svh] bg-bwai-bg flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/50">
        <p className="text-bwai-googleRed font-pixel text-sm mb-2">SYSTEM HALTED</p>
        <p className="text-gray-300 text-sm">{errorMsg}</p>
        <button onClick={handleLogout} className="mt-6 bg-white/10 px-6 py-3 rounded-xl w-full">Keluar</button>
      </div>
    </div>
  );

  if (hasVoted) return (
    // ... UI Locked Tetap Sama ...
    <div className="min-h-[100svh] bg-bwai-bg bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#132A1D] to-bwai-bg flex flex-col items-center justify-center text-center p-6 relative">
      <button onClick={handleLogout} className="absolute top-6 right-6 text-gray-500 hover:text-white p-2 bg-white/5 rounded-full"><LogOut size={20} /></button>
      <div className="animate-bounce mb-6"><ShieldCheck size={80} className="text-bwai-googleGreen drop-shadow-[0_0_30px_rgba(52,168,83,0.8)]" /></div>
      <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">AGENT SECURED</h1>
      <p className="text-gray-400 mb-8">Suara Anda telah dienkripsi dan masuk ke dalam sistem The Arena.</p>
      <div className="bg-black/40 px-6 py-3 rounded-full border border-bwai-googleGreen/30">
        <p className="text-bwai-googleGreen text-xs font-pixel tracking-widest">PLEASE LOOK AT THE SCREEN</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-[100svh] bg-bwai-bg pb-20 relative">
      {/* Sticky Header untuk HP */}
      <div className="sticky top-0 z-40 bg-bwai-bg/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2"><Cpu size={18} className="text-bwai-googleBlue"/> THE ARENA</h1>
          <p className="text-[10px] text-gray-400 truncate w-48">{userEmail}</p>
        </div>
        <button onClick={handleLogout} className="bg-red-500/10 text-bwai-googleRed p-2 rounded-lg"><LogOut size={18} /></button>
      </div>

      {/* List Tim */}
      <div className="p-6 max-w-md mx-auto w-full">
        <div className="mb-6">
          <p className="text-bwai-googleYellow font-pixel text-[10px] tracking-wider mb-2">LIVE VOTING</p>
          <h2 className="text-2xl font-bold text-white leading-tight">Pilih Inovasi<br/>Terbaik.</h2>
        </div>

        <div className="flex flex-col gap-4">
          {teams.map((team, index) => (
            <div key={team.id_kelompok} className="bg-white/5 border border-white/10 p-5 rounded-2xl active:scale-[0.98] transition-transform">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-gray-500 font-pixel text-[10px]">TEAM {String(index + 1).padStart(2, '0')}</span>
                  <h3 className="text-xl font-bold text-white mt-1">{team.nama_kelompok}</h3>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-6 line-clamp-2">{team.deskripsi}</p>
              
              {/* Tombol Vote Buka Modal, Bukan Alert! */}
              <button 
                onClick={() => setConfirmModal({ isOpen: true, teamId: team.id_kelompok, teamName: team.nama_kelompok })}
                className="w-full bg-white/10 text-bwai-googleBlue font-bold py-4 rounded-xl shadow-[0_0_15px_rgba(66,133,244,0.1)] hover:bg-bwai-googleBlue hover:text-white transition-all border border-bwai-googleBlue/30"
              >
                AUTHORIZE VOTE
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CUSTOM CONFIRMATION MODAL (GLASSMORPHISM) */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center px-4 pb-10 sm:p-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-bwai-card w-full max-w-sm rounded-3xl p-6 border border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4 mx-auto border border-red-500/20">
              <AlertTriangle className="text-bwai-googleRed" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-1">Konfirmasi Final</h3>
            <p className="text-gray-400 text-center text-sm mb-6">
              Apakah Anda yakin ingin memberikan suara untuk <span className="font-bold text-white">{confirmModal.teamName}</span>? Pilihan tidak dapat diubah.
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmModal({ isOpen: false, teamId: '', teamName: '' })}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-300 bg-white/5 hover:bg-white/10 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={executeVote}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-bwai-googleBlue shadow-[0_0_20px_rgba(66,133,244,0.4)] hover:bg-blue-600 transition-all active:scale-95"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}