import { supabase } from '../supabaseClient';
import { Fingerprint } from 'lucide-react';

export default function Login() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` }
    });
  };

  return (
    <div className="min-h-[100svh] bg-bwai-bg bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2A1F45] to-bwai-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Ornamen Latar Belakang (Cyberpunk/Tech Vibe) */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-bwai-googleBlue rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-bwai-googleRed rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-pulse delay-1000"></div>

      <div className="w-full max-w-sm z-10 flex flex-col items-center">
        {/* Logo/Branding Event */}
        <div className="mb-8 text-center">
          <p className="text-bwai-googleYellow font-pixel text-[9px] tracking-[0.3em] mb-3">#JuaraVibeCoding</p>
          <h1 className="text-5xl font-bold text-white mb-1 tracking-tight">
            Arena<span className="text-transparent bg-clip-text bg-gradient-to-r from-bwai-googleBlue to-blue-300">Vote</span>
          </h1>
          <p className="text-gray-400 text-xs tracking-widest mt-2 uppercase">GDGoC STT Terpadu Nurul Fikri</p>
        </div>

        {/* Kotak Kredensial */}
        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 text-center w-full shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Fingerprint className="text-bwai-googleBlue" size={32} />
          </div>
          
          <h2 className="text-lg font-bold text-white mb-2">Agent Clearance</h2>
          <p className="text-gray-400 text-sm mb-8">Login dengan email terdaftar untuk memberikan suara.</p>
          
          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-white text-black font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-200 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
            Lanjutkan Akses
          </button>
        </div>
        
        <p className="mt-10 text-[10px] text-gray-500 font-pixel text-center leading-relaxed">
          BUILD WITH AI 2026<br/>THE AI AGENT ARENA
        </p>
      </div>
    </div>
  );
}