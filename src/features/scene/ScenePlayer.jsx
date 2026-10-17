import { useEffect, useMemo, useRef, useState } from 'react';
import { chapters, characterById, locationById, art } from '../../content.mjs';
import { sceneArt } from '../../engine.mjs';
import { chapterBeats, chapterSceneId, choiceKey, spoken } from '../../scene-beats.mjs';
import { SceneDecision } from '../story/AuthoredChapter.jsx';
import { DialogueBox } from './DialogueBox.jsx';
import { useLineReveal } from './useLineReveal.mjs';
import './scene.css';

/** The story, played full screen one line at a time over the place it happens in. */
export function ScenePlayer({ game, act, reading, onExit }) {
  const chapter = chapters[game.chapter];
  const beats = useMemo(() => chapterBeats(game.chapter, game), [game.chapter, game.storyChoices]);
  const sceneId = chapterSceneId(game.chapter);
  const [position, setPosition] = useState(() => {
    const at =
      game.bookmark?.scene === sceneId ? beats.findIndex((b) => b.id === game.bookmark.beat) : 0;
    return Math.max(0, at);
  });
  const index = Math.min(position, beats.length - 1);
  const current = beats[index];
  const text = current.speaker ? spoken(current.text) : current.text;
  const reveal = useLineReveal(current.id, text, reading);
  const pending = Boolean(current.choice && !game.storyChoices?.[choiceKey(sceneId, current.id)]);
  const location = current.section?.location || chapter.scene;
  const period = current.section?.period ?? 0;

  // Each key press acts on the newest state exactly once, however fast the presses come.
  const live = useRef(null);
  live.current = { index, reveal, pending, last: index >= beats.length - 1 };
  function go(to) {
    setPosition(to);
    act({ type: 'bookmark', scene: sceneId, beat: beats[to].id });
  }
  function next() {
    const s = live.current;
    if (!s.reveal.complete) return s.reveal.reveal();
    if (s.pending) return;
    if (s.last) return onExit?.();
    live.current = { ...s, index: s.index + 1, reveal: { complete: false, reveal() {} } };
    go(s.index + 1);
  }
  function back() {
    if (live.current.index > 0) go(live.current.index - 1);
  }
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('input, select, textarea')) return;
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest?.('.scene-decision, .scene-menu')) return;
        e.preventDefault();
        next();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        back();
      } else if (e.key === 'Escape') onExit?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div
      className="scene-player"
      role="dialog"
      aria-modal="true"
      aria-label={locationById[location].name}
    >
      <img
        className="scene-painting"
        src={art(
          current.illustration?.art ||
            sceneArt({ ...game, location, date: current.section?.date || chapter.date, period }),
        )}
        alt={current.illustration?.alt || locationById[location].description}
      />
      <div className="scene-shade" aria-hidden="true" />
      <div className="scene-stage">
        <DialogueBox
          lineId={current.id}
          speakerName={current.speaker ? characterById[current.speaker].name : null}
          text={text}
          reveal={reveal}
          onNext={next}
          onBack={back}
          canBack={index > 0}
          nextDisabled={pending && reveal.complete}
        >
          {current.choice && reveal.complete && (
            <SceneDecision
              beat={current}
              sceneId={sceneId}
              game={game}
              onSelect={(key, option) => {
                act({ type: 'story-choice', key, option });
                setPosition(index + 1);
              }}
            />
          )}
        </DialogueBox>
      </div>
    </div>
  );
}
