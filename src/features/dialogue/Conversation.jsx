import { isLiveLike } from '../../engine/modes.mjs';
import { useState } from 'react';
import { Heart, MessageCircle, Check } from 'lucide-react';
import { characterById, expressions, topics, art } from '../../content.mjs';
import { talkLine, relationshipLabel, sceneArt } from '../../engine.mjs';
import { dailyConversation } from '../../life.mjs';
import { Modal, Eyebrow } from '../../components.jsx';
import { ConversationMemory } from '../../conversation-memory.jsx';
import { AnimatedPortrait, ConversationLine } from '../../dialogue-presentation.jsx';
export function Conversation({ id, game, act, onClose, reading }) {
  const c = characterById[id];
  const [emotion, setEmotion] = useState(talkLine(id, 'hello', game)[0]),
    [line, setLine] = useState(talkLine(id, 'hello', game)[1]),
    [source, setSource] = useState('A prepared conversation');
  function prepared(topic) {
    const [em, text] = talkLine(id, topic, game);
    setEmotion(em);
    setLine(text);
    setSource('A prepared conversation');
    act({ type: 'talk', id, topic });
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
          {isLiveLike(game.mode) && (
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
          <ConversationMemory id={id} game={game} />
        </div>
      </div>
    </Modal>
  );
}
