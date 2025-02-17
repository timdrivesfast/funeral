'use client';

declare global {
  interface Window {
    Square: {
      payments: (applicationId: string, locationId: string) => Promise<{
        card: () => Promise<{
          attach: (selector: string) => Promise<void>;
          tokenize: () => Promise<{
            status: 'OK' | 'ERROR';
            token?: string;
            errors?: Array<{ message: string }>;
          }>;
        }>;
      }>;
    };
  }
}

let paymentsInstance: Awaited<ReturnType<typeof window.Square.payments>> | null = null;

export async function initializeSquarePayments() {
  if (!process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID) {
    throw new Error('Square Application ID is not set');
  }

  if (!process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID) {
    throw new Error('Square Location ID is not set');
  }

  if (!paymentsInstance) {
    paymentsInstance = await window.Square.payments(
      process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID,
      process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID
    );
  }

  return paymentsInstance;
}

export async function createPayment(amount: number) {
  if (!paymentsInstance) {
    throw new Error('Square Payments not initialized');
  }

  try {
    const card = await paymentsInstance.card();
    await card.attach('#card-container');

    const result = await card.tokenize();
    if (result.status === 'OK' && result.token) {
      return result.token;
    } else {
      throw new Error(result.errors?.[0]?.message || 'Payment tokenization failed');
    }
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
} 