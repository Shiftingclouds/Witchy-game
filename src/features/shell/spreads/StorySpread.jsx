import './spreads.css';
import { art, chapters, locationById } from '../../../content.mjs';
import { dateLabel, sceneArt } from '../../../engine.mjs';
import { VineButton } from '../../opening/VineButton.jsx';
import { LanternSketch, MarginNote } from '../../../components/lamplight/marginalia.jsx';
import { Spread } from '../Grimoire.jsx';

/** Between scenes: where the story waits, as a plate, and the way back in. No chapter names. */
export function StorySpread({ game, onPlayScene }) {
  const place = locationById[chapters[game.chapter].scene];
  const left = (
    <figure className="gm-plate">
      <span className="scene gm-arch">
        <img src={art(sceneArt({ ...game, location: place.id }))} alt={place.name} />
      </span>
      <figcaption>
        <h2>{place.name}</h2>
        {place.subtitle}
      </figcaption>
    </figure>
  );
  const right = (
    <div className="story-return">
      <h1>Your story is waiting.</h1>
      <p className="gm-lede">{place.description}</p>
      <VineButton title="Return to the story" subline={place.name} onClick={onPlayScene} />
      <div className="mg-row">
        <LanternSketch />
        <MarginNote tilt={-3}>
          {dateLabel(game.date)}. The story waits where you left it.
        </MarginNote>
      </div>
    </div>
  );
  return <Spread className="gm-story" folio={26} title="The Story" left={left} right={right} />;
}
