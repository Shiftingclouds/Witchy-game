import { useState } from 'react';
import { houses, familiars, art } from '../../content.mjs';
import { VineButton } from './VineButton.jsx';
import { MODE_LABELS } from './menu-model.mjs';

/** Shown only when entering a mode whose save slot is empty. */
export function CharacterCreation({ mode, onBegin, onBack }) {
  const [name, setName] = useState('Avery'),
    [house, setHouse] = useState('owlcombe'),
    [familiar, setFamiliar] = useState('cat');
  const chosen = houses.find((h) => h.id === house);
  return (
    <div className="character-creation" role="dialog" aria-labelledby="creation-title">
      <p className="title-kicker">{MODE_LABELS[mode]}</p>
      <h2 id="creation-title">Who are you?</h2>
      <p className="creation-lede">A lantern is waiting with your name on it.</p>
      <div className="creation-body">
        <img className="creation-familiar" src={art('fam-' + familiar)} alt={`Your ${familiar}`} />
        <div className="creation-fields">
          <label>
            Your name
            <input maxLength={24} value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            Your house
            <select value={house} onChange={(e) => setHouse(e.target.value)}>
              {houses.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} · {h.virtue}
                </option>
              ))}
            </select>
          </label>
          <p className="creation-motto">{chosen.motto}</p>
          <label>
            Your familiar
            <select value={familiar} onChange={(e) => setFamiliar(e.target.value)}>
              {familiars.map((f) => (
                <option key={f} value={f}>
                  {f[0].toUpperCase() + f.slice(1)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="creation-actions">
        <VineButton
          lead
          title="Begin your story"
          disabled={!name.trim()}
          onClick={() => onBegin(name.trim(), house, familiar)}
        />
        <button className="title-quiet" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
}
