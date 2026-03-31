type FileContentResponse = {
  fileId: number;
  originalFileName: string;
  content: string;
  message: string;
};

type Props = {
  data: FileContentResponse;
};

export default function FileContentViewer({ data }: Props) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          File Viewer
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">Nội dung file</h2>
        <p className="mt-1 text-sm text-slate-400">
          {data.originalFileName} (ID: {data.fileId})
        </p>
      </div>

      <div className="mb-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
        {data.message}
      </div>

      <pre className="max-h-[500px] overflow-auto whitespace-pre-wrap break-words rounded-[24px] border border-white/10 bg-[#020817] p-5 text-sm leading-7 text-slate-100">
        {data.content || '(file trống)'}
      </pre>
    </div>
  );
}