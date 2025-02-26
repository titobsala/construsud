# Database Migration Instructions

To set up the database for OrcaWorks, follow these steps:

1. Log into your Supabase account at https://app.supabase.com
2. Navigate to your project
3. Go to the SQL Editor
4. Create a new query
5. Copy the contents of `01_initial_schema.sql` and paste it into the SQL Editor
6. Run the query

## Schema Overview

- **profiles**: Extends the auth.users table with additional user information
- **projects**: Stores budget projects information
- **chapters**: Stores budget chapters, linked to projects
- **budget_items**: Stores individual budget items, linked to chapters
- **internal_control**: Stores internal control data for each project
- **project_settings**: Stores configuration settings for each project

## Security

The schema includes Row Level Security (RLS) policies that ensure:
- Users can only access their own data
- Data is properly secured based on ownership
- Relationships between tables maintain security constraints

## Automatic fields

The schema handles several things automatically:
- `created_at` timestamps are set when records are created
- `updated_at` timestamps are updated when records are modified
- User profiles are automatically created when users sign up