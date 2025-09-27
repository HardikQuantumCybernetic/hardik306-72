
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Plus, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppointments, usePatients } from "@/hooks/useSupabase";

const AppointmentScheduling = ({ doctors = [], onClose }: AppointmentSchedulingProps) => {
  const { toast } = useToast();
  const { addAppointment } = useAppointments();
  const { patients } = usePatients();
  
  const [formData, setFormData] = useState({
    patient_id: '',
    appointment_date: '',
    appointment_time: '',
    service_type: '',
    doctor: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceTypes = [
    'Regular Cleaning',
    'Dental Examination',
    'Teeth Whitening',
    'Root Canal',
    'Tooth Extraction',
    'Dental Filling',
    'Crown Installation',
    'Orthodontic Consultation',
    'Emergency Treatment'
  ];

  const doctors = [
    'Dr. Smith',
    'Dr. Johnson',
    'Dr. Williams',
    'Dr. Brown',
    'Dr. Davis'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patient_id || !formData.appointment_date || !formData.appointment_time || !formData.service_type || !formData.doctor) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await addAppointment({
        patient_id: formData.patient_id,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        service_type: formData.service_type,
        doctor: formData.doctor,
        notes: formData.notes,
        status: 'scheduled'
      });

      toast({
        title: "Success",
        description: "Appointment scheduled successfully!",
      });

      // Reset form
      setFormData({
        patient_id: '',
        appointment_date: '',
        appointment_time: '',
        service_type: '',
        doctor: '',
        notes: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule appointment",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateTimeSlots = () => {
    const slots: { value: string; label: string }[] = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const value = `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}:00`;
        const labelHours = ((hour + 11) % 12) + 1;
        const ampm = hour < 12 ? 'AM' : 'PM';
        const label = `${labelHours}:${minute.toString().padStart(2, '0')} ${ampm}`;
        slots.push({ value, label });
      }
    }
    return slots;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Schedule New Appointment</h2>
          <p className="text-dental-gray">Book appointments for your patients</p>
        </div>
      </div>

      <Card className="border-dental-blue-light">
        <CardHeader className="bg-gradient-to-r from-dental-blue to-dental-mint text-white">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Appointment Details</span>
          </CardTitle>
          <CardDescription className="text-dental-blue-light">
            Fill in the appointment information below
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Selection */}
              <div className="space-y-2">
                <Label htmlFor="patient" className="text-sm font-medium flex items-center space-x-2">
                  <User className="w-4 h-4 text-dental-blue" />
                  <span>Select Patient *</span>
                </Label>
                <Select value={formData.patient_id} onValueChange={(value) => handleInputChange('patient_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name} - {patient.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Selection */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-dental-blue" />
                  <span>Appointment Date *</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.appointment_date}
                  onChange={(e) => handleInputChange('appointment_date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full"
                />
              </div>

              {/* Time Selection */}
              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-medium flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-dental-blue" />
                  <span>Appointment Time *</span>
                </Label>
                <Select value={formData.appointment_time} onValueChange={(value) => handleInputChange('appointment_time', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {generateTimeSlots().map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Service Type */}
              <div className="space-y-2">
                <Label htmlFor="service" className="text-sm font-medium flex items-center space-x-2">
                  <Plus className="w-4 h-4 text-dental-blue" />
                  <span>Service Type *</span>
                </Label>
                <Select value={formData.service_type} onValueChange={(value) => handleInputChange('service_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Doctor Selection */}
              <div className="space-y-2">
                <Label htmlFor="doctor" className="text-sm font-medium flex items-center space-x-2">
                  <User className="w-4 h-4 text-dental-blue" />
                  <span>Assigned Doctor *</span>
                </Label>
                <Select value={formData.doctor} onValueChange={(value) => handleInputChange('doctor', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor} value={doctor}>
                        {doctor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes" className="text-sm font-medium">
                  Additional Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Any special instructions or notes..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                variant="dental" 
                disabled={isSubmitting}
                className="px-8 py-2 flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isSubmitting ? 'Scheduling...' : 'Schedule Appointment'}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentScheduling;
