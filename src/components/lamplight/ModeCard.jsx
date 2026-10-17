import './patterns.css';

/** A large framed choice, such as Timeless or Timed. Use inside ModeChoice (a radiogroup). */
export function ModeCard({ title, description, selected, onSelect, onArrow }) {
  return (
    <button
      role="radio"
      aria-checked={selected}
      tabIndex={selected ? 0 : -1}
      className={'mode-card-choice' + (selected ? ' selected' : '')}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (['ArrowRight', 'ArrowDown'].includes(e.key)) onArrow?.(1, e);
        if (['ArrowLeft', 'ArrowUp'].includes(e.key)) onArrow?.(-1, e);
      }}
    >
      <strong>{title}</strong>
      <span>{description}</span>
    </button>
  );
}

/** Keyboard-friendly group of ModeCards: arrow keys move the selection. */
export function ModeChoice({ label, options, value, onChange }) {
  const move = (step, event) => {
    event.preventDefault();
    const index = options.findIndex((o) => o.id === value);
    const next = options[(index + step + options.length) % options.length];
    onChange(next.id);
    event.currentTarget.parentElement
      .querySelectorAll('[role="radio"]')
      [options.indexOf(next)]?.focus();
  };
  return (
    <div className="mode-choice" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <ModeCard
          key={o.id}
          title={o.title}
          description={o.description}
          selected={value === o.id}
          onSelect={() => onChange(o.id)}
          onArrow={move}
        />
      ))}
    </div>
  );
}
