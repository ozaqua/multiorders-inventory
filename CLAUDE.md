# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a multi-platform inventory management system inspired by Ricemill Inventory, designed to synchronize inventory across Shopify and eBay stores. The application replicates the core functionality seen in the reference screenshots.

## Development Commands

```bash
# Start development server
npm run dev

# Build production version
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## Technology Stack

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS with custom sidebar theme
- **APIs**: Shopify Admin API, eBay API integrations (planned)
- **Database**: PostgreSQL with Prisma ORM (to be added)

## Application Architecture

### Core Features (Based on Reference App)
1. **Dashboard**: Activity feed, recent changes, user welcome
2. **Inventory Management**: Product catalog with images, stock levels, bundle conversion
3. **Multi-Channel Integration**: Shopify and eBay synchronization
4. **Purchase Management**: Supplier orders, import/export functionality
5. **Supplier Management**: Contact details, order history
6. **Channel Configuration**: Store setup, location mapping, sync settings

### Directory Structure
```
src/
├── app/                 # Next.js App Router pages
│   ├── dashboard/       # Main dashboard with activity feed
│   ├── inventory/       # Product catalog and bundle management
│   ├── purchases/       # Purchase orders and supplier management
│   ├── suppliers/       # Supplier database
│   ├── channels/        # Shopify/eBay integration settings
│   └── settings/        # Application configuration
├── components/          # Reusable UI components
│   ├── sidebar/         # Navigation sidebar (dark theme)
│   ├── inventory/       # Product tables, bundle converter
│   └── forms/           # Form components
├── lib/                 # Utilities and API clients
│   ├── shopify/         # Shopify API integration
│   ├── ebay/           # eBay API integration
│   └── database/        # Database models and queries
└── types/              # TypeScript type definitions
```

## Key UI Patterns (From Reference)

- **Sidebar Navigation**: Dark theme (#1f2937) with icons and labels
- **Data Tables**: Clean rows with product images, status badges, search/filter
- **Status Indicators**: Color-coded badges (green=active, yellow=pending, etc.)
- **Bundle Management**: Convert products to bundles with component selection
- **Empty States**: Centered messages with "Clear all filters" actions
- **Forms**: Clean layouts with proper validation and dropdown selectors

## Integration Requirements

### Shopify API
- Admin API access for inventory sync
- Location mapping for multi-store support
- Automatic quantity updates and order sync

### eBay API
- Developer API for listing management
- Inventory synchronization
- Order processing integration

## Development Notes

- The reference app uses location mapping to sync inventory between Ricemill and Shopify locations
- Bundle conversion is a key feature allowing products to be converted to bundles with multiple components
- Real-time inventory updates across platforms prevent overselling
- The UI follows a clean, professional design with consistent spacing and typography