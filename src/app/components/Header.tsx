"use client";

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Header() {
  const pathname = usePathname()
  const [isStoreOpen, setIsStoreOpen] = useState(true);

  useEffect(() => {
    const checkStoreStatus = () => {
      // Force closed state for initial launch
      setIsStoreOpen(false);
    };

    checkStoreStatus();
    const interval = setInterval(checkStoreStatus, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  if (pathname === '/') return null;

  return (
    <header className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 md:px-10 z-40 bg-black/50 backdrop-blur-sm">
      <Link href="/" className="font-bold tracking-tighter">
        FUNERAL
      </Link>

      {isStoreOpen && (
        <nav className="space-x-6">
          <Link
            href="/products?category=objects"
            className={`hover:text-white transition-colors ${
              pathname.includes('objects') ? 'text-white' : 'text-zinc-500'
            }`}
          >
            Objects
          </Link>
          <Link
            href="/products?category=packaging"
            className={`hover:text-white transition-colors ${
              pathname.includes('packaging') ? 'text-white' : 'text-zinc-500'
            }`}
          >
            Packaging
          </Link>
        </nav>
      )}
    </header>
  );
} 