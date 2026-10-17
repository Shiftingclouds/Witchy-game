import { useState } from 'react';
import { ThinkingVeil } from '../../components/lamplight/ThinkingVeil.jsx';
import { StoryInput } from '../../components/lamplight/StoryInput.jsx';
import { ModeChoice } from '../../components/lamplight/ModeCard.jsx';
import { art } from '../../content.mjs';

/** Reference page for the AI-mode patterns (open with ?patterns). */
export function PatternShowcase({ reduced }) {
  const [text, setText] = useState(''),
    [sent, setSent] = useState(''),
    [mode, setMode] = useState('timeless');
  return (
    <main className="pattern-showcase">
      <h1>Lamplight patterns</h1>
      <section className="pattern-scene" style={{ backgroundImage: `url(${art('lantern-hall')})` }}>
        <ThinkingVeil active reduced={reduced} />
      </section>
      <StoryInput
        value={text}
        onChange={setText}
        onSubmit={(t) => {
          setSent(t);
          setText('');
        }}
      />
      {sent && <p>Submitted: {sent}</p>}
      <ModeChoice
        label="How should time pass?"
        value={mode}
        onChange={setMode}
        options={[
          {
            id: 'timeless',
            title: 'Timeless',
            description: 'Live at your own pace; the mystery waits for you.',
          },
          {
            id: 'timed',
            title: 'Timed',
            description: 'The year moves on, and so does the mystery.',
          },
        ]}
      />
    </main>
  );
}
