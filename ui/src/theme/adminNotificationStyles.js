import styled, { keyframes } from 'react-emotion';
import { css } from 'emotion';
import { Link } from 'react-router-dom';

import base from 'theme';

const {
  fonts: { openSans },
  keyedPalette: { brandPrimary, pelorousapprox, mineShaft },
  transparency: { brandPrimary20, pelorousapprox20 },
} = base;

const successBkgColour = pelorousapprox20;
const successColour = pelorousapprox;
const errorBkgColour = brandPrimary20;
const errorColour = brandPrimary;
const textColour = mineShaft;

export const NotificationsToaster = styled('div')`
  width: 100%;
  display: flex;
  flex-direction: column;
  font-family: ${openSans};
  margin: 15px 0 0;
`;

const NotificationAnim = keyframes`
    from { opacity: 0; }
    to   { opacity: 1; }
`;

export const Notification = styled('div')`
  display: flex;
  flex-direction: row;
  width: 100%;
  background: ${({ type }) => {
    if (type === 'error') {
      return errorBkgColour;
    } else {
      return successBkgColour;
    }
  }};
  border: 2px solid;
  border-color: ${({ type }) => {
    if (type === 'error') {
      return errorColour;
    } else {
      return successColour;
    }
  }};
  border-radius: 5px;
  padding: 14px;
  margin-bottom: 7px;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.86;
  letter-spacing: normal;
  text-align: left;
  color: ${textColour};
  animation: ${NotificationAnim} 1s ease;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Message = styled('span')`
  font-weight: bold;
  margin-right: 6px;
`;

export const Details = styled('span')`
  margin-right: 6px;
`;

export const MessageLink = styled(Link)`
  font-weight: bold;
  text-decoration: underline;
  color: ${({ type }) => {
    if (type === 'error') {
      return errorColour;
    } else {
      return successColour;
    }
  }};
`;

export const closeIcon = css`
  width: 24px;
  height: 24px;
  margin-right: 0;
  margin-left: auto;
  align-self: flex-end;
`;
