import { useEffect, useRef, useState } from 'react';
import { art, locationById } from '../../content.mjs';

/**
 * Arriving somewhere new: the place's painting fills the screen with only its name. The next click or
 * key fades it into the scene; under reduced motion it simply cuts.
 */
export function ArrivalPainting({ location, src, reduced, onDone }) {
  const [leaving, setLeaving] = useState(false);
  const done = useRef(false);
  const finish = () => {
    if (done.current) return;
    done.current = true;
    if (reduced) return onDone();
    setLeaving(true);
    setTimeout(onDone, 700);
  };
  useEffect(() => {
    const onKey = (e) => {
      // Once dismissed it lets keys through to the scene while it fades.
      if (done.current || e.ctrlKey || e.metaKey || e.altKey) return;
      if (['Enter', ' ', 'Escape'].includes(e.key) || e.key.length === 1) {
        e.preventDefault();
        e.stopImmediatePropagation();
        finish();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  });
  const place = locationById[location];
  return (
    <div
      className={'arrival-painting' + (leaving ? ' leaving' : '')}
      role="button"
      tabIndex={0}
      aria-label={`${place?.name}. Continue`}
      onClick={finish}
    >
      <img src={src || art(location)} alt={place?.description || ''} />
      <p className="arrival-name">{place?.name}</p>
    </div>
  );
}
