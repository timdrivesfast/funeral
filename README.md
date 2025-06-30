# E-commerce Store with Next.js and Square

A modern, full-stack e-commerce solution built with Next.js, Square, and Supabase. This project provides a solid foundation for building a production-ready online store with real-time inventory management, secure payments, and a seamless shopping experience.

## ✨ Features

- **Modern Stack**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Square Integration**: Seamless integration with Square for payments, inventory, and catalog management
- **Real-time Updates**: Live inventory tracking with Square webhooks
- **Authentication**: Secure user authentication with Supabase Auth
- **Responsive Design**: Mobile-first, responsive layout that works on all devices
- **Developer Friendly**: TypeScript support, clean code structure, and comprehensive documentation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Square Developer Account
- Supabase Account
- Stripe Account (for payment processing)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ecommerce-store.git
   cd ecommerce-store
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   Then update the values in `.env.local` with your credentials.

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 🔧 Configuration

### Required Environment Variables

```env
# Square Configuration
SQUARE_ACCESS_TOKEN=your_square_access_token
SQUARE_LOCATION_ID=your_square_location_id
SQUARE_ENVIRONMENT=sandbox  # or 'production' for live environment
SQUARE_WEBHOOK_SIGNATURE_KEY=your_webhook_signature_key

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### Square Integration

This project uses Square's APIs for:
- Product catalog management
- Inventory tracking
- Secure payment processing
- Order management

#### Webhook Setup

For real-time inventory updates, configure a Square webhook:

1. Go to the [Square Developer Dashboard](https://developer.squareup.com/apps)
2. Select your application
3. Navigate to the Webhooks section
4. Add a new webhook endpoint:
   - URL: `https://your-domain.com/api/webhooks/square`
   - Event type: `inventory.count.updated`
5. Copy the Signature Key and add it to your environment variables as `SQUARE_WEBHOOK_SIGNATURE_KEY`

## 🛠 Development

### Code Structure

```
src/
├── app/                    # Next.js 13+ app directory
│   ├── api/                # API routes
│   ├── components/         # Reusable UI components
│   ├── lib/                # Utility functions and API clients
│   └── styles/             # Global styles
```

### Common Issues

#### TypeScript Errors in square-server.ts

If you encounter TypeScript errors related to Square's API methods (like `createPaymentLink`, `searchCatalogObjects`, etc.), you may need to update the Square Node.js SDK or install the correct types:

```bash
npm install @square/square@latest
# or
yarn add @square/square@latest
```

#### Tailwind CSS Warnings

The warnings about `@tailwind` and `@apply` directives in `globals.css` are normal and can be safely ignored. They appear because the CSS linter doesn't recognize Tailwind's custom directives.

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fecommerce-store&env=SQUARE_ACCESS_TOKEN,SQUARE_LOCATION_ID,NEXT_PUBLIC_SITE_URL,NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SQUARE_WEBHOOK_SIGNATURE_KEY&envDescription=Environment%20variables%20needed%20to%20run%20the%20application&envLink=https%3A%2F%2Fgithub.com%2Fyourusername%2Fecommerce-store%23%EF%B8%8F-configuration&project-name=ecommerce-store&repository-name=ecommerce-store)

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework for Production
- [Square](https://squareup.com/) - For their amazing e-commerce APIs
- [Supabase](https://supabase.com/) - For the awesome open-source Firebase alternative
- [Tailwind CSS](https://tailwindcss.com/) - For the utility-first CSS framework
