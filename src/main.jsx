import { Conversation } from './features/dialogue/Conversation.jsx';
import { SettingsPanel } from './features/settings/SettingsPanel.jsx';
import { endingCommon, endingVariants } from './features/story/epilogue.mjs';
import { createSaveRepository, downloadSave } from './storage/saves.mjs';
import { platformStorage } from './storage/platform.mjs';
import { ErrorBoundary } from './ErrorBoundary.jsx';
import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BookOpen,
  Compass,
  Map,
  Users,
  Sparkles,
  CalendarDays,
  Feather,
  Settings,
  ChevronsLeft,
  Flame,
  ArrowRight,
  ChevronLeft,
  Check,
  CheckCircle2,
  Heart,
  Sun,
  Moon,
  Download,
  X,
  Search,
  LogOut,
  Menu,
  GraduationCap,
  Eye,
  Bookmark,
  MessageCircle,
  Shield,
  MapPin,
} from 'lucide-react';
import {
  art,
  houses,
  locations,
  locationById,
  characters,
  spells,
  festivals,
  chapters,
} from './content.mjs';
import {
  initialState,
  transition,
  season,
  dateLabel,
  periods,
  sceneArt,
  relationshipLabel,
  requirements,
  canAdvance,
} from './engine.mjs';
import { Button, Eyebrow, Modal, Portrait } from './components.jsx';
import { DailyCard, Gathering, CharacterProfile } from './daily-life.jsx';
import { characterLocation } from './life.mjs';
import World from './World.jsx';

import { SceneReader, ReadingControls, useReadingPreferences } from './dialogue-presentation.jsx';
import './theme/fonts.mjs';
import './styles.css';
import './dialogue-presentation.css';
import './theme/lamplight.css';
import './theme/surfaces.css';
import { applyReadingMode } from './theme/apply.mjs';
import { OpeningScene } from './features/opening/OpeningScene.jsx';
import { TitleScreen } from './features/opening/TitleScreen.jsx';
import { VineButton } from './features/opening/VineButton.jsx';
import { metCharacters, needsOpening } from './engine/selectors.mjs';
import { AiScene } from './features/ai/AiScene.jsx';
import { ScenePlayer } from './features/scene/ScenePlayer.jsx';
import { ArrivalPainting } from './features/scene/ArrivalPainting.jsx';
import { Soundscape } from './features/audio/Soundscape.jsx';
import { useChronicle } from './features/ai/useTurn.mjs';
import { AiStory, ThreadsCard } from './features/ai/AiStory.jsx';
import { Book, Desk, Leaf, Ribbons } from './features/shell/Grimoire.jsx';
import { JournalSpread } from './features/shell/spreads/JournalSpread.jsx';
import { CalendarSpread } from './features/shell/spreads/CalendarSpread.jsx';
import { SpellsSpread } from './features/shell/spreads/SpellsSpread.jsx';
import { PeopleSpread } from './features/shell/spreads/PeopleSpread.jsx';
import { StorySpread } from './features/shell/spreads/StorySpread.jsx';
import { PatternShowcase } from './features/patterns/PatternShowcase.jsx';
import './features/shell/grimoire.css';
import { CharacterCreation } from './features/opening/CharacterCreation.jsx';
import { LAST_MODE_KEY, MODE_LABELS } from './features/opening/menu-model.mjs';
import { isBookLike, isLiveLike, MODES } from './engine/modes.mjs';

const storage = platformStorage();
const saves = createSaveRepository(storage);
const lastMode = () => {
  try {
    return storage.getItem(LAST_MODE_KEY);
  } catch {
    return null;
  }
};
/** 'empty', 'ok' or 'unreadable' — an unreadable save must never look like an empty slot. */
function slotStatus(mode) {
  try {
    return saves.read(mode) ? 'ok' : 'empty';
  } catch {
    return 'unreadable';
  }
}
function load(mode) {
  try {
    return saves.read(mode);
  } catch {
    return null;
  }
}
// Sections of the grimoire: [view, accessible name, ribbon label].
const navItems = [
  ['world', 'Your day', 'Today'],
  ['map', 'World map', 'Map'],
  ['book', 'The story', 'Story'],
  ['people', 'People', 'People'],
  ['spells', 'Grimoire', 'Spells'],
  ['calendar', 'Calendar', 'Calendar'],
  ['journal', 'Journal', 'Journal'],
];
const taskLocations = {
  rowan: 'lantern-hall',
  kindle: 'classroom',
  imogen: 'library',
  archive: 'library',
  echo: 'library',
  saoirse: 'glasshouses',
  flower: 'glasshouses',
  lake: 'mere',
  stones: 'candlestones',
  thread: 'warding-hall',
  friends: 'lantern-hall',
  restored: 'heartfire',
};
function taskLocation(game, id) {
  if (['rowan', 'imogen', 'saoirse'].includes(id)) return characterLocation(game, id);
  if (id === 'friends')
    return characterLocation(
      game,
      ['rowan', 'imogen', 'saoirse'].find((c) => (game.bonds[c] || 0) < 10) || 'rowan',
    );
  return taskLocations[id];
}

function App() {
  const reading = useReadingPreferences();
  useEffect(() => applyReadingMode(reading.mode), [reading.mode]);
  const [game, setGame] = useState(null),
    [view, setView] = useState('world'),
    [modal, setModal] = useState(null),
    [creating, setCreating] = useState(null),
    [freshStart, setFreshStart] = useState(false),
    [arrival, setArrival] = useState(null),
    [sceneSound, setSceneSound] = useState(null),
    [toast, setToast] = useState(''),
    [mobileNav, setMobileNav] = useState(false),
    [manifest, setManifest] = useState([]),
    [saveError, setSaveError] = useState('');
  // The story plays as a full-screen scene; leaving it shows a card to return to it.
  const [sceneDismissed, setSceneDismissed] = useState(false);
  const scenePlaying = Boolean(game) && !game.ending && !sceneDismissed;
  useEffect(() => setSceneDismissed(false), [game?.chapter, game?.mode]);
  // One chronicle keeper per playthrough (AI modes only; it does nothing for Book and Live).
  useChronicle(game, act);
  useEffect(() => {
    fetch('/art/manifest.json')
      .then((r) => r.json())
      .then(setManifest)
      .catch(() => {});
  }, []);
  useEffect(() => {
    if (!game) return;
    try {
      saves.write(game);
      storage.setItem(LAST_MODE_KEY, game.mode);
      setSaveError('');
    } catch {
      setSaveError(
        'Browser storage is full or unavailable. Export your save to keep your progress.',
      );
    }
  }, [game]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 6500);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    // The ending screen says this itself; no toast on top of it.
    if (game?.feedback && !(game.ending && game.feedback.startsWith('The first year is complete')))
      setToast(game.feedback);
  }, [game]);
  function act(action) {
    setGame((prev) => transition(prev, action));
  }
  function navigate(next) {
    setView(next);
    setMobileNav(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  function visit(id) {
    if (game && id !== game.location) setArrival(id);
    act({ type: 'visit', id });
    navigate('world');
  }
  function chooseMode(mode) {
    const status = slotStatus(mode);
    if (status === 'unreadable')
      setToast(
        'This save could not be read. Nothing was changed — you can restore an exported copy with Restore a save.',
      );
    else if (status === 'ok') start(mode);
    else setCreating(mode);
  }
  function start(mode, name, timeMode) {
    try {
      setGame(saves.read(mode) || initialState(mode, name, null, null, { timeMode }));
      setView(isBookLike(mode) ? 'book' : 'world');
    } catch (error) {
      setToast(error.message);
    }
  }
  function importSave(file) {
    if (!file) return;
    if (file.size > 1048576) {
      setToast('That save file is too large. Choose a Lanternmere JSON export.');
      return;
    }
    file
      .text()
      .then((raw) => {
        const imported = saves.import(raw, game);
        setGame(imported);
        navigate(isBookLike(imported.mode) ? 'book' : 'world');
        setModal(null);
        setToast('Your saved life is restored.');
      })
      .catch(() =>
        setToast('This file is not a valid Lanternmere save. Your current progress is safe.'),
      );
  }
  if (new URLSearchParams(window.location.search).has('patterns'))
    return <PatternShowcase reduced={reading.reduced} />;
  // Stand-alone view of the opening scene (used by the scene's own browser tests).
  if (new URLSearchParams(window.location.search).has('opening'))
    return <OpeningScene reduced={reading.reduced} awake={false} />;
  // What should be playing: the title theme, a story moment, or the place you are in.
  const soundContext = !game
    ? { screen: 'title' }
    : (needsOpening(game) || (scenePlaying && view === 'book')) && sceneSound
      ? { screen: 'scene', ...sceneSound, date: game.date }
      : { screen: 'world', location: game.location, period: game.period, date: game.date };
  const soundscape = <Soundscape context={soundContext} />;
  if (!game)
    return (
      <>
        {soundscape}
        <TitleScreen
          reduced={reading.reduced}
          saves={Object.fromEntries(MODES.map((m) => [m, load(m)]))}
          slots={Object.fromEntries(MODES.map((m) => [m, slotStatus(m)]))}
          lastMode={lastMode()}
          onContinue={chooseMode}
          onNewGame={(mode) => {
            setFreshStart(slotStatus(mode) !== 'empty');
            setCreating(mode);
          }}
          onImport={importSave}
          onSettings={() => setModal({ type: 'reading' })}
        >
          {creating && (
            <CharacterCreation
              mode={creating}
              onBack={() => {
                setCreating(null);
                setFreshStart(false);
              }}
              onBegin={(name, timeMode) => {
                if (freshStart) {
                  // New game over an existing save: the old one is kept as a backup.
                  const fresh = initialState(creating, name, null, null, { timeMode });
                  saves.beginAgain(fresh);
                  setGame(fresh);
                  setView(isBookLike(creating) ? 'book' : 'world');
                } else start(creating, name, timeMode);
                setFreshStart(false);
                setCreating(null);
              }}
            />
          )}
        </TitleScreen>
        {modal?.type === 'reading' && (
          <Modal title="Settings" onClose={() => setModal(null)}>
            <ReadingControls reading={reading} />
          </Modal>
        )}
        {toast && (
          <div className="toast" role="status">
            {toast}
          </div>
        )}
      </>
    );
  // Arrival night: the crossing, the hall, house and familiar, played before anything else.
  if (needsOpening(game))
    return (
      <div
        className="opening-story"
        data-reading-size={reading.size}
        data-reduced-motion={reading.reduced}
      >
        {soundscape}
        <ScenePlayer
          key="opening"
          opening
          game={game}
          act={act}
          reading={reading}
          onSound={setSceneSound}
        />
        {toast && (
          <div className="toast" role="status">
            {toast}
          </div>
        )}
      </div>
    );
  const house = houses.find((h) => h.id === game.house),
    chapter = chapters[game.chapter];
  const ribbons = navItems
    .filter(([id]) => isLiveLike(game.mode) || !['world', 'map'].includes(id))
    .map(([id, label, short]) =>
      id === 'book' && game.mode === 'sandbox' ? [id, 'Your story', 'Story'] : [id, label, short],
    );
  const storyScene = view === 'book' && game.mode !== 'sandbox' && scenePlaying;
  return (
    <div
      className="app-shell grimoire"
      data-reading-size={reading.size}
      data-reduced-motion={reading.reduced}
    >
      {soundscape}
      <div className="gm-inert" inert={Boolean(modal) || storyScene}>
        <Desk
          game={game}
          dateText={`${dateLabel(game.date)} · ${periods[game.period]}`}
          reduced={reading.reduced}
          onHome={() => setGame(null)}
          onMenu={() => setGame(null)}
          onCalendar={() => navigate('calendar')}
          onSettings={() => setModal({ type: 'settings' })}
          onToggleNav={() => setMobileNav(!mobileNav)}
        >
          {saveError && (
            <div className="storage-warning" role="alert">
              {saveError}
              <button onClick={() => downloadSave(game)}>Export save</button>
            </div>
          )}
          <Book
            view={view}
            ribbons={<Ribbons items={ribbons} view={view} onChange={navigate} open={mobileNav} />}
          >
            {view === 'world' && (
              <World
                game={game}
                act={act}
                visit={visit}
                navigate={navigate}
                open={setModal}
                quest={
                  game.mode === 'sandbox' ? (
                    <ThreadsCard game={game} navigate={navigate} />
                  ) : (
                    <QuestCard game={game} visit={visit} navigate={navigate} />
                  )
                }
                aiScene={
                  game.mode === 'sandbox' ? (
                    <AiScene game={game} act={act} reduced={reading.reduced} />
                  ) : null
                }
              />
            )}
            {view === 'map' && (
              <Leaf folio={14} title="The Atlas" className="gm-map">
                <Atlas game={game} visit={visit} />
              </Leaf>
            )}
            {view === 'book' && game.mode === 'sandbox' && (
              <Leaf>
                <AiStory game={game} act={act} />
              </Leaf>
            )}
            {view === 'book' && game.mode !== 'sandbox' && !scenePlaying && game.ending && (
              <Leaf>
                <Epilogue
                  game={game}
                  leave={() => (isLiveLike(game.mode) ? navigate('world') : setGame(null))}
                />
              </Leaf>
            )}
            {view === 'book' && game.mode !== 'sandbox' && !scenePlaying && !game.ending && (
              <StorySpread game={game} onPlayScene={() => setSceneDismissed(false)} />
            )}
            {view === 'people' && (
              <PeopleSpread game={game} open={setModal} live={isLiveLike(game.mode)} />
            )}
            {view === 'spells' && (
              <SpellsSpread
                game={game}
                act={act}
                visit={visit}
                open={setModal}
                live={isLiveLike(game.mode)}
              />
            )}
            {view === 'calendar' && (
              <CalendarSpread
                game={game}
                act={act}
                visit={visit}
                open={setModal}
                live={isLiveLike(game.mode)}
              />
            )}
            {view === 'journal' && <JournalSpread game={game} act={act} />}
          </Book>
        </Desk>
      </div>
      {storyScene && (
        <ScenePlayer
          key={game.chapter}
          onSound={setSceneSound}
          game={game}
          act={act}
          reading={reading}
          onExit={() => (isLiveLike(game.mode) ? navigate('world') : setSceneDismissed(true))}
          onVisit={(task) => visit(taskLocation(game, task))}
        />
      )}
      {arrival && (
        <ArrivalPainting
          key={arrival}
          location={arrival}
          src={art(sceneArt({ ...game, location: arrival }))}
          reduced={reading.reduced}
          onDone={() => setArrival(null)}
        />
      )}
      {modal?.type === 'talk' && (
        <Conversation
          key={modal.id}
          reading={reading}
          id={modal.id}
          game={game}
          act={act}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === 'profile' && (
        <CharacterProfile
          id={modal.id}
          game={game}
          visit={visit}
          open={setModal}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === 'event' && (
        <Gathering id={modal.id} game={game} act={act} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'lesson' && (
        <Lesson
          spell={spells.find((s) => s.id === modal.id)}
          game={game}
          act={act}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === 'scene' && (
        <Modal title={locationById[game.location].name} wide onClose={() => setModal(null)}>
          <img
            className="full-scene"
            src={art(sceneArt(game))}
            alt={locationById[game.location].name}
          />
          <p>{locationById[game.location].description}</p>
        </Modal>
      )}
      {modal?.type === 'reading' && (
        <Modal title="Reading settings" onClose={() => setModal(null)}>
          <ReadingControls reading={reading} />
        </Modal>
      )}
      {modal?.type === 'settings' && (
        <SettingsPanel
          reading={reading}
          game={game}
          manifest={manifest}
          onClose={() => setModal(null)}
          importSave={importSave}
          setGame={setGame}
          notify={setToast}
          open={setModal}
        />
      )}
      {modal?.type === 'gallery' && <Gallery manifest={manifest} onClose={() => setModal(null)} />}
      {toast && (
        <div className="toast" role="status">
          <Sparkles size={19} />
          <span>{toast}</span>
          <button
            className="icon-button"
            aria-label="Dismiss notification"
            onClick={() => setToast('')}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

const CHAPTER_WORDS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
function QuestCard({ game, visit, navigate }) {
  const chapter = chapters[game.chapter];
  return (
    <section className="quest-card">
      <h2>{game.ending ? 'A home made of light' : chapter.title}</h2>
      <p className="gm-chapter-count">
        <Bookmark size={14} />
        {game.ending
          ? 'Your story, all eight chapters'
          : `Chapter ${CHAPTER_WORDS[game.chapter]} of eight`}
      </p>
      <p>
        {game.ending
          ? 'The Heartfire is restored. There are still books to read, places to find, and friends to sit beside.'
          : chapter.goal}
      </p>
      {!game.ending && (
        <div className="task-list">
          {requirements(game).map((r) => (
            <button
              key={r.id}
              onClick={() => visit(taskLocation(game, r.id))}
              className={r.done ? 'done' : ''}
            >
              {r.done ? <CheckCircle2 size={15} /> : <span className="empty-check" />}
              <span>{r.label}</span>
            </button>
          ))}
        </div>
      )}
      <button className="text-button" onClick={() => navigate('book')}>
        {canAdvance(game) ? 'Continue your story' : 'Open the storybook'} <ArrowRight size={15} />
      </button>
    </section>
  );
}

function Atlas({ game, visit }) {
  const [region, setRegion] = useState('All places'),
    [query, setQuery] = useState('');
  const pins = [
    ['whispering-wood', 18, 25],
    ['candlestones', 36, 12],
    ['boathouse', 30, 43],
    ['lantern-hall', 65, 34],
    ['observatory', 84, 21],
    ['glasshouses', 86, 50],
    ['thimble-cross', 20, 78],
    ['mere', 62, 75],
  ];
  const filtered = locations.filter(
    (l) =>
      (region === 'All places' || l.region === region) &&
      l.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <h1>A world worth wandering</h1>
      <p className="gm-lede">
        {game.visited.length} of {locations.length} places discovered. There is no wrong turn.
      </p>
      <div className="atlas">
        <img
          src={art('academy-map')}
          alt="Illustrated map of the lakeside academy, the village, woodland, standing stones, observatory, and glasshouses"
        />
        {pins.map(([id, x, y]) => (
          <button
            key={id}
            className={'map-pin ' + (game.location === id ? 'current' : '')}
            style={{ left: x + '%', top: y + '%' }}
            onClick={() => visit(id)}
          >
            <MapPin size={17} />
            <span>{locationById[id].name}</span>
          </button>
        ))}
        <span className="map-compass">
          N <Compass size={35} />
        </span>
      </div>
      <div className="filter-bar">
        <div className="tabs">
          {['All places', 'Academy', 'Grounds', 'Village', 'Houses'].map((r) => (
            <button key={r} className={region === r ? 'active' : ''} onClick={() => setRegion(r)}>
              {r}
            </button>
          ))}
        </div>
        <label className="search">
          <Search size={15} />
          <input
            placeholder="Find a place…"
            aria-label="Find a place"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <div className="location-grid">
        {filtered.map((l) => (
          <button className="location-tile" key={l.id} onClick={() => visit(l.id)}>
            <div>
              <img src={art(sceneArt(game, l.id))} alt="" loading="lazy" />
              {game.visited.includes(l.id) && (
                <span className="visited-label">
                  <Check size={12} /> Visited
                </span>
              )}
            </div>
            <span className="location-tile-copy">
              <small>{l.region}</small>
              <strong>{l.name}</strong>
              <span>{l.subtitle}</span>
            </span>
            <ArrowRight size={17} />
          </button>
        ))}
      </div>
      {!filtered.length && (
        <p className="empty-state">No places by that name. Try “library” or “mere”.</p>
      )}
    </>
  );
}

function Epilogue({ game, leave }) {
  return (
    <section className="epilogue" style={{ '--epilogue-art': `url(${art('heartfire')})` }}>
      <div className="epilogue-card">
        <Eyebrow>The end of the beginning</Eyebrow>
        <h2>A home made of light</h2>
        <div className="book-ornament">— ✧ —</div>
        <p>{endingCommon[0]}</p>
        <p>{endingVariants[game.ending]}</p>
        <p>{endingCommon[1]}</p>
        <p className="ending-line">{endingCommon[2]}</p>
        <p className="ending-stats">
          <span>
            <Heart /> {Object.values(game.bonds).filter((v) => v >= 10).length} friendships
          </span>
          <span>
            <Sparkles /> {game.spells.length} spells
          </span>
          <span>
            <Shield /> {game.points} house points
          </span>
        </p>
        <VineButton
          lead
          title="Your life at Lanternmere continues"
          subline={isLiveLike(game.mode) ? 'Return to your day' : 'Close the book for now'}
          onClick={leave}
        />
      </div>
    </section>
  );
}

function Lesson({ spell, game, act, onClose }) {
  const [chosen, setChosen] = useState(null),
    [result, setResult] = useState(null);
  const blocked = spell.requires?.some((id) => !game.spells.includes(id));
  return (
    <Modal title={`A lesson in ${spell.name}`} onClose={onClose}>
      <div className="lesson-symbol">
        <Sparkles size={36} />
      </div>
      <Eyebrow>{spell.school}</Eyebrow>
      <p>{spell.description}</p>
      <p className="lesson-gesture">{spell.gesture}</p>
      {blocked ? (
        <p>First learn Kindle in the Charms Classroom and Echosight in the Library.</p>
      ) : (
        <>
          <h3>{spell.question}</h3>
          <div className="lesson-answers">
            {spell.answers.map((answer, i) => (
              <button
                key={answer}
                className={chosen === i ? 'selected' : ''}
                onClick={() => {
                  setChosen(i);
                  setResult(null);
                }}
              >
                {answer}
              </button>
            ))}
          </div>
          {result && (
            <p className="lesson-feedback" role="status">
              {result}
            </p>
          )}
          <Button
            className="primary"
            disabled={chosen === null}
            onClick={() => {
              act({ type: 'learn', id: spell.id, answer: chosen });
              if (chosen === spell.correct) onClose();
              else setResult('Try again. ' + spell.explanation);
            }}
          >
            Try the spell <Sparkles size={15} />
          </Button>
        </>
      )}
    </Modal>
  );
}
function Gallery({ manifest, onClose }) {
  const [kind, setKind] = useState('environment'),
    [query, setQuery] = useState(''),
    [selected, setSelected] = useState(null);
  const needed = manifest.filter((a) => a.placeholder);
  const shown =
    kind === 'needed'
      ? needed.filter((a) => a.original.includes(query.toLowerCase()))
      : manifest.filter(
          (a) => !a.placeholder && a.kind === kind && a.id.includes(query.toLowerCase()),
        );
  return (
    <Modal title="The art that built this world" wide onClose={onClose}>
      <p>
        Your originals are preserved. These are smaller copies for the game. Art still to come from
        ChatGPT is listed under Art needed, with the exact filename to save it as.
      </p>
      <div className="filter-bar">
        <div className="tabs">
          {[
            ['environment', 'Environments'],
            ['character', 'Characters'],
            ['familiar', 'Familiars'],
            ['needed', `Art needed · ${needed.length}`],
          ].map(([k, label]) => (
            <button
              key={k}
              className={kind === k ? 'active' : ''}
              onClick={() => {
                setKind(k);
                setSelected(null);
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="search">
          <Search size={14} />
          <input
            aria-label="Find artwork"
            placeholder="Find artwork…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      {selected && (
        <div className="gallery-selected">
          <img src={selected.src} alt={selected.id} />
          <p>
            {selected.original}
            {selected.placeholder
              ? ` · Art needed — save as art/${selected.original}. ${selected.request}`
              : selected.generated
                ? ' · New artwork'
                : ' · Original artwork'}
          </p>
        </div>
      )}
      <div className="gallery-grid">
        {shown.map((a) => (
          <button key={a.id} onClick={() => setSelected(a)}>
            <img
              src={a.src}
              alt={a.placeholder ? `Art needed: ${a.original}` : a.id}
              loading="lazy"
            />
            <span>{a.placeholder ? `ART NEEDED · ${a.original}` : a.id}</span>
          </button>
        ))}
      </div>
    </Modal>
  );
}

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
