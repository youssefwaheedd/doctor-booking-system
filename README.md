# Doctor Booking System

A modern web application for managing medical appointments, built with React, TypeScript, and Supabase.

## Overview

Doctor Booking System is a comprehensive appointment management system designed for healthcare providers and patients. It streamlines the appointment booking process, manages schedules, and provides a seamless experience for both doctors and patients.

## Features

### For Patients

- Book appointments with healthcare providers
- View and manage upcoming appointments
- Cancel appointments when needed
- Receive real-time availability updates
- Secure authentication and profile management

### For Healthcare Providers

- Manage availability and working hours
- View and manage patient appointments
- Block specific time periods for breaks or meetings
- Track appointment history and statistics
- Complete appointment management workflow

## Technical Stack

- **Frontend**: React with TypeScript
- **UI Framework**: Tailwind CSS with custom components
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **State Management**: React Context API
- **Routing**: React Router
- **Date/Time Handling**: date-fns
- **Form Handling**: React Hook Form
- **API Integration**: Supabase Client

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/doctor-booking-system.git
   cd doctor-booking-system
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Database Setup

1. Create a new Supabase project
2. Run the SQL commands from `src/database/schema.sql` in your Supabase SQL editor
3. Configure authentication settings in Supabase dashboard
4. Set up Row Level Security (RLS) policies as defined in the schema

## Project Structure

```
src/
├── components/        # Reusable UI components
├── contexts/         # React context providers
├── database/         # Database schema and migrations
├── hooks/           # Custom React hooks
├── integrations/    # Third-party integrations
├── pages/          # Page components
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Security

- Row Level Security (RLS) policies ensure data privacy
- Secure authentication via Supabase
- Protected routes for authenticated users
- Role-based access control (admin/patient)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.
