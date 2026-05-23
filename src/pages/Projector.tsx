import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Lock, Unlock, Eye, Trophy, Hexagon } from 'lucide-react';

interface Team {
  id_kelompok: string;
  nama_kelompok: string;
  total_vote: number;
}

export default function Projector() {
  const [standings, setStandings] = useState<Team[]>([]);
  const [revealLevel, setRevealLevel] = useState(0); 

  useEffect(() => {
    const fetchStandings = async () => {
      const { data } = await supabase.from('leaderboard_view').select('*');
      setStandings(data || []);
    };
    fetchStandings();
    
    const voteSub = supabase.channel('live-voting')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'voting' }, () => { fetchStandings(); })
      .subscribe();
      
    return () => { supabase.removeChannel(voteSub); };
  }, []);

  // Logika Sensor
  const getTeamName = (team: Team, index: number) => {
    if (revealLevel === 0) return "[ DATA ENCRYPTED ]";
    if (revealLevel === 1 && index > 0) return team.nama_kelompok; 
    if (revealLevel === 2) return team.nama_kelompok; 
    return "[ DATA ENCRYPTED ]";
  };

  return (
    <div className="h-[100svh] w-full bg-[#090514] overflow-hidden font-sans relative flex flex-col items-center">
      
      {/* 🌌 BACKGROUND EFFECTS (Cyber Grid & Glow) */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-bwai-googleBlue/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[500px] bg-bwai-googleRed/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

      {/* 🎬 OFFICIAL BROADCAST HEADER */}
      <header className="w-full pt-10 pb-6 flex flex-col items-center z-10">
        <div className="flex items-center gap-10 bg-white/5 px-10 py-4 rounded-full border border-white/10 backdrop-blur-md shadow-2xl mb-8">
          <img src="/logo.png" alt="GDGoC" className="h-10 object-contain drop-shadow-md" />
          <div className="w-[1px] h-8 bg-white/20"></div>
          <img src="/Group 914.png" alt="BWAI" className="h-12 object-contain drop-shadow-md transform scale-110" />
          <div className="w-[1px] h-8 bg-white/20"></div>
          <img src="/Group 1000006496.png" alt="Juara Vibe Coding" className="h-10 object-contain drop-shadow-md" />
        </div>
        
        <div className="text-center flex flex-col items-center">
          <h1 className="text-xl text-bwai-googleYellow font-pixel tracking-[0.5em] mb-2 uppercase drop-shadow-[0_0_10px_rgba(251,188,5,0.5)]">
            Official Live Standings
          </h1>
          <h2 className="text-6xl font-black text-white tracking-tighter uppercase drop-shadow-2xl flex items-center gap-4">
            <Hexagon className="text-bwai-googleBlue" size={40} />
            THE ARENA LEADERBOARD
            <Hexagon className="text-bwai-googleRed" size={40} />
          </h2>
        </div>
      </header>

      {/* 📊 LEADERBOARD CARDS */}
      <div className="w-full max-w-[1300px] flex flex-col gap-5 z-10 px-8 mt-4 relative">
        {standings.slice(0, 5).map((team, index) => {
          const isRevealed = getTeamName(team, index) !== "[ DATA ENCRYPTED ]";
          const isRank1 = index === 0;

          return (
            <div 
              key={team.id_kelompok} 
              className={`w-full relative overflow-hidden rounded-2xl flex items-center transition-all duration-[1500ms] backdrop-blur-xl border-y border-r
                ${isRevealed ? 'bg-white/10 border-white/20' : 'bg-[#120C1F]/80 border-gray-800'}
                ${isRank1 && isRevealed ? 'h-32 shadow-[0_0_50px_rgba(251,188,5,0.15)] bg-gradient-to-r from-yellow-900/40 to-transparent border-white/30 scale-[1.02]' : 'h-24'}
              `}
            >
              {/* Garis Kiri Penanda Peringkat */}
              <div className={`absolute left-0 top-0 bottom-0 w-3 
                ${isRank1 && isRevealed ? 'bg-bwai-googleYellow shadow-[0_0_20px_rgba(251,188,5,1)]' : 'bg-gray-600'}
                ${isRevealed && !isRank1 ? 'bg-bwai-googleBlue' : ''}
              `}></div>

              {/* Angka Peringkat */}
              <div className="w-32 flex justify-center items-center">
                {isRank1 && isRevealed ? (
                  <Trophy className="text-bwai-googleYellow drop-shadow-[0_0_15px_rgba(251,188,5,0.8)] animate-pulse" size={56} />
                ) : (
                  <span className={`text-5xl font-black italic
                    ${isRevealed ? 'text-white' : 'text-gray-600'}
                  `}>
                    0{index + 1}
                  </span>
                )}
              </div>
              
              <div className="flex-1 pr-8">
                {/* Nama Tim */}
                <h3 className={`font-black uppercase tracking-wide transition-all duration-700
                  ${isRank1 && isRevealed ? 'text-4xl text-bwai-googleYellow mb-2 drop-shadow-md' : 'text-3xl text-white mb-2'}
                  ${!isRevealed ? 'text-bwai-googleRed font-pixel text-xl tracking-widest opacity-80 animate-pulse' : ''}
                `}>
                  {getTeamName(team, index)}
                </h3>
                
                {/* Visual Bar Chart */}
                <div className="w-full bg-black/60 h-4 rounded-full overflow-hidden border border-white/5 relative">
                  {/* Efek Garis Bergerak di dalam Bar */}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBsNDAtNDBIMHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-20"></div>
                  
                  <div 
                    className={`h-full transition-all duration-[2000ms] ease-out rounded-full relative z-10
                      ${isRank1 ? 'bg-bwai-googleYellow shadow-[0_0_15px_rgba(251,188,5,1)]' : 'bg-bwai-googleBlue'}
                      ${!isRevealed ? 'bg-gray-500' : ''}
                    `}
                    style={{ width: `${Math.max((team.total_vote / 153) * 100, 1)}%` }} 
                  ></div>
                </div>
              </div>
              
              {/* Jumlah Vote (Skor) */}
              <div className="w-48 h-full bg-black/40 flex flex-col items-center justify-center border-l border-white/10">
                <span className={`font-black leading-none
                  ${isRank1 && isRevealed ? 'text-6xl text-bwai-googleYellow' : 'text-5xl text-white'}
                  ${!isRevealed ? 'text-gray-500 blur-[4px]' : ''}
                `}>
                  {team.total_vote}
                </span>
                <p className="text-gray-400 text-xs tracking-[0.4em] font-bold mt-1">VOTES</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🎛️ INVISIBLE ADMIN CONTROLS (Muncul saat mouse diarahkan ke bawah layar) */}
      <div className="absolute bottom-0 w-full h-24 flex items-center justify-center bg-gradient-to-t from-black to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 z-50">
        <div className="px-4 py-2 bg-black/80 backdrop-blur-md rounded-full border border-gray-700 flex gap-2">
          <button onClick={() => setRevealLevel(0)} className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 text-sm transition-all ${revealLevel === 0 ? 'bg-bwai-googleRed text-white' : 'text-gray-400 hover:bg-white/10'}`}>
            <Lock size={16} /> SECURE DATA
          </button>
          <button onClick={() => setRevealLevel(1)} className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 text-sm transition-all ${revealLevel === 1 ? 'bg-bwai-googleBlue text-white' : 'text-gray-400 hover:bg-white/10'}`}>
            <Eye size={16} /> REVEAL 2-5
          </button>
          <button onClick={() => setRevealLevel(2)} className={`px-8 py-2 rounded-full font-bold flex items-center gap-2 text-sm transition-all ${revealLevel === 2 ? 'bg-bwai-googleGreen text-black' : 'text-bwai-googleYellow hover:bg-white/10'}`}>
            <Unlock size={16} /> REVEAL CHAMPION
          </button>
        </div>
      </div>
      
    </div>
  );
}