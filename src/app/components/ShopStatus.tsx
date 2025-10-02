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
      // Default to closed
      localStorage.setItem('shopStatus', 'closed');
      setIsOpen(false); // Explicitly set to closed
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
        className="relative select-none cursor-pointer transition-all duration-300 ease-out font-sans"
      >
        {/* Traditional neon sign style */}
        <div className="relative text-center">
          {/* Status text with neon effect */}
          <div className={`py-3 px-8 ${isHovering ? 'scale-105' : 'scale-100'} transition-all duration-300 transform-gpu`}>
            <span className={`font-bold text-4xl tracking-widest ${isOpen ? 'text-green-600' : 'text-red-500'} ${!isOpen ? 'animate-neon-flicker' : ''} transition-colors duration-500`} 
              style={{
                fontFamily: 'Helvetica, Arial, sans-serif',
                textShadow: isOpen 
                  ? '0 1px 2px rgba(0,0,0,0.1)'
                  : '0 0 5px rgba(239,68,68,0.8), 0 0 10px rgba(239,68,68,0.8), 0 0 15px rgba(239,68,68,0.8), 0 0 20px rgba(239,68,68,0.8)'
              }}
            >
              {isOpen ? 'OPEN' : 'CLOSED'}
            </span>
          </div>

          {/* Neon connector lines */}
          <div className={`absolute top-1/2 -left-4 w-4 h-1 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'} ${!isOpen ? 'animate-flicker-slow' : ''} ${isOpen ? 'shadow-sm' : 'shadow-[0_0_10px_rgba(239,68,68,0.8)]'}`}></div>

          <div className={`absolute top-1/2 -right-4 w-4 h-1 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'} ${!isOpen ? 'animate-flicker-delayed' : ''} ${isOpen ? 'shadow-sm' : 'shadow-[0_0_10px_rgba(239,68,68,0.8)]'}`}></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes neon-flicker {
          0%, 100% {
            text-shadow: 0 0 5px rgba(239,68,68,0.8), 0 0 10px rgba(239,68,68,0.8), 0 0 15px rgba(239,68,68,0.8), 0 0 20px rgba(239,68,68,0.8);
            opacity: 1;
          }
          90%, 98% {
            text-shadow: 0 0 5px rgba(239,68,68,0.3), 0 0 10px rgba(239,68,68,0.3), 0 0 15px rgba(239,68,68,0.3), 0 0 20px rgba(239,68,68,0.3);
            opacity: 0.8;
          }
          91%, 96% {
            text-shadow: none;
            opacity: 0.6;
          }
        }

        @keyframes flicker-slow {
          0%, 100% { opacity: 1; }
          41% { opacity: 1; }
          42% { opacity: 0.4; }
          43% { opacity: 1; }
          45% { opacity: 0.8; }
          47% { opacity: 1; }
          85% { opacity: 1; }
          86% { opacity: 0.5; }
          87% { opacity: 1; }
        }

        @keyframes flicker-delayed {
          0%, 100% { opacity: 1; }
          60% { opacity: 1; }
          61% { opacity: 0.3; }
          62% { opacity: 1; }
          65% { opacity: 0.7; }
          67% { opacity: 1; }
          95% { opacity: 1; }
          96% { opacity: 0.4; }
          97% { opacity: 1; }
        }

        .animate-neon-flicker {
          animation: neon-flicker 3s infinite;
        }

        .animate-flicker-slow {
          animation: flicker-slow 4s infinite;
        }

        .animate-flicker-delayed {
          animation: flicker-delayed 5s infinite;
        }
      `}</style>

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