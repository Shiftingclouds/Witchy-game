import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * The fixed dialogue box. Its size and the Next/Back positions never change from line to line;
 * long lines scroll inside the text area instead of pushing the controls.
 */
export function DialogueBox({
  lineId,
  speakerName,
  text,
  reveal,
  onNext,
  onBack,
  canBack,
  nextDisabled,
  framed = false,
  children,
}) {
  return (
    <div
      className={'dialogue-box' + (framed ? ' framed' : '')}
      data-line={lineId}
      data-revealing={!reveal.complete}
    >
      {speakerName && <div className="name-plate">{speakerName}</div>}
      <button
        type="button"
        className="dialogue-text"
        onClick={onNext}
        aria-label={reveal.complete ? 'Continue' : 'Show the whole line'}
      >
        <span className="visually-hidden" aria-live="polite" aria-atomic="true">
          {speakerName ? `${speakerName}: ${text}` : text}
        </span>
        <span className="revealed-text" aria-hidden="true">
          {reveal.visible}
          <span className="unrevealed-text">{text.slice(reveal.visible.length)}</span>
        </span>
      </button>
      {children}
      <button
        type="button"
        className="scene-back"
        onClick={onBack}
        disabled={!canBack}
        aria-label="Previous line"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        className="scene-next"
        onClick={onNext}
        disabled={nextDisabled}
        aria-label="Next"
      >
        <span>Next</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
