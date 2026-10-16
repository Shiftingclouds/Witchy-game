import { chapterBeats, chapterSceneId, choiceKey } from '../../scene-beats.mjs';
import { characterById, locationById } from '../../content.mjs';

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
  const beats = chapterBeats(game.chapter, game),
    sceneId = chapterSceneId(game.chapter);
  return (
    <div className="authored-chapter">
      {beats.map((beat, index) => (
        <div key={beat.id} data-story-beat={beat.id}>
          {beat.section && beat.section.id !== beats[index - 1]?.section?.id && (
            <header className="story-section-heading">
              <small>{locationById[beat.section.location]?.name}</small>
              <h3>{beat.section.title}</h3>
            </header>
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
              onSelect={(key, option) => act({ type: 'story-choice', key, option })}
            />
          )}
        </div>
      ))}
    </div>
  );
}
