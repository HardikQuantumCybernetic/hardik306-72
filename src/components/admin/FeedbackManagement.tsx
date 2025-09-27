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
  Download,
  Eye,
  User
} from "lucide-react";
import { downloadCSV, downloadExcel } from "@/utils/downloadUtils";
import { useToast } from "@/hooks/use-toast";
import { useFeedback } from "@/hooks/useSupabaseExtended";

const FeedbackManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();
  const { feedback, loading, updateFeedback } = useFeedback();

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
    return feedback.filter(feedbackItem => {
      const matchesSearch = searchTerm === "" || 
        feedbackItem.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedbackItem.patient_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedbackItem.message.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRating = filterRating === "all" || feedbackItem.rating.toString() === filterRating;
      const matchesStatus = filterStatus === "all" || feedbackItem.status === filterStatus;
      
      return matchesSearch && matchesRating && matchesStatus;
    });
  }, [feedback, searchTerm, filterRating, filterStatus]);

  const averageRating = useMemo(() => {
    const total = filteredFeedbacks.reduce((sum, feedbackItem) => sum + feedbackItem.rating, 0);
    return filteredFeedbacks.length > 0 ? (total / filteredFeedbacks.length).toFixed(1) : "0.0";
  }, [filteredFeedbacks]);

  const handleViewFeedback = (feedbackId: string) => {
    const feedbackItem = feedback.find(f => f.id === feedbackId);
    if (feedbackItem) {
      toast({
        title: `Feedback from ${feedbackItem.patient_name}`,
        description: feedbackItem.message.length > 100 ? feedbackItem.message.substring(0, 100) + "..." : feedbackItem.message,
      });
    }
  };

  const handleMarkAsReviewed = async (feedbackId: string) => {
    try {
      await updateFeedback(feedbackId, { status: 'reviewed' });
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleExportFeedbacks = (format: 'csv' | 'excel') => {
    const exportData = filteredFeedbacks.map(feedbackItem => ({
      'Patient Name': feedbackItem.patient_name,
      Email: feedbackItem.patient_email,
      Rating: feedbackItem.rating,
      Message: feedbackItem.message,
      Category: feedbackItem.category,
      'Date': formatDate(feedbackItem.created_at),
      Status: feedbackItem.status
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-dental-blue">Loading feedback...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-3 md:space-y-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Feedback Management</h2>
          <p className="text-dental-gray text-sm md:text-base">Monitor and manage patient feedback and reviews (Real-time updates enabled)</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="dental-outline" size="sm" onClick={() => handleExportFeedbacks('csv')}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="dental-outline" size="sm" onClick={() => handleExportFeedbacks('excel')}>
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <Card className="border-dental-blue-light">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="text-dental-blue font-medium mb-2 block">
                Search Feedback
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-dental-gray" />
                <Input
                  id="search"
                  placeholder="Search by patient name, email, or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-dental-blue-light focus:border-dental-blue"
                />
              </div>
            </div>
            
            <div className="w-40">
              <Label htmlFor="filterRating" className="text-dental-blue font-medium mb-2 block">
                Filter by Rating
              </Label>
              <select
                id="filterRating"
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="w-full p-2 border border-dental-blue-light rounded-md focus:border-dental-blue focus:outline-none bg-white"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div className="w-40">
              <Label htmlFor="filterStatus" className="text-dental-blue font-medium mb-2 block">
                Filter by Status
              </Label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 border border-dental-blue-light rounded-md focus:border-dental-blue focus:outline-none bg-white"
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
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-dental-blue-light">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-dental-blue">{feedback.length}</p>
              <p className="text-dental-gray">Total Reviews</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-dental-blue-light">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-warning fill-current" />
                <p className="text-2xl font-bold text-warning">{averageRating}</p>
              </div>
              <p className="text-dental-gray">Average Rating</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-dental-blue-light">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-dental-blue">{feedback.filter(f => f.status === 'new').length}</p>
              <p className="text-dental-gray">New Reviews</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-dental-blue-light">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{filteredFeedbacks.length}</p>
              <p className="text-dental-gray">Filtered Results</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Table */}
      <Card className="border-dental-blue-light">
        <CardHeader>
          <CardTitle className="text-dental-blue">Patient Feedback</CardTitle>
          <CardDescription>All patient reviews and feedback with real-time updates</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredFeedbacks.length > 0 ? (
            <div className="rounded-lg border border-dental-blue-light overflow-hidden">
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
                  {filteredFeedbacks.map((feedbackItem) => (
                    <TableRow key={feedbackItem.id} className="hover:bg-dental-blue-light/50">
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-dental-blue" />
                            <span className="font-medium text-foreground">{feedbackItem.patient_name}</span>
                          </div>
                          <div className="text-sm text-dental-gray">{feedbackItem.patient_email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span className={`font-bold ${getRatingColor(feedbackItem.rating)}`}>{feedbackItem.rating}</span>
                          <Star className={`w-4 h-4 ${getRatingColor(feedbackItem.rating)} fill-current`} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm text-dental-gray truncate">{feedbackItem.message}</p>
                          <Badge variant="outline" className="mt-1 text-xs">{feedbackItem.category}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-dental-gray">{formatDate(feedbackItem.created_at)}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(feedbackItem.status)} text-xs`}>
                          {feedbackItem.status.charAt(0).toUpperCase() + feedbackItem.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-dental-blue hover:bg-dental-blue-light"
                            onClick={() => handleViewFeedback(feedbackItem.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {feedbackItem.status === 'new' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-success hover:bg-success/10"
                              onClick={() => handleMarkAsReviewed(feedbackItem.id)}
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
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-dental-gray mx-auto mb-4" />
              <p className="text-dental-gray">No feedback found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackManagement;