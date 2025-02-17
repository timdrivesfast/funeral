'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Subscribe from './Subscribe';

export default function ShopStatus() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // Start with closed state
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(false);

  useEffect(() => {
    // Force closed state for initial launch
    setIsOpen(false);
    setIsLoaded(true);
    
    const interval = setInterval(() => {
      setIsOpen(false); // Keep it closed
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    if (isOpen) {
      router.push('/products');
    } else {
      setShowSubscribe(true);
    }
  };

  // Don't render anything until loaded to prevent flicker
  if (!isLoaded) {
    return null;
  }

  return (
    <>
      <div 
        onClick={handleClick}
        className={`
          font-['Helvetica_Neue'] select-none cursor-pointer hover:scale-105
          transition-transform duration-300
        `}
      >
        <div className="relative">
          <div className={`
            px-6 py-3 text-sm uppercase tracking-[0.2em]
            ${isOpen ? 'text-emerald-500' : 'text-red-500'}
            transition-colors duration-1000
          `}>
            {/* Neon glow effect */}
            <div className={`
              absolute inset-0 blur-md opacity-50
              ${isOpen ? 'bg-emerald-500' : 'bg-red-500'}
              transition-colors duration-1000
            `} />
            
            {/* Text with glow */}
            <span className={`
              relative
              ${isOpen ? 'text-emerald-400' : 'text-red-400'}
              transition-colors duration-1000
              [text-shadow:0_0_10px_currentColor,0_0_20px_currentColor]
            `}>
              {isOpen ? 'OPEN' : 'CLOSED'}
            </span>
          </div>

          {/* Flicker animation */}
          <div className={`
            absolute inset-0 opacity-0
            animate-[flicker_4s_infinite]
            ${isOpen ? 'bg-emerald-500' : 'bg-red-500'}
            transition-colors duration-1000
            mix-blend-overlay
          `} />
        </div>
      </div>

      {/* Controlled Subscribe Modal */}
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