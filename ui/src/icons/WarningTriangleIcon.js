import React from 'react';
import { InlineSvg } from 'icons';

const WarningTriangleIcon = ({
  fill = '#9a6700',
  width = '16px',
  height = '16px',
  viewBox = '0 0 16 16',
  ...props
}) =>
  InlineSvg({
    alt: 'Warning Icon',
    viewBox,
    width,
    height,
    fill,
    ariaHidden: true,
    focusable: false,
    path: (
      <path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
    ),
    ...props,
  });

export default WarningTriangleIcon;