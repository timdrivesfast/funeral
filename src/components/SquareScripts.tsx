'use client';

import Script from 'next/script';

export default function SquareScripts() {
  return (
    <Script
      src="https://web.squarecdn.com/v1/square.js"
      strategy="beforeInteractive"
      onLoad={() => {
        console.log('Square SDK loaded');
      }}
    />
  );
} 