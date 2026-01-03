# PrimoBoost Half Storage System

## Overview
The PrimoBoost application now uses a **Half Storage System** that divides your 150 product capacity into two separate halves of 75 products each. This allows for better organization and management of your product catalog.

## How It Works

### Storage Division
- **Total Capacity**: 150 products
- **Half 1**: 75 products maximum
- **Half 2**: 75 products maximum
- **Current Active Half**: Only one half is active at a time for adding/viewing products

### Admin Dashboard Features

#### Half Switcher Component
- **Visual Progress Bars**: See how many products are stored in each half
- **Capacity Indicators**: Shows current usage (e.g., "45/75")
- **Switch Between Halves**: Click to switch between Half 1 and Half 2
- **Color Coding**: 
  - Green: Space available
  - Red: Half is full
  - Blue: Currently active half

#### Product Management
- **Add Products**: Products are added to the currently active half
- **Edit/Delete**: Can manage products from the currently active half
- **Capacity Limits**: Cannot add more than 75 products to any single half

### User Portal Features
- **Half Indicator**: Shows which half is currently being displayed
- **Product Count**: Displays the number of products in the current half
- **Seamless Browsing**: Users see products from the currently active half

## Database Schema

### Products Table
```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  usage_instructions TEXT NOT NULL,
  external_link VARCHAR(500) NOT NULL,
  half INTEGER NOT NULL DEFAULT 1 CHECK (half IN (1, 2)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Key Fields
- `half`: Integer field (1 or 2) indicating which half the product belongs to
- Constraint ensures only values 1 or 2 are allowed
- Default value is 1 for new products

## Setup Instructions

### For New Installations
1. Run the main setup script: `supabase-setup.sql`
2. This will create the products table with the half column included

### For Existing Installations
1. **IMPORTANT**: If you already have products in your database, run the migration script first
2. Execute: `supabase-migration.sql`
3. This will:
   - Add the `half` column to existing products table
   - Distribute existing products between Half 1 and Half 2
   - Create necessary indexes

### Migration Details
The migration script will:
- Add the `half` column if it doesn't exist
- Distribute existing products alternately between halves
- Create performance indexes
- Show a summary of the distribution

## Usage Guide

### For Admins
1. **Login**: Use password "qwerty" to access admin dashboard
2. **View Half Status**: Check the Half Switcher component at the top
3. **Switch Halves**: Click "Switch to Half X" to change active half
4. **Add Products**: Products are added to the currently active half
5. **Monitor Capacity**: Watch the progress bars to avoid hitting limits

### For Users
1. **Browse Products**: See products from the currently active half
2. **Search**: Search works within the current half's products
3. **View Details**: Click on any product to see full details

## Benefits

### Organization
- **Logical Separation**: Organize products into two distinct groups
- **Capacity Management**: Better control over storage limits
- **Performance**: Faster queries when working with smaller subsets

### Flexibility
- **Easy Switching**: Quickly switch between product sets
- **Independent Management**: Each half can be managed separately
- **Scalable Design**: Foundation for future expansion

### User Experience
- **Clear Indicators**: Always know which half you're working with
- **Visual Feedback**: Progress bars show capacity usage
- **Intuitive Interface**: Simple switching between halves

## Technical Implementation

### Context Updates
- `ProductContext` now manages current half state
- New functions: `switchToHalf()`, `getHalfProducts()`, `getHalfCount()`
- Products are filtered by half before display

### Service Layer
- `productService` updated to handle half field
- Database queries include half filtering
- Type definitions updated for half support

### Components
- `HalfSwitcher`: New component for half management
- `AdminDashboard`: Integrated half switcher
- `UserPortal`: Shows current half indicator

## Troubleshooting

### Common Issues
1. **Products Not Showing**: Check if you're viewing the correct half
2. **Cannot Add Products**: Current half might be full (75 max)
3. **Missing Products**: They might be in the other half

### Solutions
1. **Switch Halves**: Use the Half Switcher in admin dashboard
2. **Check Capacity**: Look at the progress bars for space availability
3. **Run Migration**: If upgrading, ensure migration script was executed

## Future Enhancements
- Cross-half search functionality
- Bulk move products between halves
- Half-specific analytics and reporting
- Custom half naming/labeling

---

**Need Help?** Check the admin dashboard's Half Switcher component for real-time status and capacity information.