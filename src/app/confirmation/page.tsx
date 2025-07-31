'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function OrderContent() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get the orderId from the URL query parameters
  const orderId = searchParams.get('orderId');
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setLoading(false);
        setError('No order ID found in URL. Unable to retrieve order details.');
        return;
      }
      
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch order details: ${response.statusText}`);
        }
        
        const data = await response.json();
        setOrderDetails(data);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Unable to load your order details. Please contact customer support.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId]);
  
  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-20">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-1/2 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-1/3 bg-gray-200 rounded mb-8"></div>
            <div className="h-32 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center">Order Information Unavailable</h1>
          <p className="text-center text-gray-600 mb-6">{error}</p>
          <div className="flex justify-center">
            <Link href="/" className="btn btn-primary">
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // If we don't have order details but also don't have an error or loading state
  if (!orderDetails) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center">Thank You For Your Order!</h1>
          <p className="text-center text-gray-600 mb-6">
            Your purchase was successful, but we couldn't retrieve the detailed information.
            You will receive a confirmation email shortly.
          </p>
          <div className="flex justify-center">
            <Link href="/" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold">Order Confirmed!</h1>
          <p className="text-gray-600 mt-2">Thank you for your purchase. Your order has been successfully placed.</p>
        </div>
        
        <div className="border-t border-b border-gray-200 py-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-medium">{orderDetails.id || orderId}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">
              {orderDetails.createdAt 
                ? new Date(orderDetails.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
              }
            </span>
          </div>
          {orderDetails.customer && (
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{orderDetails.customer.email}</span>
            </div>
          )}
        </div>
        
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        
        {orderDetails.lineItems && orderDetails.lineItems.length > 0 ? (
          <div className="space-y-4 mb-6">
            {orderDetails.lineItems.map((item: any, index: number) => (
              <div key={index} className="flex items-center border-b border-gray-100 pb-4">
                {item.imageUrl && (
                  <div className="w-20 h-20 relative mr-4 rounded overflow-hidden">
                    <Image 
                      src={item.imageUrl} 
                      alt={item.name}
                      fill
                      sizes="80px"
                      style={{ objectFit: 'cover' }}
                      className="rounded"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(item.totalMoney?.amount / 100).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic mb-6">Order items information not available</p>
        )}
        
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal:</span>
            <span>
              ${orderDetails.totalMoney?.amount 
                ? (orderDetails.totalMoney.amount / 100).toFixed(2)
                : '0.00'}
            </span>
          </div>
          {orderDetails.totalTaxMoney && (
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Tax:</span>
              <span>${(orderDetails.totalTaxMoney.amount / 100).toFixed(2)}</span>
            </div>
          )}
          {orderDetails.totalShippingMoney && (
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Shipping:</span>
              <span>${(orderDetails.totalShippingMoney.amount / 100).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold pt-2 border-t border-gray-200 mt-2">
            <span>Total:</span>
            <span>
              ${orderDetails.totalMoney?.amount 
                ? (orderDetails.totalMoney.amount / 100).toFixed(2)
                : '0.00'}
            </span>
          </div>
        </div>
        
        {orderDetails.fulfillments && orderDetails.fulfillments.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              {orderDetails.fulfillments[0].shipmentDetails?.recipient && (
                <>
                  <p className="font-medium">
                    {orderDetails.fulfillments[0].shipmentDetails.recipient.displayName}
                  </p>
                  {orderDetails.fulfillments[0].shipmentDetails.recipient.address && (
                    <address className="text-gray-600 not-italic">
                      {orderDetails.fulfillments[0].shipmentDetails.recipient.address.addressLine1}<br />
                      {orderDetails.fulfillments[0].shipmentDetails.recipient.address.addressLine2 && (
                        <>{orderDetails.fulfillments[0].shipmentDetails.recipient.address.addressLine2}<br /></>
                      )}
                      {orderDetails.fulfillments[0].shipmentDetails.recipient.address.locality}, {' '}
                      {orderDetails.fulfillments[0].shipmentDetails.recipient.address.administrativeDistrictLevel1} {' '}
                      {orderDetails.fulfillments[0].shipmentDetails.recipient.address.postalCode}
                    </address>
                  )}
                </>
              )}
            </div>
          </div>
        )}
        
        <div className="text-center">
          <Link href="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmation() {
  return (
    <Suspense fallback={
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-20">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-1/2 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-1/3 bg-gray-200 rounded mb-8"></div>
            <div className="h-32 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    }>
      <OrderContent />
    </Suspense>
  );
}
