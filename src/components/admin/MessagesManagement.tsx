import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Mail,
  Search,
  Download,
  Eye,
  User,
  CheckCircle
} from "lucide-react";
import { downloadCSV, downloadExcel } from "@/utils/downloadUtils";
import { useToast } from "@/hooks/use-toast";
import { useFeedback } from "@/hooks/useSupabaseExtended";

const MessagesManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();
  const { feedback, loading, updateFeedback } = useFeedback();

  // Filter only contact messages
  const contactMessages = useMemo(() => {
    return feedback.filter(item => item.category === 'contact');
  }, [feedback]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": 
        return "bg-dental-blue text-white";
      case "reviewed": 
        return "bg-success text-white";
      default: 
        return "bg-dental-gray text-white";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredMessages = useMemo(() => {
    return contactMessages.filter(message => {
      const matchesSearch = searchTerm === "" || 
        message.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.patient_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === "all" || message.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [contactMessages, searchTerm, filterStatus]);

  const handleViewMessage = (messageId: string) => {
    const message = feedback.find(f => f.id === messageId);
    if (message) {
      toast({
        title: `Message from ${message.patient_name}`,
        description: message.message.length > 150 ? message.message.substring(0, 150) + "..." : message.message,
      });
    }
  };

  const handleMarkAsReviewed = async (messageId: string) => {
    try {
      await updateFeedback(messageId, { status: 'reviewed' });
      toast({
        title: "Success",
        description: "Message marked as reviewed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update message status",
        variant: "destructive"
      });
    }
  };

  const handleExportMessages = (format: 'csv' | 'excel') => {
    const exportData = filteredMessages.map(message => ({
      'Name': message.patient_name,
      'Email': message.patient_email,
      'Message': message.message,
      'Date': formatDate(message.created_at),
      'Status': message.status
    }));

    if (format === 'csv') {
      downloadCSV(exportData, 'contact-messages-export');
    } else {
      downloadExcel(exportData, 'contact-messages-export');
    }
    
    toast({
      title: "Messages Exported",
      description: `Contact messages have been exported as ${format.toUpperCase()} successfully.`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-dental-blue">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-3 md:space-y-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Contact Messages</h2>
          <p className="text-dental-gray text-sm md:text-base">View and manage all contact form submissions in real-time</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="dental-outline" size="sm" onClick={() => handleExportMessages('csv')}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="dental-outline" size="sm" onClick={() => handleExportMessages('excel')}>
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <Card className="border-dental-blue-light">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div>
              <Label htmlFor="search" className="text-dental-blue font-medium mb-2 block text-sm">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-dental-gray" />
                <Input
                  id="search"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-dental-blue-light focus:border-dental-blue text-sm"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="filterStatus" className="text-dental-blue font-medium mb-2 block text-sm">
                Status
              </Label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 text-sm border border-dental-blue-light rounded-md focus:border-dental-blue focus:outline-none bg-background"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-dental-blue-light">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-dental-blue">{contactMessages.length}</p>
              <p className="text-dental-gray">Total Messages</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-dental-blue-light">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">{contactMessages.filter(m => m.status === 'new').length}</p>
              <p className="text-dental-gray">New Messages</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-dental-blue-light">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{filteredMessages.length}</p>
              <p className="text-dental-gray">Filtered Results</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages Table */}
      <Card className="border-dental-blue-light">
        <CardHeader>
          <CardTitle className="text-dental-blue">All Contact Messages</CardTitle>
          <CardDescription>Website contact form submissions with real-time updates</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredMessages.length > 0 ? (
            <div className="rounded-lg border border-dental-blue-light overflow-x-auto">
              <Table>
                <TableHeader className="bg-dental-blue-light">
                  <TableRow>
                    <TableHead className="font-semibold text-dental-blue text-xs md:text-sm whitespace-nowrap">Contact Info</TableHead>
                    <TableHead className="font-semibold text-dental-blue text-xs md:text-sm whitespace-nowrap">Message</TableHead>
                    <TableHead className="font-semibold text-dental-blue text-xs md:text-sm whitespace-nowrap">Date</TableHead>
                    <TableHead className="font-semibold text-dental-blue text-xs md:text-sm whitespace-nowrap">Status</TableHead>
                    <TableHead className="font-semibold text-dental-blue text-xs md:text-sm whitespace-nowrap">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.map((message) => (
                    <TableRow key={message.id} className="hover:bg-dental-blue-light/50">
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-dental-blue" />
                            <span className="font-medium text-foreground">{message.patient_name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-3 h-3 text-dental-gray" />
                            <span className="text-sm text-dental-gray">{message.patient_email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-md">
                          <p className="text-sm text-dental-gray line-clamp-2">{message.message}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-dental-gray whitespace-nowrap">{formatDate(message.created_at)}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(message.status)} text-xs`}>
                          {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-dental-blue hover:bg-dental-blue-light"
                            onClick={() => handleViewMessage(message.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {message.status === 'new' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-success hover:bg-success/10"
                              onClick={() => handleMarkAsReviewed(message.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 text-dental-gray mx-auto mb-4" />
              <p className="text-dental-gray">No contact messages found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagesManagement;
