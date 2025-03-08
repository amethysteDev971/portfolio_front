import React from 'react';
import './ScrollingBanner.css';

export default function ScrollingBanner() {
  const text = "WEBDESIGN - DÉVELOPPEMENT INFORMATIQUE - BRANDING - COMMUNICATION DIGITAL - DEVELOPPEMENT WEB - PORTFOLIO - ";
  return (
    <div className="scrolling-banner">
      <div className="scrolling-text">
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </div>
  );
}
