import { useState, useRef } from "react";

export function BeforeAfterSlider({ beforeLabel = "Before", afterLabel = "After", before, after }:
  { beforeLabel?: string; afterLabel?: string; before: string; after: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);

  const move = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const p = Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100));
    setPos(p);
  };

  return (
    <div
      ref={ref}
      className="group relative aspect-[4/3] w-full select-none overflow-hidden rounded-2xl bg-secondary shadow-card"
      onMouseMove={(e)=> e.buttons === 1 && move(e.clientX)}
      onTouchMove={(e)=> move(e.touches[0].clientX)}
      onClick={(e)=> move(e.clientX)}
    >
      <div className="absolute inset-0" style={{ background: after }} />
      <span className="absolute right-3 top-3 z-20 rounded-full bg-background/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur">{afterLabel}</span>
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%`, background: before }}>
        <span className="absolute left-3 top-3 rounded-full bg-background/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur">{beforeLabel}</span>
      </div>
      <div className="pointer-events-none absolute top-0 bottom-0" style={{ left: `${pos}%` }}>
        <div className="absolute top-0 bottom-0 -ml-px w-0.5 bg-white shadow-elevated" />
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary shadow-elevated">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M8 6 2 12l6 6M16 6l6 6-6 6"/></svg>
          </div>
        </div>
      </div>
      <input
        type="range" min={0} max={100} value={pos}
        onChange={(e)=> setPos(Number(e.target.value))}
        className="absolute inset-0 z-30 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
        aria-label="Before/after slider"
      />
    </div>
  );
}
