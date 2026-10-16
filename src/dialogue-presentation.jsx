import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { art, chapters, characterById, portrait, locationById } from './content.mjs';
import { sceneArt } from './engine.mjs';
import { Button, Modal } from './components.jsx';
import { SceneDecision } from './features/story/AuthoredChapter.jsx';
import {
  chapterBeats,
  chapterSceneId,
  resolveExpression,
  textCharacters,
  textSpeeds,
  letterDelay,
  choiceKey,
} from './scene-beats.mjs';

const preferenceKey = 'lanternmere.text-speed';
export function useReadingPreferences() {
  const [speed, setSpeedState] = useState(() => {
    try {
      const saved = localStorage.getItem(preferenceKey);
      return Object.hasOwn(textSpeeds, saved) ? saved : 'normal';
    } catch {
      return 'normal';
    }
  });
  const [reduced, setReduced] = useState(
    () => matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  function setSpeed(value) {
    if (!Object.hasOwn(textSpeeds, value)) return;
    setSpeedState(value);
    try {
      localStorage.setItem(preferenceKey, value);
    } catch {
      /* Reading still works without browser storage. */
    }
  }
  return { speed, setSpeed, reduced };
}

export function ReadingControls({ reading }) {
  return (
    <label className="reading-controls">
      Text reveal{' '}
      <select
        aria-label="Text reveal speed"
        value={reading.speed}
        onChange={(e) => reading.setSpeed(e.target.value)}
      >
        <option value="slow">Slow</option>
        <option value="normal">Normal</option>
        <option value="fast">Fast</option>
        <option value="instant">Instant</option>
      </select>
      {reading.reduced && <small>Reduced motion: text appears immediately.</small>}
    </label>
  );
}

export function useTextReveal(text, reading, initiallyComplete = false) {
  const chars = useMemo(() => textCharacters(text), [text]);
  const [progress, setProgress] = useState(() => ({
    text,
    count: initiallyComplete ? chars.length : 0,
  }));
  const immediate = reading.reduced || reading.speed === 'instant';
  const count = immediate ? chars.length : progress.text === text ? progress.count : 0;
  useEffect(() => {
    if (immediate || reading.paused || count >= chars.length) return;
    const timer = setTimeout(
      () => setProgress({ text, count: count + 1 }),
      letterDelay(chars[count], reading.speed),
    );
    return () => clearTimeout(timer);
  }, [text, chars, count, immediate, reading.speed, reading.paused]);
  return {
    visible: chars.slice(0, count).join(''),
    complete: count >= chars.length,
    reveal: () => setProgress({ text, count: chars.length }),
  };
}

export function RevealedText({ text, reveal, announcement = text }) {
  return (
    <>
      <span className="visually-hidden" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
      <span className="revealed-text" aria-hidden="true">
        {reveal.visible}
        <span className="unrevealed-text">{text.slice(reveal.visible.length)}</span>
      </span>
    </>
  );
}

// Decode the incoming portrait before fading it over the outgoing image.
// The old expression stays visible if a new file cannot be loaded.
export function AnimatedPortrait({ id, emotion = 'neutral', reduced = false }) {
  const resolved = resolveExpression(id, emotion),
    src = portrait(id, resolved);
  const [frames, setFrames] = useState({ src, emotion: resolved, previous: null });
  const framesRef = useRef(frames);
  framesRef.current = frames;
  useEffect(() => {
    if (src === framesRef.current.src) {
      if (framesRef.current.previous) setFrames((current) => ({ ...current, previous: null }));
      return;
    }
    let cancelled = false,
      timer;
    const next = new window.Image();
    next.src = src;
    next
      .decode()
      .then(() => {
        if (cancelled) return;
        const previous = reduced ? null : framesRef.current.src;
        setFrames({ src, emotion: resolved, previous });
        timer = setTimeout(() => {
          if (!cancelled) setFrames((current) => ({ ...current, previous: null }));
        }, 220);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [src, resolved, reduced]);
  return (
    <span className="animated-portrait" data-expression={frames.emotion}>
      {frames.previous && (
        <img
          className="portrait expression-previous"
          src={frames.previous}
          alt=""
          aria-hidden="true"
        />
      )}
      <img
        key={frames.src}
        className={'portrait expression-current ' + (frames.previous && !reduced ? 'changing' : '')}
        src={frames.src}
        alt={`${characterById[id].name}, ${frames.emotion} expression`}
      />
    </span>
  );
}

function StageActor({ actor, speaking, visible, reduced }) {
  return (
    <div
      className={
        'stage-actor ' +
        (visible ? 'present' : 'departed') +
        ' ' +
        (speaking ? 'speaking' : 'listening')
      }
      data-character={actor.id}
      aria-hidden={!visible}
    >
      <AnimatedPortrait id={actor.id} emotion={actor.emotion} reduced={reduced} />
      <span className="actor-name">
        {characterById[actor.id].name}
        {speaking ? ' · speaking' : ' · listening'}
      </span>
    </div>
  );
}

function PortraitStage({ actors, speaker, reduced }) {
  const [slots, setSlots] = useState(actors);
  useEffect(() => {
    // Keep departed actors for the exit fade. Matching ids retain their positions.
    setSlots((previous) => [
      ...previous.filter((actor) => !actors.some((next) => next.id === actor.id)),
      ...actors,
    ]);
    const timer = setTimeout(() => setSlots(actors), reduced ? 0 : 220);
    return () => clearTimeout(timer);
  }, [actors, reduced]);
  return (
    <div className={'portrait-stage ' + (actors.length > 1 ? 'ensemble' : 'solo')}>
      {slots.map((actor) => (
        <StageActor
          key={actor.id}
          actor={actor}
          visible={actors.some((current) => current.id === actor.id)}
          speaking={speaker === actor.id}
          reduced={reduced}
        />
      ))}
    </div>
  );
}

export function ConversationLine({ text, reading, speaker }) {
  const reveal = useTextReveal(text, reading);
  return (
    <div className="conversation-line">
      <blockquote>
        <RevealedText
          text={`“${text}”`}
          announcement={`${speaker}: ${text}`}
          reveal={{ ...reveal, visible: `“${reveal.visible}${reveal.complete ? '”' : ''}` }}
        />
      </blockquote>
      {!reveal.complete && (
        <button className="text-button reveal-control" onClick={reveal.reveal}>
          Show full text <ArrowRight size={13} />
        </button>
      )}
    </div>
  );
}

export function SceneReader({ game, reading, act, onClose }) {
  const chapter = chapters[game.chapter],
    beats = useMemo(() => chapterBeats(game.chapter, game), [game.chapter, game.storyChoices]);
  const sceneId = chapterSceneId(game.chapter);
  const [position, setPosition] = useState(() =>
      game.bookmark?.scene === sceneId
        ? Math.max(
            0,
            beats.findIndex((beat) => beat.id === game.bookmark.beat),
          )
        : 0,
    ),
    [finished, setFinished] = useState(false),
    [transcriptOpen, setTranscriptOpen] = useState(false);
  const current = beats[Math.min(position, beats.length - 1)],
    reveal = useTextReveal(
      current.text,
      { ...reading, paused: transcriptOpen },
      Boolean(game.bookmark),
    );
  const final = position === beats.length - 1;
  const pending = Boolean(current.choice && !game.storyChoices?.[choiceKey(sceneId, current.id)]);
  const location = current.section?.location || chapter.scene;
  function go(index) {
    setPosition(index);
    setFinished(false);
    act({ type: 'bookmark', scene: sceneId, beat: beats[index].id });
  }
  function next() {
    if (!reveal.complete) {
      reveal.reveal();
      return;
    }
    if (pending) return;
    if (final) {
      setFinished(true);
      return;
    }
    go(position + 1);
  }
  return (
    <Modal title={chapter.title} wide onClose={onClose}>
      <div className="scene-reader">
        <div className="performance-scene" aria-label={locationById[location].name}>
          <img
            className="performance-background"
            src={art(
              sceneArt({
                ...game,
                location,
                date: chapter.date,
                period: current.section?.period ?? 0,
              }),
            )}
            alt={locationById[location].description}
          />
          <div className="scene-light" aria-hidden="true" />
          <PortraitStage
            actors={current.actors}
            speaker={current.speaker}
            reduced={reading.reduced}
          />
        </div>
        <div className="speech-box" data-beat={position} data-revealing={!reveal.complete}>
          <div className="speaker-heading">
            <strong>{current.speaker ? characterById[current.speaker].name : 'Your story'}</strong>
            <span>
              {position + 1} / {beats.length}
            </span>
          </div>
          {current.section && (
            <div className="scene-section-title">
              {current.section.title} · {locationById[location].name}
            </div>
          )}
          <button
            className="speech-text"
            aria-label={reveal.complete ? 'Continue scene' : 'Show full text'}
            onClick={next}
            disabled={finished || (pending && reveal.complete)}
          >
            <RevealedText
              text={current.text}
              reveal={reveal}
              announcement={`${current.speaker ? characterById[current.speaker].name : 'Narration'}: ${current.text}`}
            />
          </button>
          {current.choice && reveal.complete && (
            <SceneDecision
              beat={current}
              sceneId={sceneId}
              game={game}
              onSelect={(key, option) => {
                act({ type: 'story-choice', key, option });
                setPosition(position + 1);
                setFinished(false);
              }}
            />
          )}
          <div className="speech-controls">
            <button
              className="text-button"
              disabled={position === 0}
              onClick={() => go(position - 1)}
            >
              <ChevronLeft size={14} />
              Previous
            </button>
            {finished ? (
              <Button className="primary" onClick={onClose}>
                Return to your choices <ArrowRight size={15} />
              </Button>
            ) : (
              <Button className="primary" onClick={next} disabled={pending && reveal.complete}>
                {!reveal.complete
                  ? 'Show full text'
                  : pending
                    ? 'Choose above to continue'
                    : final
                      ? 'Finish scene'
                      : 'Next line'}
                <ArrowRight size={15} />
              </Button>
            )}
          </div>
          {finished && (
            <p className="scene-complete" role="status">
              Take your time. Your decision is waiting on the page.
            </p>
          )}
        </div>
        <ReadingControls reading={reading} />
        <details
          className="scene-transcript"
          onToggle={(e) => setTranscriptOpen(e.currentTarget.open)}
        >
          <summary>Read the conversation so far</summary>
          <ol>
            {beats.slice(0, position + 1).map((entry) => (
              <li key={entry.id}>
                <strong>{entry.speaker ? characterById[entry.speaker].name : 'Narration'}</strong>
                <p>{entry.text}</p>
              </li>
            ))}
          </ol>
        </details>
      </div>
    </Modal>
  );
}
