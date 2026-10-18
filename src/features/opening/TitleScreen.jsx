import { useEffect, useRef, useState } from 'react';
import { OpeningScene } from './OpeningScene.jsx';
import { VineButton } from './VineButton.jsx';
import { MODE_LABELS, saveLine } from './menu-model.mjs';
import { aiAvailable } from '../../ai/claude.mjs';
import './title.css';

function Title() {
  return (
    <div className="title-block">
      <p className="title-kicker">Academy of the Quiet Arts</p>
      <h1 className="title-name">Lanternmere</h1>
      <svg className="title-rule" viewBox="0 0 400 24" aria-hidden="true">
        <path d="M20 12 H168 M232 12 H380" />
        <path d="M168 12 C176 12 180 6 186 6 C190 6 192 9 190 11" />
        <path d="M232 12 C224 12 220 18 214 18 C210 18 208 15 210 13" />
        <path d="M200 4 L206 12 L200 20 L194 12 Z" />
        <circle cx="20" cy="12" r="1.4" />
        <circle cx="380" cy="12" r="1.4" />
      </svg>
    </div>
  );
}

/**
 * The opening: "Press any key", then the menu over the living scene.
 * Menu states: 'title' → 'menu' (Continue / New game) → 'continue' (your saves) or 'new' (ways to play).
 */
const slotLine = (status, saved, empty) =>
  status === 'unreadable' ? 'This save could not be read' : status === 'ok' ? saved : empty;

const START_AGAIN = {
  book: 'Begin the book again from the first page?',
  live: 'Begin a new life at Lanternmere?',
  guided: 'Begin the Guided Tale again?',
  sandbox: 'Begin a new Open World?',
};
const NEW_GAME_LINES = {
  book: 'An illustrated story, one page at a time',
  live: 'Explore at your own pace',
  guided: 'The same path, alive around you',
  sandbox: 'Go anywhere. Make a life.',
};

/** Continue: each save by name, most recently played first. */
function ContinueList({ saves, slots, lastMode, onPick, onBack }) {
  const modes = Object.keys(MODE_LABELS)
    .filter((mode) => slots[mode] !== 'empty')
    .sort((a, b) => (b === lastMode) - (a === lastMode));
  return (
    <>
      <div className="title-modes three">
        {modes.map((mode) => (
          <VineButton
            key={mode}
            title={MODE_LABELS[mode]}
            subline={
              slots[mode] === 'unreadable' ? 'This save could not be read' : saveLine(saves[mode])
            }
            onClick={() => onPick(mode)}
          />
        ))}
      </div>
      <button className="title-quiet" onClick={onBack}>
        Back
      </button>
    </>
  );
}

/** Choose a way to play from the beginning; replacing an existing save asks first. */
function NewGame({ saves, slots, ai, confirming, onPick, onConfirm, onCancel, onBack }) {
  const modes = ai ? ['book', 'live', 'guided', 'sandbox'] : ['book', 'live'];
  const owner = (mode) => saves?.[mode]?.name;
  if (confirming)
    return (
      <div className="title-confirm" role="alertdialog" aria-labelledby="confirm-new">
        <p id="confirm-new">
          {START_AGAIN[confirming]} {owner(confirming) ? `${owner(confirming)}’s` : 'The current'}{' '}
          game will be set aside as a backup.
        </p>
        <div className="title-confirm-actions">
          <VineButton title="Start over" onClick={onConfirm} />
          <button className="title-quiet" onClick={onCancel}>
            Keep my save
          </button>
        </div>
      </div>
    );
  return (
    <>
      <div className="title-modes three">
        {modes.map((mode) => (
          <VineButton
            key={mode}
            title={MODE_LABELS[mode]}
            subline={
              slots[mode] === 'empty'
                ? NEW_GAME_LINES[mode]
                : `Replaces ${owner(mode) ? owner(mode) + '’s' : 'the saved'} game`
            }
            onClick={() => onPick(mode)}
          />
        ))}
      </div>
      {!ai && (
        <p className="title-note">The Guided Tale and the Open World run in the desktop app.</p>
      )}
      <button className="title-quiet" onClick={onBack}>
        Back
      </button>
    </>
  );
}

/** `slots` holds each save slot's status: 'empty', 'ok' or 'unreadable'. */
export function TitleScreen({
  reduced,
  saves,
  slots,
  lastMode,
  onContinue,
  onNewGame,
  onImport,
  onSettings,
  children,
}) {
  const [stage, setStage] = useState('title');
  // New game: which mode is waiting for the player to confirm replacing its save.
  const [confirming, setConfirming] = useState(null);
  const menu = useRef(null);
  const fileInput = useRef(null);
  const anySave = Object.values(slots).some((status) => status !== 'empty');
  const desktop = typeof window !== 'undefined' && Boolean(window.lanternmere?.storage);
  const ai = aiAvailable();

  useEffect(() => {
    if (stage !== 'title') return;
    const wake = (event) => {
      // Leave browser and app shortcuts (Ctrl/Alt/Meta combinations, F-keys) alone.
      if (event.ctrlKey || event.metaKey || event.altKey || /^F\d+$/.test(event.key)) return;
      if (['Shift', 'Control', 'Alt', 'Meta', 'Tab'].includes(event.key)) return;
      event.preventDefault?.();
      setStage('menu');
    };
    addEventListener('keydown', wake);
    return () => removeEventListener('keydown', wake);
  }, [stage]);

  useEffect(() => {
    if (stage === 'continue' || stage === 'new') menu.current?.querySelector('button')?.focus();
    if (stage !== 'continue' && stage !== 'new') return;
    const back = (event) => event.key === 'Escape' && (setConfirming(null), setStage('menu'));
    addEventListener('keydown', back);
    return () => removeEventListener('keydown', back);
  }, [stage]);

  const awake = stage !== 'title';
  return (
    <OpeningScene reduced={reduced} awake={awake}>
      <div
        className={'title-ui' + (awake ? ' awake' : '') + (children ? ' stepped-aside' : '')}
        inert={Boolean(children)}
        onClick={() => !awake && setStage('menu')}
      >
        <Title />
        {awake && (
          <nav className="title-menu" aria-label="Choose how to play" ref={menu}>
            {stage === 'menu' ? (
              <>
                {anySave && (
                  <VineButton
                    title="Continue"
                    subline="Return to a story you have begun"
                    onClick={() => setStage('continue')}
                  />
                )}
                <VineButton
                  title="New game"
                  subline="Begin at the lake, with a lantern of your own"
                  onClick={() => setStage('new')}
                />
              </>
            ) : stage === 'continue' ? (
              <ContinueList
                saves={saves}
                slots={slots}
                lastMode={lastMode}
                onPick={onContinue}
                onBack={() => setStage('menu')}
              />
            ) : stage === 'new' ? (
              <NewGame
                saves={saves}
                slots={slots}
                ai={ai}
                confirming={confirming}
                onPick={(mode) => (slots[mode] === 'empty' ? onNewGame(mode) : setConfirming(mode))}
                onConfirm={() => {
                  onNewGame(confirming);
                  setConfirming(null);
                }}
                onCancel={() => setConfirming(null)}
                onBack={() => {
                  setConfirming(null);
                  setStage('menu');
                }}
              />
            ) : null}
          </nav>
        )}
        {!awake && <p className="title-press">Press any key</p>}
        {awake && (
          <div className="title-corner">
            <button className="title-quiet" onClick={onSettings}>
              Settings
            </button>
            <button className="title-quiet" onClick={() => fileInput.current?.click()}>
              Restore a save
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={(e) => onImport(e.target.files[0])}
            />
            {desktop && (
              <button className="title-quiet" onClick={() => window.close()}>
                Quit
              </button>
            )}
          </div>
        )}
      </div>
      {children}
    </OpeningScene>
  );
}
