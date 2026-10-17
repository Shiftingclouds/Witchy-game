import { useEffect, useState } from 'react';
import { Button, Eyebrow } from '../../components.jsx';
import {
  askClaude,
  aiAvailable,
  claudeStatus,
  ERROR_COPY,
  MODEL_CHOICES,
  storyModel,
  housekeepingModel,
  debugLogging,
} from '../../ai/claude.mjs';

const save = (key, value) => {
  try {
    localStorage.setItem('lanternmere.' + key, value);
  } catch {
    /* Defaults apply without storage. */
  }
};

/** Settings section for the AI modes: status, a small test, model choices and the opt-in debug log. */
export function ClaudeConnection() {
  const [status, setStatus] = useState(null),
    [test, setTest] = useState(''),
    [busy, setBusy] = useState(false),
    [story, setStory] = useState(storyModel),
    [house, setHouse] = useState(housekeepingModel),
    [debug, setDebug] = useState(debugLogging);
  useEffect(() => {
    if (aiAvailable()) claudeStatus().then(setStatus);
  }, []);
  if (!aiAvailable()) return null;
  async function runTest() {
    setBusy(true);
    setTest('');
    const result = await askClaude({
      system: 'You are checking a connection. Reply in the JSON shape requested.',
      prompt: 'Reply with ready set to true.',
      schema: {
        type: 'object',
        properties: { ready: { type: 'boolean' } },
        required: ['ready'],
        additionalProperties: false,
      },
      purpose: 'housekeeping',
    });
    setBusy(false);
    setTest(
      result.ok ? 'Connected — Claude answered.' : ERROR_COPY[result.error] || result.message,
    );
  }
  return (
    <div className="settings-section">
      <Eyebrow>CLAUDE FOR THE AI MODES</Eyebrow>
      <h3>The storyteller.</h3>
      <p>
        {status?.available
          ? `Claude Code ${status.version} is ready on this computer. The Guided Tale and the Open World use your Claude subscription; nothing is sent anywhere else.`
          : status
            ? ERROR_COPY[status.reason] || 'Claude Code could not be found.'
            : 'Checking for Claude Code…'}
      </p>
      <div className="reading-controls">
        <label>
          Writing model{' '}
          <select
            aria-label="Writing model"
            value={story}
            onChange={(e) => (setStory(e.target.value), save('ai-story-model', e.target.value))}
          >
            {MODEL_CHOICES.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
        <label>
          Memory model{' '}
          <select
            aria-label="Memory model"
            value={house}
            onChange={(e) => (setHouse(e.target.value), save('ai-house-model', e.target.value))}
          >
            {MODEL_CHOICES.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
        <label>
          Debug log{' '}
          <select
            aria-label="Debug log"
            value={debug ? 'on' : 'off'}
            onChange={(e) => (
              setDebug(e.target.value === 'on'),
              save('ai-debug-log', e.target.value)
            )}
          >
            <option value="off">Off</option>
            <option value="on">On (saved on this computer)</option>
          </select>
        </label>
      </div>
      <div className="button-row">
        <Button disabled={busy} onClick={runTest}>
          {busy ? 'Asking…' : 'Test connection'}
        </Button>
      </div>
      {test && <p role="status">{test}</p>}
    </div>
  );
}
