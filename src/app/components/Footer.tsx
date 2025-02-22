import Subscribe from './Subscribe'
import { FaInstagram, FaTiktok } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 p-4 md:p-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-xs text-zinc-500">
        <div>FUNERAL OBJECTS © 2025</div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com/funeralobjects"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <FaInstagram size={18} />
            </a>
            <a
              href="https://tiktok.com/@funeralobjects"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
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