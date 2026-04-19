"use client";
import { useRouter } from "next/navigation";
import { Users, Beer, Wine, Search, Lightbulb, Cocktail, GlassWater } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ members: "3", previousDrink: "ビール" });

  const handleSearch = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const params = new URLSearchParams({ ...formData, lat: String(p.coords.latitude), lng: String(p.coords.longitude) });
        router.push(`/results?${params.toString()}`);
      },
      () => {
        const params = new URLSearchParams({ ...formData, lat: "35.6812", lng: "139.7671" });
        router.push(`/results?${params.toString()}`);
      },
      { timeout: 5000 }
    );
  };

  return (
    <main className="min-h-screen bg-white relative overflow-hidden flex flex-col items-center justify-center p-6">
      <div className="absolute inset-0 bg-dot opacity-10"></div>
      
      {/* 散りばめられたお酒アイコン */}
      <Beer className="absolute top-[15%] left-[10%] text-yellow-400 opacity-30 animate-float" size={60} />
      <Wine className="absolute top-[20%] right-[10%] text-red-400 opacity-30 animate-float" style={{animationDelay:'1s'}} size={50} />
      <Cocktail className="absolute bottom-[20%] left-[15%] text-pink-400 opacity-30 animate-float" style={{animationDelay:'2s'}} size={60} />
      <GlassWater className="absolute bottom-[10%] right-[15%] text-blue-400 opacity-30 animate-float" style={{animationDelay:'0.5s'}} size={50} />

      <div className="max-w-md w-full relative z-10 space-y-10">
        <div className="text-center flex flex-col items-center">
          <div className="w-24 h-24 border-4 border-[#333] rounded-full flex items-center justify-center bg-white shadow-[6px_6px_0px_#FFD700] mb-4">
            <Lightbulb size={48} className="text-[#333]" />
          </div>
          <h1 className="text-4xl font-black text-[#333] tracking-tighter uppercase">2軒目研究所</h1>
          <p className="text-gray-500 font-bold">AIが選ぶ最高のゴール。</p>
        </div>

        <div className="bg-white lab-card p-8 space-y-6">
          <div className="space-y-4 font-black text-[#333]">
            <div className="flex items-center gap-4 border-b-4 border-[#333] pb-2">
              <Users className="text-pink-500" size={24} />
              <input type="number" value={formData.members} onChange={e => setFormData({...formData, members: e.target.value})} className="w-full text-2xl outline-none bg-transparent" />
              <span>人</span>
            </div>
            <div className="flex items-center gap-4 border-b-4 border-[#333] pb-2">
              <Beer className="text-yellow-500" size={24} />
              <input type="text" value={formData.previousDrink} onChange={e => setFormData({...formData, previousDrink: e.target.value})} className="w-full text-xl outline-none bg-transparent" placeholder="ビール..." />
            </div>
          </div>
          <button onClick={handleSearch} disabled={loading} className="w-full h-16 bg-[#FFEE00] border-4 border-[#333] rounded-2xl font-black text-xl flex items-center justify-center gap-2 shadow-[6px_6px_0px_#333] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">
            {loading ? <div className="animate-spin rounded-full h-6 w-6 border-4 border-white/30 border-t-[#333]" /> : <><Search size={24} strokeWidth={4} /><span>店を探す</span></>}
          </button>
        </div>
      </div>
    </main>
  );
}
