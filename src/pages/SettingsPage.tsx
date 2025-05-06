
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { toast } = useToast();
  const [accountDetails, setAccountDetails] = useState({
    name: "Lisa Jackson",
    email: "lisa.jackson@example.com",
    username: "lisakitchen",
    bio: "Passionate baker and pastry chef. Love to create sweet treats and share my knowledge with others."
  });

  const [preferences, setPreferences] = useState({
    darkMode: false,
    emailNotifications: true,
    pushNotifications: true,
    newsletter: false,
    language: "english",
    autoplay: true,
    subtitles: true
  });

  const handleAccountUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Account updated",
      description: "Your account details have been successfully updated.",
    });
  };

  const handlePreferenceUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Preferences updated",
      description: "Your preferences have been saved.",
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-1">Settings</h1>
        <p className="text-muted-foreground mb-6">Manage your account settings and preferences</p>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="mb-6 button-3d">
            <TabsTrigger value="account" className="hover-scale">Account</TabsTrigger>
            <TabsTrigger value="preferences" className="hover-scale">Preferences</TabsTrigger>
            <TabsTrigger value="notifications" className="hover-scale">Notifications</TabsTrigger>
            <TabsTrigger value="appearance" className="hover-scale">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            <Card className="border shadow-sm card-3d">
              <CardContent className="p-6">
                <form onSubmit={handleAccountUpdate} className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                      <h2 className="text-xl font-semibold">Profile Information</h2>
                      
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={accountDetails.name} 
                          onChange={e => setAccountDetails({...accountDetails, name: e.target.value})}
                          className="button-3d"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input 
                          id="username" 
                          value={accountDetails.username} 
                          onChange={e => setAccountDetails({...accountDetails, username: e.target.value})} 
                          className="button-3d"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={accountDetails.email} 
                          onChange={e => setAccountDetails({...accountDetails, email: e.target.value})} 
                          className="button-3d"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Input 
                          id="bio" 
                          value={accountDetails.bio} 
                          onChange={e => setAccountDetails({...accountDetails, bio: e.target.value})} 
                          className="h-24 button-3d"
                        />
                      </div>
                    </div>
                    
                    <div className="flex-none w-full md:w-64 space-y-4">
                      <h2 className="text-xl font-semibold">Profile Picture</h2>
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <Avatar className="h-32 w-32 border-2 border-primary transition-all hover:scale-105 cursor-pointer">
                          <img src="/public/lovable-uploads/79b57a48-41b3-47a6-aba3-8cf20a45a438.png" alt="User" />
                        </Avatar>
                        <Button type="button" variant="outline" className="w-full button-3d">
                          Change Photo
                        </Button>
                      </div>
                      
                      <div className="mt-8">
                        <h3 className="text-lg font-medium mb-2">Account Status</h3>
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Active</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Member since: May 2023
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4 border-t">
                    <Button type="button" variant="outline" className="button-3d">Reset</Button>
                    <Button type="submit" className="button-3d">Save Changes</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            <Card className="border shadow-sm card-3d">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Password</h2>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" className="button-3d" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" className="button-3d" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" className="button-3d" />
                  </div>
                  
                  <Button className="w-full md:w-auto button-3d">
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card className="border shadow-sm card-3d">
              <CardContent className="p-6">
                <form onSubmit={handlePreferenceUpdate}>
                  <h2 className="text-xl font-semibold mb-4">Display & Language</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">Enable dark theme for the application</p>
                      </div>
                      <Switch 
                        id="dark-mode" 
                        checked={preferences.darkMode} 
                        onCheckedChange={checked => setPreferences({...preferences, darkMode: checked})}
                        className="button-3d"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="language" className="font-medium">Language</Label>
                      <p className="text-sm text-muted-foreground mb-2">Select your preferred language</p>
                      <Select 
                        value={preferences.language} 
                        onValueChange={value => setPreferences({...preferences, language: value})}
                      >
                        <SelectTrigger className="w-full md:w-[200px] button-3d">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-900">
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                          <SelectItem value="japanese">Japanese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-semibold mb-4 mt-8">Content Preferences</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="autoplay" className="font-medium">Autoplay Videos</Label>
                        <p className="text-sm text-muted-foreground">Automatically play videos when viewing courses</p>
                      </div>
                      <Switch 
                        id="autoplay" 
                        checked={preferences.autoplay} 
                        onCheckedChange={checked => setPreferences({...preferences, autoplay: checked})}
                        className="button-3d"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="subtitles" className="font-medium">Enable Subtitles</Label>
                        <p className="text-sm text-muted-foreground">Show subtitles by default in video lessons</p>
                      </div>
                      <Switch 
                        id="subtitles" 
                        checked={preferences.subtitles} 
                        onCheckedChange={checked => setPreferences({...preferences, subtitles: checked})}
                        className="button-3d"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-4 border-t flex justify-end">
                    <Button type="submit" className="button-3d">Save Preferences</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card className="border shadow-sm card-3d">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive course updates and announcements via email</p>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={preferences.emailNotifications} 
                      onCheckedChange={checked => setPreferences({...preferences, emailNotifications: checked})}
                      className="button-3d"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications" className="font-medium">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                    </div>
                    <Switch 
                      id="push-notifications" 
                      checked={preferences.pushNotifications} 
                      onCheckedChange={checked => setPreferences({...preferences, pushNotifications: checked})}
                      className="button-3d"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="newsletter" className="font-medium">Newsletter</Label>
                      <p className="text-sm text-muted-foreground">Receive our monthly newsletter with tips and updates</p>
                    </div>
                    <Switch 
                      id="newsletter" 
                      checked={preferences.newsletter} 
                      onCheckedChange={checked => setPreferences({...preferences, newsletter: checked})}
                      className="button-3d"
                    />
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mt-8 mb-4">Notification Frequency</h3>
                <RadioGroup defaultValue="daily" className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="realtime" id="realtime" className="button-3d" />
                    <Label htmlFor="realtime">Real-time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="daily" id="daily" className="button-3d" />
                    <Label htmlFor="daily">Daily digest</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="weekly" className="button-3d" />
                    <Label htmlFor="weekly">Weekly digest</Label>
                  </div>
                </RadioGroup>
                
                <div className="mt-8 pt-4 border-t flex justify-end">
                  <Button className="button-3d">Save Notification Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-6">
            <Card className="border shadow-sm card-3d">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>
                
                <div className="space-y-8">
                  <div>
                    <Label htmlFor="theme" className="text-lg font-medium">Theme</Label>
                    <p className="text-sm text-muted-foreground mb-4">Choose your preferred theme</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="border rounded-md p-4 flex flex-col items-center space-y-2 cursor-pointer hover:border-primary transition-colors card-3d">
                        <div className="w-full h-20 rounded bg-white border"></div>
                        <span className="text-sm font-medium">Light</span>
                      </div>
                      <div className="border rounded-md p-4 flex flex-col items-center space-y-2 cursor-pointer hover:border-primary transition-colors card-3d">
                        <div className="w-full h-20 rounded bg-gray-900 border border-gray-700"></div>
                        <span className="text-sm font-medium">Dark</span>
                      </div>
                      <div className="border rounded-md p-4 flex flex-col items-center space-y-2 cursor-pointer hover:border-primary transition-colors card-3d">
                        <div className="w-full h-20 rounded bg-gradient-to-r from-primary to-blue-600 border"></div>
                        <span className="text-sm font-medium">Purple</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-lg font-medium">Text Size</Label>
                    <p className="text-sm text-muted-foreground mb-2">Adjust the size of text throughout the application</p>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm">A</span>
                      <Slider defaultValue={[50]} max={100} step={10} className="w-full button-3d" />
                      <span className="text-lg">A</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-lg font-medium">Animation</Label>
                    <p className="text-sm text-muted-foreground mb-2">Control UI animations and transitions</p>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm">Minimal</span>
                      <Slider defaultValue={[70]} max={100} step={10} className="w-full button-3d" />
                      <span className="text-sm">Full</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-4 border-t flex justify-end">
                  <Button className="button-3d">Save Appearance Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
