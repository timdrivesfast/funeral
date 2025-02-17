import Subscribe from './Subscribe'

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 p-4 md:p-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-xs text-zinc-500">
        <div>FUNERAL OBJECTS © 2025</div>
        <Subscribe />
      </div>
    </footer>
  )
} 