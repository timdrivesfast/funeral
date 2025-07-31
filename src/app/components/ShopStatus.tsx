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
        className="relative select-none cursor-pointer transition-all duration-300 ease-out font-sans"
      >
        {/* Traditional neon sign style */}
        <div className="relative text-center">
          {/* Status text with neon effect */}
          <div className={`py-3 px-8 ${isHovering ? 'scale-105' : 'scale-100'} transition-all duration-300 transform-gpu`}>
            <span className={`font-bold text-4xl tracking-widest ${isOpen ? 'text-cyan-400' : 'text-purple-400'} ${isOpen ? 'animate-neon-cyan' : 'animate-neon-purple'} transition-colors duration-500`} 
              style={{
                fontFamily: 'Helvetica, Arial, sans-serif',
                textShadow: isOpen 
                  ? '0 0 5px rgba(6,182,212,0.8), 0 0 10px rgba(6,182,212,0.8), 0 0 15px rgba(6,182,212,0.8), 0 0 20px rgba(6,182,212,0.8)'
                  : '0 0 5px rgba(147,51,234,0.8), 0 0 10px rgba(147,51,234,0.8), 0 0 15px rgba(147,51,234,0.8), 0 0 20px rgba(147,51,234,0.8)'
              }}
            >
              {isOpen ? 'OPEN' : 'CLOSED'}
            </span>
          </div>

          {/* Neon tube connector lines */}
          <div className={`absolute top-1/2 -left-4 w-4 h-1 rounded-full ${isOpen ? 'bg-cyan-400' : 'bg-purple-400'} ${isOpen ? 'shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'shadow-[0_0_10px_rgba(147,51,234,0.8)]'} animate-flicker-slow`}></div>

          <div className={`absolute top-1/2 -right-4 w-4 h-1 rounded-full ${isOpen ? 'bg-cyan-400' : 'bg-purple-400'} ${isOpen ? 'shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'shadow-[0_0_10px_rgba(147,51,234,0.8)]'} animate-flicker-delayed`}></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes neon-cyan {
          0%, 100% {
            text-shadow: 0 0 5px rgba(6,182,212,0.8), 0 0 10px rgba(6,182,212,0.8), 0 0 15px rgba(6,182,212,0.8), 0 0 20px rgba(6,182,212,0.8);
            opacity: 1;
          }
          90%, 98% {
            text-shadow: 0 0 5px rgba(6,182,212,0.3), 0 0 10px rgba(6,182,212,0.3), 0 0 15px rgba(6,182,212,0.3), 0 0 20px rgba(6,182,212,0.3);
            opacity: 0.8;
          }
          91%, 96% {
            text-shadow: none;
            opacity: 0.6;
          }
        }

        @keyframes neon-purple {
          0%, 100% {
            text-shadow: 0 0 5px rgba(147,51,234,0.8), 0 0 10px rgba(147,51,234,0.8), 0 0 15px rgba(147,51,234,0.8), 0 0 20px rgba(147,51,234,0.8);
            opacity: 1;
          }
          95%, 99% {
            text-shadow: 0 0 5px rgba(147,51,234,0.3), 0 0 10px rgba(147,51,234,0.3), 0 0 15px rgba(147,51,234,0.3), 0 0 20px rgba(147,51,234,0.3);
            opacity: 0.7;
          }
          96%, 98% {
            text-shadow: none;
            opacity: 0.5;
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

        .animate-neon-cyan {
          animation: neon-cyan 8s infinite;
        }

        .animate-neon-purple {
          animation: neon-purple 6s infinite;
        }

        .animate-flicker-slow {
          animation: flicker-slow 5s infinite;
        }

        .animate-flicker-delayed {
          animation: flicker-delayed 7s infinite;
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