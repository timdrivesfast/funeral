"use client"

import { useState } from 'react'

interface Props {
  productId: string
  quantity?: number
  className?: string
  buttonText?: string
}

export default function CheckoutButton({ 
  productId, 
  quantity = 1, 
  className = '',
  buttonText = 'Buy Now'
}: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      // Redirect to Square Checkout
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleCheckout}
        disabled={isLoading}
        className={`btn btn-primary w-full md:w-auto ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        } ${className}`}
      >
        {isLoading ? 'Processing...' : buttonText}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}