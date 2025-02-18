import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from './components/Header'
import Footer from './components/Footer'
import { CartProvider } from '@/src/contexts/CartContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FUNERAL - Jewelry & Packaging',
  description: 'Exclusive jewelry and premium packaging solutions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-screen bg-black text-white`}>
        <CartProvider>
          <Header />
          <div className="pt-16">
            {children}
          </div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
} 