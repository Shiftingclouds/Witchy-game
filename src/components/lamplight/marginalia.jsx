// Ink marginalia for the grimoire pages: sketches and notes that fill a page the way a real one fills.

/** A pressed autumn leaf, drawn in ochre ink with a few veins. */
export function PressedLeaf({ className = '' }) {
  return (
    <svg className={`mg mg-leaf ${className}`} viewBox="0 0 120 140" aria-hidden="true">
      <path
        className="fill"
        d="M60 6 C 66 22, 78 22, 86 16 C 84 30, 92 38, 108 38 C 98 50, 100 60, 112 70 C 96 74, 90 82, 94 98 C 80 90, 70 94, 66 108 L 60 100 L 54 108 C 50 94, 40 90, 26 98 C 30 82, 24 74, 8 70 C 20 60, 22 50, 12 38 C 28 38, 36 30, 34 16 C 42 22, 54 22, 60 6 Z"
      />
      <path
        className="vein"
        d="M60 134 L 60 22 M60 60 L 92 34 M60 60 L 28 34 M60 80 L 100 70 M60 80 L 20 70 M60 96 L 84 96 M60 96 L 36 96"
      />
    </svg>
  );
}

/** A small hanging lantern sketch, with a faint glow wash. */
export function LanternSketch({ className = '' }) {
  return (
    <svg className={`mg mg-lantern ${className}`} viewBox="0 0 80 130" aria-hidden="true">
      <circle className="glow" cx="40" cy="78" r="34" />
      <path
        className="ink"
        d="M40 2 V 22 M30 22 h20 l6 12 h-32 z M24 34 v52 q16 10 32 0 v-52 M24 86 l-4 10 h40 l-4 -10 M40 96 v8"
      />
      <path className="ink thin" d="M32 40 v40 M48 40 v40 M24 60 h32" />
      <path className="flame" d="M40 52 c 6 8, 6 16, 0 20 c -6 -4, -6 -12, 0 -20 z" />
    </svg>
  );
}

/** A spell's gesture as a diagram: the hand's path with an arrow. */
export function GestureSketch({ kind = 'circle', className = '' }) {
  return (
    <svg className={`mg mg-gesture ${className}`} viewBox="0 0 140 90" aria-hidden="true">
      {kind === 'circle' ? (
        <>
          <path className="ink" d="M70 76 C 30 76, 26 22, 64 16 C 100 10, 116 50, 92 68" />
          <path className="ink" d="M92 68 l 2 -12 M92 68 l -11 -3" />
          <path className="ink thin dash" d="M70 16 V 2" />
        </>
      ) : (
        <>
          <path className="ink" d="M30 70 C 50 64, 60 40, 66 18 M54 74 C 72 66, 82 44, 88 22" />
          <path className="ink" d="M66 18 l -8 6 M66 18 l 3 9 M88 22 l -8 6 M88 22 l 3 9" />
          <rect className="ink thin dash" x="20" y="76" width="100" height="10" />
        </>
      )}
    </svg>
  );
}

/** A note written in the margin, a little askew, with an optional hand-drawn arrow. */
export function MarginNote({ children, tilt = -2, arrow = false, className = '' }) {
  return (
    <p className={`mg-note ${className}`} style={{ rotate: `${tilt}deg` }}>
      {arrow && (
        <svg viewBox="0 0 40 24" aria-hidden="true">
          <path d="M2 20 C 12 4, 26 2, 36 8 M36 8 l -8 -2 M36 8 l -4 7" />
        </svg>
      )}
      {children}
    </p>
  );
}

/** The moon's real phases for the coming nights: `nights` from moonWeek() in features/shell/moon.mjs. */
export function Moons({ nights = [], className = '' }) {
  return (
    <div className={`mg-moons ${className}`} aria-hidden="true">
      {nights.map(({ date, phase }) => {
        const waxing = phase < 0.5;
        const rx = (8 * Math.abs(Math.cos(2 * Math.PI * phase))).toFixed(2);
        const inner = waxing ? (phase < 0.25 ? 0 : 1) : phase < 0.75 ? 0 : 1;
        return (
          <svg key={date} viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="8" className="ring" />
            <path
              className="lit"
              d={`M10 2 A8 8 0 0 ${waxing ? 1 : 0} 10 18 A${rx} 8 0 0 ${inner} 10 2 Z`}
            />
          </svg>
        );
      })}
    </div>
  );
}
