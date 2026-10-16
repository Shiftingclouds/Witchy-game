import { useEffect, useRef, useId } from 'react';
import { X } from 'lucide-react';
import { portrait, characterById } from './content.mjs';

export function Button({ children, icon: Icon, className = '', ...props }) {
  return (
    <button className={'button ' + className} {...props}>
      {Icon && <Icon size={16} />} {children}
    </button>
  );
}
export function Eyebrow({ children }) {
  return <div className="eyebrow">{children}</div>;
}
export function Modal({ title, children, onClose, wide = false }) {
  const id = useId(),
    ref = useRef(null);
  useEffect(() => {
    const prior = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.querySelector('button')?.focus();
    const listener = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const nodes = [
          ...ref.current.querySelectorAll(
            'button:not([disabled]),input,select,textarea,a[href],[tabindex="0"]',
          ),
        ].filter((el) => el.getClientRects().length);
        const first = nodes[0],
          last = nodes.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', listener);
      prior?.focus();
    };
  }, []);
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section
        ref={ref}
        className={'modal ' + (wide ? 'wide' : '')}
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
      >
        <div className="modal-heading">
          <h2 id={id}>{title}</h2>
          <button className="icon-button" aria-label="Close dialog" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
export function Portrait({ id, emotion = 'neutral', className = '' }) {
  return (
    <img
      className={'portrait ' + className}
      src={portrait(id, emotion)}
      alt={`${characterById[id]?.name}, ${emotion} expression`}
    />
  );
}
