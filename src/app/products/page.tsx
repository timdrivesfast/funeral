import { Suspense } from 'react'
import ProductGrid from '../components/ProductGrid'

interface Props {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function ProductsPage({ searchParams }: Props) {
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const title = category ? `${category.charAt(0).toUpperCase()}${category.slice(1)}` : 'Products'

  return (
    <main className="min-h-screen p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 tracking-tighter">{title}</h1>
        <Suspense fallback={<div>Loading products...</div>}>
          <ProductGrid category={category} />
        </Suspense>
      </div>
    </main>
  )
} 