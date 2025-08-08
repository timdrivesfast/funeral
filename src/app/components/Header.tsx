"use client";

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Header() {
  const pathname = usePathname()
  const [isStoreOpen, setIsStoreOpen] = useState(true);

  useEffect(() => {
    const checkStoreStatus = () => {
      // Check localStorage for store status
      const status = localStorage.getItem('shopStatus');
      setIsStoreOpen(status === 'open');
    };

    checkStoreStatus();
    const interval = setInterval(checkStoreStatus, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  if (pathname === '/') return null;

  return (
    <header className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 md:px-10 z-40 bg-black/80 backdrop-blur-md border-b border-cyan-500/20 shadow-[0_4px_12px_rgba(6,182,212,0.15)]">
      <Link href="/" className="font-bold tracking-tighter text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]" style={{ fontFamily: 'Helvetica, sans-serif', textTransform: 'uppercase' }}>
        funeral
      </Link>

      {isStoreOpen && (
        <nav className="flex items-center space-x-6">
          <Link
            href="/products"
            className="text-cyan-400 hover:text-cyan-300 transition-colors drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]"
            style={{ fontFamily: 'Helvetica, sans-serif', textTransform: 'uppercase' }}
          >
            shop
          </Link>
        </nav>
      )}
    </header>
  );
}