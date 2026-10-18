import { useEffect, useMemo, useRef, useState } from 'react';
import { chapters, characterById, locationById, art } from '../../content.mjs';
import { sceneArt } from '../../engine.mjs';
import { chapterBeats, chapterSceneId, choiceKey, spoken } from '../../scene-beats.mjs';
import { SceneDecision, OwnWords } from '../story/AuthoredChapter.jsx';
import { Interlude } from '../ai/Interlude.jsx';
import { DialogueBox } from './DialogueBox.jsx';
import { useLineReveal } from './useLineReveal.mjs';
import { PortraitFrame } from './PortraitFrame.jsx';
import { SceneMenu } from './SceneMenu.jsx';
import { X } from 'lucide-react';
import { emotionOf, endsSection, sectionCast, sectionText, staging, timeOfDay } from './stage.mjs';
import './scene.css';

/** The story, played full screen one line at a time over the place it happens in. */
export function ScenePlayer({ game, act, reading, onExit, onReadAsPage, opening = false }) {
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
  // After a typed answer, Claude's short bridge into the chosen option plays before the story goes on.
  const [bridge, setBridge] = useState(null);
  const bridgeLine = bridge?.lines[bridge.at];
  const lineId = bridgeLine ? `bridge-${current.id}-${bridge.at}` : current.id;
  const text = bridgeLine ? bridgeLine.text : current.speaker ? spoken(current.text) : current.text;
  const reveal = useLineReveal(lineId, text, reading);
  const pending = Boolean(current.choice && !game.storyChoices?.[choiceKey(sceneId, current.id)]);
  const location = current.section?.location || chapter.scene;
  const period = current.section?.period ?? 0;
  const painting = art(
    current.illustration?.art ||
      sceneArt({ ...game, location, date: current.section?.date || chapter.date, period }),
  );
  const backdrop = art(
    sceneArt({ ...game, location, date: current.section?.date || chapter.date, period }),
  );
  const cast = sectionCast(beats, index);
  // A close-up illustration (a clue, a page of evidence) is shown on its own, without frames over it.
  const stage = current.illustration ? 'none' : staging(cast);
  const time = timeOfDay(period);
  const frame = (id, size) => (
    <PortraitFrame
      key={id}
      id={id}
      size={size}
      emotion={emotionOf(current, id)}
      backdrop={backdrop}
      time={time}
      speaking={size === 'stage' && current.speaker === id}
      shadowed={size === 'stage' && current.speaker !== id}
    />
  );

  // Each key press acts on the newest state exactly once, however fast the presses come.
  const live = useRef(null);
  const textRef = useRef(null);
  const choiceMade = useRef(false);
  useEffect(() => {
    if (!choiceMade.current) return;
    choiceMade.current = false;
    textRef.current?.focus();
  }, [game.storyChoices]);
  live.current = { index, reveal, pending, last: index >= beats.length - 1, bridge };
  function go(to) {
    setPosition(to);
    act({ type: 'bookmark', scene: sceneId, beat: beats[to].id });
  }
  function next() {
    const s = live.current;
    if (!s.reveal.complete) return s.reveal.reveal();
    if (s.bridge) {
      if (s.bridge.at < s.bridge.lines.length - 1) setBridge({ ...s.bridge, at: s.bridge.at + 1 });
      else {
        setBridge(null);
        if (!s.last) go(s.index + 1);
      }
      live.current = { ...s, bridge: null, reveal: { complete: false, reveal() {} } };
      return;
    }
    if (s.pending) return;
    if (s.last) return opening ? undefined : onExit?.();
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
        if (e.target.closest?.('.scene-decision, .scene-menu, .scene-corner, .scene-exit')) return;
        e.preventDefault();
        next();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        back();
      } else if (e.key === 'Escape' && !opening) onExit?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div
      className={'scene-player' + (opening ? ' opening' : '')}
      data-section={current.section?.id}
      role="dialog"
      aria-modal="true"
      aria-label={locationById[location].name}
    >
      <img
        className={'scene-painting' + (current.illustration ? ' detail' : '')}
        src={painting}
        alt={current.illustration?.alt || locationById[location].description}
      />
      <div className="scene-shade" aria-hidden="true" />
      {!opening && (
        <button
          type="button"
          className="scene-icon scene-exit"
          aria-label="Leave the scene"
          onClick={onExit}
        >
          <X size={18} />
        </button>
      )}
      <SceneMenu
        reading={reading}
        lines={beats.slice(0, index + 1).map((b) => {
          const picked = b.choice && game.storyChoices?.[choiceKey(sceneId, b.id)];
          return picked
            ? { ...b, chosen: b.choice.options.find((o) => o.id === picked)?.label }
            : b;
        })}
        view="play"
        onSwitchView={onReadAsPage}
      />
      <div className={`scene-stage ${stage}`}>
        {game.mode === 'guided' && reveal.complete && endsSection(beats, index) && (
          <div className="scene-interlude">
            <Interlude
              key={current.section.id}
              game={game}
              act={act}
              reduced={reading.reduced}
              sectionId={current.section.id}
              sceneText={sectionText(beats, current.section.id, (id) => characterById[id].name)}
            />
          </div>
        )}
        {stage === 'group' && (
          <div className="stage-row">{cast.map((id) => frame(id, 'stage'))}</div>
        )}
        <DialogueBox
          framed={stage === 'single'}
          lineId={lineId}
          textRef={textRef}
          speakerName={
            bridgeLine
              ? bridgeLine.name
              : current.speaker && stage !== 'group'
                ? characterById[current.speaker].name
                : null
          }
          text={text}
          reveal={reveal}
          onNext={next}
          onBack={back}
          canBack={index > 0}
          nextDisabled={pending && reveal.complete}
        >
          {stage === 'single' && frame(cast[0], 'box')}
          {current.choice && reveal.complete && !bridge && (
            <div className="scene-choice-panel">
              <SceneDecision
                beat={current}
                sceneId={sceneId}
                game={game}
                onSelect={(key, option) => {
                  choiceMade.current = true;
                  act({ type: 'story-choice', key, option });
                  setPosition(index + 1);
                }}
              />
              {pending && game.mode === 'guided' && (
                <OwnWords
                  game={game}
                  act={act}
                  beat={current}
                  sceneId={sceneId}
                  sceneText={sectionText(
                    beats,
                    current.section?.id,
                    (id) => characterById[id].name,
                  )}
                  reduced={reading.reduced}
                  onBridge={(reply) =>
                    setBridge({
                      at: 0,
                      lines: reply.beats.map((b) => ({
                        name: b.speaker ? characterById[b.speaker]?.name || null : null,
                        text: b.speaker ? spoken(b.text) : b.text,
                      })),
                    })
                  }
                />
              )}
            </div>
          )}
        </DialogueBox>
      </div>
    </div>
  );
}
