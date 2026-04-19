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
        const sugg = sRes.ok ? await sRes.json() : { keyword: "居酒屋", reason: "リサーチ完了。" };
        const hRes = await fetch(`/api/shops?lat=${params.get("lat")}&lng=${params.get("lng")}&keyword=${encodeURIComponent(sugg.keyword)}`);
        const shops = await hRes.json();
        setData({ shops: Array.isArray(shops) ? shops : [], suggestion: sugg, loading: false });
      } catch (e) { setData(d => ({ ...d, loading: false, shops: [] })); }
    }
    init();
  }, [params]);

  if (data.loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center">
      <div className="w-16 h-16 border-4 border-[#333] rounded-full flex items-center justify-center animate-bounce shadow-[4px_4px_0px_#FFD700] bg-white text-[#333]"><Lightbulb size={32}/></div>
      <p className="mt-6 text-xl font-black italic text-[#333]">LAB ANALYSIS...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#FDFDFD] p-4 pb-12 max-w-2xl mx-auto text-[#333]">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => router.back()} className="p-3 bg-white rounded-xl border-4 border-[#333] shadow-[4px_4px_0px_#333] transition-all active:shadow-none"><ArrowLeft size={24}/></button>
        <Martini className="text-pink-400" size={32} />
      </div>
      
      {data.suggestion && (
        <div className="bg-[#FFEE00] border-4 border-[#333] p-6 rounded-[2.5rem] mb-10 shadow-[8px_8px_0px_#333] relative">
          <div className="absolute -top-4 left-6 bg-white border-2 border-[#333] px-3 py-1 rounded-full text-[10px] font-black uppercase">Study Result</div>
          <h2 className="text-2xl font-black mb-1 flex items-center gap-2 mt-2"><Sparkles size={20}/> {data.suggestion.keyword}</h2>
          <p className="font-bold text-xs opacity-80 leading-relaxed">{data.suggestion.reason}</p>
        </div>
      )}

      <div className="grid gap-10">
        {data.shops.length > 0 ? data.shops.map((shop: any) => (
          <div key={shop.id} className="bg-white border-4 border-[#333] rounded-[2.5rem] overflow-hidden shadow-[12px_12px_0px_#333]">
            <img src={shop.photo.pc.l} className="w-full h-52 object-cover border-b-4 border-[#333]" alt={shop.name} />
            <div className="p-6 space-y-3">
              <h3 className="text-2xl font-black leading-tight tracking-tighter">{shop.name}</h3>
              <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400"><MapPin size={12} className="text-red-400 shrink-0"/>{shop.address}</div>
              <p className="font-bold text-sm text-gray-600 line-clamp-2 leading-relaxed italic">「{shop.catch}」</p>
              <div className="flex gap-4 pt-4 border-t-2 border-dashed border-gray-200">
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl border-2 border-[#333] text-xs font-black"><Banknote size={16}/>{shop.budget.name}</div>
                <div className="flex items-center gap-2 bg-green-100 px-3 py-2 rounded-xl border-2 border-[#333] text-xs font-black"><Utensils size={16}/>{shop.capacity}席</div>
              </div>
              <a href={shop.urls.pc} target="_blank" rel="noopener noreferrer" className="block w-full bg-[#333] text-white text-center py-5 rounded-2xl font-black text-xl mt-4 shadow-[6px_6px_0px_#FFD700] active:translate-x-1 active:translate-y-1 transition-all">予約画面へ飛ぶ</a>
            </div>
          </div>
        )) : <div className="text-center py-20 font-black text-gray-300 italic text-2xl uppercase tracking-widest">No Lab Data</div>}
      </div>
    </main>
  );
}
export default function Page() { return <Suspense fallback={null}><Content /></Suspense>; }
