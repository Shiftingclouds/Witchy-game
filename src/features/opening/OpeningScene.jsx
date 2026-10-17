import { useEffect, useRef, useState } from 'react';
import { PAINTING, waterMaskDataUri } from './geometry.mjs';
import { startSparks } from './sparks.mjs';
import './opening.css';

const ASSETS = '/opening/';
const waterMask = `url("${waterMaskDataUri()}")`;

// Each window rests most of the time and swells briefly on its own rhythm (5–13 s).
const twinkleTiming = (i) => ({
  animationDuration: `${5 + ((i * 37) % 81) / 10}s`,
  animationDelay: `-${((i * 53) % 121) / 10}s`,
});

/** SMIL animations are left out entirely under reduced motion; CSS animations stop via the `still` class. */
const Animate = ({ reduced, ...props }) => (reduced ? null : <animate {...props} />);

export function OpeningScene({ reduced, awake, children }) {
  const canvas = useRef(null);
  const [lights, setLights] = useState([]);
  useEffect(() => {
    fetch(ASSETS + 'castle-lights.json')
      .then((r) => r.json())
      .then(setLights)
      .catch(() => {});
  }, []);
  useEffect(() => startSparks(canvas.current, { reduced }), [reduced]);
  const view = `0 0 ${PAINTING.w} ${PAINTING.h}`;
  return (
    <div className={'opening' + (reduced ? ' still' : '') + (awake ? ' awake' : '')}>
      <svg width="0" height="0" className="opening-defs" aria-hidden="true">
        <defs>
          <filter id="op-ripple" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.004 0.06" numOctaves="2" seed="3">
              <Animate
                reduced={reduced}
                attributeName="baseFrequency"
                dur="14s"
                values="0.004 0.06;0.005 0.075;0.004 0.06"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              scale="7"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <filter id="op-billow" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.0025 0.006" numOctaves="2" seed="8">
              <Animate
                reduced={reduced}
                attributeName="baseFrequency"
                dur="18s"
                values="0.0025 0.006;0.0034 0.008;0.0025 0.006"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              scale="16"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <div className="frame">
        <div className="op-scene">
          <div className="paint" style={{ backgroundImage: `url(${ASSETS}painting.webp)` }} />
          <div className="sky" style={{ backgroundImage: `url(${ASSETS}painting.webp)` }} />
          <div
            className="water"
            style={{
              backgroundImage: `url(${ASSETS}painting.webp)`,
              WebkitMaskImage: waterMask,
              maskImage: waterMask,
            }}
          />
          <svg className="twinkle" viewBox={view} aria-hidden="true">
            <defs>
              <radialGradient id="op-window">
                <stop offset="0" stopColor="#fff3cf" />
                <stop offset=".45" stopColor="#ffc766" stopOpacity=".7" />
                <stop offset="1" stopColor="#ff9d3a" stopOpacity="0" />
              </radialGradient>
            </defs>
            <g fill="url(#op-window)">
              {lights.map(([x, y, size], i) => (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={Math.min(9, 3 + Math.sqrt(size)).toFixed(1)}
                  style={twinkleTiming(i)}
                />
              ))}
            </g>
          </svg>
          <svg className="puffs" viewBox={view} aria-hidden="true">
            <defs>
              <filter id="op-cloudlight" x="0" y="0" width="100%" height="100%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.009 0.022"
                  numOctaves="3"
                  seed="13"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.88  0 0 0 0 0.64  0 0 0 0 0.62  0 0 0 2.4 -1.05"
                />
              </filter>
              <mask
                id="op-cloudshape"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width={PAINTING.w}
                height={PAINTING.h}
              >
                <image
                  href={ASSETS + 'wisps-mask.png'}
                  width={PAINTING.w}
                  height={PAINTING.h}
                  preserveAspectRatio="none"
                />
              </mask>
            </defs>
            <g mask="url(#op-cloudshape)">
              <rect
                className="drift"
                x="-600"
                y="0"
                width="2872"
                height={PAINTING.h}
                filter="url(#op-cloudlight)"
              />
            </g>
          </svg>
          <svg className="fog" viewBox={view} aria-hidden="true">
            <defs>
              <filter id="op-wisps" x="0" y="0" width="100%" height="100%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.0032 0.011"
                  numOctaves="4"
                  seed="21"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.86  0 0 0 0 0.66  0 0 0 0 0.66  0 0 0 2.4 -1.05"
                />
              </filter>
              <filter id="op-wisps2" x="0" y="0" width="100%" height="100%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.0041 0.013"
                  numOctaves="4"
                  seed="57"
                />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.86  0 0 0 0 0.66  0 0 0 0 0.66  0 0 0 2.4 -1.05"
                />
              </filter>
              <mask
                id="op-valleys"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width={PAINTING.w}
                height={PAINTING.h}
              >
                <image
                  href={ASSETS + 'fog-zone.png'}
                  width={PAINTING.w}
                  height={PAINTING.h}
                  preserveAspectRatio="none"
                />
              </mask>
            </defs>
            <g mask="url(#op-valleys)">
              <rect
                className="drift"
                x="-1672"
                y="0"
                width="5016"
                height={PAINTING.h}
                filter="url(#op-wisps)"
              />
              <rect
                className="drift b"
                x="-1672"
                y="0"
                width="5016"
                height={PAINTING.h}
                filter="url(#op-wisps2)"
                opacity=".7"
              />
            </g>
          </svg>
          <div className="glow" data-light-source />
          <div className="rings">
            <span className="ring" />
            <span className="ring" />
            <span className="ring" />
          </div>
        </div>
        <canvas ref={canvas} className="sparks" aria-hidden="true" />
      </div>
      <div className="vignette" />
      {children}
    </div>
  );
}
