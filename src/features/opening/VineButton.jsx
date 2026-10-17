import '../../theme/vine-button.css';
/** Thin gold vines that branch and curl outward from a button's ends. */
function Vine({ side }) {
  return (
    <svg className={'vine ' + side} viewBox="0 0 74 54" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth=".9" strokeLinecap="round">
        <path d="M74 27 C62 27 54 26 46 22 C38 18 33 10 25 9 C17 8 13 14 16 19 C18 22 23 21 22 17" />
        <path d="M46 22 C42 30 34 37 25 38 C18 39 15 35 18 32" />
        <path d="M33 13 C31 7 34 3 39 3" />
        <path d="M36 33 C37 40 34 46 28 47 C24 48 22 45 24 43" />
        <path d="M57 25 C56 20 59 17 62 18" />
      </g>
      <g className="vine-buds">
        <circle cx="22" cy="17" r="1.1" />
        <circle cx="39" cy="3" r=".9" />
        <circle cx="24" cy="43" r=".9" />
      </g>
    </svg>
  );
}

/** The framed Lamplight button. Vines grow on hover and keyboard focus, and stay on the lead action. */
export function VineButton({ title, subline, lead = false, className = '', ...props }) {
  return (
    <button
      className={'vine-button' + (lead ? ' lead' : '') + (className ? ' ' + className : '')}
      {...props}
    >
      <Vine side="l" />
      <strong>{title}</strong>
      {subline && <small>{subline}</small>}
      <Vine side="r" />
    </button>
  );
}
