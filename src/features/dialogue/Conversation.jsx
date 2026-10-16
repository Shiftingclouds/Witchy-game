import { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Check, Send, ChevronRight, Copy } from 'lucide-react';
import { characterById, expressions, topics, art } from '../../content.mjs';
import { talkLine, relationshipLabel, sceneArt } from '../../engine.mjs';
import { dailyConversation } from '../../life.mjs';
import { characterInput, copiedCharacterContext } from '../../character-context.mjs';
import { apiRequest } from '../../ai/client.mjs';
import { Modal, Button, Eyebrow } from '../../components.jsx';
import { ConversationMemory } from '../../conversation-memory.jsx';
import { AnimatedPortrait, ConversationLine } from '../../dialogue-presentation.jsx';
export function Conversation({ id, game, act, ai, online, notify, onClose, reading }) {
  const c = characterById[id],
    lastTurn = game.conversations?.[id]?.at(-1);
  const [emotion, setEmotion] = useState(lastTurn?.emotion || talkLine(id, 'hello', game)[0]),
    [line, setLine] = useState(lastTurn?.text || talkLine(id, 'hello', game)[1]),
    [source, setSource] = useState(
      lastTurn ? 'Your last AI conversation' : 'A prepared conversation',
    ),
    [message, setMessage] = useState(''),
    [busy, setBusy] = useState(false),
    [bridge, setBridge] = useState(false),
    [pasted, setPasted] = useState(''),
    [copiedContext, setCopiedContext] = useState('');
  const abort = useRef(null);
  useEffect(() => () => abort.current?.abort(), []);
  function prepared(topic) {
    const [em, text] = talkLine(id, topic, game);
    setEmotion(em);
    setLine(text);
    setSource('A prepared conversation');
    act({ type: 'talk', id, topic });
  }
  async function send() {
    if (!message.trim() || busy) return;
    const text = message.trim();
    setBusy(true);
    abort.current = new AbortController();
    const timeout = setTimeout(() => abort.current.abort(), 28000);
    try {
      const data = await apiRequest('/api/dialogue', {
        method: 'POST',
        signal: abort.current.signal,
        body: { character: id, message: text, context: characterInput(game, id) },
      });
      setLine(data.text);
      setEmotion(data.emotion);
      setSource('An AI conversation');
      act({
        type: 'conversation',
        id,
        requestId: crypto.randomUUID(),
        source: 'provider',
        player: text,
        text: data.text,
        emotion: data.emotion,
      });
      setMessage('');
    } catch (e) {
      notify(
        e.name === 'AbortError'
          ? 'The conversation timed out. Try a prepared topic.'
          : e.message || 'Could not connect. Prepared conversations still work.',
      );
    } finally {
      clearTimeout(timeout);
      setBusy(false);
    }
  }
  async function copyContext() {
    const text = copiedCharacterContext(
      id,
      characterInput(game, id),
      message || 'What is on your mind today?',
    );
    setCopiedContext(text);
    try {
      await navigator.clipboard.writeText(text);
      notify(
        'Character context copied, including this friendship and recent conversation. Paste it into your AI, then bring the reply back here.',
      );
    } catch {
      notify('Clipboard access is unavailable. Select and copy the character context shown below.');
    }
  }
  return (
    <Modal title={`A moment with ${c.name}`} wide onClose={onClose}>
      <div className="conversation">
        <div
          className="conversation-portrait"
          style={{
            backgroundImage: `linear-gradient(0deg,#232b2bbb,#232b2b20),url(${art(sceneArt(game))})`,
          }}
        >
          <AnimatedPortrait id={id} emotion={emotion} reduced={reading.reduced} />
          <div className="conversation-identity">
            <h3>{c.name}</h3>
            <span>
              <Heart size={13} /> {relationshipLabel(game.bonds[id] || 0)} · {game.bonds[id] || 0}
              /100
            </span>
          </div>
        </div>
        <div className="conversation-content">
          <Eyebrow>{c.role}</Eyebrow>
          <ConversationLine key={line} text={line} reading={reading} speaker={c.name} />
          <span className="dialogue-source">{source}</span>
          <div className="topic-grid">
            {topics.map((t) => (
              <button key={t.id} onClick={() => prepared(t.id)}>
                <MessageCircle size={14} />
                {t.label}
                {game.rewards.includes(`talk:${id}:${t.id}`) && <Check size={13} />}
              </button>
            ))}
          </div>
          {game.mode === 'live' && (
            <div className="daily-checkin">
              <button
                disabled={!(game.bonds[id] > 0) || game.daily.checkins.includes(id)}
                onClick={() => {
                  setLine(dailyConversation(game, id));
                  setEmotion((expressions[id] || []).includes('warm') ? 'warm' : 'neutral');
                  setSource('A little time together');
                  act({ type: 'checkin', id });
                }}
              >
                <Heart size={15} />
                {game.daily.checkins.includes(id)
                  ? 'Time well spent today'
                  : 'Spend a little time together'}
              </button>
              <small>
                {!(game.bonds[id] > 0)
                  ? 'Choose an introductory topic first.'
                  : game.daily.checkins.includes(id)
                    ? 'Come back tomorrow for another quiet moment.'
                    : 'Once a day · +3 friendship · takes one part of the day'}
              </small>
            </div>
          )}
          <ConversationMemory id={id} game={game} act={act} />
          <div className="ai-conversation">
            <label htmlFor="dialogue-message">Or say something in your own words</label>
            <div className="message-input">
              <input
                id="dialogue-message"
                maxLength={2000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && ai.configured && send()}
                placeholder={
                  ai.configured
                    ? 'What would you like to say?'
                    : 'Write a message to take to your AI…'
                }
              />
              <button
                aria-label="Send to AI"
                disabled={busy || !ai.configured || !message.trim()}
                onClick={send}
              >
                {busy ? <span className="spinner" /> : <Send size={17} />}
              </button>
            </div>
            <small>
              {!online
                ? 'You’re offline. Prepared topics work; connected local AI can answer if the game server is reachable.'
                : ai.configured
                  ? `Connected to ${ai.model}. AI conversations do not award progress.`
                  : 'Optional AI is not connected. Use prepared topics or bring a reply from your own AI.'}
            </small>
            <button className="text-button" onClick={() => setBridge(!bridge)}>
              Use ChatGPT or another AI <ChevronRight size={14} />
            </button>
            {bridge && (
              <div className="ai-bridge">
                <Button icon={Copy} onClick={copyContext}>
                  Copy conversation context
                </Button>
                {copiedContext && (
                  <label>
                    Character context to copy
                    <textarea readOnly value={copiedContext} onFocus={(e) => e.target.select()} />
                  </label>
                )}
                <label>
                  Paste the AI’s reply
                  <textarea
                    maxLength={3000}
                    value={pasted}
                    onChange={(e) => setPasted(e.target.value)}
                    placeholder="Bring the conversation back here…"
                  />
                </label>
                <label>
                  Expression
                  <select
                    aria-label="Expression"
                    value={emotion}
                    onChange={(e) => setEmotion(e.target.value)}
                  >
                    {(expressions[id] || ['neutral']).map((e) => (
                      <option key={e}>{e}</option>
                    ))}
                  </select>
                </label>
                <Button
                  disabled={!pasted.trim()}
                  onClick={() => {
                    setLine(pasted.trim());
                    setSource('A reply from your AI');
                    act({
                      type: 'conversation',
                      id,
                      requestId: crypto.randomUUID(),
                      source: 'pasted',
                      player: message.trim(),
                      text: pasted.trim(),
                      emotion,
                    });
                    setPasted('');
                    setMessage('');
                    setBridge(false);
                  }}
                >
                  Read their reply
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
