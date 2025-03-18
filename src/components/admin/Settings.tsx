
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Save, 
  Upload, 
  RefreshCw, 
  Download, 
  Clock, 
  Globe, 
  Lock, 
  Zap
} from "lucide-react";

const Settings = () => {
  const [siteName, setSiteName] = useState("LMS Dashboard");
  const [siteDescription, setSiteDescription] = useState("A comprehensive learning management system for educational institutions and businesses.");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Settings & Configuration</h2>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general" className="flex items-center gap-1">
            <Globe className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1">
            <Lock className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-1">
            <Zap className="h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-1">
            <RefreshCw className="h-4 w-4" />
            Backup
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="site-name" className="text-sm font-medium">Site Name</label>
                  <Input 
                    id="site-name" 
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="site-description" className="text-sm font-medium">Site Description</label>
                  <Textarea 
                    id="site-description" 
                    rows={3}
                    value={siteDescription}
                    onChange={(e) => setSiteDescription(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="site-logo" className="text-sm font-medium">Site Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-muted rounded flex items-center justify-center">
                      <span className="text-2xl font-bold">LMS</span>
                    </div>
                    <Button variant="outline" className="gap-1">
                      <Upload className="h-4 w-4" />
                      Upload Logo
                    </Button>
                  </div>
                </div>
                
                <Button className="gap-1">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="timezone" className="text-sm font-medium">Timezone</label>
                  <select 
                    id="timezone" 
                    className="w-full rounded-md border border-input bg-background px-3 h-10"
                  >
                    <option value="utc">UTC</option>
                    <option value="est">Eastern Time (EST)</option>
                    <option value="cst">Central Time (CST)</option>
                    <option value="mst">Mountain Time (MST)</option>
                    <option value="pst">Pacific Time (PST)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="language" className="text-sm font-medium">Default Language</label>
                  <select 
                    id="language" 
                    className="w-full rounded-md border border-input bg-background px-3 h-10"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                  </select>
                </div>
                
                <Button className="gap-1">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Enable Maintenance Mode</p>
                  <p className="text-sm text-muted-foreground">
                    This will display a maintenance page to all non-admin users.
                  </p>
                </div>
                <Switch 
                  checked={maintenanceMode}
                  onCheckedChange={setMaintenanceMode}
                />
              </div>
              
              {maintenanceMode && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <p className="font-medium text-yellow-800">Maintenance Mode is Enabled</p>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Only administrators can access the site. All other users will see a maintenance page.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Require Strong Passwords</p>
                    <p className="text-sm text-muted-foreground">
                      Minimum 8 characters with uppercase, lowercase, number and special character.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Password Expiration</p>
                    <p className="text-sm text-muted-foreground">
                      Require users to change password every 90 days.
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for all admin accounts.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Button className="gap-1">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Session Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="session-timeout" className="text-sm font-medium">Session Timeout (minutes)</label>
                  <Input id="session-timeout" type="number" defaultValue={30} min={5} />
                  <p className="text-xs text-muted-foreground">
                    Users will be automatically logged out after this period of inactivity.
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Force Logout After Password Change</p>
                    <p className="text-sm text-muted-foreground">
                      Log out users from all devices when they change their password.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Button className="gap-1">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                          <path d="M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Zoom Integration</h3>
                        <p className="text-sm text-muted-foreground">Connect Zoom for virtual classrooms</p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="zoom-api-key" className="text-sm font-medium">API Key</label>
                    <Input id="zoom-api-key" placeholder="Enter your Zoom API key" />
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 7L13 15L9 11L3 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M21 13V7H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Google Analytics</h3>
                        <p className="text-sm text-muted-foreground">Track user engagement and behavior</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="ga-tracking-id" className="text-sm font-medium">Tracking ID</label>
                    <Input id="ga-tracking-id" defaultValue="UA-123456789-1" />
                  </div>
                </div>
                
                <Button className="gap-1">
                  <Save className="h-4 w-4" />
                  Save Integrations
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Backup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Automatic Backups</p>
                    <p className="text-sm text-muted-foreground">
                      Schedule regular backups of your database.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="backup-frequency" className="text-sm font-medium">Backup Frequency</label>
                  <select 
                    id="backup-frequency" 
                    className="w-full rounded-md border border-input bg-background px-3 h-10"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Retention Period</label>
                  <div className="flex items-center gap-2">
                    <Input type="number" defaultValue={30} className="w-24" />
                    <span>days</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Backups older than this will be automatically deleted.
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button className="gap-1">
                    <RefreshCw className="h-4 w-4" />
                    Backup Now
                  </Button>
                  <Button variant="outline" className="gap-1">
                    <Download className="h-4 w-4" />
                    Download Latest
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
