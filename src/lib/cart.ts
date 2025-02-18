import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabase';

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  name?: string;
  price?: number;
}

const CART_SESSION_KEY = 'funeral_cart_session';

export function getCartSession(): string {
  let sessionId = localStorage.getItem(CART_SESSION_KEY);
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem(CART_SESSION_KEY, sessionId);
  }
  return sessionId;
}

export async function getCartItems(): Promise<CartItem[]> {
  const sessionId = getCartSession();
  const { data: cartItems, error } = await supabase
    .from('cart_items')
    .select('*')
    .eq('session_id', sessionId);

  if (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }

  if (!cartItems || cartItems.length === 0) {
    return [];
  }

  // Fetch product details from our API
  const productIds = cartItems.map(item => item.product_id);
  const response = await fetch(`/api/cart?ids=${productIds.join(',')}`);
  if (!response.ok) {
    console.error('Error fetching product details:', await response.text());
    return cartItems;
  }

  const { items: products } = await response.json();
  const productMap = new Map(products.map((product: any) => [product.id, product]));

  // Combine cart items with product details
  return cartItems.map(item => {
    const product = productMap.get(item.product_id);
    return {
      ...item,
      name: product?.name,
      price: product?.price
    };
  });
}

export async function addToCart(productId: string, quantity: number = 1): Promise<void> {
  const sessionId = getCartSession();
  
  // Check if item already exists in cart
  const { data: existingItems } = await supabase
    .from('cart_items')
    .select('*')
    .eq('session_id', sessionId)
    .eq('product_id', productId)
    .single();

  if (existingItems) {
    // Update quantity if item exists
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: existingItems.quantity + quantity })
      .eq('id', existingItems.id);

    if (error) console.error('Error updating cart item:', error);
  } else {
    // Insert new item if it doesn't exist
    const { error } = await supabase
      .from('cart_items')
      .insert([
        {
          session_id: sessionId,
          product_id: productId,
          quantity
        }
      ]);

    if (error) console.error('Error adding item to cart:', error);
  }
}

export async function updateCartItemQuantity(itemId: string, quantity: number): Promise<void> {
  if (quantity < 1) {
    await removeFromCart(itemId);
    return;
  }

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId)
    .eq('session_id', getCartSession());

  if (error) console.error('Error updating cart item quantity:', error);
}

export async function removeFromCart(itemId: string): Promise<void> {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId)
    .eq('session_id', getCartSession());

  if (error) console.error('Error removing item from cart:', error);
}

export async function clearCart(): Promise<void> {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('session_id', getCartSession());

  if (error) console.error('Error clearing cart:', error);
} 