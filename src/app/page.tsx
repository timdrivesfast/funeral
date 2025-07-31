import ShopStatus from './components/ShopStatus'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden">
      {/* Cyberpunk gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900 to-blue-900 z-0" />
      
      {/* Tron-inspired central light source */}
      <div className="absolute bottom-[30%] left-1/2 transform -translate-x-1/2 w-60 h-60 bg-gradient-radial from-cyan-400 via-cyan-500/30 to-transparent rounded-full blur-md"></div>
      
      {/* Grid overlay for cyberpunk feel */}
      <div className="absolute inset-0" style={{ 
        backgroundImage: `
          linear-gradient(0deg, rgba(0, 231, 255, 0.1) 1px, transparent 1px), 
          linear-gradient(90deg, rgba(0, 231, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        backgroundPosition: 'center',
        perspective: '500px',
        transform: 'rotateX(60deg) translateY(100px)'
      }}></div>
      
      {/* Neon glass bubbles */}
      {/* Large bubble left */}
      <div className="absolute bottom-[15%] left-[10%] w-36 h-36 rounded-full overflow-hidden animate-[float_15s_ease-in-out_infinite]">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/60 via-blue-500/40 to-purple-600/30 backdrop-blur-sm shadow-lg border border-cyan-300/50"></div>
        <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-cyan-300 opacity-70"></div>
        {/* Animated internal reflection */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/40 via-transparent to-transparent -translate-y-full animate-[bubble-shine_8s_ease-in-out_infinite]"></div>
      </div>
      
      {/* Medium bubble right */}
      <div className="absolute bottom-[10%] right-[15%] w-28 h-28 rounded-full overflow-hidden animate-[float_12s_ease-in-out_infinite_0.5s]">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/60 via-blue-600/40 to-cyan-700/30 backdrop-blur-sm shadow-lg border border-purple-300/50"></div>
        <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-purple-300 opacity-70"></div>
        {/* Animated internal reflection */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-400/40 via-transparent to-transparent -translate-y-full animate-[bubble-shine_10s_ease-in-out_infinite_1s]"></div>
      </div>
      
      {/* Small floating bubbles */}
      <div className="absolute bottom-[25%] left-[30%] w-14 h-14 rounded-full overflow-hidden animate-[float_8s_ease-in-out_infinite_1.2s]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/60 via-purple-500/40 to-cyan-600/30 backdrop-blur-sm shadow-lg border border-blue-300/50"></div>
        <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-blue-300 opacity-70"></div>
      </div>
      
      <div className="absolute bottom-[20%] right-[40%] w-10 h-10 rounded-full overflow-hidden animate-[float_6s_ease-in-out_infinite_0.8s]">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/60 via-purple-500/40 to-blue-600/30 backdrop-blur-sm shadow-lg border border-cyan-300/50"></div>
      </div>
      
      {/* Digital circuit horizon line */}
      <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-gradient-to-b from-cyan-900/70 to-blue-900/80 border-t border-cyan-500/50"></div>
      
      {/* Clean, simple logo and status */}
      <div className="relative z-10 flex flex-col items-center gap-10 px-6">
        {/* Modern, Helvetica FUNERAL logo with neon effect */}
        <div className="relative py-4">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
            <span 
              className="relative inline-block text-white drop-shadow-[0_0_10px_rgba(6,182,212,0.7)]" 
              style={{ fontFamily: 'Helvetica, Arial, sans-serif', textTransform: 'uppercase' }}>
              FUNERAL
            </span>
          </h1>
        </div>
        
        {/* ShopStatus sign - more prominent */}
        <div className="relative z-10 transform scale-125 mt-4">
          <ShopStatus />
        </div>
      </div>
      
      {/* Tiny rising bubbles with neon colors */}
      <div className="absolute w-6 h-6 left-[20%] bottom-16 rounded-full overflow-hidden animate-[float-up_15s_linear_infinite]">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/70 via-blue-500/40 to-transparent backdrop-blur-sm shadow-sm border border-cyan-400/50"></div>
      </div>
      <div className="absolute w-4 h-4 right-[25%] bottom-10 rounded-full overflow-hidden animate-[float-up_12s_linear_infinite_3s]">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/70 via-blue-500/40 to-transparent backdrop-blur-sm shadow-sm border border-purple-400/50"></div>
      </div>
      <div className="absolute w-3 h-3 right-[40%] bottom-20 rounded-full overflow-hidden animate-[float-up_10s_linear_infinite_5s]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/70 via-purple-500/40 to-transparent backdrop-blur-sm shadow-sm border border-blue-400/50"></div>
      </div>
    </main>
  )
} 