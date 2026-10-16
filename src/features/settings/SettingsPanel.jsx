import { useState } from 'react';
import { Download, Upload, Image, RotateCcw } from 'lucide-react';
import { Modal, Button, Eyebrow } from '../../components.jsx';
import { ReadingControls } from '../../dialogue-presentation.jsx';
import { initialState } from '../../engine.mjs';
import { downloadSave } from '../../storage/saves.mjs';
export function SettingsPanel({
  reading,
  game,
  offline,
  ai,
  setAi,
  manifest,
  onClose,
  importSave,
  setGame,
  notify,
  open,
}) {
  const [confirm, setConfirm] = useState(false);
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
          Your {game.mode === 'book' ? 'book' : 'world'} save stays in this browser. Export a copy
          to move devices or keep a backup. The two modes have separate saves.
        </p>
        <div className="button-row">
          <Button icon={Download} onClick={() => downloadSave(game)}>
            Export save
          </Button>
          <label className="button">
            <Upload size={16} />
            Import save
            <input
              type="file"
              accept="application/json,.json"
              hidden
              onChange={(e) => importSave(e.target.files[0])}
            />
          </label>
        </div>
      </div>
      <div className="settings-section">
        <Eyebrow>OFFLINE ADVENTURES</Eyebrow>
        <p>
          {offline === 'ready'
            ? 'The app and every illustration are cached on this device. You can reload and play without an internet connection.'
            : offline === 'preparing'
              ? 'The app is downloading the illustrations for offline play. Keep this tab open until the status says Saved for offline.'
              : offline === 'dev'
                ? 'You are using the development server. Offline caching is enabled in the production build.'
                : 'Offline caching could not finish. Free browser storage and reload while connected.'}
        </p>
        <small>Browser storage can be cleared by your browser. Export important saves.</small>
      </div>
      <div className="settings-section">
        <Eyebrow>OPTIONAL AI CONVERSATIONS</Eyebrow>
        <p>
          {ai.configured
            ? `Connected to ${ai.model}. Your message, character context, and recent conversation are sent to your configured provider when you press Send.`
            : 'No AI provider is connected. All lessons, choices, friendships, and endings already work with prepared dialogue.'}
        </p>
        <p>
          Choose a provider, follow its instructions, and test a greeting before saving. Local
          models and copy-and-paste conversations are supported too.
        </p>
        <Button onClick={() => open({ type: 'ai-setup' })}>Open AI setup</Button>
        <Button
          onClick={() =>
            fetch('/api/status')
              .then((r) => r.json())
              .then((data) => {
                setAi(data);
                notify(
                  data.configured
                    ? 'AI connection settings detected.'
                    : 'No AI connection configured yet.',
                );
              })
              .catch(() => notify('The AI server is unavailable. Offline play is still available.'))
          }
        >
          Check connection settings
        </Button>
      </div>
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
