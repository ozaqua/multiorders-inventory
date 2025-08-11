# INVENTREE PLUS - Advanced Inventory Management

A comprehensive inventory management system built with Next.js 14, TypeScript, Prisma, and PostgreSQL. This professional application supports multi-platform e-commerce inventory management with advanced bundle tracking for eBay, Shopify, and Etsy.

## Features

- **Dashboard Analytics**: Real-time metrics, sales charts, and order status tracking
- **Inventory Management**: Product catalog with warehouse stock tracking
- **Multi-Platform Support**: Integration with major e-commerce platforms
- **Order Management**: Complete order lifecycle management
- **Customer Management**: Customer database with order history
- **Bundle Products**: Support for bundled products with component tracking
- **Supplier Management**: Track suppliers and purchase information
- **Real-time Updates**: Live inventory and stock level monitoring

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Prisma ORM, PostgreSQL
- **Deployment**: Vercel with Vercel Postgres
- **Icons**: Lucide React
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or Vercel Postgres)

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd inventree-plus
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Update `.env` with your database connection string:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/inventree_plus"
```

### Database Setup

1. Generate Prisma client
```bash
npm run db:generate
```

2. Push schema to database
```bash
npm run db:push
```

3. Seed the database with sample data
```bash
npm run db:seed
```

4. (Optional) Open Prisma Studio to view data
```bash
npm run db:studio
```

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment on Vercel

### 1. Create Vercel Postgres Database

1. Go to your Vercel dashboard
2. Create a new Postgres database
3. Copy the connection string

### 2. Set Environment Variables

In your Vercel project settings, add:
```
DATABASE_URL=<your-vercel-postgres-url>
```

### 3. Deploy

```bash
# Deploy to Vercel
vercel --prod

# Or connect your GitHub repository for automatic deployments
```

### 4. Run Database Migration

After deployment, you need to set up your database:

```bash
# Connect to your production database and run
npx prisma db push
npx prisma db seed
```

## Database Schema

The application uses the following main entities:

- **Products**: Core product information with multi-platform pricing
- **WarehouseStock**: Inventory levels and warehouse locations
- **Customers**: Customer information with order history
- **Orders**: Order management with platform integration
- **Suppliers**: Supplier information and relationships
- **BundleComponents**: Support for bundled products
- **PlatformIntegrations**: Platform API connections

## API Routes

The application uses Server Actions and database functions:

- `/lib/database/products.ts` - Product operations
- `/lib/database/customers.ts` - Customer operations  
- `/lib/database/orders.ts` - Order operations
- `/lib/database/dashboard.ts` - Analytics and metrics

## Prisma Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes to database
npm run db:push

# Create and run migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/inventree_plus"

# Authentication (optional)
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Platform API Keys (for integrations)
AMAZON_ACCESS_KEY=""
AMAZON_SECRET_KEY=""
EBAY_CLIENT_ID=""
EBAY_CLIENT_SECRET=""
SHOPIFY_API_KEY=""
SHOPIFY_SECRET=""
WIX_API_KEY=""
ETSY_API_KEY=""

# Encryption
ENCRYPTION_KEY="your-32-character-encryption-key"
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
