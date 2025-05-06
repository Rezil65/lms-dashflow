
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, MessageCircle, Phone, Mail, FileText } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const HelpPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent",
      description: "We've received your message and will respond shortly.",
    });
  };
  
  const faqCategories = [
    {
      title: "Account & Profile",
      faqs: [
        {
          question: "How do I change my password?",
          answer: "To change your password, go to Settings > Account > Password. You'll need to enter your current password before creating a new one."
        },
        {
          question: "Can I change my username?",
          answer: "Yes, you can change your username in Settings > Account > Profile Information. Note that you can only change your username once every 30 days."
        },
        {
          question: "How do I update my profile picture?",
          answer: "Go to Settings > Account, then click on the 'Change Photo' button under your current profile picture. You can upload a new image from your device."
        }
      ]
    },
    {
      title: "Courses & Learning",
      faqs: [
        {
          question: "How do I track my course progress?",
          answer: "Your course progress is automatically tracked as you complete lessons. You can view your progress on the dashboard or on the individual course pages."
        },
        {
          question: "Can I download course materials for offline use?",
          answer: "Yes, most courses offer downloadable resources that you can save for offline use. Look for the download icon next to course resources."
        },
        {
          question: "How do certificates work?",
          answer: "Certificates are awarded upon successful completion of a course. Once you've completed all required modules and passed any assessments, your certificate will be available to download from your achievements section."
        }
      ]
    },
    {
      title: "Payment & Billing",
      faqs: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards, PayPal, and in some regions, bank transfers. Payment options are displayed during checkout."
        },
        {
          question: "How do I get a refund?",
          answer: "Refund requests can be submitted within 30 days of purchase. Go to your Purchase History, select the course, and click 'Request Refund'. Our team will review your request within 48 hours."
        },
        {
          question: "Is there a subscription option?",
          answer: "Yes, we offer monthly and annual subscription plans that provide access to our entire course library. You can find more details on our Pricing page."
        }
      ]
    },
  ];
  
  // Filter FAQs based on search query
  const filteredFAQs = searchQuery
    ? faqCategories.map(category => ({
        ...category,
        faqs: category.faqs.filter(faq => 
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.faqs.length > 0)
    : faqCategories;

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Help Center</h1>
            <p className="text-muted-foreground">Find answers and get support</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button variant="outline" className="flex items-center gap-2 button-3d hover:bg-primary/10">
              <MessageCircle className="h-4 w-4" />
              <span>Live Chat</span>
            </Button>
            <Button className="flex items-center gap-2 button-3d">
              <HelpCircle className="h-4 w-4" />
              <span>Support Ticket</span>
            </Button>
          </div>
        </div>
        
        {/* Search Section */}
        <Card className="mb-8 overflow-hidden border-none bg-gradient-to-r from-primary/20 to-blue-400/20 shadow-lg card-3d">
          <CardContent className="p-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-2">How can we help you?</h2>
              <p className="text-muted-foreground mb-6">Search our knowledge base for quick answers</p>
              <div className="relative">
                <HelpCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input 
                  type="text"
                  placeholder="Search for answers..." 
                  className="pl-10 text-lg h-12 button-3d hover:shadow-lg hover:shadow-primary/10 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* FAQ Section */}
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((category, index) => (
            <div key={index} className="mb-8">
              <h3 className="text-lg font-medium mb-4">{category.title}</h3>
              {category.faqs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {category.faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`item-${index}-${i}`} className="card-3d hover:shadow-primary/10">
                      <AccordionTrigger className="text-left px-4 hover:text-primary transition-colors">{faq.question}</AccordionTrigger>
                      <AccordionContent className="px-4">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-muted-foreground">No FAQs found in this category.</p>
              )}
            </div>
          ))
        ) : (
          <Card className="p-6 text-center">
            <p>No FAQs match your search. Please try different keywords or contact our support team.</p>
          </Card>
        )}
        
        {/* Contact Section */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 card-3d hover:shadow-primary/10">
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>Send us a message and we'll get back to you as soon as possible</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" className="button-3d" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your@email.com" className="button-3d" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help you?" className="button-3d" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Describe your issue in detail..." className="h-32 button-3d" />
                </div>
                <Button type="submit" className="w-full md:w-auto button-3d">Send Message</Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <Card className="card-3d hover:shadow-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Phone Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">Available Monday-Friday, 9am-5pm EST</p>
                <p className="font-medium">+1 (555) 123-4567</p>
              </CardContent>
            </Card>
            
            <Card className="card-3d hover:shadow-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">We'll respond within 24 hours</p>
                <p className="font-medium">support@acornlearning.com</p>
              </CardContent>
            </Card>
            
            <Card className="card-3d hover:shadow-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">Explore our detailed guides</p>
                <Button variant="outline" className="w-full button-3d">Browse Docs</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HelpPage;
