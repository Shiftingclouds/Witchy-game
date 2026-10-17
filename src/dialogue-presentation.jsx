import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { art, chapters, characterById, portrait, locationById } from './content.mjs';
import { sceneArt, dateLabel } from './engine.mjs';
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
import { READING_MODES } from './theme/tokens.mjs';

const readPreference = (key, allowed, fallback) => {
  try {
    const value = localStorage.getItem('lanternmere.' + key);
    return allowed.includes(value) ? value : fallback;
  } catch {
    return fallback;
  }
};
const writePreference = (key, value) => {
  try {
    localStorage.setItem('lanternmere.' + key, value);
  } catch {
    /* Reading remains available without storage. */
  }
};
export function useReadingPreferences() {
  const [speed, setSpeedState] = useState(() =>
    readPreference('text-speed', Object.keys(textSpeeds), 'normal'),
  );
  const [size, setSizeState] = useState(() =>
    readPreference('text-size', ['standard', 'large', 'largest'], 'standard'),
  );
  const [motion, setMotionState] = useState(() =>
    readPreference('motion', ['system', 'reduce'], 'system'),
  );
  const [mode, setModeState] = useState(() =>
    readPreference('reading-mode', READING_MODES, 'lamplight'),
  );
  const [systemReduced, setSystemReduced] = useState(
    () => matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setSystemReduced(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  const setter = (key, allowed, set) => (value) => {
    if (!allowed.includes(value)) return;
    set(value);
    writePreference(key, value);
  };
  return {
    speed,
    size,
    motion,
    mode,
    reduced: systemReduced || motion === 'reduce',
    setSpeed: setter('text-speed', Object.keys(textSpeeds), setSpeedState),
    setSize: setter('text-size', ['standard', 'large', 'largest'], setSizeState),
    setMotion: setter('motion', ['system', 'reduce'], setMotionState),
    setMode: setter('reading-mode', READING_MODES, setModeState),
  };
}

export function ReadingControls({ reading }) {
  return (
    <div className="reading-controls">
      <label>
        Reading mode{' '}
        <select
          aria-label="Reading mode"
          value={reading.mode}
          onChange={(e) => reading.setMode(e.target.value)}
        >
          <option value="lamplight">Lamplight</option>
          <option value="parchment">Parchment</option>
          <option value="night">Night</option>
        </select>
      </label>
      <label>
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
      </label>
      <label>
        Story text{' '}
        <select
          aria-label="Story text size"
          value={reading.size}
          onChange={(e) => reading.setSize(e.target.value)}
        >
          <option value="standard">Standard</option>
          <option value="large">Large</option>
          <option value="largest">Largest</option>
        </select>
      </label>
      <label>
        Motion{' '}
        <select
          aria-label="Reading motion"
          value={reading.motion}
          onChange={(e) => reading.setMotion(e.target.value)}
        >
          <option value="system">Follow device</option>
          <option value="reduce">Reduce motion</option>
        </select>
      </label>
      {reading.reduced && <small>Reduced motion: text appears immediately.</small>}
    </div>
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
      style={{ '--actor-slot': actor.slot }}
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
  const initial = () => actors.map((actor, slot) => ({ ...actor, slot }));
  const [slots, setSlots] = useState(initial);
  const active = useRef(slots);
  useEffect(() => {
    const previous = active.current;
    const occupied = new Set(
      previous
        .filter((actor) => actors.some((next) => next.id === actor.id))
        .map((actor) => actor.slot),
    );
    const next = actors.map((actor) => {
      const kept = previous.find((old) => old.id === actor.id);
      const slot = kept?.slot ?? [0, 1].find((value) => !occupied.has(value));
      occupied.add(slot);
      return { ...actor, slot };
    });
    const leaving = previous.filter((actor) => !actors.some((next) => next.id === actor.id));
    active.current = next;
    setSlots(reduced ? next : [...leaving, ...next]);
    const timer = setTimeout(() => setSlots(next), reduced ? 0 : 220);
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
  const choiceMade = useRef(false),
    speechRef = useRef(null);
  const readerRef = useRef(null);
  useEffect(() => {
    if (choiceMade.current) {
      speechRef.current?.focus();
      choiceMade.current = false;
    }
  }, [game.storyChoices]);
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
  useEffect(() => {
    readerRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [current.id]);
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
    <Modal title={chapter.title} wide className="scene-modal" onClose={onClose}>
      <div className="scene-reader" ref={readerRef}>
        <div
          className={`performance-scene${current.illustration ? ' performance-detail' : ''}`}
          aria-label={locationById[location].name}
        >
          <img
            className="performance-background"
            src={art(
              current.illustration?.art ||
                sceneArt({
                  ...game,
                  location,
                  date: current.section?.date || chapter.date,
                  period: current.section?.period ?? 0,
                }),
            )}
            alt={current.illustration?.alt || locationById[location].description}
          />
          {!current.illustration && <div className="scene-light" aria-hidden="true" />}
          <PortraitStage
            actors={current.actors}
            speaker={current.speaker}
            reduced={reading.reduced}
          />
        </div>
        <div className="speech-box" data-beat={position} data-revealing={!reveal.complete}>
          <div className="speaker-heading">
            <strong>{current.speaker ? characterById[current.speaker].name : 'Your story'}</strong>
            <span>Line {position + 1}</span>
          </div>
          {current.section && (
            <div className="scene-section-title">
              {current.section.title} · {locationById[location].name}
              {current.section.date && ` · ${dateLabel(current.section.date)}`}
            </div>
          )}
          <button
            className="speech-text"
            ref={speechRef}
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
                choiceMade.current = true;
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
                {entry.choice && game.storyChoices[choiceKey(sceneId, entry.id)] && (
                  <small>
                    Your choice:{' '}
                    {
                      entry.choice.options.find(
                        (option) => option.id === game.storyChoices[choiceKey(sceneId, entry.id)],
                      ).label
                    }
                  </small>
                )}
              </li>
            ))}
          </ol>
        </details>
      </div>
    </Modal>
  );
}
