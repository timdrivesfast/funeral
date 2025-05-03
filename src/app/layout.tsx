import './globals.css'
import type { Metadata } from 'next'
import { Roboto, Inter, Rubik_Mono_One } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import Header from './components/Header'
import Footer from './components/Footer'

// Fonts for our new aesthetic
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const roboto = Roboto({ 
  weight: ['400', '700'], 
  subsets: ['latin'],
  variable: '--font-roboto'
})
const rubikMono = Rubik_Mono_One({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-rubik-mono'
})

export const metadata: Metadata = {
  title: 'FUNERAL - Designer Objects',
  description: 'Exclusive designer homegoods and funeral objects',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} ${roboto.variable} ${rubikMono.variable} min-h-screen bg-white text-zinc-800 font-sans`}>
        <Header />
        <div className="pt-16">
          {children}
        </div>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}