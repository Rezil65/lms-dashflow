
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BellRing, Send, Users, MessageSquare, Mail } from "lucide-react";

// Mock announcement data
const announcements = [
  { id: 1, title: "Platform Maintenance", content: "The platform will be down for maintenance on May 15th from 2-4 AM EST.", date: "2023-05-10", audience: "All Users" },
  { id: 2, title: "New Course Release", content: "We're excited to announce our new AI Fundamentals course is now available!", date: "2023-05-05", audience: "Students" },
  { id: 3, title: "End of Year Survey", content: "Please complete our annual survey to help us improve our platform.", date: "2023-05-01", audience: "All Users" },
];

const Communication = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Communication Tools</h2>
      
      <Tabs defaultValue="announcements">
        <TabsList>
          <TabsTrigger value="announcements" className="flex items-center gap-1">
            <BellRing className="h-4 w-4" />
            Announcements
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-1">
            <Mail className="h-4 w-4" />
            Email Campaigns
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="announcements" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Announcement</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">Title</label>
                  <Input id="title" placeholder="Announcement title" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium">Content</label>
                  <Textarea 
                    id="content" 
                    placeholder="Enter your announcement content here..." 
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="audience" className="text-sm font-medium">Target Audience</label>
                  <select 
                    id="audience" 
                    className="w-full rounded-md border border-input bg-background px-3 h-10"
                  >
                    <option value="all">All Users</option>
                    <option value="students">Students</option>
                    <option value="instructors">Instructors</option>
                    <option value="admins">Administrators</option>
                  </select>
                </div>
                <div className="pt-2">
                  <Button className="gap-1">
                    <BellRing className="h-4 w-4" />
                    Post Announcement
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Audience</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {announcements.map(announcement => (
                    <TableRow key={announcement.id}>
                      <TableCell className="font-medium">{announcement.title}</TableCell>
                      <TableCell className="max-w-xs truncate">{announcement.content}</TableCell>
                      <TableCell>{announcement.date}</TableCell>
                      <TableCell>{announcement.audience}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-red-600">Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="messages" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Recipients</span>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Users className="h-4 w-4" />
                      Select
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="all-users" 
                        className="rounded text-primary mr-2" 
                      />
                      <label htmlFor="all-users">All Users (1,542)</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="students" 
                        className="rounded text-primary mr-2" 
                      />
                      <label htmlFor="students">Students (1,250)</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="instructors" 
                        className="rounded text-primary mr-2" 
                      />
                      <label htmlFor="instructors">Instructors (120)</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="admins" 
                        className="rounded text-primary mr-2" 
                      />
                      <label htmlFor="admins">Administrators (25)</label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Compose Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                      <Input 
                        id="subject" 
                        placeholder="Message subject" 
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">Message</label>
                      <Textarea 
                        id="message" 
                        placeholder="Enter your message here..." 
                        rows={8}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>
                    <div className="pt-2 flex justify-end">
                      <Button className="gap-1">
                        <Send className="h-4 w-4" />
                        Send Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="email" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Email Campaign Manager</h3>
              <p className="text-muted-foreground mb-4">
                Create and manage email campaigns to engage with your users. Schedule automated emails,
                track open rates, and analyze user engagement.
              </p>
              <Button>Create Email Campaign</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Communication;
