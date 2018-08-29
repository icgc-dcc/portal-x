import { BaseSvg } from 'icons';

export default ({ fill = '#ffffff', ...props }) =>
  BaseSvg({
    svg: `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90"><defs><style>.cls-1{fill:${fill};}</style></defs><title>icon-plus</title><path class="cls-1" d="M45,8A37,37,0,1,1,8,45,37,37,0,0,1,45,8m0-8A45,45,0,1,0,90,45,44.94,44.94,0,0,0,45,0Z"/><path class="cls-1" d="M60.1,41H49V29.8a4,4,0,1,0-8,0V40.9H29.9a4,4,0,0,0,0,8H41V60a4,4,0,0,0,8,0V49H60.1a4,4,0,0,0,4-4A4,4,0,0,0,60.1,41Z"/></svg>`,
    ...props,
  });
