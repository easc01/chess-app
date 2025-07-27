# Chess Application - MonoChess

## Overview

MonoChess is a single-player chess application where users can play against an AI opponent with varying difficulty levels. The application features a clean, modern interface built with React and TypeScript, using shadcn/ui components for consistent styling. Users can track their game statistics, view game history, and enjoy both light and dark themes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: Zustand for global state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Chess Logic**: chess.js library for game rules and validation
- **Animations**: Framer Motion for smooth UI transitions
- **Data Fetching**: TanStack Query (React Query) for server state management

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Development**: Vite for development server and build tooling
- **Database**: Configured for PostgreSQL with Drizzle ORM
- **Session Storage**: Currently using in-memory storage with interface for database integration
- **API**: RESTful API structure with `/api` prefix

### Build System
- **Frontend Build**: Vite with React plugin
- **Backend Build**: esbuild for server bundling
- **Development**: Hot module replacement via Vite
- **TypeScript**: Strict mode enabled with path mapping

## Key Components

### Game Engine
- **Chess Logic**: Implemented using chess.js for move validation and game state
- **AI Engine**: Custom chess engine with difficulty-based move selection
  - Easy: Random moves
  - Medium: Prioritizes captures with some randomness
  - Hard: Advanced evaluation including captures and checks
- **Move Validation**: Server-side and client-side validation for game integrity

### User Interface
- **Chess Board**: Interactive 8x8 grid with piece rendering using Unicode symbols
- **Game Controls**: Move selection, difficulty selection, game management
- **Modals**: Difficulty selection, game end results, user interactions
- **Theme Support**: Light/dark mode with system preference detection

### Data Management
- **Local Storage**: User preferences, game history, and statistics
- **State Stores**: 
  - Game Store: Current game state, moves, AI logic
  - User Store: User profile, statistics, preferences
- **Schema Validation**: Zod schemas for type safety and validation

## Data Flow

### Game Flow
1. User selects difficulty level through modal
2. New game initializes with Chess.js instance
3. User makes moves through board interaction
4. Moves validated and applied to game state
5. AI calculates and executes response move
6. Game continues until checkmate, stalemate, or forfeit
7. Final score calculated and statistics updated

### Data Persistence
1. User data stored in localStorage with async interface
2. Game history maintained locally with structured format
3. Statistics calculated and cached for performance
4. Theme preferences persisted across sessions

## External Dependencies

### Core Libraries
- **React Ecosystem**: React, React DOM, React Router (Wouter)
- **State Management**: Zustand for client state
- **Chess Engine**: chess.js for game logic
- **UI Framework**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with class-variance-authority
- **Animations**: Framer Motion for transitions
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns for time formatting

### Development Tools
- **Build Tools**: Vite, esbuild, TypeScript
- **Database**: Drizzle ORM with PostgreSQL support
- **Session**: connect-pg-simple for PostgreSQL sessions
- **Development**: Replit-specific plugins for development environment

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with HMR
- **Database**: Configured for PostgreSQL connection via DATABASE_URL
- **Environment Variables**: Environment-specific configuration
- **Replit Integration**: Specialized plugins for Replit development environment

### Production Build
- **Frontend**: Static assets built to `dist/public`
- **Backend**: Server bundle compiled to `dist/index.js`
- **Database Migrations**: Drizzle migrations in `migrations/` directory
- **Static Serving**: Express serves built frontend assets

### Database Setup
- **ORM**: Drizzle configured for PostgreSQL
- **Schema**: Defined in `shared/schema.ts` with Zod validation
- **Migrations**: Generated and managed via drizzle-kit
- **Connection**: Neon Database serverless driver for PostgreSQL

The application is designed as a full-stack TypeScript application with clear separation between client and server code, shared type definitions, and a scalable architecture that can easily transition from in-memory storage to full database persistence.