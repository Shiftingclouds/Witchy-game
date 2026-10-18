// Hand-drawn ornaments shared by the variants: branching vines, filigree corners, gold motes.

/** A thin climbing vine that branches into curls and small leaves. `length` in px. */
export function Vine({ length = 600, className = '', flip = false }) {
  const segs = Math.max(2, Math.round(length / 120));
  const parts = [];
  for (let i = 0; i < segs; i++) {
    const y = i * 120;
    const side = i % 2 ? -1 : 1;
    parts.push(
      <g key={i}>
        <path
          d={`M14 ${y} C ${14 + 8 * side} ${y + 40}, ${14 - 8 * side} ${y + 80}, 14 ${y + 120}`}
          className="vine-stem"
        />
        <path
          d={`M14 ${y + 52} c ${10 * side} -6, ${22 * side} -4, ${26 * side} 8 c ${2 * side} 8, ${-6 * side} 12, ${-10 * side} 6 c ${-3 * side} -4, 0 ${-8}, ${4 * side} -7`}
          className="vine-curl"
        />
        <path
          d={`M14 ${y + 88} q ${-12 * side} -2, ${-16 * side} -14 q ${10 * side} 2, ${16 * side} 14 z`}
          className="vine-leaf"
        />
        <path
          d={`M14 ${y + 24} q ${9 * side} -10, ${18 * side} -8 q -4 9, ${-18 * side} 8 z`}
          className="vine-leaf"
        />
        {i % 3 === 1 && <circle cx={14 + 26 * side} cy={y + 60} r="1.6" className="vine-bud" />}
      </g>,
    );
  }
  return (
    <svg
      className={`vine ${className}`}
      viewBox={`-20 0 68 ${segs * 120}`}
      width="68"
      height={segs * 120}
      aria-hidden="true"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      {parts}
    </svg>
  );
}

/** A filigree corner: a gold curl with a leaf, for framing paintings. Rotate per corner. */
export function Corner({ className = '' }) {
  return (
    <svg
      className={`corner ${className}`}
      viewBox="0 0 64 64"
      width="64"
      height="64"
      aria-hidden="true"
    >
      <path d="M2 40 V8 a6 6 0 0 1 6 -6 H40" className="corner-line" />
      <path d="M8 30 C 8 16, 16 8, 30 8" className="corner-line thin" />
      <path
        d="M14 14 c 8 0, 14 4, 16 12 c -6 1, -10 -2, -11 -7 c 4 0, 6 2, 6 5"
        className="corner-line thin"
      />
      <path d="M40 2 q 10 4, 14 0 q -6 -6, -14 0 z" className="corner-leaf" />
      <path d="M2 40 q 4 10, 0 14 q -6 -6, 0 -14 z" className="corner-leaf" />
      <circle cx="8" cy="8" r="2.2" className="corner-gem" />
    </svg>
  );
}

/** Slow gold motes drifting through warm light. Static when the reader prefers less motion. */
export function Motes({ count = 18, className = '' }) {
  const motes = Array.from({ length: count }, (_, i) => {
    const r = (n) => ((Math.sin(i * 9301 + n * 49297) + 1) / 2) % 1;
    return {
      left: `${r(1) * 100}%`,
      top: `${r(2) * 100}%`,
      size: 2 + r(3) * 3,
      delay: `${-r(4) * 14}s`,
      dur: `${10 + r(5) * 12}s`,
      star: i % 4 === 0,
    };
  });
  return (
    <div className={`motes ${className}`} aria-hidden="true">
      {motes.map((m, i) =>
        m.star ? (
          <svg
            key={i}
            className="mote star"
            viewBox="0 0 10 10"
            style={{
              left: m.left,
              top: m.top,
              width: m.size * 3,
              animationDelay: m.delay,
              animationDuration: m.dur,
            }}
          >
            <path d="M5 0 C5.4 3.6 6.4 4.6 10 5 C6.4 5.4 5.4 6.4 5 10 C4.6 6.4 3.6 5.4 0 5 C3.6 4.6 4.6 3.6 5 0Z" />
          </svg>
        ) : (
          <span
            key={i}
            className="mote"
            style={{
              left: m.left,
              top: m.top,
              width: m.size,
              height: m.size,
              animationDelay: m.delay,
              animationDuration: m.dur,
            }}
          />
        ),
      )}
    </div>
  );
}

/** A small four-point sparkle, for marking the active or special thing. */
export function Sparkle({ size = 12, className = '' }) {
  return (
    <svg
      className={`sparkle ${className}`}
      viewBox="0 0 10 10"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path d="M5 0 C5.4 3.6 6.4 4.6 10 5 C6.4 5.4 5.4 6.4 5 10 C4.6 6.4 3.6 5.4 0 5 C3.6 4.6 4.6 3.6 5 0Z" />
    </svg>
  );
}
