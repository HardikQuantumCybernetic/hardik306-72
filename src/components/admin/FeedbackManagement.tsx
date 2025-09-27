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
  MessageSquare,
  Star,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  User
} from "lucide-react";
import { downloadCSV, downloadExcel } from "@/utils/downloadUtils";
import { useToast } from "@/hooks/use-toast";

// Mock feedback data - would come from Supabase
const mockFeedbacks = [
  {
    id: 1,
    patientName: "John Smith",
    email: "john.smith@email.com",
    rating: 5,
    message: "Excellent service! The staff was very professional and the treatment was painless. Dr. Johnson explained everything clearly and made me feel comfortable throughout the procedure.",
    category: "service",
    createdAt: "2024-01-15T10:30:00Z",
    status: "new"
  },
  {
    id: 2,
    patientName: "Sarah Johnson",
    email: "sarah.j@email.com",
    rating: 4,
    message: "Very satisfied with my dental cleaning. The hygienist was gentle and thorough. The office is clean and modern. Only minor complaint is the waiting time.",
    category: "cleaning",
    createdAt: "2024-01-14T14:20:00Z",
    status: "reviewed"
  },
  {
    id: 3,
    patientName: "Mike Davis",
    email: "mike.davis@email.com",
    rating: 5,
    message: "Amazing experience! I was nervous about my root canal but Dr. Smith made it completely comfortable. The whole team is fantastic.",
    category: "treatment",
    createdAt: "2024-01-13T11:45:00Z",
    status: "reviewed"
  },
  {
    id: 4,
    patientName: "Emily Brown",
    email: "emily.brown@email.com",
    rating: 4,
    message: "Great dental practice. Very professional and caring staff. The appointment was on time and efficient. Highly recommend!",
    category: "general",
    createdAt: "2024-01-12T16:00:00Z",
    status: "new"
  }
];

const FeedbackManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();

  const getRatingColor = (rating: number) => {
    if (rating >= 5) return "text-success";
    if (rating >= 4) return "text-dental-mint";
    if (rating >= 3) return "text-warning";
    return "text-destructive";
  };

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

  const filteredFeedbacks = useMemo(() => {
    return mockFeedbacks.filter(feedback => {
      const matchesSearch = searchTerm === "" || 
        feedback.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.message.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRating = filterRating === "all" || feedback.rating.toString() === filterRating;
      const matchesStatus = filterStatus === "all" || feedback.status === filterStatus;
      
      return matchesSearch && matchesRating && matchesStatus;
    });
  }, [searchTerm, filterRating, filterStatus]);

  const averageRating = useMemo(() => {
    const total = filteredFeedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    return filteredFeedbacks.length > 0 ? (total / filteredFeedbacks.length).toFixed(1) : "0.0";
  }, [filteredFeedbacks]);

  const handleViewFeedback = (feedbackId: number) => {
    const feedback = mockFeedbacks.find(f => f.id === feedbackId);
    if (feedback) {
      toast({
        title: `Feedback from ${feedback.patientName}`,
        description: feedback.message.length > 100 ? feedback.message.substring(0, 100) + "..." : feedback.message,
      });
    }
  };

  const handleMarkAsReviewed = (feedbackId: number) => {
    toast({
      title: "Feedback Updated",
      description: "Feedback has been marked as reviewed.",
    });
  };

  const handleExportFeedbacks = (format: 'csv' | 'excel') => {
    const exportData = filteredFeedbacks.map(feedback => ({
      'Patient Name': feedback.patientName,
      Email: feedback.email,
      Rating: feedback.rating,
      Message: feedback.message,
      Category: feedback.category,
      'Date': formatDate(feedback.createdAt),
      Status: feedback.status
    }));

    if (format === 'csv') {
      downloadCSV(exportData, 'feedback-export');
    } else {
      downloadExcel(exportData, 'feedback-export');
    }
    
    toast({
      title: "Feedbacks Exported",
      description: `Feedback data has been exported as ${format.toUpperCase()} successfully.`,
    });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-3 md:space-y-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Feedback Management</h2>
          <p className="text-dental-gray text-sm md:text-base">Monitor and manage patient feedback and reviews</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="dental-outline" size="sm" className="font-inter text-xs md:text-sm" onClick={() => handleExportFeedbacks('csv')}>
            <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">CSV</span>
          </Button>
          <Button variant="dental-outline" size="sm" className="font-inter text-xs md:text-sm" onClick={() => handleExportFeedbacks('excel')}>
            <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Export Excel</span>
            <span className="sm:hidden">Excel</span>
          </Button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <Card className="border-dental-blue-light">
        <CardContent className="p-3 md:p-6">
          <div className="space-y-3 md:space-y-0 md:flex md:gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="text-dental-blue font-medium mb-2 block text-xs md:text-sm">
                Search Feedback
              </Label>
              <div className="relative">
                <Search className="absolute left-2 md:left-3 top-2.5 md:top-3 w-3 h-3 md:w-4 md:h-4 text-dental-gray" />
                <Input
                  id="search"
                  placeholder="Search by patient name, email, or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 md:pl-10 text-xs md:text-sm border-dental-blue-light focus:border-dental-blue"
                />
              </div>
            </div>
            
            <div className="md:w-40">
              <Label htmlFor="filterRating" className="text-dental-blue font-medium mb-2 block text-xs md:text-sm">
                Filter by Rating
              </Label>
              <select
                id="filterRating"
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="w-full p-2 text-xs md:text-sm border border-dental-blue-light rounded-md focus:border-dental-blue focus:outline-none bg-white"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div className="md:w-40">
              <Label htmlFor="filterStatus" className="text-dental-blue font-medium mb-2 block text-xs md:text-sm">
                Filter by Status
              </Label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 text-xs md:text-sm border border-dental-blue-light rounded-md focus:border-dental-blue focus:outline-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        <Card className="border-dental-blue-light">
          <CardContent className="p-2 md:p-4">
            <div className="text-center">
              <p className="text-lg md:text-2xl font-bold text-dental-blue">{mockFeedbacks.length}</p>
              <p className="text-dental-gray text-xs md:text-sm">Total Reviews</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-dental-blue-light">
          <CardContent className="p-2 md:p-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-warning fill-current" />
                <p className="text-lg md:text-2xl font-bold text-warning">{averageRating}</p>
              </div>
              <p className="text-dental-gray text-xs md:text-sm">Average Rating</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-dental-blue-light">
          <CardContent className="p-2 md:p-4">
            <div className="text-center">
              <p className="text-lg md:text-2xl font-bold text-dental-blue">{mockFeedbacks.filter(f => f.status === 'new').length}</p>
              <p className="text-dental-gray text-xs md:text-sm">New Reviews</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-dental-blue-light">
          <CardContent className="p-2 md:p-4">
            <div className="text-center">
              <p className="text-lg md:text-2xl font-bold text-success">{filteredFeedbacks.length}</p>
              <p className="text-dental-gray text-xs md:text-sm">Filtered Results</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Table */}
      <Card className="border-dental-blue-light">
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-dental-blue text-base md:text-lg">Patient Feedback</CardTitle>
          <CardDescription className="text-xs md:text-sm">All patient reviews and feedback</CardDescription>
        </CardHeader>
        <CardContent className="p-3 md:p-6">
          {filteredFeedbacks.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block rounded-lg border border-dental-blue-light overflow-hidden">
                <Table>
                  <TableHeader className="bg-dental-blue-light">
                    <TableRow>
                      <TableHead className="font-semibold text-dental-blue">Patient</TableHead>
                      <TableHead className="font-semibold text-dental-blue">Rating</TableHead>
                      <TableHead className="font-semibold text-dental-blue">Message</TableHead>
                      <TableHead className="font-semibold text-dental-blue">Date</TableHead>
                      <TableHead className="font-semibold text-dental-blue">Status</TableHead>
                      <TableHead className="font-semibold text-dental-blue">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFeedbacks.map((feedback) => (
                      <TableRow key={feedback.id} className="hover:bg-dental-blue-light/50">
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-dental-blue" />
                              <span className="font-medium text-foreground">{feedback.patientName}</span>
                            </div>
                            <div className="text-sm text-dental-gray">{feedback.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <span className={`font-bold ${getRatingColor(feedback.rating)}`}>{feedback.rating}</span>
                            <Star className={`w-4 h-4 ${getRatingColor(feedback.rating)} fill-current`} />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="text-sm text-dental-gray truncate">{feedback.message}</p>
                            <Badge variant="outline" className="mt-1 text-xs">{feedback.category}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-dental-gray">{formatDate(feedback.createdAt)}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(feedback.status)} text-xs`}>
                            {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-dental-blue hover:bg-dental-blue-light"
                              onClick={() => handleViewFeedback(feedback.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {feedback.status === 'new' && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-success hover:bg-success/10"
                                onClick={() => handleMarkAsReviewed(feedback.id)}
                              >
                                <MessageSquare className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {filteredFeedbacks.map((feedback) => (
                  <Card key={feedback.id} className="border-dental-blue-light">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-dental-blue flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-foreground text-sm">{feedback.patientName}</h4>
                            <p className="text-xs text-dental-gray">{feedback.email}</p>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(feedback.status)} text-xs`}>
                          {feedback.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center space-x-1">
                          <span className={`font-bold text-sm ${getRatingColor(feedback.rating)}`}>{feedback.rating}</span>
                          <Star className={`w-3 h-3 ${getRatingColor(feedback.rating)} fill-current`} />
                        </div>
                        <Badge variant="outline" className="text-xs">{feedback.category}</Badge>
                      </div>
                      
                      <p className="text-sm text-dental-gray mb-2 line-clamp-2">{feedback.message}</p>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-dental-gray">{formatDate(feedback.createdAt)}</p>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-dental-blue hover:bg-dental-blue-light h-8 w-8 p-0"
                            onClick={() => handleViewFeedback(feedback.id)}
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          {feedback.status === 'new' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-success hover:bg-success/10 h-8 w-8 p-0"
                              onClick={() => handleMarkAsReviewed(feedback.id)}
                            >
                              <MessageSquare className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-dental-gray mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No feedback found</h3>
              <p className="text-dental-gray">No feedback matches your current filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackManagement;