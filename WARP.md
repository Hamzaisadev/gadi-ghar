# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development
```bash
# Start development server with Turbopack (faster builds)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code with ESLint
npm run lint
```

### Database Operations
```bash
# Generate Prisma client (runs automatically after npm install)
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Open Prisma Studio to view/edit database
npx prisma studio

# Reset database (destructive - use with caution)
npx prisma migrate reset

# Deploy migrations to production
npx prisma migrate deploy
```

### Development Workflow
```bash
# Full setup for new development environment
npm install
npx prisma migrate dev
npm run dev

# Database schema changes workflow
# 1. Modify schema.prisma
# 2. Run migration
npx prisma migrate dev --name your_migration_name
# 3. Generate client (happens automatically)
```

## Required Environment Variables

Create a `.env.local` file with these required variables:

```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..." # For Prisma migrations

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# Image Storage (Supabase)
NEXT_PUBLIC_SUPABASE_URL="https://...supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# AI Features (Google Generative AI)
GEMINI_API_KEY="AIzaSy..." # For AI image search

# Security (Arcjet - Rate limiting)
ARCJET_KEY="ajkey_..." # For rate limiting and security
```

## Project Architecture

### High-Level Structure
This is a **Next.js 15 App Router** car marketplace application with three distinct user flows:
- **Public users**: Browse cars, save favorites, book test drives
- **Dealership admins**: Manage their car inventory and dealership settings
- **Platform admins**: Oversee the entire platform, approve dealerships

### Key Architectural Components

#### Route Groups & Layouts
- `app/(main)/` - Public-facing pages (cars, about, contact, etc.)
- `app/(admin)/` - Admin/dealership dashboard with role-based access
- `app/(auth)/` - Authentication pages
- `app/(dealership)/` - Dealership-specific functionality

#### Authentication & Authorization
- **Clerk** for user authentication and session management
- **Role-based access control** with three levels:
  - `USER` - Regular users
  - `DEALERSHIP_ADMIN` - Can manage dealership cars and settings
  - `ADMIN` - Platform administrators
- Middleware (`middleware.js`) handles route protection

#### Database Architecture (Prisma + PostgreSQL)
- **Car model**: Uses `minPrice/maxPrice` range instead of single price for Pakistani market
- **User roles**: Hierarchical permissions with dealership associations
- **Dealership applications**: Full workflow for dealership onboarding and approval
- **Test drive bookings**: Complete scheduling system with status tracking

#### Price Filtering Logic
Cars use price ranges (`minPrice`/`maxPrice`) instead of fixed prices. When filtering:
```sql
WHERE minPrice <= userMaxFilter AND maxPrice >= userMinFilter
```
This ensures all cars whose price range overlaps with user selection are shown.

### Key Features & Integrations

#### AI-Powered Features
- **AI Image Search**: Users can upload car photos to find similar vehicles
- **Rate limiting**: 10 requests per hour per IP for AI image processing
- **Car recognition**: AI extracts make, body type, color, and confidence score

#### External Services
- **Clerk**: Authentication and user management
- **Supabase**: Image storage for car photos and dealership logos
- **Google Generative AI**: AI-powered features (image recognition, description generation)
- **Arcjet**: Security and rate limiting (10 requests/hour for AI features)

#### UI Framework
- **Tailwind CSS** with custom car-themed color palette (`car-red`, `car-black`, etc.)
- **Shadcn/ui** components (New York style, JSX not TSX)
- **Radix UI** components for accessible UI primitives
- **Framer Motion** for animations
- **Sonner** for toast notifications
- **React Hook Form + Zod** for form validation
- **Next View Transitions** for smooth page transitions

### File Structure Patterns

#### Components Organization
- `components/` - Reusable UI components (Header, Navbar, car-card, etc.)
- `components/ui/` - Shadcn/ui components (button, dialog, card, etc.)
- `components/sections/` - Page sections (HeroSection, FeaturedCars, etc.)
- `components/utils/` - Utility components (FormatCurrency, pageWrapper, etc.)
- `hooks/` - Custom React hooks (`use-fetch.jsx`)
- Route-specific components often live within their route directories

#### Business Logic
- `app/actions/` - Server actions organized by feature (admin.js, cars.js, dealership.js)
- `lib/` - Shared utilities and configurations
  - `lib/prisma.js` - Database client singleton
  - `lib/data.js` - Static data and constants
  - `lib/auth.js` - Authentication helpers

#### API Architecture
Uses **Next.js App Router Server Actions** instead of traditional API routes for most backend operations.

### Environment Requirements
- **Node.js >= 18.0.0** (specified in package.json engines)
- **PostgreSQL database** (local or hosted)
- **Environment variables** for Clerk, Supabase, database URLs

### Pakistani Market Specifics
- All prices displayed in **PKR (Pakistani Rupees)**
- Dealership locations focused on **Karachi**
- Business logic adapted for local car market practices (price ranges vs fixed prices)
- FAQ content tailored for Pakistani users

### Development Notes
- Uses **Turbopack** for faster development builds
- Implements **Content Security Policy** headers for security
- Supports both manual and AI-generated car images
- Test drive booking system with time slot management
- Dealership approval workflow with admin oversight
- **No testing framework** currently configured (consider adding Jest/Vitest)
- **No deployment configuration** files (consider adding Docker/CI-CD)
- **No code formatting** tools configured (consider adding Prettier)

### Missing Development Features (Recommendations)

#### Testing
- No test files or testing framework configured
- Consider adding Jest or Vitest for unit/integration tests
- Consider adding Playwright or Cypress for E2E tests

#### Code Quality
- No Prettier configuration for code formatting
- No pre-commit hooks (consider Husky + lint-staged)
- No TypeScript (currently using JSX)

#### Deployment
- No Dockerfile or deployment configuration
- No CI/CD pipeline configuration
- No production environment documentation

### Database Migrations
When making schema changes:
1. Always backup production data first
2. Test migrations locally with `npx prisma migrate dev`
3. Use descriptive migration names
4. Review generated SQL before applying to production

### Server Actions Overview

The project uses Next.js App Router Server Actions instead of API routes:

- `app/actions/admin.js` - Admin operations (user management, platform oversight)
- `app/actions/cars.js` - Car CRUD operations, search, filtering
- `app/actions/dealership.js` - Dealership management, applications, approval workflow
- `app/actions/home.js` - Homepage data, featured cars, AI image search
- `app/actions/car-listing.js` - Car listing operations
- `app/actions/settings.js` - User and dealership settings

### Security Implementation

- **Clerk middleware** protects routes requiring authentication
- **Role-based access control** in page components and server actions
- **Arcjet rate limiting** (10 requests/hour) for AI image processing
- **Content Security Policy** headers for XSS protection
- **Environment variable validation** for API keys

### Custom Hooks & Utilities

- `hooks/use-fetch.jsx` - Generic data fetching hook with loading/error states
- `components/utils/FormatCurrency.js` - PKR currency formatting
- `components/utils/FormatPriceRange.js` - Price range display utilities
- `lib/helper.js` - Car data serialization and validation utilities
