import { useEffect, useRef, useState } from 'react';
import { dateLabel } from '../../engine.mjs';
import { Interlude } from '../ai/Interlude.jsx';
import { StoryInput } from '../../components/lamplight/StoryInput.jsx';
import { ThinkingVeil } from '../../components/lamplight/ThinkingVeil.jsx';
import { useTurn } from '../ai/useTurn.mjs';
import { ERROR_COPY } from '../../ai/claude.mjs';
import { chapterBeats, chapterSceneId, choiceKey, spoken } from '../../scene-beats.mjs';
import { art, characterById, locationById } from '../../content.mjs';

export function SceneDecision({ beat, sceneId, game, onSelect }) {
  const key = choiceKey(sceneId, beat.id),
    selected = game.storyChoices?.[key];
  return (
    <fieldset className="scene-decision" data-choice={key}>
      <legend>{beat.choice.prompt || 'What will you do?'}</legend>
      {beat.choice.options.map((option) => (
        <button
          type="button"
          key={option.id}
          disabled={Boolean(selected)}
          className={selected === option.id ? 'selected' : ''}
          aria-pressed={selected === option.id}
          onClick={() => onSelect(key, option.id)}
        >
          <span>{option.label}</span>
          {option.hint && <small>{option.hint}</small>}
          {selected === option.id && <small>Chosen · saved in your story</small>}
        </button>
      ))}
    </fieldset>
  );
}

/** Guided Tale: answer an authored decision in your own words; Claude maps it to an authored option. */
export function OwnWords(props) {
  // Once the decision is made there is nothing to answer, and no turn should stay alive.
  if (props.game.storyChoices?.[choiceKey(props.sceneId, props.beat.id)]) return null;
  return <OwnWordsInput {...props} />;
}

function OwnWordsInput({ game, act, beat, sceneId, sceneText, reduced, onBridge }) {
  const [text, setText] = useState('');
  const turn = useTurn({ game, act, mode: 'guided' });
  const key = choiceKey(sceneId, beat.id);
  const decision = {
    prompt: beat.choice.prompt || 'What will you do?',
    options: beat.choice.options.map((o) => ({ id: o.id, label: o.label })),
  };
  const submit = async (words) => {
    const reply = await turn.send(words, {
      focus: { sectionId: beat.section?.id, sceneText },
      decision,
      onReply: (r) => {
        onBridge?.(r);
        act({ type: 'story-choice', key, option: r.mappedOption });
      },
    });
    if (reply) setText('');
  };
  return (
    <div className="own-words">
      <StoryInput
        value={text}
        onChange={setText}
        onSubmit={submit}
        disabled={turn.busy}
        placeholder="Or answer in your own words"
      />
      {turn.error && (
        <p className="ai-error-inline" role="alert">
          {ERROR_COPY[turn.error] || ERROR_COPY.failed}
        </p>
      )}
      <ThinkingVeil active={turn.busy} reduced={reduced} label="Finding your way into the story…" />
      {turn.busy && (
        <button className="text-button ai-stop" onClick={turn.cancel}>
          Stop
        </button>
      )}
    </div>
  );
}

export function AuthoredChapter({ game, act, reduced = false }) {
  const guided = game.mode === 'guided';
  const justChosen = useRef(null),
    root = useRef(null);
  const beats = chapterBeats(game.chapter, game),
    sceneId = chapterSceneId(game.chapter);
  useEffect(() => {
    if (!justChosen.current) return;
    const index = beats.findIndex((beat) => beat.id === justChosen.current);
    const next = beats[index + 1];
    if (next) root.current?.querySelector(`[data-story-beat="${next.id}"]`)?.focus();
    justChosen.current = null;
  }, [game.storyChoices]);
  // The authored text of one section, handed to Claude as verbatim canon for interludes.
  const sectionText = (id) =>
    beats
      .filter((b) => b.section?.id === id)
      .map((b) => (b.speaker ? `${characterById[b.speaker].name}: ${b.text}` : b.text))
      .join('\n')
      .slice(-2500);
  function jump(beat) {
    root.current?.querySelector(`[data-story-beat="${beat.id}"]`)?.focus();
    act({ type: 'bookmark', scene: sceneId, beat: beat.id });
  }
  return (
    <div className="authored-chapter" ref={root}>
      {game.bookmark?.scene === sceneId && (
        <nav className="chapter-contents" aria-label="Your place in the chapter">
          <button
            onClick={() => jump(beats.find((beat) => beat.id === game.bookmark.beat) || beats[0])}
          >
            Resume saved place
          </button>
        </nav>
      )}
      {beats.map((beat, index) => {
        const sectionEnds =
          guided &&
          beat.section &&
          (beats[index + 1] ? beats[index + 1].section?.id !== beat.section.id : !beat.choice);
        return (
          <div key={beat.id} data-story-beat={beat.id} tabIndex={-1}>
            {beat.section && beat.section.id !== beats[index - 1]?.section?.id && (
              <header className="story-section-heading">
                <small>
                  {locationById[beat.section.location]?.name}
                  {beat.section.date && ` · ${dateLabel(beat.section.date)}`}
                </small>
              </header>
            )}
            {beat.illustration && (
              <figure className="story-illustration">
                <img src={art(beat.illustration.art)} alt={beat.illustration.alt} loading="lazy" />
              </figure>
            )}
            <p className={beat.speaker ? 'authored-dialogue' : ''}>
              {beat.speaker && (
                <strong className="story-speaker">{characterById[beat.speaker].name}</strong>
              )}
              {beat.speaker ? spoken(beat.text) : beat.text}
            </p>
            {beat.choice && (
              <SceneDecision
                beat={beat}
                sceneId={sceneId}
                game={game}
                onSelect={(key, option) => {
                  justChosen.current = beat.id;
                  act({ type: 'story-choice', key, option });
                }}
              />
            )}
            {beat.choice && guided && (
              <OwnWords
                game={game}
                act={act}
                beat={beat}
                sceneId={sceneId}
                sceneText={sectionText(beat.section?.id)}
                reduced={reduced}
              />
            )}
            {sectionEnds && (
              <Interlude
                game={game}
                act={act}
                reduced={reduced}
                sectionId={beat.section.id}
                sceneText={sectionText(beat.section.id)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
