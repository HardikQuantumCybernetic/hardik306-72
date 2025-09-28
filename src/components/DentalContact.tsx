
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Calendar,
  Send,
  Navigation
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { handlePhoneCall, handleEmail, handleDirections, handleEmergencyCall } from "@/utils/buttonActions";
import QuickInfoCard from "@/components/common/QuickInfoCard";

const DentalContact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    toast({
      title: "Message Sent Successfully!",
      description: "We'll get back to you within 24 hours.",
    });
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Our Office",
      details: ["123 Smile Street", "Downtown District", "City, ST 12345"],
      action: "Get Directions",
      onClick: () => handleDirections("123 Smile Street, Downtown District, City, ST 12345")
    },
    {
      icon: Phone,
      title: "Call Us Today",
      details: ["Main: (555) 123-4567", "Emergency: (555) 123-4568", "Fax: (555) 123-4569"],
      action: "Call Now",
      onClick: () => handlePhoneCall("(555) 123-4567")
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["info@smilecare.com", "appointments@smilecare.com", "emergency@smilecare.com"],
      action: "Send Email",
      onClick: () => handleEmail("info@smilecare.com", "General Inquiry")
    }
  ];

  const officeHours = [
    { day: "Monday - Friday", hours: "8:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "9:00 AM - 3:00 PM" },
    { day: "Sunday", hours: "Emergency Only" },
    { day: "Holidays", hours: "Emergency Only" }
  ];

  const contactInfoItems = [
    { text: "All messages are responded to within 24 hours", icon: "clock" as const },
    { text: "Emergency calls are handled immediately", icon: "alert" as const },
    { text: "Your contact information is kept confidential", icon: "check" as const },
    { text: "Multiple contact methods available for your convenience", icon: "info" as const },
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-dental-blue-light via-white to-dental-mint-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 font-inter">
            Get In 
            <span className="bg-gradient-to-r from-dental-blue to-dental-mint bg-clip-text text-transparent"> Touch</span>
          </h2>
          <p className="text-lg text-dental-gray max-w-3xl mx-auto leading-relaxed">
            Have questions about our services or want to schedule an appointment? 
            We're here to help and look forward to hearing from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            {/* Quick Info Card */}
            <QuickInfoCard 
              title="Contact Guidelines" 
              items={contactInfoItems}
            />
            
            {/* Contact Cards */}
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <Card 
                  key={info.title} 
                  className="border-dental-blue-light hover:shadow-dental-card transition-all duration-300 animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-dental-blue to-dental-mint rounded-full flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground mb-2 font-inter">{info.title}</h3>
                        <div className="space-y-1">
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-dental-gray">{detail}</p>
                          ))}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-3 text-dental-blue hover:text-white hover:bg-dental-blue p-0"
                          onClick={info.onClick}
                        >
                          <div className="flex items-center space-x-2">
                            <span>{info.action}</span>
                            <Navigation className="w-4 h-4" />
                          </div>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Office Hours */}
            <Card className="border-dental-blue-light">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-dental-blue font-inter">
                  <Clock className="w-5 h-5" />
                  <span>Office Hours</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {officeHours.map((schedule, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-dental-gray font-medium">{schedule.day}</span>
                      <span className="text-dental-blue font-semibold">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-dental-blue-light rounded-lg">
                  <p className="text-sm text-dental-gray text-center">
                    <strong>Emergency Care Available 24/7</strong><br />
                    Call (555) 123-4568 for urgent dental needs
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-dental-card border-dental-blue-light animate-fade-in">
              <CardHeader className="bg-gradient-to-r from-dental-blue to-dental-mint text-white rounded-t-lg">
                <CardTitle className="text-2xl font-bold font-inter flex items-center space-x-2">
                  <Send className="w-6 h-6" />
                  <span>Send Us a Message</span>
                </CardTitle>
                <CardDescription className="text-dental-blue-light">
                  We'll respond to your inquiry within 24 hours
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-8">
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Fields */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="contactFirstName" className="text-dental-blue font-medium">
                          First Name *
                        </Label>
                        <Input 
                          id="contactFirstName" 
                          required 
                          className="border-dental-blue-light focus:border-dental-blue"
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactLastName" className="text-dental-blue font-medium">
                          Last Name *
                        </Label>
                        <Input 
                          id="contactLastName" 
                          required 
                          className="border-dental-blue-light focus:border-dental-blue"
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    {/* Contact Fields */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail" className="text-dental-blue font-medium">
                          Email Address *
                        </Label>
                        <Input 
                          id="contactEmail" 
                          type="email" 
                          required 
                          className="border-dental-blue-light focus:border-dental-blue"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPhone" className="text-dental-blue font-medium">
                          Phone Number
                        </Label>
                        <Input 
                          id="contactPhone" 
                          type="tel" 
                          className="border-dental-blue-light focus:border-dental-blue"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <Label htmlFor="contactSubject" className="text-dental-blue font-medium">
                        Subject *
                      </Label>
                      <Input 
                        id="contactSubject" 
                        required 
                        className="border-dental-blue-light focus:border-dental-blue"
                        placeholder="What is your inquiry about?"
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="contactMessage" className="text-dental-blue font-medium">
                        Message *
                      </Label>
                      <Textarea 
                        id="contactMessage" 
                        required 
                        className="border-dental-blue-light focus:border-dental-blue"
                        placeholder="Please describe your question or concern..."
                        rows={6}
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="text-center pt-4">
                      <Button type="submit" variant="dental" size="xl" className="font-inter w-full md:w-auto">
                        <Send className="w-5 h-5" />
                        Send Message
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2 font-inter">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-dental-gray">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <Card className="text-center border-dental-blue-light hover:shadow-dental-card transition-all duration-300">
                <CardContent className="p-6">
                  <Calendar className="w-12 h-12 text-dental-blue mx-auto mb-4" />
                  <h4 className="text-lg font-bold text-foreground mb-2 font-inter">Book Appointment</h4>
                  <p className="text-dental-gray mb-4">Schedule your visit online</p>
                  <Link to="/booking">
                    <Button variant="dental" size="lg" className="w-full font-inter">
                      Schedule Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              <Card className="text-center border-dental-blue-light hover:shadow-dental-card transition-all duration-300">
                <CardContent className="p-6">
                  <Phone className="w-12 h-12 text-dental-mint mx-auto mb-4" />
                  <h4 className="text-lg font-bold text-foreground mb-2 font-inter">Emergency Care</h4>
                  <p className="text-dental-gray mb-4">24/7 emergency service</p>
                  <Button 
                    variant="dental-outline" 
                    size="lg" 
                    className="w-full font-inter"
                    onClick={handleEmergencyCall}
                  >
                    Call Emergency
                  </Button>
                </CardContent>
              </Card>
              <Card className="text-center border-dental-blue-light hover:shadow-dental-card transition-all duration-300">
                <CardContent className="p-6">
                  <Send className="w-12 h-12 text-dental-blue mx-auto mb-4" />
                  <h4 className="text-lg font-bold text-foreground mb-2 font-inter">Share Feedback</h4>
                  <p className="text-dental-gray mb-4">Help us improve our services</p>
                  <Link to="/feedback">
                    <Button variant="dental-outline" size="lg" className="w-full font-inter">
                      Give Feedback
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-16">
          <Card className="border-dental-blue-light shadow-dental-card">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-dental-blue-light to-dental-mint-light h-64 md:h-80 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-dental-blue mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-dental-blue mb-2 font-inter">Visit Our Office</h3>
                  <p className="text-dental-gray mb-4">123 Smile Street, Downtown District</p>
                  <Button 
                    variant="dental" 
                    size="lg" 
                    className="font-inter"
                    onClick={() => handleDirections("123 Smile Street, Downtown District, City, ST 12345")}
                  >
                    <Navigation className="w-5 h-5" />
                    Get Directions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DentalContact;
