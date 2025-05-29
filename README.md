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

## Demo Accounts

### Admin Account

To access the admin dashboard, use the following credentials:

- Email: admin@example.com
- Password: admin

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
   ```
   # or
   ```bash
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   # or
   ```bash
   yarn dev
   ```

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

