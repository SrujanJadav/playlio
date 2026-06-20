import { useEffect } from 'react';
import './PixelEmoji.css';

const FILTER_ID = 'pixelate-emoji-filter';

function ensureFilter() {
  if (document.getElementById(FILTER_ID)) return;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.position = 'absolute';
  svg.style.pointerEvents = 'none';

  const defs = document.createElementNS(ns, 'defs');
  const filter = document.createElementNS(ns, 'filter');
  filter.setAttribute('id', FILTER_ID);
  filter.setAttribute('x', '0');
  filter.setAttribute('y', '0');
  filter.setAttribute('width', '100%');
  filter.setAttribute('height', '100%');

  // 1. Create a 1×1 sample point inside each grid cell
  const flood = document.createElementNS(ns, 'feFlood');
  flood.setAttribute('x', '2');
  flood.setAttribute('y', '2');
  flood.setAttribute('height', '1');
  flood.setAttribute('width', '1');

  // 2. Define the grid cell size (smaller = more pixelated)
  const comp1 = document.createElementNS(ns, 'feComposite');
  comp1.setAttribute('width', '5');
  comp1.setAttribute('height', '5');

  // 3. Tile the grid across the element
  const tile = document.createElementNS(ns, 'feTile');
  tile.setAttribute('result', 'a');

  // 4. Sample from the source image using the grid
  const comp2 = document.createElementNS(ns, 'feComposite');
  comp2.setAttribute('in', 'SourceGraphic');
  comp2.setAttribute('in2', 'a');
  comp2.setAttribute('operator', 'in');

  // 5. Dilate each sample to fill the grid cell
  const morph = document.createElementNS(ns, 'feMorphology');
  morph.setAttribute('operator', 'dilate');
  morph.setAttribute('radius', '2.5');

  filter.append(flood, comp1, tile, comp2, morph);
  defs.appendChild(filter);
  svg.appendChild(defs);
  document.body.appendChild(svg);
}

/**
 * Renders an emoji with a pixelated mosaic look via SVG filter.
 * Usage: <PixelEmoji>🎨</PixelEmoji>
 */
export default function PixelEmoji({ children, size, className = '' }) {
  useEffect(() => {
    ensureFilter();
  }, []);

  return (
    <span
      className={`pixel-emoji ${className}`}
      style={size ? { fontSize: size } : undefined}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}
