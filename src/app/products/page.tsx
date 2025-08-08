import { Suspense } from 'react'
import ProductGrid from '../components/ProductGrid'
import Image from 'next/image'

interface Props {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function ProductsPage({ searchParams }: Props) {
  // Await searchParams before accessing its properties
  const params = await searchParams;
  const category = typeof params.category === 'string' ? params.category : undefined;
  const title = category ? `${category.charAt(0).toUpperCase()}${category.slice(1)}` : 'Products'

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black">
      {/* Cyberpunk/Tron style background */}
      <div className="fixed inset-0 bg-gradient-to-b from-black via-blue-950 to-black z-0" />
      
      {/* Cyberpunk grid overlay */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-repeat opacity-20 z-0"></div>
      
      {/* Blue neon glow effects */}
      <div className="fixed -bottom-20 left-1/4 w-1/2 h-40 bg-cyan-500 rounded-full opacity-20 blur-[100px] animate-pulse-slow z-0"></div>
      <div className="fixed -top-20 right-1/3 w-1/3 h-40 bg-purple-600 rounded-full opacity-20 blur-[100px] animate-pulse-slow z-0"></div>
      <div className="fixed top-1/4 left-10 w-1/5 h-40 bg-cyan-400 rounded-full opacity-10 blur-[80px] animate-pulse-slow z-0"></div>
      
      {/* Horizontal grid lines */}
      <div className="fixed left-0 right-0 h-px bg-cyan-500/20 top-1/4 z-0"></div>
      <div className="fixed left-0 right-0 h-px bg-cyan-500/20 top-2/4 z-0"></div>
      <div className="fixed left-0 right-0 h-px bg-cyan-500/20 top-3/4 z-0"></div>
      
      {/* Vertical grid lines */}
      <div className="fixed top-0 bottom-0 w-px bg-cyan-500/20 left-1/4 z-0"></div>
      <div className="fixed top-0 bottom-0 w-px bg-cyan-500/20 left-2/4 z-0"></div>
      <div className="fixed top-0 bottom-0 w-px bg-cyan-500/20 left-3/4 z-0"></div>
      
      {/* Neon glass bubbles */}
      <div className="fixed w-44 h-44 right-24 bottom-60 rounded-full overflow-hidden animate-[float_15s_ease-in-out_infinite] z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-blue-900/50 to-cyan-500/30 backdrop-blur-sm shadow-[0_0_15px_rgba(6,182,212,0.5)] border border-cyan-500/30"></div>
        <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-cyan-400 opacity-80"></div>
        {/* Animated internal reflection */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/20 via-transparent to-transparent -translate-y-full animate-[bubble-shine_8s_ease-in-out_infinite]"></div>
      </div>
      
      <div className="fixed w-32 h-32 left-24 top-1/2 rounded-full overflow-hidden animate-[float_12s_ease-in-out_infinite_0.5s] z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-purple-900/50 to-purple-500/30 backdrop-blur-sm shadow-[0_0_15px_rgba(147,51,234,0.5)] border border-purple-500/30"></div>
        <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-purple-400 opacity-80"></div>
        {/* Animated internal reflection */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-400/20 via-transparent to-transparent -translate-y-full animate-[bubble-shine_10s_ease-in-out_infinite_1s]"></div>
      </div>
      
      {/* Content area with cyberpunk panel effect */}
      <div className="relative z-10 pt-20 pb-24 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          {/* "PRODUCTS" with Tron/cyberpunk styling */}
          <div className="relative py-8 mb-12 text-center">
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tighter">
              <span 
                className="relative inline-block text-cyan-400 animate-pulse-slow drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]" 
                style={{ fontFamily: 'Helvetica, sans-serif', textTransform: 'uppercase' }}>
                {title}
              </span>
            </h1>
            
            {/* Animated neon accents around title */}
            <div className="absolute -right-1 -top-1 w-14 h-14 bg-gradient-to-br from-cyan-900 to-cyan-500/40 rounded-full opacity-70 animate-[float_9s_ease-in-out_infinite_0.8s]"></div>
            <div className="absolute -left-3 -bottom-2 w-10 h-10 bg-gradient-to-br from-purple-900 to-purple-500/40 rounded-full opacity-70 animate-[float_7s_ease-in-out_infinite_0.3s]"></div>
          </div>
          
          {/* Cyberpunk panel for products */}
          <div className="relative p-8 md:p-12 backdrop-blur-md bg-black/30 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)] overflow-hidden">
            {/* Panel gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 to-black/30 rounded-xl pointer-events-none"></div>
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-10"></div>
            
            <Suspense fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse aspect-square">
                    <div className="bg-black/50 border border-cyan-900/50 h-full w-full rounded-lg shadow-[0_0_10px_rgba(6,182,212,0.2)]" />
                  </div>
                ))}
              </div>
            }>
              <ProductGrid category={category} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  )
} 