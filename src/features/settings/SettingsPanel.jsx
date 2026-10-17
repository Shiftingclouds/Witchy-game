import { useRef, useState } from 'react';
import { Download, Upload, Image, RotateCcw } from 'lucide-react';
import { Modal, Button, Eyebrow } from '../../components.jsx';
import { ReadingControls } from '../../dialogue-presentation.jsx';
import { initialState } from '../../engine.mjs';
import { downloadSave } from '../../storage/saves.mjs';
import { ClaudeConnection } from '../ai/ClaudeConnection.jsx';
export function SettingsPanel({
  reading,
  game,
  manifest,
  onClose,
  importSave,
  setGame,
  notify,
  open,
}) {
  const [confirm, setConfirm] = useState(false);
  const fileInput = useRef(null);
  return (
    <Modal title="Make yourself at home" onClose={onClose}>
      <div className="settings-section">
        <Eyebrow>READ AT YOUR PACE</Eyebrow>
        <h3>Let the words arrive.</h3>
        <ReadingControls reading={reading} />
        <p>
          Tap the text or choose Show full text to finish a line immediately. Scene choices wait for
          you. Choose larger text or Reduce motion here. Your device’s reduced-motion preference is
          also respected.
        </p>
      </div>
      <div className="settings-section">
        <Eyebrow>YOUR PROGRESS</Eyebrow>
        <h3>One life. Safely kept.</h3>
        <p>
          Your {game.mode === 'book' ? 'book' : 'world'} save stays on this computer. Export a copy
          to keep a backup. The two modes have separate saves.
        </p>
        <div className="button-row">
          <Button icon={Download} onClick={() => downloadSave(game)}>
            Export save
          </Button>
          <Button icon={Upload} onClick={() => fileInput.current?.click()}>
            Import save
          </Button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => importSave(e.target.files[0])}
          />
        </div>
      </div>
      <ClaudeConnection />
      <div className="settings-section">
        <Eyebrow>THE WORLD IN PICTURES</Eyebrow>
        <p>
          {manifest.filter((a) => !a.generated).length} original illustrations, with a new overview
          map made from their visual references.
        </p>
        <Button icon={Image} onClick={() => open({ type: 'gallery' })}>
          Browse the art collection
        </Button>
      </div>
      <div className="settings-section danger-zone">
        {confirm ? (
          <>
            <p>
              Start this {game.mode} save again? Export it first if you want to keep it. Your other
              mode will stay as it is.
            </p>
            <div className="button-row">
              <Button
                onClick={() => {
                  setGame(initialState(game.mode, game.name, game.house, game.familiar));
                  onClose();
                  notify('A fresh first day. Welcome back.');
                }}
              >
                Start this save again
              </Button>
              <Button onClick={() => setConfirm(false)}>Keep my progress</Button>
            </div>
          </>
        ) : (
          <button className="text-button" onClick={() => setConfirm(true)}>
            <RotateCcw size={14} /> Start this mode again
          </button>
        )}
      </div>
    </Modal>
  );
}
