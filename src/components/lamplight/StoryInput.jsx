import { Send } from 'lucide-react';
import './patterns.css';

/** Free text for AI modes. Enter sends; Shift+Enter starts a new line. */
export function StoryInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = 'What do you do?',
  maxLength = 2000,
}) {
  const send = () => {
    const text = value.trim();
    if (text && !disabled) onSubmit(text);
  };
  return (
    <div className="story-input">
      <textarea
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        rows={2}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            send();
          }
        }}
      />
      <button aria-label="Send" disabled={disabled || !value.trim()} onClick={send}>
        <Send size={17} />
      </button>
    </div>
  );
}
