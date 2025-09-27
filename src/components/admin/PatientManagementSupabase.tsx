import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users,
  UserPlus,
  Search,
  Edit,
  Trash2,
  Phone,
  Mail,
  Calendar,
  MapPin,
  FileText,
  Shield,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePatients } from "@/hooks/useSupabase";
import { Patient } from "@/lib/supabase";

const PatientManagementSupabase = () => {
  const { toast } = useToast();
  const { patients, loading, addPatient, updatePatient, deletePatient } = usePatients();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    date_of_birth: string;
    address: string;
    medical_history: string;
    insurance_info: string;
    status: "active" | "inactive";
  }>({
    name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    address: "",
    medical_history: "",
    insurance_info: "",
    status: "active"
  });

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPatient) {
        await updatePatient(editingPatient.id, formData);
        setEditingPatient(null);
      } else {
        await addPatient(formData);
      }
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        date_of_birth: "",
        address: "",
        medical_history: "",
        insurance_info: "",
        status: "active"
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving patient:', error);
    }
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      date_of_birth: patient.date_of_birth,
      address: patient.address,
      medical_history: patient.medical_history,
      insurance_info: patient.insurance_info,
      status: patient.status
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this patient?')) {
      await deletePatient(id);
    }
  };

  const handleCancel = () => {
    setEditingPatient(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      date_of_birth: "",
      address: "",
      medical_history: "",
      insurance_info: "",
      status: "active"
    });
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-dental-blue" />
        <span className="ml-2 text-dental-gray">Loading patients...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center space-x-2">
            <Users className="w-6 h-6 text-dental-blue" />
            <span>Patient Management</span>
          </h2>
          <p className="text-dental-gray">Manage patient records with Supabase integration</p>
        </div>
        
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-dental-gray" />
            <Input
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-dental-blue-light focus:border-dental-blue"
            />
          </div>
          
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button variant="dental" onClick={() => setShowAddForm(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingPatient ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
                <DialogDescription>
                  {editingPatient ? 'Update patient information' : 'Enter patient details to add them to the system'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="border-dental-blue-light focus:border-dental-blue"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="border-dental-blue-light focus:border-dental-blue"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                      className="border-dental-blue-light focus:border-dental-blue"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                      required
                      className="border-dental-blue-light focus:border-dental-blue"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="border-dental-blue-light focus:border-dental-blue"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="insurance_info">Insurance Information</Label>
                  <Input
                    id="insurance_info"
                    value={formData.insurance_info}
                    onChange={(e) => setFormData({...formData, insurance_info: e.target.value})}
                    className="border-dental-blue-light focus:border-dental-blue"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="medical_history">Medical History</Label>
                  <Textarea
                    id="medical_history"
                    value={formData.medical_history}
                    onChange={(e) => setFormData({...formData, medical_history: e.target.value})}
                    className="border-dental-blue-light focus:border-dental-blue"
                    rows={3}
                  />
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button type="submit" variant="dental" className="flex-1">
                    {editingPatient ? 'Update Patient' : 'Add Patient'}
                  </Button>
                  <Button type="button" variant="dental-outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Patient Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-dental-blue-light">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-dental-blue">{patients.length}</p>
              <p className="text-dental-gray text-sm">Total Patients</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-dental-blue-light">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-success">
                {patients.filter(p => p.status === 'active').length}
              </p>
              <p className="text-dental-gray text-sm">Active Patients</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-dental-blue-light">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-dental-mint">{filteredPatients.length}</p>
              <p className="text-dental-gray text-sm">Search Results</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patients List */}
      <Card className="border-dental-blue-light">
        <CardHeader>
          <CardTitle className="text-dental-blue">Patient Records</CardTitle>
          <CardDescription>Complete list of all registered patients from Supabase</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPatients.length > 0 ? (
            <div className="space-y-4">
              {filteredPatients.map((patient) => (
                <Card key={patient.id} className="border-dental-blue-light">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-dental-blue-light rounded-full">
                            <Users className="w-4 h-4 text-dental-blue" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{patient.name}</h3>
                            <p className="text-sm text-dental-gray">Born: {patient.date_of_birth}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-dental-gray" />
                            <span className="text-dental-gray">{patient.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-dental-gray" />
                            <span className="text-dental-gray">{patient.phone}</span>
                          </div>
                          {patient.address && (
                            <div className="flex items-center space-x-2 md:col-span-2">
                              <MapPin className="w-4 h-4 text-dental-gray" />
                              <span className="text-dental-gray">{patient.address}</span>
                            </div>
                          )}
                          {patient.insurance_info && (
                            <div className="flex items-center space-x-2">
                              <Shield className="w-4 h-4 text-dental-gray" />
                              <span className="text-dental-gray">{patient.insurance_info}</span>
                            </div>
                          )}
                        </div>
                        
                        {patient.medical_history && (
                          <div className="mt-2">
                            <div className="flex items-start space-x-2">
                              <FileText className="w-4 h-4 text-dental-gray mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-foreground">Medical History:</p>
                                <p className="text-sm text-dental-gray">{patient.medical_history}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Badge variant={patient.status === 'active' ? 'default' : 'secondary'}>
                          {patient.status}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(patient)}
                            className="text-dental-blue hover:bg-dental-blue-light"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(patient.id)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-dental-gray mx-auto mb-4" />
              <p className="text-dental-gray">No patients found. Add your first patient to get started!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientManagementSupabase;