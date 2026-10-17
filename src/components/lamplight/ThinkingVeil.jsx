import './patterns.css';

/** Laid over a scene while Claude writes: a slow warm shimmer and a quiet line. Static under reduced motion. */
export function ThinkingVeil({ active, label = 'The world is stirring…', reduced = false }) {
  return (
    <div
      className={'thinking-veil' + (active ? ' active' : '') + (reduced ? ' still' : '')}
      role="status"
      aria-busy={active}
      aria-live="polite"
    >
      {active && (
        <p>
          <span className="thinking-mote" aria-hidden="true" />
          {label}
        </p>
      )}
    </div>
  );
}
