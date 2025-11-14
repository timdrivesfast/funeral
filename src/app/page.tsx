import ShopStatus from './components/ShopStatus'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden">
      {/* Clean white background */}
      <div className="absolute inset-0 bg-white z-0" />
      
      
      {/* Translucent pink holographic bubbles */}
      {/* Large bubble left */}
      <div className="absolute bottom-[25%] left-[10%] w-36 h-36 rounded-full overflow-hidden animate-[float_15s_ease-in-out_infinite]">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-300/40 via-pink-200/30 to-pink-400/20 backdrop-blur-sm shadow-lg border border-pink-200/30"></div>
        <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-pink-300/50 opacity-60"></div>
        {/* Subtle holographic reflection */}
        <div className="absolute inset-0 bg-gradient-to-b from-pink-300/30 via-transparent to-transparent -translate-y-full animate-[bubble-shine_8s_ease-in-out_infinite]"></div>
      </div>
      
      {/* Medium bubble right */}
      <div className="absolute bottom-[20%] right-[15%] w-28 h-28 rounded-full overflow-hidden animate-[float_12s_ease-in-out_infinite_0.5s]">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-400/40 via-pink-300/30 to-pink-500/20 backdrop-blur-sm shadow-lg border border-pink-300/30"></div>
        <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-pink-400/50 opacity-60"></div>
        {/* Subtle holographic reflection */}
        <div className="absolute inset-0 bg-gradient-to-b from-pink-400/30 via-transparent to-transparent -translate-y-full animate-[bubble-shine_10s_ease-in-out_infinite_1s]"></div>
      </div>
      
      {/* Small floating bubbles */}
      <div className="absolute bottom-[35%] left-[30%] w-14 h-14 rounded-full overflow-hidden animate-[float_8s_ease-in-out_infinite_1.2s]">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-300/40 via-pink-200/30 to-pink-400/20 backdrop-blur-sm shadow-lg border border-pink-200/30"></div>
        <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-pink-300/50 opacity-60"></div>
      </div>
      
      <div className="absolute bottom-[30%] right-[40%] w-10 h-10 rounded-full overflow-hidden animate-[float_6s_ease-in-out_infinite_0.8s]">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-400/40 via-pink-300/30 to-pink-500/20 backdrop-blur-sm shadow-lg border border-pink-300/30"></div>
      </div>
      
      {/* Clean bottom area - removed digital circuit horizon line */}
      
      {/* Clean, simple logo and status */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6">
        {/* Modern, Helvetica FUNERAL logo with clean styling */}
        <div className="relative py-4">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
            <span 
              className="relative inline-block text-[#ff6fa8] drop-shadow-[0_6px_30px_rgba(255,111,168,0.35)]" 
              style={{ fontFamily: 'Helvetica, Arial, sans-serif', textTransform: 'uppercase' }}>
              FUNERAL
            </span>
          </h1>
        </div>
        
        {/* ShopStatus sign */}
        <div className="relative z-10">
          <ShopStatus />
        </div>
      </div>
      
      {/* Tiny rising pink bubbles - moved up to avoid footer */}
      <div className="absolute w-6 h-6 left-[20%] bottom-24 rounded-full overflow-hidden animate-[float-up_15s_linear_infinite]">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-300/60 via-pink-200/40 to-transparent backdrop-blur-sm shadow-sm border border-pink-300/40"></div>
      </div>
      <div className="absolute w-4 h-4 right-[25%] bottom-20 rounded-full overflow-hidden animate-[float-up_12s_linear_infinite_3s]">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-400/60 via-pink-300/40 to-transparent backdrop-blur-sm shadow-sm border border-pink-400/40"></div>
      </div>
      <div className="absolute w-3 h-3 right-[40%] bottom-28 rounded-full overflow-hidden animate-[float-up_10s_linear_infinite_5s]">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-300/60 via-pink-400/40 to-transparent backdrop-blur-sm shadow-sm border border-pink-300/40"></div>
      </div>
    </main>
  )
} 