import { useEffect, useRef, useState } from 'react';
import { OpeningScene } from './OpeningScene.jsx';
import { VineButton } from './VineButton.jsx';
import { continueTarget, MODE_LABELS } from './menu-model.mjs';
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
 * Menu states: 'title' → 'menu' → 'story' (Read the book / Live the world).
 */
const slotLine = (status, saved, empty) =>
  status === 'unreadable' ? 'This save could not be read' : status === 'ok' ? saved : empty;

/** `slots` holds each save slot's status: 'empty', 'ok' or 'unreadable'. */
export function TitleScreen({
  reduced,
  saves,
  slots,
  lastMode,
  onContinue,
  onChooseMode,
  onImport,
  onSettings,
  children,
}) {
  const [stage, setStage] = useState('title');
  const menu = useRef(null);
  const fileInput = useRef(null);
  const target = continueTarget({ lastMode, saves });
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
    if (stage === 'story') menu.current?.querySelector('button')?.focus();
    if (stage !== 'story') return;
    const back = (event) => event.key === 'Escape' && setStage('menu');
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
                {target && (
                  <VineButton
                    lead
                    title="Continue"
                    subline={target.label}
                    onClick={() => onContinue(target.mode)}
                  />
                )}
                <div className={'title-modes' + (ai ? ' three' : '')}>
                  <VineButton
                    lead={!target}
                    title="The Story"
                    subline="The tale as it was written"
                    onClick={() => setStage('story')}
                  />
                  {ai && (
                    <>
                      <VineButton
                        title={MODE_LABELS.guided}
                        subline={slotLine(
                          slots.guided,
                          'Continue your tale',
                          'The same path, alive around you',
                        )}
                        onClick={() => onChooseMode('guided')}
                      />
                      <VineButton
                        title={MODE_LABELS.sandbox}
                        subline={slotLine(
                          slots.sandbox,
                          'Continue your life',
                          'Go anywhere. Make a life.',
                        )}
                        onClick={() => onChooseMode('sandbox')}
                      />
                    </>
                  )}
                </div>
                {!ai && <p className="title-note">AI modes run in the desktop app.</p>}
              </>
            ) : (
              <>
                <VineButton
                  title={MODE_LABELS.book}
                  subline={slotLine(
                    slots.book,
                    'Continue your book',
                    'An illustrated story, one page at a time',
                  )}
                  onClick={() => onChooseMode('book')}
                />
                <VineButton
                  title={MODE_LABELS.live}
                  subline={slotLine(slots.live, 'Continue your life', 'Explore at your own pace')}
                  onClick={() => onChooseMode('live')}
                />
                <button className="title-quiet" onClick={() => setStage('menu')}>
                  Back
                </button>
              </>
            )}
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
