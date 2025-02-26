# OrcaWorks - Construction Budget Management

OrcaWorks is a budget management application specifically designed for construction companies. It allows creating detailed budgets with proper cost calculations, margin analysis, and financial tracking.

## Features

- Project management with multiple budgets
- Chapter-based organization of budget items
- Built-in calculations for costs, margins, and sales prices
- Detailed internal control section for business metrics
- User authentication and data persistence with Supabase
- Real-time data storage and synchronization

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Supabase account (for database and authentication)

### Installation

1. Clone the repository
```
git clone <repository-url>
cd orcaworks
```

2. Install dependencies
```
npm install
```

3. Create a Supabase project at [supabase.com](https://supabase.com)

4. Set up environment variables by creating a `.env` file in the root directory:
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Run database migrations
   - Go to your Supabase project's SQL Editor
   - Copy the contents of `migrations/01_initial_schema.sql`
   - Paste into the SQL Editor and run the query

6. Start the development server
```
npm start
```

## Database Schema

The application uses the following database tables:

- **profiles**: Extends the auth.users table with additional user information
- **projects**: Stores budget projects information
- **chapters**: Stores budget chapters, linked to projects
- **budget_items**: Stores individual budget items, linked to chapters
- **internal_control**: Stores internal control data for each project
- **project_settings**: Stores configuration settings for each project

## Authentication

The application uses Supabase Authentication, which provides:

- Email and password authentication
- Social authentication (can be enabled through Supabase)
- JWT-based auth with secure, httpOnly cookies
- Row Level Security (RLS) policies ensure users can only access their own data

## Development

### Project Structure

- `src/components/`: React components
  - `auth/`: Authentication components
  - `budget/`: Budget-related components
  - `layout/`: Layout components
  - `modals/`: Modal components
- `src/context/`: React contexts
  - `AuthContext.js`: Authentication state management
  - `BudgetContext.js`: Budget state management
- `src/services/`: API services
  - `projectService.js`: Project CRUD operations
  - `budgetService.js`: Budget item and chapter operations
- `src/lib/`: Utility functions and libraries
  - `supabase.js`: Supabase client configuration
- `migrations/`: Database migration files

### Adding Features

1. Create or modify components in the appropriate directories
2. Update services to interact with the Supabase database
3. Modify contexts as needed to manage state

## Production Deployment

1. Update your .env file with production Supabase credentials

2. Build the application
```
npm run build
```

3. Deploy the `build` directory to your hosting provider