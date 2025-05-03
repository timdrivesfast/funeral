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
    <header className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 md:px-10 z-40 bg-white shadow-sm">
      <Link href="/" className="font-bold tracking-tighter text-[#FF9BC0]">
        funeral
      </Link>

      {isStoreOpen && (
        <nav className="flex items-center space-x-6">
          <Link
            href="/products"
            className="text-[#FF9BC0] hover:text-[#FF83B1] transition-colors"
          >
            shop
          </Link>
        </nav>
      )}
    </header>
  );
}