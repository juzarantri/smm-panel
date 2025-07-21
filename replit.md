# SMM Panel - Social Media Marketing Platform

## Overview

This is a modern SMM (Social Media Marketing) panel application built with React, Express, and PostgreSQL. The platform allows users to purchase social media marketing services like Instagram followers, YouTube views, TikTok likes, etc. The application features a responsive design with shadcn/ui components and follows modern web development practices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Style**: RESTful API endpoints
- **Middleware**: Built-in Express middleware for JSON parsing and logging
- **Error Handling**: Centralized error handling middleware

### Database Architecture
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations
- **Connection**: @neondatabase/serverless for serverless PostgreSQL

## Key Components

### Database Schema
- **Users**: User accounts with Google OAuth integration, balance tracking, and admin flags
- **Service Categories**: Platform categories (Instagram, YouTube, TikTok, Facebook, etc.)
- **Services**: Individual marketing services with pricing and delivery details
- **Orders**: Purchase tracking with status management and pricing

### API Endpoints
- `GET /api/categories` - Fetch all service categories
- `GET /api/services` - Fetch all available services
- `GET /api/categories/:id/services` - Fetch services by category
- `GET /api/orders` - Fetch user orders (placeholder for auth)
- `POST /api/orders` - Create new orders (placeholder for auth)

### UI Components
- Comprehensive component library using shadcn/ui
- Theme provider for dark/light mode switching
- Responsive design with mobile-first approach
- Form components with React Hook Form integration
- Toast notifications and error handling

### Authentication (Planned)
- Google OAuth integration (UI components present, backend pending)
- Session management with PostgreSQL session store
- Protected routes and user authorization

## Data Flow

1. **Client Requests**: Frontend makes API calls using TanStack Query
2. **API Processing**: Express server handles requests with proper error handling
3. **Database Operations**: Drizzle ORM manages type-safe database interactions
4. **Response Handling**: Structured JSON responses with proper status codes
5. **State Management**: TanStack Query caches and manages server state
6. **UI Updates**: React components automatically re-render based on query state

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe SQL query builder
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI component primitives
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **drizzle-kit**: Database schema management
- **@replit/vite-plugin-cartographer**: Replit integration

## Deployment Strategy

### Development
- **Command**: `npm run dev` runs the server with tsx in development mode
- **Hot Reload**: Vite handles frontend hot module replacement
- **Database**: Drizzle Kit manages schema changes with `npm run db:push`

### Production Build
- **Frontend**: Vite builds optimized client bundle to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Assets**: Static files served from the build directory

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment mode (development/production)
- **Port**: Configurable server port (defaults based on environment)

### Key Architectural Decisions

1. **Monorepo Structure**: Single repository with `client/`, `server/`, and `shared/` directories for better code organization and type sharing
2. **TypeScript Throughout**: Full TypeScript implementation for type safety across frontend, backend, and shared schemas
3. **Drizzle ORM**: Chosen for type-safe database operations and excellent TypeScript integration over traditional ORMs
4. **shadcn/ui**: Provides consistent, accessible, and customizable UI components while maintaining design system flexibility
5. **TanStack Query**: Handles server state management, caching, and data synchronization more effectively than traditional state management
6. **Vite**: Selected for faster development experience and optimized production builds compared to Create React App
7. **Memory Storage Fallback**: Implements in-memory storage for development/testing while maintaining the same interface as database storage