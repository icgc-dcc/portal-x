import { css } from 'emotion';
import styled from 'react-emotion';
import base from 'theme';
import { Col } from 'theme/system';
import { AdminContent } from 'theme/adminStyles';

const {
  fonts: { libreFranklin },
  keyedPalette: { brandPrimary, porcelain, white },
} = base;

const borderColour = porcelain;

export const AdminModelNav = styled(Col)`
  width: 164px;
  label: admin-model-nav;
`;

const activeNavItem = css`
  background: ${white};
  border: solid 1px ${borderColour};
  border-right-color: ${white};
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  /* Extending it over 1 pixel to match design (cover other border) */
  z-index: 2;
  position: relative;
  width: 165px;
  label: admin-model-nav-item-active;
`;

export const NavItem = styled('div')`
  padding: 19px 15px;
  font-family: ${libreFranklin};
  font-size: 14px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.57;
  letter-spacing: normal;
  text-align: left;
  color: ${brandPrimary};
  text-transform: uppercase;
  cursor: pointer;
  label: admin-model-nav-item;
  ${props => props.active && activeNavItem};
`;

export const AdminModelContent = styled(AdminContent)`
  width: calc(100% - 164px);
  z-index: 1;
  label: admin-model-content;
`;
