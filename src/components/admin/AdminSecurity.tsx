import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ValidatedInput } from "@/components/ui/validated-input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Key, Clock, Eye, Settings, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SecuritySettings {
  passwordExpiry: number;
  sessionTimeout: number;
  maxLoginAttempts: number;
  backupFrequency: string;
  twoFactorAuth: boolean;
  ipRestriction: boolean;
  auditLogging: boolean;
  dataEncryption: boolean;
}

const AdminSecurity = () => {
  const { toast } = useToast();
  const [security, setSecurity] = useState<SecuritySettings>({
    passwordExpiry: 90,
    sessionTimeout: 30,
    maxLoginAttempts: 3,
    backupFrequency: 'daily',
    twoFactorAuth: false,
    ipRestriction: false,
    auditLogging: true,
    dataEncryption: true
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('admin_security_settings');
    if (savedSettings) {
      setSecurity(JSON.parse(savedSettings));
    }
  }, []);

  const handleSaveSecurity = () => {
    // Validation
    if (security.passwordExpiry < 30 || security.passwordExpiry > 365) {
      toast({
        title: "Invalid Password Expiry",
        description: "Password expiry must be between 30 and 365 days.",
        variant: "destructive"
      });
      return;
    }

    if (security.sessionTimeout < 5 || security.sessionTimeout > 480) {
      toast({
        title: "Invalid Session Timeout",
        description: "Session timeout must be between 5 and 480 minutes.",
        variant: "destructive"
      });
      return;
    }

    // Save to localStorage and sessionStorage
    localStorage.setItem('admin_security_settings', JSON.stringify(security));
    sessionStorage.setItem('admin_security_settings', JSON.stringify(security));
    
    // Audit logging
    const auditLog = {
      action: 'Security Settings Updated',
      timestamp: new Date().toISOString(),
      user: 'admin',
      details: 'Security configuration updated'
    };
    const existingLogs = JSON.parse(localStorage.getItem('admin_audit_logs') || '[]');
    existingLogs.push(auditLog);
    localStorage.setItem('admin_audit_logs', JSON.stringify(existingLogs));

    toast({
      title: "Security Settings Saved",
      description: "Your security configuration has been updated successfully.",
    });
  };

  return (
    <Card className="border-dental-blue-light">
      <CardHeader>
        <CardTitle className="text-dental-blue flex items-center space-x-2">
          <Shield className="w-5 h-5" />
          <span>Security Configuration</span>
        </CardTitle>
        <CardDescription>Manage system security settings and access controls</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <ValidatedInput
            id="passwordExpiry"
            label="Password Expiry (days)"
            type="number"
            value={security.passwordExpiry.toString()}
            validation={{ type: 'number', required: true }}
            onValueChange={(value) => setSecurity({...security, passwordExpiry: parseInt(value) || 90})}
            className="border-dental-blue-light focus:border-dental-blue"
          />
          <ValidatedInput
            id="sessionTimeout"
            label="Session Timeout (minutes)"
            type="number"
            value={security.sessionTimeout.toString()}
            validation={{ type: 'number', required: true }}
            onValueChange={(value) => setSecurity({...security, sessionTimeout: parseInt(value) || 30})}
            className="border-dental-blue-light focus:border-dental-blue"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ValidatedInput
            id="maxLoginAttempts"
            label="Max Login Attempts"
            type="number"
            value={security.maxLoginAttempts.toString()}
            validation={{ type: 'number', required: true }}
            onValueChange={(value) => setSecurity({...security, maxLoginAttempts: parseInt(value) || 3})}
            className="border-dental-blue-light focus:border-dental-blue"
          />
          <div className="space-y-2">
            <Label htmlFor="backupFrequency">Backup Frequency</Label>
            <Select value={security.backupFrequency} onValueChange={(value) => setSecurity({...security, backupFrequency: value})}>
              <SelectTrigger className="border-dental-blue-light focus:border-dental-blue">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-foreground flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Security Features</span>
          </h4>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="twoFactorAuth" className="text-dental-gray">Two-Factor Authentication</Label>
              <Switch
                id="twoFactorAuth"
                checked={security.twoFactorAuth}
                onCheckedChange={(checked) => setSecurity({...security, twoFactorAuth: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="ipRestriction" className="text-dental-gray">IP Restriction</Label>
              <Switch
                id="ipRestriction"
                checked={security.ipRestriction}
                onCheckedChange={(checked) => setSecurity({...security, ipRestriction: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="auditLogging" className="text-dental-gray">Audit Logging</Label>
              <Switch
                id="auditLogging"
                checked={security.auditLogging}
                onCheckedChange={(checked) => setSecurity({...security, auditLogging: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="dataEncryption" className="text-dental-gray">Data Encryption</Label>
              <Switch
                id="dataEncryption"
                checked={security.dataEncryption}
                onCheckedChange={(checked) => setSecurity({...security, dataEncryption: checked})}
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t">
          <Button onClick={handleSaveSecurity} variant="dental" className="w-full md:w-auto">
            <Save className="w-4 h-4 mr-2" />
            Save Security Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminSecurity;