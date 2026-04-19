"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Sparkles, Utensils, Banknote, Lightbulb, Martini } from "lucide-react";

function Content() {
  const params = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<{shops: any[], suggestion: any, loading: boolean}>({ shops: [], suggestion: null, loading: true });

  useEffect(() => {
    async function init() {
      try {
        const sRes = await fetch("/api/suggest", { method: "POST", body: JSON.stringify(Object.fromEntries(params)) });
        const sugg = sRes.ok ? await sRes.json() : { keyword: "居酒屋", reason: "AIの分析完了。" };
        const hRes = await fetch(`/api/shops?lat=${params.get("lat")}&lng=${params.get("lng")}&keyword=${encodeURIComponent(sugg.keyword)}`);
        const shops = await hRes.json();
        setData({ shops: Array.isArray(shops) ? shops : [], suggestion: sugg, loading: false });
      } catch (e) { setData(d => ({ ...d, loading: false, shops: [] })); }
    }
    init();
  }, [params]);

  if (data.loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center">
      <div className="w-20 h-20 border-4 border-[#1A1A1B] rounded-full flex items-center justify-center animate-bounce shadow-[6px_6px_0px_#FFEE00] bg-white"><Lightbulb size={40}/></div>
      <p className="mt-8 text-2xl font-black italic">REPORT GENERATING...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#FDFCF0] p-4 pb-20 max-w-2xl mx-auto">
      <header className="flex items-center justify-between mb-10 pt-4">
        <button onClick={() => router.back()} className="p-4 bg-white rounded-2xl border-4 border-[#1A1A1B] shadow-[4px_4px_0px_#1A1A1B] active:shadow-none transition-all"><ArrowLeft size={24}/></button>
        <div className="text-right">
          <p className="text-[10px] font-black text-[#FF6B6B] uppercase tracking-widest">Lab Report</p>
          <h1 className="text-xl font-black tracking-tighter">SELECTIVE EIGHT</h1>
        </div>
      </header>

      {data.suggestion && (
        <div className="bg-[#4ECDC4] border-4 border-[#1A1A1B] p-8 rounded-[2.5rem] mb-12 shadow-[10px_10px_0px_#1A1A1B] relative overflow-hidden">
          <Martini className="absolute -bottom-4 -right-4 opacity-20 text-white rotate-12" size={100} />
          <h2 className="text-3xl font-black mb-3 flex items-center gap-2 text-white"><Sparkles size={28}/> {data.suggestion.keyword}</h2>
          <p className="font-bold text-white text-sm leading-relaxed drop-shadow-sm">{data.suggestion.reason}</p>
        </div>
      )}

      <div className="grid gap-12">
        {data.shops.length > 0 ? data.shops.map((shop: any) => (
          <div key={shop.id} className="lab-card overflow-hidden transition-all hover:scale-[1.01]">
            <div className="relative h-64 border-b-4 border-[#1A1A1B]">
              <img src={shop.photo.pc.l} className="w-full h-full object-cover" alt={shop.name} />
              <div className="absolute top-4 right-4 bg-[#FFEE00] border-2 border-[#1A1A1B] px-4 py-1.5 rounded-full text-xs font-black shadow-[4px_4px_0px_#1A1A1B]">
                {shop.genre.name}
              </div>
            </div>
            <div className="p-8 space-y-5">
              <div className="space-y-1">
                <h3 className="text-3xl font-black tracking-tighter leading-tight">{shop.name}</h3>
                <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest"><MapPin size={12} className="text-[#FF6B6B]"/>{shop.address}</div>
              </div>
              <p className="font-bold text-sm text-gray-600 leading-relaxed border-l-4 border-[#FFEE00] pl-4 italic">「{shop.catch}」</p>
              <div className="flex gap-4 pt-2">
                <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl border-2 border-[#1A1A1B] text-xs font-black shadow-[3px_3px_0px_#1A1A1B]"><Banknote size={16}/>{shop.budget.name}</div>
                <div className="flex items-center gap-2 bg-[#FEE2E2] px-4 py-2 rounded-xl border-2 border-[#1A1A1B] text-xs font-black shadow-[3px_3px_0px_#1A1A1B] uppercase"><Utensils size={16}/>{shop.capacity}席</div>
              </div>
              <a href={shop.urls.pc} target="_blank" rel="noopener noreferrer" className="block w-full bg-[#1A1A1B] text-white text-center py-5 rounded-2xl font-black text-xl mt-4 shadow-[6px_6px_0px_#FFEE00] hover:bg-gray-800 transition-all">
                BOOK THIS SHOP
              </a>
            </div>
          </div>
        )) : <div className="text-center py-24 font-black text-gray-300 italic text-3xl">OUT OF TARGET...</div>}
      </div>
    </main>
  );
}
export default function Page() { return <Suspense fallback={null}><Content /></Suspense>; }
