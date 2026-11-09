// Each case study gets its own look, so no two pages repeat the same picture:
//   hue  – the project's colour (diagrams, hub, flow, progress bar); lightness keeps white text readable
//   map  – integration-map layout: orbit | split | arc | tree | rings | fan
//   flow – step-flow style: chevron | rail | stairs | numbers | ladder
//   arch – architecture animation: dots | march | comet | beacon
// Neighbouring pages (in the Previous / Next order) never share a layout.
export const caseLooks = {
  'grandiose-supermarket': { hue: 258, light: 60, map: 'orbit', flow: 'chevron', arch: 'dots' },
  'fantasy-world-toys': { hue: 22, light: 42, map: 'split', flow: 'rail', arch: 'march' },
  'antoine-online': { hue: 212, light: 48, map: 'arc', flow: 'stairs', arch: 'comet' },
  toolmart: { hue: 0, light: 52, map: 'tree', flow: 'numbers', arch: 'beacon' },
  switch: { hue: 305, light: 46, map: 'rings', flow: 'ladder', arch: 'march' },
  'sterling-machinery': { hue: 42, light: 33, map: 'fan', flow: 'stairs', arch: 'dots' },
  minamin: { hue: 335, light: 50, map: 'split', flow: 'numbers', arch: 'comet' },
  aquanexus: { hue: 165, light: 30, map: 'rings', flow: 'rail', arch: 'beacon' },
  kalombo: { hue: 228, light: 59, map: 'tree', arch: 'march' },
  punjabstore: { hue: 135, light: 30, map: 'fan' },
  siemens: { hue: 185, light: 31, map: 'orbit', flow: 'ladder' },
  '2d-layer': { hue: 278, light: 57, map: 'rings', flow: 'chevron' },
  artha360: { hue: 245, light: 60, map: 'arc', arch: 'dots' },
  'career-intelligence': { hue: 200, light: 39, map: 'split', arch: 'beacon' },
  'gym-management-platform': { hue: 100, light: 30, map: 'orbit', arch: 'comet' },
  'magento-2-developer-toolkit': { hue: 62, light: 27, map: 'tree', arch: 'march' },
};

const FALLBACK = { hue: 258, light: 60, map: 'orbit', flow: 'chevron', arch: 'dots' };
export const lookFor = (slug) => ({ ...FALLBACK, ...caseLooks[slug] });

const list = (xs) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs.at(-1)}`);

// Heading and intro for the integration map, written for the layout it sits above.
export function mapCopy(variant, { name, platform, product, nodes }) {
  const n = nodes.length;
  const groups = [...new Set(nodes.map((x) => x.group).filter(Boolean))].map((g) => g.toLowerCase());
  const covers = groups.length ? ` Covers ${list(groups.slice(0, 4))}.` : '';
  if (product) {
    const p = {
      orbit: [`Everything ${name} runs on`, `The ${n} main technologies behind the product, around the app itself.`],
      split: [`${name}, with its tools either side`, `The app in the middle and the ${n} technologies it is built from.`],
      arc: [`${n} technologies under one product`, `What sits underneath ${name}, from interface to data.`],
      tree: [`From ${name} down to its building blocks`, `The product at the top and the ${n} pieces it rests on.`],
      rings: [`${name}, layer by layer`, `Core pieces close in, supporting tools further out.`],
      fan: [`How ${name} fits together`, `The app on the left and everything it reaches on the right.`],
    }[variant];
    return { title: p[0], intro: p[1] + covers };
  }
  const p = {
    orbit: [`Everything ${name} talks to`, `${platform} in the middle and the ${n} systems I connected around it.`],
    split: [`${platform} between ${n} systems`, `The store in the middle, with the tools and services it depends on either side.`],
    arc: [`${n} systems feeding one store`, `Each line is a connection I built or configured for ${name}.`],
    tree: [`From ${platform} out to ${n} systems`, `The platform at the top and the integrations that hang off it.`],
    rings: [`${name}'s stack, ring by ring`, `${platform} at the centre, with the ${n} systems around it.`],
    fan: [`How ${name} reaches the rest of the business`, `The platform on the left; the ${n} systems it exchanges data with on the right.`],
  }[variant];
  return { title: p[0], intro: p[1] + covers };
}
