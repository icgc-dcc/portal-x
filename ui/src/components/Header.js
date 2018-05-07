import React from 'react';
import bannerPath from 'assets/hcmi-dna-banner.jpg';
import logoPath from 'assets/logo-NIH-HCMI-Catalog.svg';
import { Link } from 'react-router-dom';

let Gradient = p => (
  <div
    css={`
      height: 88px;
      position: absolute;
      width: 100%;
      ${p.xcss};
    `}
  />
);

export default () => (
  <>
    <Gradient
      xcss={`
       background-image: -webkit-gradient(
         linear,
         left top,
         right top,
         from(rgba(255, 255, 255, 0.7)),
         to(rgba(0, 0, 0, 0))
       );`}
    />
    <Link
      to="/"
      css={`
        display: flex;
        background: #fff0ce;
        background-image: url(${bannerPath});
        height: 88px;
        background-repeat: no-repeat;
        background-position: right;
        justify-content: space-between;
        align-items: center;
        padding: 0 23px;
        text-decoration: none;
      `}
    >
      <img
        src={logoPath}
        alt="HCMI Catalog logo"
        css={`
          height: 51px;
          z-index: 1;
        `}
      />
      <div
        css={`
          font-family: 'Libre Franklin';
          font-size: 26px;
          font-weight: bold;
          font-stretch: normal;
          line-height: 0.87;
          letter-spacing: 0.04em;
          text-align: left;
          color: #ffffff;
          text-shadow: 0 0 4.9px rgba(50, 50, 50, 0.44);
        `}
      >
        Models Catalog
      </div>
    </Link>
  </>
);
