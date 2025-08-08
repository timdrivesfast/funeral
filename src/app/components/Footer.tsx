import Subscribe from './Subscribe'
import { FaInstagram, FaTiktok } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 p-4 md:p-6 z-40">
      {/* Gradient background that blends with the main background */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-blue-900/80 to-transparent"></div>
      
      {/* Subtle grid overlay to match main background */}
      <div className="absolute inset-0 opacity-20" style={{ 
        backgroundImage: `
          linear-gradient(0deg, rgba(0, 231, 255, 0.3) 1px, transparent 1px), 
          linear-gradient(90deg, rgba(0, 231, 255, 0.3) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px'
      }}></div>
      
      {/* Content with backdrop blur */}
      <div className="relative max-w-7xl mx-auto flex justify-between items-center text-xs">
        <div className="text-cyan-300/80 font-light tracking-wide" style={{ fontFamily: 'Helvetica, sans-serif' }}>
          FUNERAL OBJECTS © 2025
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com/funeralobjects"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300/70 hover:text-cyan-200 transition-all duration-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)] hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
            >
              <FaInstagram size={18} />
            </a>
            <a
              href="https://tiktok.com/@funeralobjects"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300/70 hover:text-cyan-200 transition-all duration-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)] hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
            >
              <FaTiktok size={16} />
            </a>
          </div>
          <Subscribe />
        </div>
      </div>
    </footer>
  )
} 