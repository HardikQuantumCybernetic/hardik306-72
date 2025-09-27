import { supabase } from '@/integrations/supabase/client'

export { supabase }

// Database types for the dental practice
export type Patient = {
  id: string
  created_at: string
  name: string
  email: string
  phone: string
  date_of_birth: string
  address: string
  medical_history: string
  insurance_info: string
  status: 'active' | 'inactive'
}

export type Appointment = {
  id: string
  created_at: string
  patient_id: string
  appointment_date: string
  appointment_time: string
  service_type: string
  doctor: string
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show'
  notes: string
}

export type Treatment = {
  id: string
  created_at: string
  patient_id: string
  appointment_id: string
  treatment_type: string
  description: string
  cost: number
  status: 'planned' | 'in-progress' | 'completed'
}

// Helper functions for database operations
export const patientService = {
  async getAll() {
    console.log('🔍 Fetching patients from Supabase...')
    
    // Check authentication status
    const { data: authData } = await supabase.auth.getUser()
    console.log('🔐 Auth status:', authData?.user ? 'Authenticated' : 'Not authenticated')
    
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false })
    
    console.log('📊 Patients query result:', { data, error, count: data?.length })
    
    if (error) {
      console.error('❌ Patient fetch error:', error)
      throw error
    }
    return data as Patient[]
  },

  async create(patient: Omit<Patient, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('patients')
      .insert([patient])
      .select()
      .single()
    
    if (error) throw error
    return data as Patient
  },

  async update(id: string, updates: Partial<Patient>) {
    const { data, error } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Patient
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

export const appointmentService = {
  async getAll() {
    try {
      console.log('🔍 Fetching appointments from Supabase...')
      
      // Check authentication status
      const { data: authData } = await supabase.auth.getUser()
      console.log('🔐 Auth status for appointments:', authData?.user ? 'Authenticated' : 'Not authenticated')
      
      // Get appointments with patient data using a simpler approach
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true })
      
      console.log('📊 Appointments query result:', { appointments, appointmentsError, count: appointments?.length })
      
      if (appointmentsError) {
        console.error('Appointments error:', appointmentsError)
        throw appointmentsError
      }

      // Get patient data separately and merge
      const { data: patients, error: patientsError } = await supabase
        .from('patients')
        .select('id, name, email, phone')
      
      if (patientsError) {
        console.error('Patients error:', patientsError)
        throw patientsError
      }

      // Merge appointment and patient data
      const appointmentsWithPatients = appointments?.map(appointment => {
        const patient = patients?.find(p => p.id === appointment.patient_id)
        return {
          ...appointment,
          patient_name: patient?.name || 'Unknown Patient',
          patient_email: patient?.email,
          patient_phone: patient?.phone
        }
      }) || []

      console.log('Merged appointments data:', appointmentsWithPatients)
      return appointmentsWithPatients
    } catch (error) {
      console.error('Error in appointmentService.getAll:', error)
      throw error
    }
  },

  async create(appointment: Omit<Appointment, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointment])
      .select()
      .single()
    
    if (error) throw error
    return data as Appointment
  },

  async update(id: string, updates: Partial<Appointment>) {
    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Appointment
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}