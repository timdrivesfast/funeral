import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Ensure the URL is properly formatted with https protocol
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.trim();

// Validate and format URL
let formattedUrl = supabaseUrl;
if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
  formattedUrl = `https://${formattedUrl}`;
}

try {
  new URL(formattedUrl);
} catch (error) {
  throw new Error(`Invalid NEXT_PUBLIC_SUPABASE_URL: ${formattedUrl}`);
}

export const supabase = createClient(
  formattedUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false
    },
    db: {
      schema: 'public'
    }
  }
);

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number | null;
  image_url: string;
  category: 'jewelry' | 'packaging';
  created_at: string;
}; 