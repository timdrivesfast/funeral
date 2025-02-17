import { Suspense } from 'react'
import ProductGrid from './components/ProductGrid'
import ShopStatus from './components/ShopStatus'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black gap-8">
      <h1 className="text-6xl md:text-8xl font-bold tracking-tighter">
        FUNERAL
      </h1>
      <ShopStatus />
    </main>
  )
} 