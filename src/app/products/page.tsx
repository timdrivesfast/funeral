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
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Windows XP/Vista style background with blue sky gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300 z-0" />
      
      {/* Fluffy white clouds with gentle drift animation */}
      <div className="fixed w-64 h-28 left-10 top-20 bg-white rounded-full blur-md animate-[float_35s_linear_infinite]"></div>
      <div className="fixed w-80 h-32 -right-10 top-40 bg-white rounded-full blur-md animate-[float_42s_linear_infinite_0.5s] opacity-90"></div>
      <div className="fixed w-52 h-24 right-1/4 top-10 bg-white rounded-full blur-md animate-[float_38s_linear_infinite_1.2s]"></div>
      <div className="fixed w-44 h-20 left-1/3 top-16 bg-white rounded-full blur-md animate-[float_40s_linear_infinite_2s] opacity-80"></div>
      
      {/* Subtle sun rays effect */}
      <div className="fixed top-5 right-20 w-48 h-48 bg-yellow-100/30 rounded-full blur-xl animate-pulse-slow"></div>
      
      {/* Green grass hills at bottom (Windows XP style) */}
      <div className="fixed left-0 right-0 bottom-0 h-1/5 bg-gradient-to-t from-green-500 to-green-400 rounded-t-[100%] transform translate-y-10"></div>
      <div className="fixed left-0 right-0 bottom-0 h-1/6 bg-gradient-to-t from-green-600 to-green-500 rounded-t-[100%] transform translate-y-5"></div>
      
      {/* Glass-like water bubbles */}
      <div className="fixed w-44 h-44 right-24 bottom-60 rounded-full overflow-hidden animate-[float_15s_ease-in-out_infinite] z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-blue-100/70 to-blue-200/50 backdrop-blur-sm shadow-2xl"></div>
        <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-white opacity-80"></div>
        {/* Animated internal reflection */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent -translate-y-full animate-[bubble-shine_8s_ease-in-out_infinite]"></div>
      </div>
      
      <div className="fixed w-32 h-32 left-24 top-1/2 rounded-full overflow-hidden animate-[float_12s_ease-in-out_infinite_0.5s] z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-blue-100/70 to-blue-200/50 backdrop-blur-sm shadow-xl"></div>
        <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-white opacity-80"></div>
        {/* Animated internal reflection */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent -translate-y-full animate-[bubble-shine_10s_ease-in-out_infinite_1s]"></div>
      </div>
      
      {/* Content area with glass panel effect */}
      <div className="relative z-10 pt-20 pb-24 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          {/* "PRODUCTS" with Y2K Frutiger Aero treatment */}
          <div className="relative py-8 mb-12 text-center">
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tighter">
              <span 
                className="relative inline-block text-[#FF80B0] animate-pulse-slow drop-shadow-sm" 
                style={{ fontFamily: 'Inter, sans-serif', textTransform: 'lowercase' }}>
                {title}
              </span>
            </h1>
            
            {/* Animated glossy bubbles around title */}
            <div className="absolute -right-1 -top-1 w-14 h-14 bg-gradient-to-br from-blue-200 to-blue-400/70 rounded-full opacity-70 animate-[float_9s_ease-in-out_infinite_0.8s]"></div>
            <div className="absolute -left-3 -bottom-2 w-10 h-10 bg-gradient-to-br from-pink-200 to-pink-400/70 rounded-full opacity-70 animate-[float_7s_ease-in-out_infinite_0.3s]"></div>
          </div>
          
          {/* Glass panel for products */}
          <div className="relative glass-panel p-8 md:p-12 backdrop-blur-md bg-white/10 rounded-xl border border-white/20 shadow-lg overflow-hidden">
            {/* Glass panel gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-xl pointer-events-none"></div>
            
            <Suspense fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse aspect-square">
                    <div className="bg-white/20 backdrop-blur-sm h-full w-full rounded-lg" />
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