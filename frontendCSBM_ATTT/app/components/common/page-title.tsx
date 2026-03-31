type Props = {
  title: string;
  subtitle?: string;
};

export default function PageTitle({ title, subtitle }: Props) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300/80">
        Workspace Section
      </p>
      <h1 className="mt-2 text-3xl font-bold text-white">{title}</h1>
      {subtitle ? (
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}