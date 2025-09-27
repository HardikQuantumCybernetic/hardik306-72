-- Supabase SQL Schema for Dental Practice Management System
-- Run these queries in your Supabase SQL Editor to set up the database

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) NOT NULL,
  date_of_birth DATE NOT NULL,
  address TEXT,
  medical_history TEXT,
  insurance_info VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive'))
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  service_type VARCHAR(255) NOT NULL,
  doctor VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no-show')),
  notes TEXT
);

-- Create treatments table
CREATE TABLE IF NOT EXISTS treatments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  treatment_type VARCHAR(255) NOT NULL,
  description TEXT,
  cost DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'in-progress', 'completed'))
);

-- Create practice_settings table for admin settings
CREATE TABLE IF NOT EXISTS practice_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default practice settings
INSERT INTO practice_settings (setting_key, setting_value) VALUES
('practice_info', '{
  "name": "SmileCare Dental Practice",
  "address": "123 Main Street, Cityville, ST 12345",
  "phone": "(555) 123-DENT",
  "email": "info@smilecare.com",
  "website": "www.smilecare.com",
  "working_hours": "Mon-Fri: 8:00 AM - 6:00 PM",
  "description": "Providing quality dental care for over 20 years."
}'::jsonb),
('notifications', '{
  "email_reminders": true,
  "sms_reminders": true,
  "appointment_confirmations": true,
  "payment_reminders": true,
  "system_alerts": true,
  "marketing_emails": false
}'::jsonb),
('security', '{
  "two_factor_auth": true,
  "password_expiry": 90,
  "session_timeout": 30,
  "login_attempts": 3,
  "backup_frequency": "daily"
}'::jsonb),
('system', '{
  "theme": "light",
  "language": "English",
  "timezone": "America/New_York",
  "date_format": "MM/DD/YYYY",
  "currency": "USD",
  "auto_backup": true
}'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_treatments_patient_id ON treatments(patient_id);
CREATE INDEX IF NOT EXISTS idx_treatments_appointment_id ON treatments(appointment_id);

-- Enable Row Level Security (RLS)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_settings ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your authentication needs)
-- For now, allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON patients
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON appointments
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON treatments
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON practice_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for practice_settings
CREATE TRIGGER update_practice_settings_updated_at
    BEFORE UPDATE ON practice_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
INSERT INTO patients (name, email, phone, date_of_birth, address, medical_history, insurance_info, status) VALUES
('John Smith', 'john.smith@email.com', '(555) 123-4567', '1985-06-15', '123 Main St, City, State', 'No known allergies. Regular cleanings every 6 months.', 'Delta Dental', 'active'),
('Sarah Johnson', 'sarah.johnson@email.com', '(555) 987-6543', '1990-03-22', '456 Oak Ave, City, State', 'Sensitive to cold. Previous root canal.', 'Blue Cross Blue Shield', 'active'),
('Michael Brown', 'michael.brown@email.com', '(555) 456-7890', '1978-11-08', '789 Pine Rd, City, State', 'Diabetes. Regular monitoring required.', 'Aetna', 'active')
ON CONFLICT (email) DO NOTHING;

-- Insert sample appointments
INSERT INTO appointments (patient_id, appointment_date, appointment_time, service_type, doctor, status, notes)
SELECT 
  p.id,
  CURRENT_DATE + INTERVAL '7 days',
  '10:00:00',
  'Regular Cleaning',
  'Dr. Smith',
  'scheduled',
  'Regular checkup and cleaning'
FROM patients p
WHERE p.email = 'john.smith@email.com'
ON CONFLICT DO NOTHING;