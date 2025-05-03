import ShopStatus from './components/ShopStatus'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden">
      {/* Windows XP/Vista style background with blue sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300 z-0" />
      
      {/* Fluffy white clouds with gentle drift animation */}
      <div className="absolute w-64 h-28 left-10 top-20 bg-white rounded-full blur-md animate-[float_35s_linear_infinite]"></div>
      <div className="absolute w-80 h-32 -right-10 top-40 bg-white rounded-full blur-md animate-[float_42s_linear_infinite_0.5s] opacity-90"></div>
      <div className="absolute w-52 h-24 right-1/4 top-10 bg-white rounded-full blur-md animate-[float_38s_linear_infinite_1.2s]"></div>
      <div className="absolute w-44 h-20 left-1/3 top-16 bg-white rounded-full blur-md animate-[float_40s_linear_infinite_2s] opacity-80"></div>
      
      {/* Subtle sun rays effect */}
      <div className="absolute top-5 right-20 w-48 h-48 bg-yellow-100/30 rounded-full blur-xl animate-pulse-slow"></div>
      
      {/* Green grass hills at bottom (Windows XP style) */}
      <div className="absolute left-0 right-0 bottom-0 h-1/3 bg-gradient-to-t from-green-500 to-green-400 rounded-t-[100%] transform translate-y-10"></div>
      <div className="absolute left-0 right-0 bottom-0 h-1/4 bg-gradient-to-t from-green-600 to-green-500 rounded-t-[100%] transform translate-y-5"></div>
      
      {/* Glass-like water bubbles with reflections and animations (the signature Aero look) */}
      <div className="absolute w-48 h-48 right-20 top-56 rounded-full overflow-hidden animate-[float_15s_ease-in-out_infinite] hover:scale-105 transition-transform duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-blue-100/80 to-blue-200/60 backdrop-blur-sm border border-white/50 shadow-2xl"></div>
        <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-white opacity-90"></div>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-400/30 rounded-full blur-md animate-[float_8s_ease-in-out_infinite_1.5s]"></div>
        {/* Animated internal reflection */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent -translate-y-full animate-[bubble-shine_8s_ease-in-out_infinite]"></div>
      </div>
      
      <div className="absolute w-32 h-32 left-20 top-1/2 rounded-full overflow-hidden animate-[float_12s_ease-in-out_infinite_0.5s] hover:scale-105 transition-transform duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-blue-100/80 to-blue-200/60 backdrop-blur-sm border border-white/50 shadow-xl"></div>
        <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-white opacity-90"></div>
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-green-400/30 rounded-full blur-md animate-[float_7s_ease-in-out_infinite_2s]"></div>
        {/* Animated internal reflection */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent -translate-y-full animate-[bubble-shine_10s_ease-in-out_infinite_1s]"></div>
      </div>
      
      <div className="absolute w-24 h-24 left-1/2 bottom-32 rounded-full overflow-hidden animate-[float_10s_ease-in-out_infinite_1.2s] hover:scale-105 transition-transform duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-blue-100/80 to-blue-200/60 backdrop-blur-sm border border-white/50 shadow-lg"></div>
        <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-white opacity-90"></div>
        <div className="absolute -top-4 -left-4 w-16 h-16 bg-green-400/30 rounded-full blur-md animate-[float_6s_ease-in-out_infinite_0.5s]"></div>
        {/* Animated internal reflection */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent -translate-y-full animate-[bubble-shine_7s_ease-in-out_infinite_0.7s]"></div>
      </div>
      
      {/* Additional smaller bubbles that float up */}
      <div className="absolute w-10 h-10 right-40 bottom-10 rounded-full overflow-hidden animate-[float-up_15s_linear_infinite]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-blue-100/70 to-blue-200/50 backdrop-blur-sm border border-white/50"></div>
      </div>
      <div className="absolute w-8 h-8 left-1/3 bottom-16 rounded-full overflow-hidden animate-[float-up_18s_linear_infinite_3s]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-blue-100/70 to-blue-200/50 backdrop-blur-sm border border-white/50"></div>
      </div>
      <div className="absolute w-6 h-6 right-1/4 bottom-8 rounded-full overflow-hidden animate-[float-up_12s_linear_infinite_5s]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-blue-100/70 to-blue-200/50 backdrop-blur-sm border border-white/50"></div>
      </div>
      
      {/* Animated water splash effect */}
      <div className="absolute left-0 bottom-32 w-64 h-28 bg-gradient-to-r from-blue-300/70 via-blue-200/90 to-white/70 rounded-full transform rotate-12 blur-sm animate-[pulse-water_8s_ease-in-out_infinite]"></div>
      <div className="absolute left-10 bottom-40 w-32 h-14 bg-gradient-to-r from-blue-200/90 via-white/90 to-blue-100/80 rounded-full transform -rotate-12 blur-sm animate-[pulse-water_7s_ease-in-out_infinite_1s]"></div>
      <div className="absolute right-20 bottom-24 w-48 h-20 bg-gradient-to-r from-white/70 via-blue-200/80 to-blue-100/60 rounded-full transform rotate-6 blur-sm animate-[pulse-water_9s_ease-in-out_infinite_0.5s]"></div>
      
      {/* Small white daisies (like in Windows XP Bliss wallpaper) */}
      <div className="absolute left-1/4 bottom-10 w-6 h-6 bg-white rounded-full blur-[0.5px] shadow-sm"></div>
      <div className="absolute left-1/4 bottom-9 w-3 h-3 bg-yellow-300 rounded-full blur-[0.5px]"></div>
      
      <div className="absolute right-1/3 bottom-16 w-5 h-5 bg-white rounded-full blur-[0.5px] shadow-sm"></div>
      <div className="absolute right-1/3 bottom-15 w-2 h-2 bg-yellow-300 rounded-full blur-[0.5px]"></div>
      
      <div className="absolute left-2/3 bottom-8 w-4 h-4 bg-white rounded-full blur-[0.5px] shadow-sm"></div>
      <div className="absolute left-2/3 bottom-7 w-1.5 h-1.5 bg-yellow-300 rounded-full blur-[0.5px]"></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-12 px-6">
        {/* "FUNERAL" with Y2K Frutiger Aero treatment */}
        <div className="relative py-8">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter">
            <span 
              className="relative inline-block text-[#FF9BC0] animate-pulse-slow" 
              style={{ fontFamily: 'Inter, sans-serif', textTransform: 'lowercase' }}>
              funeral
            </span>
          </h1>
          
          {/* Animated glossy bubbles around logo */}
          <div className="absolute -right-1 -top-1 w-14 h-14 bg-gradient-to-br from-blue-200 to-blue-400/70 rounded-full opacity-70 animate-[float_9s_ease-in-out_infinite_0.8s]"></div>
          <div className="absolute -left-3 -bottom-2 w-10 h-10 bg-gradient-to-br from-pink-200 to-pink-400/70 rounded-full opacity-70 animate-[float_7s_ease-in-out_infinite_0.3s]"></div>
        </div>
        
        {/* ShopStatus now floats freely without container */}
        <div className="relative z-10 animate-[float_6s_ease-in-out_infinite_1s]">
          <ShopStatus />
        </div>
      </div>
    </main>
  )
} 