
import React from 'react';

const LOGO_URL = 'https://i.postimg.cc/rsXc55Cb/Whats-App-Image-2025-11-18-at-5-22-39-PM-removebg-preview.png';

export const Logo: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => (
  <img
    {...props}
    src={LOGO_URL}
    alt="Marketplace Logo"
  />
);
