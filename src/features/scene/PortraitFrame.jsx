import { characterById } from '../../content.mjs';
import { Portrait } from '../../components.jsx';
import { resolveExpression } from '../../scene-beats.mjs';

/**
 * A painted person in a gold frame. Behind them, inside the frame, is the place they are in,
 * tinted for the time of day. The portrait is anchored to the frame's foot and zoomed slightly
 * so the art's cut shoulders and sides never show. The name sits on a plate under the window.
 */
export function PortraitFrame({ id, emotion, backdrop, time, size = 'stage', speaking, shadowed }) {
  const name = characterById[id]?.name || id;
  return (
    <figure
      className={
        `portrait-frame ${size}` + (speaking ? ' speaking' : '') + (shadowed ? ' shadowed' : '')
      }
      data-id={id}
    >
      <div className="frame-window">
        <img className="frame-backdrop" src={backdrop} alt="" aria-hidden="true" />
        <span className="frame-tint" data-time={time} aria-hidden="true" />
        <Portrait id={id} emotion={resolveExpression(id, emotion)} className="frame-portrait" />
      </div>
      <figcaption className="name-plate">{name}</figcaption>
    </figure>
  );
}
