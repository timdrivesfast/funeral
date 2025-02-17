'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Subscribe from './Subscribe';

export default function ShopStatus() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(false);

  useEffect(() => {
    setIsOpen(false);
    setIsLoaded(true);
    
    const interval = setInterval(() => {
      setIsOpen(false);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    if (isOpen) {
      router.push('/products');
    } else {
      setShowSubscribe(true);
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <>
      <div 
        onClick={handleClick}
        className={`
          font-['Helvetica_Neue'] select-none cursor-pointer
          transition-all duration-500 ease-out
          hover:opacity-80
        `}
      >
        <div className="relative">
          <div className={`
            px-8 py-3 text-sm uppercase tracking-[0.2em]
            ${isOpen ? 'text-emerald-500/90' : 'text-red-500/90'}
            transition-colors duration-1000
            rounded-full
          `}>
            {/* Softer glow effect */}
            <div className={`
              absolute inset-0 blur-xl opacity-30
              ${isOpen ? 'bg-emerald-500' : 'bg-red-500'}
              transition-colors duration-1000
              rounded-full
            `} />
            
            {/* Text with softer glow */}
            <span className={`
              relative
              ${isOpen ? 'text-emerald-400/90' : 'text-red-400/90'}
              transition-colors duration-1000
              [text-shadow:0_0_15px_currentColor,0_0_30px_currentColor]
            `}>
              {isOpen ? 'OPEN' : 'CLOSED'}
            </span>
          </div>

          {/* Softer flicker animation */}
          <div className={`
            absolute inset-0 opacity-0
            animate-[flicker_4s_infinite]
            ${isOpen ? 'bg-emerald-500/50' : 'bg-red-500/50'}
            transition-colors duration-1000
            mix-blend-overlay
            rounded-full
          `} />
        </div>
      </div>

      {showSubscribe && (
        <Subscribe 
          isControlled
          isOpen={showSubscribe} 
          onClose={() => setShowSubscribe(false)}
          buttonText="GET NOTIFIED"
        />
      )}
    </>
  );
} 