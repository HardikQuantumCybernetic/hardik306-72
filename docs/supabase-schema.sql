-- Supabase SQL Schema for Dental Practice Management System (Updated)
-- Run these queries in your Supabase SQL Editor to set up or align the database

-- 1) Core tables -------------------------------------------------------------

-- Patients
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) NOT NULL,
  date_of_birth DATE NOT NULL,
  address TEXT,
  medical_history TEXT,
  insurance_info VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  patient_id TEXT UNIQUE
);

-- Appointments
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  service_type VARCHAR(255) NOT NULL,
  doctor VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no-show')),
  notes TEXT
);

-- Treatments (optional legacy)
CREATE TABLE IF NOT EXISTS public.treatments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  treatment_type VARCHAR(255) NOT NULL,
  description TEXT,
  cost DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'in-progress', 'completed'))
);

-- Practice settings
CREATE TABLE IF NOT EXISTS public.practice_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2) New feature tables ------------------------------------------------------

-- Feedback (real-time)
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  patient_name TEXT NOT NULL,
  patient_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  message TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed')),
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL
);

-- Doctors (used by appointment scheduling)
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  specialty TEXT,
  email TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Services catalog (used by patient_services)
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  default_cost NUMERIC DEFAULT 0,
  category TEXT DEFAULT 'general'
);

-- Patient services (TODO/treatment plan)
CREATE TABLE IF NOT EXISTS public.patient_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  assigned_cost NUMERIC DEFAULT 0,
  notes TEXT,
  scheduled_date DATE,
  completed_date DATE
);

-- Patient financials (3 financial slots)
CREATE TABLE IF NOT EXISTS public.patient_financials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  patient_id UUID NOT NULL UNIQUE REFERENCES public.patients(id) ON DELETE CASCADE,
  total_treatment_cost NUMERIC DEFAULT 0,
  amount_paid_by_patient NUMERIC DEFAULT 0,
  remaining_from_patient NUMERIC DEFAULT 0,
  amount_due_to_doctor NUMERIC DEFAULT 0,
  notes TEXT
);

-- 3) RLS ---------------------------------------------------------------------
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_financials ENABLE ROW LEVEL SECURITY;

-- Simple admin-like access policies (adjust as needed)
CREATE POLICY IF NOT EXISTS "Allow admin access to patients" ON public.patients FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow admin access to appointments" ON public.appointments FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow admin access to treatments" ON public.treatments FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow admin access to practice_settings" ON public.practice_settings FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow admin access to feedback" ON public.feedback FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow admin access to doctors" ON public.doctors FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow admin access to services" ON public.services FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow admin access to patient_services" ON public.patient_services FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow admin access to patient_financials" ON public.patient_financials FOR ALL USING (true);

-- 4) Triggers & functions ----------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

-- Auto-set updated_at
DROP TRIGGER IF EXISTS update_feedback_updated_at ON public.feedback;
CREATE TRIGGER update_feedback_updated_at
  BEFORE UPDATE ON public.feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_patient_services_updated_at ON public.patient_services;
CREATE TRIGGER update_patient_services_updated_at
  BEFORE UPDATE ON public.patient_services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_patient_financials_updated_at ON public.patient_financials;
CREATE TRIGGER update_patient_financials_updated_at
  BEFORE UPDATE ON public.patient_financials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Generated patient_id (unique)
CREATE OR REPLACE FUNCTION public.generate_patient_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id TEXT;
  counter INTEGER := 1;
BEGIN
  LOOP
    new_id := 'P' || LPAD(counter::TEXT, 6, '0');
    IF NOT EXISTS (SELECT 1 FROM public.patients WHERE patient_id = new_id) THEN
      RETURN new_id;
    END IF;
    counter := counter + 1;
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_patient_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.patient_id IS NULL THEN
    NEW.patient_id := public.generate_patient_id();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS patients_set_id ON public.patients;
CREATE TRIGGER patients_set_id
  BEFORE INSERT ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.set_patient_id();

-- Optional: auto-create a financial record for new patients
CREATE OR REPLACE FUNCTION public.create_patient_financial_record()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.patient_financials (
    patient_id, total_treatment_cost, amount_paid_by_patient, remaining_from_patient, amount_due_to_doctor, notes
  ) VALUES (
    NEW.id, 0, 0, 0, 0, 'Initial financial record created automatically'
  ) ON CONFLICT (patient_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_create_patient_financial_record ON public.patients;
CREATE TRIGGER trigger_create_patient_financial_record
  AFTER INSERT ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.create_patient_financial_record();

-- 5) Indexes -----------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_patients_email ON public.patients(email);
CREATE INDEX IF NOT EXISTS idx_patients_status ON public.patients(status);
CREATE INDEX IF NOT EXISTS idx_patients_patient_id ON public.patients(patient_id);

CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);

CREATE INDEX IF NOT EXISTS idx_treatments_patient_id ON public.treatments(patient_id);
CREATE INDEX IF NOT EXISTS idx_treatments_appointment_id ON public.treatments(appointment_id);

CREATE INDEX IF NOT EXISTS idx_feedback_patient_id ON public.feedback(patient_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_patient_services_patient_id ON public.patient_services(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_services_service_id ON public.patient_services(service_id);
CREATE INDEX IF NOT EXISTS idx_patient_services_status ON public.patient_services(status);

CREATE INDEX IF NOT EXISTS idx_patient_financials_patient_id ON public.patient_financials(patient_id);

-- 6) Seed data (optional) ----------------------------------------------------
INSERT INTO public.doctors (name, specialty, email, phone)
VALUES
('Dr. Smith', 'General Dentistry', 'dr.smith@dentalclinic.com', '(555) 123-4567'),
('Dr. Johnson', 'Orthodontics', 'dr.johnson@dentalclinic.com', '(555) 234-5678'),
('Dr. Brown', 'Oral Surgery', 'dr.brown@dentalclinic.com', '(555) 345-6789')
ON CONFLICT DO NOTHING;

INSERT INTO public.services (name, description, default_cost, category) VALUES
('Regular Cleaning', 'Routine dental cleaning and examination', 150, 'preventive'),
('Cavity Filling', 'Tooth cavity filling treatment', 200, 'restorative'),
('Root Canal', 'Root canal therapy', 800, 'endodontic'),
('Crown Installation', 'Dental crown placement', 1200, 'restorative'),
('Tooth Extraction', 'Tooth removal procedure', 300, 'surgical'),
('Teeth Whitening', 'Professional teeth whitening', 400, 'cosmetic'),
('Orthodontic Consultation', 'Braces consultation', 100, 'orthodontic'),
('Emergency Care', 'Emergency dental treatment', 250, 'emergency')
ON CONFLICT DO NOTHING;