import React from 'react';
import { InlineSvg } from 'icons';

export default props =>
  InlineSvg({
    viewBox: '0 0 99.84 90.94',
    width: '18px',
    height: '15px',
    path: (
      <>
        <path
          class="cls-1"
          d="M61.79,87.88l35-35a10.53,10.53,0,0,0,0-14.83l-35-35A10.42,10.42,0,0,0,47.05,17.79L74.73,45.46,47.05,73.14A10.42,10.42,0,0,0,61.79,87.88h0"
          transform="translate(0 0)"
        />
        <path
          class="cls-1"
          d="M17.79,87.88l35-35a10.53,10.53,0,0,0,0-14.83l-35-35A10.42,10.42,0,0,0,3.05,17.79L30.73,45.46,3.05,73.14A10.42,10.42,0,0,0,17.79,87.88"
          transform="translate(0 0)"
        />
      </>
    ),
    ...props,
  });
