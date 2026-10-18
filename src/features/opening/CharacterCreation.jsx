import { useState } from 'react';
import { VineButton } from './VineButton.jsx';
import { ModeChoice } from '../../components/lamplight/ModeCard.jsx';
import { MODE_LABELS } from './menu-model.mjs';

/** Shown only when entering a mode whose save slot is empty. House and familiar are chosen in the story. */
export function CharacterCreation({ mode, onBegin, onBack }) {
  const [timeMode, setTimeMode] = useState('timeless');
  const [name, setName] = useState('Avery');
  return (
    <div className="character-creation" role="dialog" aria-labelledby="creation-title">
      <p className="title-kicker">{MODE_LABELS[mode]}</p>
      <h2 id="creation-title">Who are you?</h2>
      <p className="creation-lede">A lantern is waiting with your name on it.</p>
      <div className="creation-fields name-only">
        <label>
          Your name
          <input maxLength={24} value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <p className="creation-motto">Your house and your familiar find you on arrival night.</p>
      </div>
      {mode === 'sandbox' && (
        <div className="creation-time">
          <p className="creation-time-label" id="time-label">
            How should time pass?
          </p>
          <ModeChoice
            label="How should time pass?"
            value={timeMode}
            onChange={setTimeMode}
            options={[
              {
                id: 'timeless',
                title: 'Timeless',
                description: 'Live at your own pace. The mystery waits until you go looking.',
              },
              {
                id: 'timed',
                title: 'Timed',
                description: 'The year moves on, and the mystery with it. Midsummer is coming.',
              },
            ]}
          />
        </div>
      )}
      <div className="creation-actions">
        <VineButton
          lead
          title="Begin your story"
          disabled={!name.trim()}
          onClick={() => onBegin(name.trim(), mode === 'sandbox' ? timeMode : null)}
        />
        <button className="title-quiet" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
}
