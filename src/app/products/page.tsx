import { Suspense } from 'react'
import ProductGrid from '../components/ProductGrid'

interface Props {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function ProductsPage({ searchParams }: Props) {
  // Await searchParams before accessing its properties
  const params = await searchParams;
  const category = typeof params.category === 'string' ? params.category : undefined;
  const title = category ? `${category.charAt(0).toUpperCase()}${category.slice(1)}` : 'Products'

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      {/* Soft gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-rose-50 to-white z-0" />

      {/* Floating bubbles to mirror the home page */}
      <div className="absolute -left-10 top-24 w-44 h-44 rounded-full overflow-hidden animate-[float_18s_ease-in-out_infinite] z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-200/60 via-pink-100/50 to-pink-300/40 backdrop-blur-md border border-pink-200/40 shadow-[0_10px_30px_rgba(255,182,193,0.35)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent -translate-y-full animate-[bubble-shine_12s_ease-in-out_infinite]" />
      </div>
      <div className="absolute right-10 top-1/3 w-32 h-32 rounded-full overflow-hidden animate-[float_14s_ease-in-out_infinite_0.5s] z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-300/60 via-pink-200/50 to-orange-200/40 backdrop-blur-md border border-pink-200/40 shadow-[0_10px_25px_rgba(255,182,193,0.3)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent -translate-y-full animate-[bubble-shine_10s_ease-in-out_infinite_1s]" />
      </div>
      <div className="absolute left-1/3 bottom-10 w-28 h-28 rounded-full overflow-hidden animate-[float_12s_ease-in-out_infinite_1s] z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-200/70 via-rose-100/60 to-amber-100/50 backdrop-blur-md border border-rose-200/40 shadow-[0_10px_25px_rgba(255,193,203,0.35)]" />
      </div>
      <div className="absolute right-1/4 bottom-20 w-16 h-16 rounded-full overflow-hidden animate-[float_9s_ease-in-out_infinite_0.2s] z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-200/70 via-pink-100/60 to-pink-300/50 backdrop-blur-sm border border-pink-200/40" />
      </div>

      {/* Content area */}
      <div className="relative z-10 pt-24 pb-24 px-4 md:px-10">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="relative py-8 mb-12 text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              <span 
                className="inline-block text-[#ff6fa8] drop-shadow-[0_6px_30px_rgba(255,111,168,0.35)]" 
                style={{ fontFamily: 'Helvetica, sans-serif', textTransform: 'uppercase' }}>
                {title}
              </span>
            </h1>
            <div className="mt-4 text-sm uppercase tracking-[0.5em] text-pink-300">
              curated objects
            </div>
          </div>

          {/* Product panel */}
          <div className="relative p-6 md:p-10 rounded-[32px] bg-white/70 border border-pink-100 shadow-[0_25px_60px_rgba(255,182,193,0.25)] backdrop-blur-md overflow-hidden">
            <div className="absolute inset-x-0 -top-20 h-40 bg-gradient-to-b from-pink-100/70 to-transparent pointer-events-none" />
            <div className="relative">
              <Suspense fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse aspect-square">
                      <div className="bg-white/60 border border-pink-100 h-full w-full rounded-2xl shadow-inner" />
                    </div>
                  ))}
                </div>
              }>
                <ProductGrid category={category} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}