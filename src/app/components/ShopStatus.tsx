'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Subscribe from './Subscribe';

export default function ShopStatus() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); 
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const storedShopStatus = localStorage.getItem('shopStatus');
    
    if (storedShopStatus !== null) {
      setIsOpen(storedShopStatus === 'open');
    } else {
      // Default to open as per updated user preference
      localStorage.setItem('shopStatus', 'open');
      setIsOpen(true); // Explicitly set to open
    }
    
    setIsLoaded(true);
    console.log('Shop status:', storedShopStatus, 'isOpen:', storedShopStatus === 'open');
  }, []);

  const toggleShopStatus = () => {
    const newStatus = !isOpen;
    setIsOpen(newStatus);
    localStorage.setItem('shopStatus', newStatus ? 'open' : 'closed');
    
    if (newStatus) {
      router.push('/products');
    }
  };

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
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="
          relative select-none cursor-pointer
          transition-all duration-500 ease-out
          font-roboto
        "
      >
        {/* Windows Vista-style glass capsule button */}
        <div className="relative py-4 px-12 overflow-hidden group">
          {/* Vista glossy capsule shape with rounded ends */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            {/* Vista glass background with light reflection */}
            <div className={`
              absolute inset-0
              ${isOpen ? 'bg-blue-400/80' : 'bg-[#FF9BC0]/80'}
              transition-colors duration-700 backdrop-blur-sm
            `}>
              {/* Debug info - only visible during development */}
              <div className="hidden">{isOpen ? 'OPEN-STATE' : 'CLOSED-STATE'}</div>
            </div>
            
            {/* Top highlight shine - the classic Vista glass look */}
            <div className="
              absolute top-0 left-0 right-0 h-1/2
              bg-gradient-to-b from-white/80 to-transparent
              opacity-80
            "></div>
            
            {/* Bottom subtle shadow */}
            <div className="
              absolute bottom-0 left-0 right-0 h-1/3
              bg-gradient-to-t from-black/10 to-transparent
            "></div>
            
            {/* Side glossy edge highlights */}
            <div className="
              absolute top-1/4 bottom-1/4 left-0.5 w-2
              bg-gradient-to-r from-white/60 to-transparent rounded-l-full
            "></div>
            <div className="
              absolute top-1/4 bottom-1/4 right-0.5 w-2
              bg-gradient-to-l from-white/60 to-transparent rounded-r-full
            "></div>
            
            {/* Vista "glass edge" reflection - thin white line at top */}
            <div className="
              absolute top-0.5 left-5 right-5 h-[1px]
              bg-white/90
            "></div>
            
            {/* Inner reflection effect */}
            <div className={`
              absolute inset-1.5 rounded-full 
              ${isOpen ? 'bg-gradient-to-b from-blue-300/70 via-blue-400/40 to-blue-500/80' : 'bg-gradient-to-b from-[#FFB4D0]/70 via-[#FF9BC0]/40 to-[#FF83B1]/80'}
              ${isHovering ? 'opacity-90 scale-[0.98]' : 'opacity-80'}
              transition-all duration-300
              shadow-inner
            `}></div>
            
            {/* Animated water-like reflection when hovered (Vista Aero effect) */}
            <div className={`
              absolute inset-x-3 top-0 h-full
              bg-gradient-to-b from-white/60 via-transparent to-transparent
              -translate-y-full group-hover:translate-y-full transition-transform duration-1500 ease-in-out
            `}></div>
          </div>
          
          {/* Outer glossy border - Vista style */}
          <div className="
            absolute inset-0 rounded-full border
            border-white/50 shadow-[0_0_10px_rgba(255,255,255,0.5),inset_0_0_2px_rgba(255,255,255,0.5)]
          "></div>
          
          {/* Text with classic Vista styling */}
          <div className="relative flex justify-center items-center py-1">
            <span className={`
              uppercase tracking-[0.15em] font-bold text-sm z-10
              text-white
              transition-colors duration-700
              drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]
            `}>{isOpen ? 'OPEN' : 'CLOSED'}</span>
          </div>
          
          {/* Bottom shadow - Windows Vista style */}
          <div className="
            absolute -bottom-3 left-1/2 -translate-x-1/2 w-3/4 h-6 
            bg-black/20 blur-md rounded-full
            opacity-60
          "></div>
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