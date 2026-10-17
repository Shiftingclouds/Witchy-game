import { dateLabel } from '../../engine.mjs';
import { chapterBeats, chapterSceneId, choiceKey } from '../../scene-beats.mjs';
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

export function AuthoredChapter({ game, act }) {
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
  const sections = beats.filter(
    (beat, index) => beat.section && beat.section.id !== beats[index - 1]?.section?.id,
  );
  function jump(beat) {
    root.current?.querySelector(`[data-story-beat="${beat.id}"]`)?.focus();
    act({ type: 'bookmark', scene: sceneId, beat: beat.id });
  }
  return (
    <div className="authored-chapter" ref={root}>
      {sections.length > 0 && (
        <nav className="chapter-contents" aria-label="Chapter sections">
          {sections.map((beat) => (
            <button key={beat.id} onClick={() => jump(beat)}>
              {beat.section.title}
            </button>
          ))}
          {game.bookmark?.scene === sceneId && (
            <button
              onClick={() => jump(beats.find((beat) => beat.id === game.bookmark.beat) || beats[0])}
            >
              Resume saved place
            </button>
          )}
        </nav>
      )}
      {beats.map((beat, index) => (
        <div key={beat.id} data-story-beat={beat.id} tabIndex={-1}>
          {beat.section && beat.section.id !== beats[index - 1]?.section?.id && (
            <header className="story-section-heading">
              <small>
                {locationById[beat.section.location]?.name}
                {beat.section.date && ` · ${dateLabel(beat.section.date)}`}
              </small>
              <h3>{beat.section.title}</h3>
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
            {beat.text}
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
        </div>
      ))}
    </div>
  );
}
import { useEffect, useRef } from 'react';
