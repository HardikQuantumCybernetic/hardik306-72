import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Settings,
  User,
  Users,
  Bell,
  Shield,
  Database,
  Mail,
  Phone,
  MapPin,
  Building,
  Clock,
  Palette,
  Save,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const { toast } = useToast();
  
  // Load settings from localStorage on component mount
  const [practiceSettings, setPracticeSettings] = useState(() => {
    const saved = localStorage.getItem('practiceSettings');
    return saved ? JSON.parse(saved) : {
      practiceName: "Hardik Dental Practice",
      address: "Near [landmark or notable location]",
      phone: "(808) 095-0921",
      email: "info@hardikdental.com",
      website: "www.hardikdental.com",
      workingHours: "Mon-Fri: 9 AM - 6 PM, Sat: 10 AM - 2 PM",
      description: "Providing comprehensive dental care with state-of-the-art technology and compassionate service."
    };
  });

  // User Management State
  const [users, setUsers] = useState([
    { id: 1, name: "Dr. Smith", email: "dr.smith@clinic.com", role: "Admin", status: "Active" },
    { id: 2, name: "Sarah Johnson", email: "sarah@clinic.com", role: "Receptionist", status: "Active" },
    { id: 3, name: "Dr. Brown", email: "dr.brown@clinic.com", role: "Dentist", status: "Active" }
  ]);

  // Load notification settings from localStorage
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notificationSettings');
    return saved ? JSON.parse(saved) : {
      emailReminders: true,
      smsReminders: true,
      appointmentConfirmations: true,
      paymentReminders: true,
      systemAlerts: true,
      marketingEmails: false
    };
  });

  // Load security settings from localStorage
  const [security, setSecurity] = useState(() => {
    const saved = localStorage.getItem('securitySettings');
    return saved ? JSON.parse(saved) : {
      twoFactorAuth: true,
      passwordExpiry: 90,
      sessionTimeout: 30,
      loginAttempts: 3,
      backupFrequency: "daily",
      encryptionEnabled: true,
      auditLogging: true
    };
  });

  // Load system settings from localStorage
  const [system, setSystem] = useState(() => {
    const saved = localStorage.getItem('systemSettings');
    return saved ? JSON.parse(saved) : {
      theme: "light",
      language: "English",
      timezone: "America/New_York",
      dateFormat: "MM/DD/YYYY",
      currency: "USD",
      autoBackup: true,
      performanceMode: "balanced",
      debugMode: false
    };
  });

  const [showPasswords, setShowPasswords] = useState(false);

  const handleSavePracticeSettings = async () => {
    try {
      // Validate required fields
      if (!practiceSettings.practiceName || !practiceSettings.email || !practiceSettings.phone) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields (Practice Name, Email, Phone).",
          variant: "destructive"
        });
        return;
      }

      // Save to localStorage
      localStorage.setItem('practiceSettings', JSON.stringify(practiceSettings));
      
      // Also save to session storage for immediate use
      sessionStorage.setItem('currentPracticeSettings', JSON.stringify(practiceSettings));
      
      toast({
        title: "Practice Settings Saved",
        description: "Your practice information has been updated successfully.",
      });
    } catch (error) {
      console.error('Failed to save practice settings:', error);
      toast({
        title: "Error",
        description: "Failed to save practice settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddUser = () => {
    const newUser = {
      id: users.length + 1,
      name: "New User",
      email: "newuser@clinic.com",
      role: "Receptionist",
      status: "Active"
    };
    setUsers([...users, newUser]);
    toast({
      title: "User Added",
      description: "New user has been added successfully.",
    });
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "User Deleted",
      description: "User has been removed from the system.",
      variant: "destructive"
    });
  };

  const handleSaveNotifications = async () => {
    try {
      localStorage.setItem('notificationSettings', JSON.stringify(notifications));
      sessionStorage.setItem('currentNotificationSettings', JSON.stringify(notifications));
      
      // Log the settings change for security audit
      const auditLog = {
        action: 'notification_settings_updated',
        timestamp: new Date().toISOString(),
        user: 'admin',
        changes: notifications
      };
      
      const existingLogs = JSON.parse(localStorage.getItem('auditLogs') || '[]');
      existingLogs.push(auditLog);
      localStorage.setItem('auditLogs', JSON.stringify(existingLogs.slice(-100))); // Keep last 100 logs
      
      toast({
        title: "Notification Settings Saved",
        description: "Your notification preferences have been updated successfully.",
      });
    } catch (error) {
      console.error('Failed to save notification settings:', error);
      toast({
        title: "Error",
        description: "Failed to save notification settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSaveSecurity = async () => {
    try {
      // Validate security settings
      if (security.passwordExpiry < 30) {
        toast({
          title: "Security Warning",
          description: "Password expiry should be at least 30 days for security.",
          variant: "destructive"
        });
        return;
      }

      if (security.sessionTimeout < 5) {
        toast({
          title: "Security Warning", 
          description: "Session timeout should be at least 5 minutes.",
          variant: "destructive"
        });
        return;
      }

      localStorage.setItem('securitySettings', JSON.stringify(security));
      sessionStorage.setItem('currentSecuritySettings', JSON.stringify(security));
      
      // Log security changes
      const auditLog = {
        action: 'security_settings_updated',
        timestamp: new Date().toISOString(),
        user: 'admin',
        changes: security,
        importance: 'critical'
      };
      
      const existingLogs = JSON.parse(localStorage.getItem('auditLogs') || '[]');
      existingLogs.push(auditLog);
      localStorage.setItem('auditLogs', JSON.stringify(existingLogs.slice(-100)));
      
      toast({
        title: "Security Settings Saved",
        description: "Your security configuration has been updated successfully.",
      });
    } catch (error) {
      console.error('Failed to save security settings:', error);
      toast({
        title: "Error",
        description: "Failed to save security settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSaveSystem = async () => {
    try {
      localStorage.setItem('systemSettings', JSON.stringify(system));
      sessionStorage.setItem('currentSystemSettings', JSON.stringify(system));
      
      // Apply theme changes immediately
      if (system.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (system.theme === 'light') {
        document.documentElement.classList.remove('dark');
      }
      
      // Log system changes
      const auditLog = {
        action: 'system_settings_updated',
        timestamp: new Date().toISOString(),
        user: 'admin',
        changes: system
      };
      
      const existingLogs = JSON.parse(localStorage.getItem('auditLogs') || '[]');
      existingLogs.push(auditLog);
      localStorage.setItem('auditLogs', JSON.stringify(existingLogs.slice(-100)));
      
      toast({
        title: "System Settings Saved",
        description: "Your system preferences have been updated successfully.",
      });
    } catch (error) {
      console.error('Failed to save system settings:', error);
      toast({
        title: "Error",
        description: "Failed to save system settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleExportSettings = () => {
    const settings = {
      practice: practiceSettings,
      notifications,
      security,
      system,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Settings Exported",
      description: "Your settings have been exported successfully.",
    });
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          // Update states with imported settings
          if (importedSettings.practice) setPracticeSettings(importedSettings.practice);
          if (importedSettings.notifications) setNotifications(importedSettings.notifications);
          if (importedSettings.security) setSecurity(importedSettings.security);
          if (importedSettings.system) setSystem(importedSettings.system);
          
          toast({
            title: "Settings Imported",
            description: "Your settings have been imported successfully.",
          });
        } catch (error) {
          toast({
            title: "Import Failed",
            description: "Failed to import settings. Please check the file format.",
            variant: "destructive"
          });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center space-x-2">
            <Settings className="w-6 h-6 text-dental-blue" />
            <span>Admin Settings</span>
          </h2>
          <p className="text-dental-gray">Manage system configuration and preferences</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="dental-outline" onClick={handleExportSettings}>
            <Download className="w-4 h-4 mr-2" />
            Export Settings
          </Button>
          <label htmlFor="import-settings">
            <Button variant="dental-outline" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Import Settings
              </span>
            </Button>
          </label>
          <input
            id="import-settings"
            type="file"
            accept=".json"
            onChange={handleImportSettings}
            className="hidden"
          />
        </div>
      </div>

      <Tabs defaultValue="practice" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="practice" className="flex items-center space-x-2">
            <Building className="w-4 h-4" />
            <span>Practice</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center space-x-2">
            <Database className="w-4 h-4" />
            <span>System</span>
          </TabsTrigger>
        </TabsList>

        {/* Practice Settings */}
        <TabsContent value="practice">
          <Card className="border-dental-blue-light">
            <CardHeader>
              <CardTitle className="text-dental-blue">Practice Information</CardTitle>
              <CardDescription>Manage your dental practice details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="practiceName">Practice Name</Label>
                  <Input
                    id="practiceName"
                    value={practiceSettings.practiceName}
                    onChange={(e) => setPracticeSettings({...practiceSettings, practiceName: e.target.value})}
                    className="border-dental-blue-light focus:border-dental-blue"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={practiceSettings.email}
                    onChange={(e) => setPracticeSettings({...practiceSettings, email: e.target.value})}
                    className="border-dental-blue-light focus:border-dental-blue"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={practiceSettings.phone}
                    onChange={(e) => setPracticeSettings({...practiceSettings, phone: e.target.value})}
                    className="border-dental-blue-light focus:border-dental-blue"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={practiceSettings.website}
                    onChange={(e) => setPracticeSettings({...practiceSettings, website: e.target.value})}
                    className="border-dental-blue-light focus:border-dental-blue"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={practiceSettings.address}
                  onChange={(e) => setPracticeSettings({...practiceSettings, address: e.target.value})}
                  className="border-dental-blue-light focus:border-dental-blue"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="workingHours">Working Hours</Label>
                  <Input
                    id="workingHours"
                    value={practiceSettings.workingHours}
                    onChange={(e) => setPracticeSettings({...practiceSettings, workingHours: e.target.value})}
                    className="border-dental-blue-light focus:border-dental-blue"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Practice Description</Label>
                <Textarea
                  id="description"
                  value={practiceSettings.description}
                  onChange={(e) => setPracticeSettings({...practiceSettings, description: e.target.value})}
                  className="border-dental-blue-light focus:border-dental-blue"
                  rows={3}
                />
              </div>

              <Button variant="dental" onClick={handleSavePracticeSettings}>
                <Save className="w-4 h-4 mr-2" />
                Save Practice Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Management */}
        <TabsContent value="users">
          <Card className="border-dental-blue-light">
            <CardHeader>
              <CardTitle className="text-dental-blue">User Management</CardTitle>
              <CardDescription>Manage system users and their access levels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-foreground">Current Users</h3>
                <Button variant="dental" onClick={handleAddUser}>
                  <User className="w-4 h-4 mr-2" />
                  Add New User
                </Button>
              </div>

              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-dental-blue-light rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-dental-blue-light rounded-full">
                        <User className="w-4 h-4 text-dental-blue" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-dental-gray">{user.email} • {user.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'Active' ? 'bg-success/10 text-success' : 'bg-dental-gray/10 text-dental-gray'
                      }`}>
                        {user.status}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card className="border-dental-blue-light">
            <CardHeader>
              <CardTitle className="text-dental-blue">Notification Preferences</CardTitle>
              <CardDescription>Configure how and when notifications are sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <Label htmlFor={key} className="text-base font-medium">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Label>
                    <p className="text-sm text-dental-gray">
                      {key === 'emailReminders' && 'Send appointment reminders via email'}
                      {key === 'smsReminders' && 'Send appointment reminders via SMS'}
                      {key === 'appointmentConfirmations' && 'Send appointment confirmations'}
                      {key === 'paymentReminders' && 'Send payment due reminders'}
                      {key === 'systemAlerts' && 'Receive system maintenance alerts'}
                      {key === 'marketingEmails' && 'Send promotional marketing emails'}
                    </p>
                  </div>
                  <Switch
                    id={key}
                    checked={Boolean(value)}
                    onCheckedChange={(checked) => setNotifications({...notifications, [key]: checked})}
                  />
                </div>
              ))}
              
              <Separator />
              
              <Button variant="dental" onClick={handleSaveNotifications}>
                <Save className="w-4 h-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card className="border-dental-blue-light">
            <CardHeader>
              <CardTitle className="text-dental-blue">Security Configuration</CardTitle>
              <CardDescription>Manage security policies and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={security.passwordExpiry}
                    onChange={(e) => setSecurity({...security, passwordExpiry: parseInt(e.target.value)})}
                    className="border-dental-blue-light focus:border-dental-blue"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={security.sessionTimeout}
                    onChange={(e) => setSecurity({...security, sessionTimeout: parseInt(e.target.value)})}
                    className="border-dental-blue-light focus:border-dental-blue"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                  <Input
                    id="loginAttempts"
                    type="number"
                    value={security.loginAttempts}
                    onChange={(e) => setSecurity({...security, loginAttempts: parseInt(e.target.value)})}
                    className="border-dental-blue-light focus:border-dental-blue"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <select
                    id="backupFrequency"
                    value={security.backupFrequency}
                    onChange={(e) => setSecurity({...security, backupFrequency: e.target.value})}
                    className="w-full p-2 border border-dental-blue-light rounded-md focus:border-dental-blue focus:outline-none"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Two-Factor Authentication</Label>
                  <p className="text-sm text-dental-gray">Require 2FA for all admin users</p>
                </div>
                <Switch
                  checked={security.twoFactorAuth}
                  onCheckedChange={(checked) => setSecurity({...security, twoFactorAuth: checked})}
                />
              </div>

              <Button variant="dental" onClick={handleSaveSecurity}>
                <Save className="w-4 h-4 mr-2" />
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system">
          <Card className="border-dental-blue-light">
            <CardHeader>
              <CardTitle className="text-dental-blue">System Preferences</CardTitle>
              <CardDescription>Configure system-wide settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <select
                    id="theme"
                    value={system.theme}
                    onChange={(e) => setSystem({...system, theme: e.target.value})}
                    className="w-full p-2 border border-dental-blue-light rounded-md focus:border-dental-blue focus:outline-none"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    value={system.language}
                    onChange={(e) => setSystem({...system, language: e.target.value})}
                    className="w-full p-2 border border-dental-blue-light rounded-md focus:border-dental-blue focus:outline-none"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    value={system.timezone}
                    onChange={(e) => setSystem({...system, timezone: e.target.value})}
                    className="w-full p-2 border border-dental-blue-light rounded-md focus:border-dental-blue focus:outline-none"
                  >
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <select
                    id="dateFormat"
                    value={system.dateFormat}
                    onChange={(e) => setSystem({...system, dateFormat: e.target.value})}
                    className="w-full p-2 border border-dental-blue-light rounded-md focus:border-dental-blue focus:outline-none"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    value={system.currency}
                    onChange={(e) => setSystem({...system, currency: e.target.value})}
                    className="w-full p-2 border border-dental-blue-light rounded-md focus:border-dental-blue focus:outline-none"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Auto Backup</Label>
                  <p className="text-sm text-dental-gray">Automatically backup system data</p>
                </div>
                <Switch
                  checked={system.autoBackup}
                  onCheckedChange={(checked) => setSystem({...system, autoBackup: checked})}
                />
              </div>

              <Button variant="dental" onClick={handleSaveSystem}>
                <Save className="w-4 h-4 mr-2" />
                Save System Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;