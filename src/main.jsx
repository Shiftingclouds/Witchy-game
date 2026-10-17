import { AuthoredChapter } from './features/story/AuthoredChapter.jsx';
import { pendingStoryChoice } from './scene-beats.mjs';
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
  Flame,
  Leaf,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Check,
  CheckCircle2,
  Heart,
  Sun,
  Moon,
  Download,
  Upload,
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
  familiars,
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
import './styles.css';
import './dialogue-presentation.css';

const saves = createSaveRepository(platformStorage());
function load(mode) {
  try {
    return saves.read(mode);
  } catch {
    return null;
  }
}
const navItems = [
  ['world', 'Your day', Compass],
  ['map', 'World map', Map],
  ['book', 'The story', BookOpen],
  ['people', 'People', Users],
  ['spells', 'Grimoire', Sparkles],
  ['calendar', 'Calendar', CalendarDays],
  ['journal', 'Journal', Feather],
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

function Landing({ onStart }) {
  const [name, setName] = useState('Avery'),
    [house, setHouse] = useState('owlcombe'),
    [familiar, setFamiliar] = useState('cat');
  return (
    <div className="landing">
      <div className="landing-art" style={{ backgroundImage: `url(${art('mere-day')})` }}>
        <div className="landing-brand">
          <img src="/crest.svg" alt="" />
          <span>
            LANTERNMERE <small>ACADEMY OF THE QUIET ARTS</small>
          </span>
        </div>
        <div className="landing-art-caption">
          <span className="little-line" /> Across the water, a different life is waiting.
        </div>
      </div>
      <main className="landing-paper">
        <Eyebrow>
          <Sparkles size={14} /> A LIFE LESS ORDINARY
        </Eyebrow>
        <h1>
          There’s a little
          <br />
          magic in <em>belonging.</em>
        </h1>
        <p className="landing-intro">
          A lantern in the window. A seat beside the fire.
          <br />A whole world waiting to know your name.
        </p>
        <div className="enrolment">
          <label>
            Your name
            <input
              maxLength={24}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What should we call you?"
            />
          </label>
          <div className="form-row">
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
        <div className="mode-options">
          <button
            className="mode-card primary-mode"
            onClick={() => onStart('live', name, house, familiar)}
          >
            <Compass size={27} />
            <span>
              <strong>{load('live') ? 'Continue your life' : 'Live the world'}</strong>
              <small>Explore at your own pace. Make this place yours.</small>
            </span>
            <ArrowRight size={20} />
          </button>
          <button className="mode-card" onClick={() => onStart('book', name, house, familiar)}>
            <BookOpen size={27} />
            <span>
              <strong>{load('book') ? 'Continue your story' : 'Read the book'}</strong>
              <small>An illustrated, choice-led story. One page at a time.</small>
            </span>
            <ArrowRight size={20} />
          </button>
        </div>
        <p className="landing-foot">
          <Leaf size={14} />
          Every page plays on this computer, no connection needed.
          <br />
          <span>Two ways to belong. Separate saves. The same enchanted year.</span>
        </p>
      </main>
    </div>
  );
}

function App() {
  const reading = useReadingPreferences();
  const [game, setGame] = useState(null),
    [view, setView] = useState('world'),
    [modal, setModal] = useState(null),
    [toast, setToast] = useState(''),
    [mobileNav, setMobileNav] = useState(false),
    [manifest, setManifest] = useState([]),
    [saveError, setSaveError] = useState('');
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
    if (game?.feedback) setToast(game.feedback);
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
    act({ type: 'visit', id });
    navigate('world');
  }
  function start(mode, name, house, familiar) {
    try {
      setGame(saves.read(mode) || initialState(mode, name, house, familiar));
      setView(mode === 'book' ? 'book' : 'world');
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
        navigate(imported.mode === 'book' ? 'book' : 'world');
        setModal(null);
        setToast('Your saved life is restored.');
      })
      .catch(() =>
        setToast('This file is not a valid Lanternmere save. Your current progress is safe.'),
      );
  }
  if (!game)
    return (
      <>
        <Landing onStart={start} />
        <div className="landing-import">
          <label className="text-button">
            <Upload size={14} /> Restore a saved game
            <input
              type="file"
              accept="application/json,.json"
              hidden
              onChange={(e) => importSave(e.target.files[0])}
            />
          </label>
        </div>
        {toast && (
          <div className="toast" role="status">
            {toast}
          </div>
        )}
      </>
    );
  const house = houses.find((h) => h.id === game.house),
    chapter = chapters[game.chapter];
  return (
    <div
      className="app-shell"
      data-reading-size={reading.size}
      data-reduced-motion={reading.reduced}
    >
      <aside className={'sidebar ' + (mobileNav ? 'open' : '')} inert={Boolean(modal)}>
        <button className="brand" onClick={() => setGame(null)} aria-label="Back to main menu">
          <img src="/crest.svg" alt="" />
          <span>
            Lanternmere<small>A LIFE LESS ORDINARY</small>
          </span>
        </button>
        <div className="sidebar-rule" />
        <Eyebrow>YOUR LITTLE WORLD</Eyebrow>
        <nav aria-label="Main navigation">
          {navItems
            .filter(([id]) => game.mode === 'live' || !['world', 'map'].includes(id))
            .map(([id, label, Icon]) => (
              <button
                key={id}
                className={'nav-item ' + (view === id ? 'active' : '')}
                onClick={() => navigate(id)}
              >
                <Icon size={19} />
                {label}
                {view === id && <span className="nav-dot" />}
              </button>
            ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="familiar-card">
            <img src={art('fam-' + game.familiar)} alt={`Your ${game.familiar} familiar`} />
            <div>
              <small>A LITTLE COMPANY</small>
              <p>
                Your familiar is
                <br />
                glad you’re here.
              </p>
            </div>
          </div>
          <button className="nav-item secondary" onClick={() => setModal({ type: 'settings' })}>
            <Settings size={17} /> Settings & saves
          </button>
          <button className="nav-item secondary" onClick={() => setGame(null)}>
            <LogOut size={17} /> Main menu
          </button>
          <div className="player-card">
            <span className="player-initial" style={{ background: house.color }}>
              {game.name[0].toUpperCase()}
            </span>
            <span>
              <strong>{game.name}</strong>
              <small>{house.name} · First year</small>
            </span>
            <Leaf size={17} />
          </div>
        </div>
      </aside>
      <div className="workspace" inert={Boolean(modal)}>
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            onClick={() => setMobileNav(!mobileNav)}
            aria-label="Toggle navigation"
          >
            <Menu size={20} />
          </button>
          <div className="breadcrumb">
            LANTERNMERE ACADEMY <span>/</span>{' '}
            <strong>{game.mode === 'book' ? 'Read the book' : 'Live the world'}</strong>
          </div>
          <div className="header-status">
            <span className="connection">
              <i />
              Local story
            </span>
            <button className="date-pill" onClick={() => navigate('calendar')}>
              <Sun size={16} />
              {dateLabel(game.date)} <span>· {periods[game.period]}</span>
            </button>
          </div>
        </header>
        {saveError && (
          <div className="storage-warning" role="alert">
            {saveError}
            <button onClick={() => downloadSave(game)}>Export save</button>
          </div>
        )}
        <main className="main-content" id="main">
          {view === 'world' && (
            <World
              game={game}
              act={act}
              visit={visit}
              navigate={navigate}
              open={setModal}
              quest={<QuestCard game={game} visit={visit} navigate={navigate} />}
            />
          )}
          {view === 'map' && <Atlas game={game} visit={visit} />}
          {view === 'book' && (
            <Story game={game} act={act} visit={visit} open={setModal} reading={reading} />
          )}
          {view === 'people' && <People game={game} open={setModal} />}
          {view === 'spells' && <Grimoire game={game} visit={visit} open={setModal} act={act} />}
          {view === 'calendar' && <Calendar game={game} act={act} visit={visit} open={setModal} />}
          {view === 'journal' && <Journal game={game} act={act} visit={visit} />}
        </main>
        <footer className="app-footer">
          <span>
            <Flame size={13} /> A little magic. A place to belong.
          </span>
          <span>
            {game.ending ? 'First year complete' : chapter.kicker}{' '}
            <span className="footer-separator">·</span> Progress saved on this device
          </span>
        </footer>
      </div>
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
      {modal?.type === 'performance' && (
        <SceneReader
          key={game.chapter}
          game={game}
          reading={reading}
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

function PageHeading({ eyebrow, title, description, children }) {
  return (
    <div className="page-heading">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children}
    </div>
  );
}
function QuestCard({ game, visit, navigate }) {
  const chapter = chapters[game.chapter];
  return (
    <section className="quest-card">
      <div className="section-label">
        <Bookmark size={16} />
        <span>YOUR STORY</span>
        <span className="chapter-number">{game.chapter + 1} / 8</span>
      </div>
      <h3>{game.ending ? 'A home made of light' : chapter.title}</h3>
      <p>
        {game.ending
          ? 'The Heartfire is restored. There are still books to read, places to find, and friends to sit beside.'
          : chapter.goal}
      </p>
      <div className="quest-progress">
        <i style={{ width: `${game.ending ? 100 : (game.chapter / 8) * 100}%` }} />
      </div>
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
              {!r.done && <ChevronRight size={13} />}
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
      <PageHeading
        eyebrow="A WORLD WORTH WANDERING"
        title="Take the long way home."
        description={`${game.visited.length} of ${locations.length} places discovered. There is no wrong turn.`}
      />
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

function Story({ game, act, visit, open, reading }) {
  const ch = chapters[game.chapter];
  return (
    <>
      <PageHeading
        eyebrow={game.mode === 'book' ? 'READ THE BOOK · AN ILLUSTRATED YEAR' : 'THE STORY SO FAR'}
        title="The light we leave behind."
        description={
          game.mode === 'book'
            ? 'Settle in. The world can wait while you turn the page.'
            : 'Your days become a story. Your choices give it meaning.'
        }
      >
        <span className="page-count">
          {game.ending ? 'The end of the beginning' : `Chapter ${game.chapter + 1} of 8`}
        </span>
      </PageHeading>
      <div className="book-layout">
        <div className="book-art">
          <img
            src={art(sceneArt({ ...game, location: ch.scene }))}
            alt={locationById[ch.scene].name}
          />
          <Portrait id={ch.speaker} emotion={ch.emotion} />
          <span>{locationById[ch.scene].name}</span>
        </div>
        <article className="book-page">
          <Eyebrow>
            {ch.kicker} <span>✦</span> {dateLabel(ch.date)}
          </Eyebrow>
          <h2>{game.ending ? 'A home made of light' : ch.title}</h2>
          <div className="book-ornament">— ✧ —</div>
          {!game.ending && (
            <Button className="scene-view-button" onClick={() => open({ type: 'performance' })}>
              Play scene <MessageCircle size={15} />
            </Button>
          )}
          {game.ending ? (
            <>
              <p>{endingCommon[0]}</p>
              <p>{endingVariants[game.ending]}</p>
              <p>{endingCommon[1]}</p>
              <p className="ending-line">{endingCommon[2]}</p>
              <div className="ending-stats">
                <span>
                  <Heart /> {Object.values(game.bonds).filter((v) => v >= 10).length} friendships
                </span>
                <span>
                  <Sparkles /> {game.spells.length} spells
                </span>
                <span>
                  <Shield /> {game.points} house points
                </span>
              </div>
            </>
          ) : (
            <>
              <ReadingControls reading={reading} />
              <AuthoredChapter game={game} act={act} />
              {pendingStoryChoice(game) ? (
                <p className="story-gate">Make your decision in the scene above to continue.</p>
              ) : game.mode === 'live' && !canAdvance(game) ? (
                <div className="story-gate">
                  <strong>
                    <Compass size={16} /> Before the next page
                  </strong>
                  {requirements(game)
                    .filter((r) => !r.done)
                    .map((r) => (
                      <button key={r.id} onClick={() => visit(taskLocation(game, r.id))}>
                        {r.label}
                        <ArrowRight size={14} />
                      </button>
                    ))}
                </div>
              ) : (
                <div className="story-choices">
                  <Eyebrow>WHAT WILL YOU DO?</Eyebrow>
                  {ch.choices.map((c, i) => (
                    <button key={i} onClick={() => act({ type: 'chapter', choice: i })}>
                      <span>{String(i + 1).padStart(2, '0')}</span>
                      {c[0]}
                      <ArrowRight size={17} />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </article>
      </div>
      <div className="chapter-trail">
        {chapters.map((c, i) => (
          <span
            key={c.title}
            className={i === game.chapter ? 'current' : i < game.chapter ? 'complete' : ''}
            title={c.title}
          >
            {i < game.chapter ? <Check size={14} /> : i + 1}
          </span>
        ))}
      </div>
    </>
  );
}

function People({ game, open }) {
  const [query, setQuery] = useState(''),
    [onlyFriends, setOnlyFriends] = useState(false);
  const shown = characters.filter(
    (c) => c.name.toLowerCase().includes(query.toLowerCase()) && (!onlyFriends || game.bonds[c.id]),
  );
  return (
    <>
      <PageHeading
        eyebrow="THE PEOPLE WHO MAKE A PLACE"
        title="A world of familiar faces."
        description="Some friendships begin with a grand adventure. Most begin with hello."
      />
      <div className="filter-bar">
        <div className="tabs">
          <button className={!onlyFriends ? 'active' : ''} onClick={() => setOnlyFriends(false)}>
            Everyone · {characters.length}
          </button>
          <button className={onlyFriends ? 'active' : ''} onClick={() => setOnlyFriends(true)}>
            People you know
          </button>
        </div>
        <label className="search">
          <Search size={15} />
          <input
            aria-label="Find a person"
            placeholder="Find a familiar face…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <div className="people-grid">
        {shown.map((c, i) => (
          <button
            className={'person-card ' + (c.index <= 3 ? 'companion' : '')}
            key={c.id}
            onClick={() => open({ type: 'profile', id: c.id })}
          >
            <div
              className="person-portrait"
              style={{ '--portrait-tint': ['#d9c5b2', '#d4ccd9', '#d0d5bc', '#c9d5d1'][i % 4] }}
            >
              <Portrait id={c.id} emotion={game.bonds[c.id] > 0 ? 'warm' : 'neutral'} />
              {c.index <= 3 && <span>YOUR STORY</span>}
            </div>
            <div className="person-info">
              <h3>{c.name}</h3>
              <p>{c.role}</p>
              <div className="friendship-meter">
                <i style={{ width: (game.bonds[c.id] || 0) + '%' }} />
              </div>
              {game.mode === 'live' && (
                <div className="person-where">
                  <MapPin size={12} />
                  {locationById[characterLocation(game, c.id)].name}
                </div>
              )}
              <small>
                <Heart size={12} />
                {relationshipLabel(game.bonds[c.id] || 0)} <span>{game.bonds[c.id] || 0}/100</span>
              </small>
            </div>
          </button>
        ))}
      </div>
      {!shown.length && (
        <p className="empty-state">
          A friendship is waiting to begin. Say hello to someone in the academy.
        </p>
      )}
    </>
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
                <span>{String.fromCharCode(65 + i)}</span>
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
function Grimoire({ game, visit, open, act }) {
  return (
    <>
      <PageHeading
        eyebrow="THINGS YOU ARE LEARNING"
        title="A little book of practical magic."
        description="Not every spell has to change the world. Some just make it warmer."
      />
      <div className="spell-intro">
        <img src={art('warding-hall')} alt="The golden circles of Warding Hall" />
        <div>
          <Sparkles size={25} />
          <h2>Magic begins with attention.</h2>
          <p>
            Learn a spell in its classroom, then carry it into the world. Your knowledge stays with
            you.
          </p>
          <span>
            {game.spells.length} of {spells.length} spells learned
          </span>
        </div>
      </div>
      <div className="spell-grid">
        {spells.map((s, i) => (
          <section
            className={'spell-card ' + (game.spells.includes(s.id) ? 'learned' : '')}
            key={s.id}
          >
            <span className="spell-number">0{i + 1}</span>
            <span className="spell-icon">
              {i === 0 ? <Flame /> : i === 1 ? <Eye /> : <Shield />}
            </span>
            <Eyebrow>{s.school}</Eyebrow>
            <h2>{s.name}</h2>
            <p>{s.description}</p>
            <div className="spell-gesture">{s.gesture}</div>
            {game.spells.includes(s.id) ? (
              <>
                <span className="learned-label">
                  <CheckCircle2 size={14} /> In your grimoire
                </span>
                {game.mode === 'live' && (
                  <Button onClick={() => act({ type: 'cast', id: s.id })}>
                    Cast at {locationById[game.location].name}
                  </Button>
                )}
              </>
            ) : game.mode === 'book' ? (
              <span className="muted">Learned as your story unfolds</span>
            ) : (
              <Button
                icon={GraduationCap}
                onClick={() =>
                  game.location === s.location
                    ? open({ type: 'lesson', id: s.id })
                    : visit(s.location)
                }
              >
                {game.location === s.location
                  ? 'Begin the lesson'
                  : 'Visit ' + locationById[s.location].name}
              </Button>
            )}
          </section>
        ))}
      </div>
    </>
  );
}

function Calendar({ game, act, visit, open }) {
  const [month, setMonth] = useState(game.date.slice(0, 7));
  const [y, m] = month.split('-').map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1));
  const offset = (first.getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells = Array.from({ length: offset + days }, (_, i) =>
    i < offset ? null : i - offset + 1,
  );
  const monthEvents = festivals.filter((f) => f.month === m);
  function move(n) {
    const d = new Date(Date.UTC(y, m - 1 + n, 1));
    setMonth(d.toISOString().slice(0, 7));
  }
  return (
    <>
      <PageHeading
        eyebrow="LET THE YEAR UNFOLD"
        title="A season for everything."
        description="Lessons, festivals, and ordinary days that turn out to matter."
      />
      <>{game.mode === 'live' && <DailyCard game={game} visit={visit} open={open} />}</>
      <div className="calendar-layout">
        <section className="calendar-card">
          <div className="calendar-heading">
            <h2>
              {new Intl.DateTimeFormat('en-GB', {
                month: 'long',
                year: 'numeric',
                timeZone: 'UTC',
              }).format(first)}
            </h2>
            <div>
              <button className="text-button" onClick={() => setMonth(game.date.slice(0, 7))}>
                Today
              </button>
              <button className="icon-button" aria-label="Previous month" onClick={() => move(-1)}>
                <ChevronLeft size={18} />
              </button>
              <button className="icon-button" aria-label="Next month" onClick={() => move(1)}>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div className="calendar-grid">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <strong key={d}>{d}</strong>
            ))}
            {cells.map((d, i) => {
              const event = festivals.find((f) => f.month === m && f.day === d);
              const date = month + '-' + String(d).padStart(2, '0');
              return (
                <div
                  key={i}
                  className={
                    'calendar-day ' +
                    (date === game.date ? 'today ' : '') +
                    (event ? 'festival' : '')
                  }
                >
                  <span>{d}</span>
                  {event && (
                    <small>
                      <Flame size={10} />
                      {event.name}
                    </small>
                  )}
                </div>
              );
            })}
          </div>
        </section>
        <aside>
          <div className="season-card">
            <img
              src={art(season(month + '-01') === 'Winter' ? 'mere-frozen' : 'mere-day')}
              alt={`${season(month + '-01')} by the mere`}
            />
            <div>
              <Eyebrow>THE TURNING YEAR</Eyebrow>
              <h3>{season(month + '-01')} at Lanternmere</h3>
              <p>
                {monthEvents.length
                  ? monthEvents.map((e) => e.description).join(' ')
                  : 'A quieter month. Leave room for small adventures.'}
              </p>
            </div>
          </div>
          <div className="calendar-note">
            <Sun size={20} />
            <p>
              It’s {dateLabel(game.date)}, {periods[game.period].toLowerCase()}. Conversations and
              lessons move the day along; story milestones turn the season.
            </p>
            {game.mode === 'live' && (
              <Button icon={Moon} onClick={() => act({ type: 'rest' })}>
                Rest until tomorrow
              </Button>
            )}
          </div>
        </aside>
      </div>
      <h2 className="section-heading">Dates to look forward to</h2>
      <div className="festival-list">
        {festivals.map((f) => (
          <div key={f.name}>
            <span>
              <small>
                {new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' }).format(
                  new Date(Date.UTC(2026, f.month - 1, f.day)),
                )}
              </small>
              <strong>{f.day}</strong>
            </span>
            <div>
              <h3>{f.name}</h3>
              <p>{f.description}</p>
            </div>
            <Flame size={19} />
          </div>
        ))}
      </div>
    </>
  );
}

function Journal({ game, act, visit }) {
  return (
    <>
      <PageHeading
        eyebrow="KEEP THE LITTLE THINGS"
        title={`${game.name}’s journal.`}
        description="A place for the things you don’t want to forget."
      >
        <Button icon={Download} onClick={() => downloadSave(game)}>
          Export your save
        </Button>
      </PageHeading>
      <div className="journal-layout">
        <section className="journal-pages">
          <Eyebrow>YOUR YEAR, IN MOMENTS</Eyebrow>
          {[...game.journal].reverse().map((entry, i) => (
            <article key={i}>
              <span className="journal-dot" />
              <time>{dateLabel(entry.date)}</time>
              <p>{entry.text}</p>
            </article>
          ))}
        </section>
        <aside>
          <div className="personal-notes">
            <Feather size={22} />
            <h3>A page just for you</h3>
            <p>Thoughts, names, things to ask tomorrow.</p>
            <textarea
              aria-label="Personal journal notes"
              maxLength={12000}
              value={game.notes}
              onChange={(e) => act({ type: 'notes', value: e.target.value })}
              placeholder="Today I noticed…"
            />
            <small>Saved on this device with your story.</small>
          </div>
          <section className="discoveries">
            <h3>Little discoveries</h3>
            <p>
              {game.visited.length} places visited · {game.clues.length} clues gathered
            </p>
            {game.clues.map((c) => (
              <span key={c}>
                <CheckCircle2 size={13} />
                {
                  {
                    archive: 'The old register',
                    flower: 'A moonflower petal',
                    lake: 'The lake’s memory',
                    stones: 'The first keepers’ circle',
                    restored: 'The Heartfire, renewed',
                  }[c]
                }
              </span>
            ))}
          </section>
        </aside>
      </div>
    </>
  );
}

function Gallery({ manifest, onClose }) {
  const [kind, setKind] = useState('environment'),
    [query, setQuery] = useState(''),
    [selected, setSelected] = useState(null);
  return (
    <Modal title="The art that built this world" wide onClose={onClose}>
      <p>
        Your originals are preserved. These are smaller copies for the browser; the overview map is
        newly generated.
      </p>
      <div className="filter-bar">
        <div className="tabs">
          {['environment', 'character', 'familiar'].map((k) => (
            <button
              key={k}
              className={kind === k ? 'active' : ''}
              onClick={() => {
                setKind(k);
                setSelected(null);
              }}
            >
              {k[0].toUpperCase() + k.slice(1)}s
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
            {selected.generated ? ' · New artwork' : ' · Original artwork'}
          </p>
        </div>
      )}
      <div className="gallery-grid">
        {manifest
          .filter((a) => a.kind === kind && a.id.includes(query.toLowerCase()))
          .map((a) => (
            <button key={a.id} onClick={() => setSelected(a)}>
              <img src={a.src} alt={a.id} loading="lazy" />
              <span>{a.id}</span>
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
