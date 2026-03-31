export default function Loading() {
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-sky-400" />
        <span className="text-sm text-slate-300">Đang tải dữ liệu...</span>
      </div>
    </div>
  );
}