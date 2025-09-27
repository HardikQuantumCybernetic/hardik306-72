import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Star, Phone, Mail, CheckCircle, MessageSquare, Users, Heart } from 'lucide-react';
import { toast } from 'sonner';
import DentalNavbar from './DentalNavbar';
import DentalFooter from './DentalFooter';

interface FeedbackData {
  overallRating: string;
  staffFriendliness: string;
  appointmentScheduling: string;
  treatmentSatisfaction: string;
  comments: string;
  suggestions: string;
  patientName?: string;
  email?: string;
  phone?: string;
}

// Demo feedback data
const demoFeedbacks = [
  {
    id: 1,
    patient_name: "Sarah Johnson",
    overall_rating: 5,
    comments: "Exceptional care! Dr. Smith was incredibly gentle and professional. The staff made me feel comfortable throughout my visit. Highly recommend!",
    created_at: "2024-01-15",
    staff_friendliness: 5,
    treatment_satisfaction: 5
  },
  {
    id: 2,
    patient_name: "Michael Chen",
    overall_rating: 5,
    comments: "Outstanding dental practice! Clean facility, state-of-the-art equipment, and the most caring dental team I've ever encountered. My teeth cleaning was painless and thorough.",
    created_at: "2024-01-10",
    staff_friendliness: 5,
    treatment_satisfaction: 4
  },
  {
    id: 3,
    patient_name: "Emma Davis",
    overall_rating: 5,
    comments: "Amazing experience! The appointment was on time, the treatment was explained clearly, and the results exceeded my expectations. Thank you for the beautiful smile!",
    created_at: "2024-01-08",
    staff_friendliness: 4,
    treatment_satisfaction: 5
  }
];

const StarRating: React.FC<{
  value: string;
  onChange: (value: string) => void;
  name: string;
  label: string;
}> = ({ value, onChange, name, label }) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-dental-blue">{label}</Label>
      <RadioGroup value={value} onValueChange={onChange} className="flex gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <div key={rating} className="flex items-center space-x-1">
            <RadioGroupItem 
              value={rating.toString()} 
              id={`${name}-${rating}`}
              className="sr-only"
            />
            <Label
              htmlFor={`${name}-${rating}`}
              className="cursor-pointer p-1 hover:bg-dental-blue-light rounded-md transition-colors"
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  parseInt(value) >= rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-dental-gray hover:text-yellow-400'
                }`}
              />
            </Label>
          </div>
        ))}
      </RadioGroup>
      <div className="text-xs text-dental-gray">
        {value === '1' && 'Poor'}
        {value === '2' && 'Fair'}
        {value === '3' && 'Good'}
        {value === '4' && 'Very Good'}
        {value === '5' && 'Excellent'}
      </div>
    </div>
  );
};

const FeedbackPage: React.FC = () => {
  const [feedback, setFeedback] = useState<FeedbackData>({
    overallRating: '',
    staffFriendliness: '',
    appointmentScheduling: '',
    treatmentSatisfaction: '',
    comments: '',
    suggestions: '',
    patientName: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.overallRating) {
      toast.error('Please provide an overall rating');
      return;
    }

    setIsSubmitting(true);

    try {
      // For now, store feedback locally and show success
      // In production, you would send this to your backend/database
      const feedbackData = {
        overall_rating: parseInt(feedback.overallRating),
        staff_friendliness: parseInt(feedback.staffFriendliness) || null,
        appointment_scheduling: parseInt(feedback.appointmentScheduling) || null,
        treatment_satisfaction: parseInt(feedback.treatmentSatisfaction) || null,
        comments: feedback.comments || null,
        suggestions: feedback.suggestions || null,
        patient_name: feedback.patientName || null,
        email: feedback.email || null,
        phone: feedback.phone || null,
        created_at: new Date().toISOString()
      };

      // Log the feedback for now (in production, send to your backend)
      console.log('Feedback submitted:', feedbackData);
      
      setIsSubmitted(true);
      toast.success('Thank you for your feedback!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background font-inter">
        <DentalNavbar />
        <div className="pt-16 pb-20">
          <div className="container mx-auto max-w-2xl px-4">
            <Card className="shadow-dental-card border-dental-blue-light animate-scale-in">
              <CardContent className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-success mx-auto mb-6" />
                <h1 className="text-2xl font-bold text-foreground mb-4 font-inter">
                  Thank You for Your Feedback!
                </h1>
                <p className="text-dental-gray mb-6">
                  We appreciate your time and input. Your responses will help us improve our services.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/'}
                    className="flex items-center gap-2 border-dental-blue-light hover:bg-dental-blue-light"
                  >
                    Return Home
                  </Button>
                  <Button 
                    variant="dental"
                    onClick={() => window.location.href = '/booking'}
                    className="flex items-center gap-2"
                  >
                    Book Another Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <DentalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-inter">
      <DentalNavbar />
      <div className="pt-16 pb-20">
        <div className="container mx-auto max-w-4xl px-4">
          {/* Page Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 font-inter">
              Patient 
              <span className="bg-gradient-to-r from-dental-blue to-dental-mint bg-clip-text text-transparent"> Feedback</span>
            </h1>
            <p className="text-lg text-dental-gray max-w-2xl mx-auto">
              Thank you for choosing Hardik Dental Practice. We value your feedback and strive to improve our services.
            </p>
          </div>

          {/* Recent Reviews Section */}
          <div className="mb-12">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Users className="w-6 h-6 text-dental-blue" />
              <h2 className="text-2xl font-bold text-foreground font-inter">Recent Patient Reviews</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {demoFeedbacks.map((review) => (
                <Card key={review.id} className="border-dental-blue-light hover:shadow-dental-card transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < review.overall_rating ? 'fill-yellow-400 text-yellow-400' : 'text-dental-gray'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-dental-gray">{review.overall_rating}/5</span>
                    </div>
                    <p className="text-dental-gray text-sm mb-4 line-clamp-4">"{review.comments}"</p>
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-dental-blue text-sm">- {review.patient_name}</p>
                      <p className="text-xs text-dental-gray">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Feedback Form */}
          <Card className="shadow-dental-card border-dental-blue-light animate-scale-in">
            <CardHeader className="text-center bg-gradient-to-r from-dental-blue to-dental-mint text-white rounded-t-lg">
              <CardTitle className="text-2xl font-bold font-inter flex items-center justify-center space-x-2">
                <MessageSquare className="w-6 h-6" />
                <span>Share Your Experience</span>
              </CardTitle>
              <p className="text-dental-blue-light">
                Please take a moment to share your thoughts about your recent visit
              </p>
            </CardHeader>
            
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Overall Rating */}
                <div>
                  <StarRating
                    value={feedback.overallRating}
                    onChange={(value) => setFeedback({ ...feedback, overallRating: value })}
                    name="overall"
                    label="How would you rate your overall experience? *"
                  />
                </div>

                <Separator className="bg-dental-blue-light" />

                {/* Specific Feedback Areas */}
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                  <StarRating
                    value={feedback.staffFriendliness}
                    onChange={(value) => setFeedback({ ...feedback, staffFriendliness: value })}
                    name="staff"
                    label="Staff Friendliness"
                  />
                  
                  <StarRating
                    value={feedback.appointmentScheduling}
                    onChange={(value) => setFeedback({ ...feedback, appointmentScheduling: value })}
                    name="scheduling"
                    label="Appointment Scheduling"
                  />
                  
                  <StarRating
                    value={feedback.treatmentSatisfaction}
                    onChange={(value) => setFeedback({ ...feedback, treatmentSatisfaction: value })}
                    name="treatment"
                    label="Treatment Satisfaction"
                  />
                </div>

                <Separator className="bg-dental-blue-light" />

                {/* Comments Section */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="comments" className="text-sm font-medium text-dental-blue">
                      What did you like about your visit? What can we improve?
                    </Label>
                    <Textarea
                      id="comments"
                      placeholder="Please share your experience with us..."
                      value={feedback.comments}
                      onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })}
                      className="mt-2 min-h-[100px] border-dental-blue-light focus:border-dental-blue"
                    />
                  </div>

                  <div>
                    <Label htmlFor="suggestions" className="text-sm font-medium text-dental-blue">
                      Do you have any suggestions for us?
                    </Label>
                    <Textarea
                      id="suggestions"
                      placeholder="Any suggestions to help us serve you better..."
                      value={feedback.suggestions}
                      onChange={(e) => setFeedback({ ...feedback, suggestions: e.target.value })}
                      className="mt-2 min-h-[80px] border-dental-blue-light focus:border-dental-blue"
                    />
                  </div>
                </div>

                <Separator className="bg-dental-blue-light" />

                {/* Optional Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-dental-blue">Contact Information (Optional)</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="patientName" className="text-dental-blue">Name</Label>
                      <Input
                        id="patientName"
                        type="text"
                        placeholder="Your name"
                        value={feedback.patientName}
                        onChange={(e) => setFeedback({ ...feedback, patientName: e.target.value })}
                        className="border-dental-blue-light focus:border-dental-blue"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-dental-blue">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={feedback.email}
                        onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
                        className="border-dental-blue-light focus:border-dental-blue"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-dental-blue">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(808) 095-0921"
                        value={feedback.phone}
                        onChange={(e) => setFeedback({ ...feedback, phone: e.target.value })}
                        className="border-dental-blue-light focus:border-dental-blue"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-dental-blue-light" />

                {/* Privacy Assurance */}
                <div className="bg-dental-blue-light rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Heart className="w-5 h-5 text-dental-blue" />
                    <p className="text-sm text-dental-blue text-center">
                      Your feedback is confidential and will only be used to enhance our services.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !feedback.overallRating}
                    variant="dental"
                    size="xl"
                    className="w-full sm:w-auto px-8 py-3 text-lg font-inter"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                  </Button>
                </div>

                {/* Contact Information */}
                <div className="text-center pt-6 border-t border-dental-blue-light">
                  <p className="text-sm text-dental-gray mb-4">
                    If you have any immediate concerns, please feel free to contact us:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <div className="flex items-center gap-2 text-sm text-dental-blue">
                      <Phone className="w-4 h-4" />
                      <span>(808) 095-0921</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-dental-blue">
                      <Mail className="w-4 h-4" />
                      <span>info@hardikdental.com</span>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <DentalFooter />
    </div>
  );
};

export default FeedbackPage;