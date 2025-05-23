-- Create profiles table to extend Supabase auth with custom fields
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('patient', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create admin_settings table for doctor availability rules
CREATE TABLE admin_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_duration_minutes INTEGER NOT NULL DEFAULT 30,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (admin_user_id, day_of_week)
);

-- Create blocked_periods table
CREATE TABLE blocked_periods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_period CHECK (start_datetime < end_datetime)
);

-- Create appointments table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  admin_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ NOT NULL,
  reason_for_visit TEXT,
  status TEXT NOT NULL CHECK (status IN ('booked', 'cancelled_by_patient', 'cancelled_by_admin', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_appointment_time CHECK (start_datetime < end_datetime)
);

-- Create index for efficient queries
CREATE INDEX idx_appointments_patient ON appointments (patient_user_id);
CREATE INDEX idx_appointments_admin ON appointments (admin_user_id);
CREATE INDEX idx_appointments_datetime ON appointments (start_datetime, end_datetime);
CREATE INDEX idx_blocked_periods_admin ON blocked_periods (admin_user_id);
CREATE INDEX idx_blocked_periods_datetime ON blocked_periods (start_datetime, end_datetime);

-- Create Row Level Security Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can view admin profiles"
ON profiles FOR SELECT
USING (role = 'admin');

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Admin settings policies
CREATE POLICY "Admins can manage their own settings"
ON admin_settings FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = admin_user_id
  AND profiles.role = 'admin'
  AND profiles.id = auth.uid()
));

CREATE POLICY "Patients can view admin settings"
ON admin_settings FOR SELECT
USING (true);

-- Blocked periods policies
CREATE POLICY "Admins can manage their own blocked periods"
ON blocked_periods FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = admin_user_id
  AND profiles.role = 'admin'
  AND profiles.id = auth.uid()
));

CREATE POLICY "Patients can view blocked periods"
ON blocked_periods FOR SELECT
USING (true);

-- Appointments policies
CREATE POLICY "Patients can view and create their own appointments"
ON appointments FOR SELECT
USING (auth.uid() = patient_user_id OR EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = admin_user_id
  AND profiles.role = 'admin'
  AND profiles.id = auth.uid()
));

CREATE POLICY "Patients can create their own appointments"
ON appointments FOR INSERT
WITH CHECK (auth.uid() = patient_user_id);

CREATE POLICY "Patients can update their own appointments"
ON appointments FOR UPDATE
USING (auth.uid() = patient_user_id);

CREATE POLICY "Admins can manage all appointments with them"
ON appointments FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = admin_user_id
  AND profiles.role = 'admin'
  AND profiles.id = auth.uid()
));

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_settings_updated_at
BEFORE UPDATE ON admin_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blocked_periods_updated_at
BEFORE UPDATE ON blocked_periods
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
