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
            <span className={`font-bold text-4xl tracking-widest ${isOpen ? 'text-green-600' : 'text-gray-600'} transition-colors duration-500`} 
              style={{
                fontFamily: 'Helvetica, Arial, sans-serif',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              {isOpen ? 'OPEN' : 'CLOSED'}
            </span>
          </div>

          {/* Clean connector lines */}
          <div className={`absolute top-1/2 -left-4 w-4 h-1 rounded-full ${isOpen ? 'bg-green-500' : 'bg-gray-400'} shadow-sm`}></div>

          <div className={`absolute top-1/2 -right-4 w-4 h-1 rounded-full ${isOpen ? 'bg-green-500' : 'bg-gray-400'} shadow-sm`}></div>
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