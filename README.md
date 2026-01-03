# PrimoJobs - Product Management Portal

A modern, dual-interface product catalog system with admin management capabilities and user-friendly product discovery. Built with React, TypeScript, and Tailwind CSS, featuring a premium dark theme with teal/cyan accents inspired by modern AI dashboard aesthetics.

## Features

### Admin Dashboard
- **Product Management**: Add, edit, and delete products with a comprehensive form
- **Rich Product Details**: Manage product names, descriptions, usage instructions, and external links
- **Real-time Updates**: Instant feedback with toast notifications
- **Responsive Grid Layout**: Beautiful card-based interface that adapts to all screen sizes
- **Floating Action Button**: Quick access to add products on mobile devices

### User Portal
- **Product Discovery**: Browse through all available products in an elegant grid layout
- **Real-time Search**: Instant search functionality with debounced filtering
- **Product Details**: Immersive full-page view for each product with complete information
- **External Links**: Direct access to product pages with prominent CTAs
- **Responsive Design**: Optimized experience across desktop, tablet, and mobile

## Design System

### Color Palette
- **Background**: Deep navy gradient (#0a1628 → #051018)
- **Primary Accent**: Electric teal (#00d9b8 / #1affce)
- **Text**: White (#ffffff) for headings, light gray (#b8c5d6) for body
- **Cards**: Glassmorphic dark panels with backdrop blur and teal border glow

### Typography
- **Display/Headings**: Space Grotesk (800 weight)
- **Subheadings**: Outfit (600 weight)
- **Body Text**: Manrope (400/500 weight)
- **Monospace**: JetBrains Mono (400 weight)

### Visual Effects
- Glassmorphism with backdrop blur
- Teal glow effects on hover and focus
- Smooth animations with Framer Motion
- Noise texture overlay for depth
- Ambient gradient backgrounds

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: Radix UI primitives with shadcn/ui
- **Animations**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router v6
- **Icons**: Lucide React
- **State Management**: React Context API
- **Data Persistence**: Supabase Database

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local development URL

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Navigation.tsx  # Top navigation bar
│   ├── ProductCard.tsx # User-facing product card
│   ├── AdminProductCard.tsx # Admin product card
│   ├── ProductFormModal.tsx # Add/Edit product form
│   └── EmptyState.tsx  # Empty state component
├── contexts/           # React Context providers
│   └── ProductContext.tsx # Product state management
├── pages/              # Page components
│   ├── UserPortal.tsx  # User product browsing
│   ├── AdminDashboard.tsx # Admin management
│   └── ProductDetail.tsx # Product detail view
├── types/              # TypeScript type definitions
│   └── product.ts      # Product types
├── App.tsx             # Main app component
└── index.css           # Global styles
```

## Routes

- `/` - User Portal (product browsing and search)
- `/admin` - Admin Dashboard (product management)
- `/:productname/:id` - Product Detail Page (SEO-friendly URLs)

## Data Storage

Products are stored in Supabase database, providing real-time sync across all devices and browsers. Data persists in the cloud and is accessible from anywhere.

## Key Features Implementation

### Search Functionality
Real-time search with debouncing filters products by name and description, providing instant results as you type.

### Form Validation
Comprehensive validation using Zod schema:
- Product name: Required, max 100 characters
- Description: Required, max 500 characters
- Usage instructions: Required
- External link: Valid URL format required

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Adaptive layouts for all screen sizes
- Touch-optimized interactions

### Animations
- Page transitions with fade effects
- Staggered card entrance animations
- Hover effects with scale and glow
- Loading states with skeleton screens

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT

