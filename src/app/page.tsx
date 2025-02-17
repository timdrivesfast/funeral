import ShopStatus from './components/ShopStatus'

export default function Home() {
  return (
    <main className="fixed inset-0 flex flex-col items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter">
          FUNERAL
        </h1>
        <ShopStatus />
      </div>
    </main>
  )
} 