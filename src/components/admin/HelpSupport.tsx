
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  HelpCircle, 
  MessageSquare, 
  Book, 
  Video, 
  Search,
  ArrowRight,
  CheckCircle,
  DownloadCloud,
  Mail
} from "lucide-react";

const HelpSupport = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Help & Support</h2>
      
      <div className="relative">
        <div className="flex items-center border rounded-lg overflow-hidden">
          <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
          <Input 
            className="pl-10 py-6 border-none focus-visible:ring-0" 
            placeholder="Search the documentation or FAQs..." 
          />
          <Button className="rounded-none h-full px-6">
            Search
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="documentation">
        <TabsList className="mb-6">
          <TabsTrigger value="documentation" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Documentation
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-1">
            <HelpCircle className="h-4 w-4" />
            FAQs
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            Support Tickets
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="documentation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Book className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-lg mb-2">Admin Guide</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Learn how to configure and manage your LMS platform.
                  </p>
                  <Button variant="outline" className="w-full gap-1">
                    Read Guide
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <Video className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-medium text-lg mb-2">Video Tutorials</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Watch step-by-step tutorials on using the admin dashboard.
                  </p>
                  <Button variant="outline" className="w-full gap-1">
                    Watch Videos
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <DownloadCloud className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium text-lg mb-2">API Documentation</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Integrate with our LMS using our comprehensive API.
                  </p>
                  <Button variant="outline" className="w-full gap-1">
                    View API Docs
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="flex items-start hover:bg-muted/50 p-2 rounded-md transition-colors">
                    <FileText className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium">Setting Up Course Prerequisites</h3>
                      <p className="text-sm text-muted-foreground">Learn how to create course dependencies and learning paths.</p>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-start hover:bg-muted/50 p-2 rounded-md transition-colors">
                    <FileText className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium">User Role Management</h3>
                      <p className="text-sm text-muted-foreground">A guide to creating and managing user roles and permissions.</p>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-start hover:bg-muted/50 p-2 rounded-md transition-colors">
                    <FileText className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium">Configuring Payment Gateways</h3>
                      <p className="text-sm text-muted-foreground">Step by step instructions for setting up payment providers.</p>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-start hover:bg-muted/50 p-2 rounded-md transition-colors">
                    <FileText className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium">Advanced Reporting</h3>
                      <p className="text-sm text-muted-foreground">How to create custom reports and export data from the platform.</p>
                    </div>
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    How do I add a new user to the platform?
                  </h3>
                  <p className="text-muted-foreground pl-7">
                    Navigate to the User Management section and click "Add User". Fill out the required information
                    and select the appropriate role. The user will receive an email with login instructions.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    How can I create a new course?
                  </h3>
                  <p className="text-muted-foreground pl-7">
                    Go to Course Management, click "Create Course", and follow the step-by-step wizard to set up
                    your course details, content, and pricing. You can save as a draft before publishing.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    How do I generate reports on course progress?
                  </h3>
                  <p className="text-muted-foreground pl-7">
                    In the Analytics section, select the Course Analytics tab. You can filter by course, date range,
                    and user groups. Use the Export button to download the report in your preferred format.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    How can I backup my LMS data?
                  </h3>
                  <p className="text-muted-foreground pl-7">
                    Go to Settings {'>'} Backup, where you can configure automatic backups or trigger a manual backup.
                    Backups include all courses, user data, and system configurations.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    How do I set up payment integrations?
                  </h3>
                  <p className="text-muted-foreground pl-7">
                    Navigate to Payment Management {'>'} Settings, where you can configure payment gateways like Stripe
                    or PayPal. You'll need to enter your API keys from these services to enable payments.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="support" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Support Ticket</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                  <Input id="subject" placeholder="Enter the subject of your issue" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">Category</label>
                  <select 
                    id="category" 
                    className="w-full rounded-md border border-input bg-background px-3 h-10"
                  >
                    <option value="">Select a category</option>
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing Question</option>
                    <option value="account">Account Management</option>
                    <option value="feature">Feature Request</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                  <select 
                    id="priority" 
                    className="w-full rounded-md border border-input bg-background px-3 h-10"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">Description</label>
                  <Textarea 
                    id="description" 
                    placeholder="Please describe your issue in detail..." 
                    rows={6}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="attachments" className="text-sm font-medium">Attachments (optional)</label>
                  <Input id="attachments" type="file" className="py-1.5" />
                  <p className="text-xs text-muted-foreground">
                    Upload screenshots or relevant files. Maximum file size: 10MB.
                  </p>
                </div>
                
                <Button className="gap-1">
                  <MessageSquare className="h-4 w-4" />
                  Submit Ticket
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Live Chat</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Chat with our support team in real-time. Available Monday to Friday, 9AM to 5PM EST.
                    </p>
                    <Button variant="outline" size="sm">Start Chat</Button>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <Mail className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email Support</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Send us an email at support@lmsdashboard.com. We typically respond within 24 hours.
                    </p>
                    <Button variant="outline" size="sm">Send Email</Button>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <Video className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Schedule a Call</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Book a 30-minute video call with a support specialist for complex issues.
                    </p>
                    <Button variant="outline" size="sm">Book Call</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpSupport;
