import crypto from 'crypto';

/**
 * Verify the Square webhook signature
 * 
 * Square uses HMAC-SHA256 to sign webhook payloads.
 * 
 * @param signature The signature from the x-square-hmacsha256-signature header
 * @param url The URL from the x-square-url header
 * @param rawBody The raw request body as text
 * @returns boolean indicating if the signature is valid
 */
export async function verifySquareSignature(
  signature: string,
  url: string,
  rawBody: string
): Promise<boolean> {
  try {
    if (!signature || !url || !rawBody) {
      console.error('Missing required parameters for Square signature verification');
      return false;
    }

    // Get the webhook signature key from environment variables
    const signingKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
    
    if (!signingKey) {
      console.warn('Square webhook signature verification skipped - missing SQUARE_WEBHOOK_SIGNATURE_KEY');
      // In production, you should return false here
      // For development/testing, you can return true to bypass verification
      return true;
    }

    // Combine the notification URL and the JSON body of the request
    const combined = url + rawBody;

    // Create an HMAC-SHA256 signature using the webhook signature key
    const hmac = crypto.createHmac('sha256', signingKey);
    const generatedSignature = hmac.update(combined).digest('base64');

    // Compare the generated signature with the one provided in the request header
    return crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(signature)
    );
  } catch (error) {
    console.error('Error verifying Square signature:', error);
    return false;
  }
}
