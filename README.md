This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Square Integration

This project uses Square APIs for product catalog, inventory management, and payment processing.

### Required Environment Variables

```
SQUARE_ACCESS_TOKEN=your_square_access_token
SQUARE_LOCATION_ID=your_square_location_id
NEXT_PUBLIC_SITE_URL=your_site_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SQUARE_WEBHOOK_SIGNATURE_KEY=your_webhook_signature_key
```

### Webhook Setup

For real-time inventory updates, configure a Square webhook:

1. Go to the [Square Developer Dashboard](https://developer.squareup.com/apps)
2. Select your application
3. Navigate to the Webhooks section
4. Add a new webhook endpoint:
   - URL: `https://your-domain.com/api/webhooks/square`
   - Event type: `inventory.count.updated`
5. Copy the Signature Key and add it to your environment variables as `SQUARE_WEBHOOK_SIGNATURE_KEY`

This webhook will automatically update your inventory when changes occur in Square, ensuring your website always displays accurate stock information.
