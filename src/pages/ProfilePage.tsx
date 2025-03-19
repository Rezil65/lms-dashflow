
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AtSign,
  Briefcase,
  Building,
  Edit,
  GraduationCap,
  LayoutDashboard,
  LinkIcon,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  Upload,
  User
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Define validation schemas based on role
const commonSchema = {
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email format").readonly(),
};

const adminSchema = z.object({
  ...commonSchema,
  organizationName: z.string().min(2, "Organization name must be at least 2 characters"),
  contactPhone: z.string().min(10, "Phone number must be at least 10 characters"),
});

const instructorSchema = z.object({
  ...commonSchema,
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  qualifications: z.string().min(5, "Qualifications must be at least 5 characters"),
  expertise: z.string().min(5, "Areas of expertise must be at least 5 characters"),
  portfolio: z.string().url("Portfolio must be a valid URL").optional().or(z.literal("")),
  linkedin: z.string().url("LinkedIn must be a valid URL").optional().or(z.literal("")),
});

const learnerSchema = z.object({
  ...commonSchema,
  education: z.string().min(5, "Education must be at least 5 characters"),
  goals: z.string().min(5, "Career goals must be at least 5 characters"),
});

// Mock profile data for testing
const mockProfiles = {
  admin: {
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    organizationName: "Kyureeus Inc.",
    contactPhone: "123-456-7890",
    mfaEnabled: true,
    profilePicture: "",
  },
  instructor: {
    firstName: "John",
    lastName: "Doe",
    email: "instructor@example.com",
    bio: "Experienced instructor with over a decade of teaching experience.",
    qualifications: "PhD in Computer Science",
    expertise: "Web Development, Machine Learning, Artificial Intelligence",
    portfolio: "https://instructor-portfolio.com",
    linkedin: "https://linkedin.com/in/instructor",
    mfaEnabled: false,
    profilePicture: "",
  },
  learner: {
    firstName: "Jane",
    lastName: "Smith",
    email: "learner@example.com",
    education: "Bachelor's in Software Engineering",
    goals: "Become a full-stack developer and work on innovative projects",
    mfaEnabled: false,
    profilePicture: "",
  }
};

const ProfilePage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState("profile");
  const [mfaEnabled, setMfaEnabled] = useState(false);
  
  // Initialize form based on user role
  const getFormSchema = () => {
    if (!user) return commonSchema;
    
    switch (user.role) {
      case "admin": return adminSchema;
      case "instructor": return instructorSchema;
      case "learner": return learnerSchema;
      default: return z.object(commonSchema);
    }
  };
  
  const form = useForm({
    resolver: zodResolver(getFormSchema()),
    defaultValues: profileData || {}
  });
  
  // Navigate to dashboard based on role
  const handleNavigateToDashboard = () => {
    if (!user) return;
    
    switch (user.role) {
      case "admin": navigate("/admin"); break;
      case "instructor": navigate("/instructor"); break;
      case "learner": navigate("/learner"); break;
      default: navigate("/");
    }
  };
  
  // Simulate fetching profile data
  useEffect(() => {
    if (!user) return;
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      // Get mock profile data based on role
      let profileData;
      switch (user.role) {
        case "admin": profileData = mockProfiles.admin; break;
        case "instructor": profileData = mockProfiles.instructor; break;
        case "learner": profileData = mockProfiles.learner; break;
        default: profileData = null;
      }
      
      if (profileData) {
        setProfileData(profileData);
        form.reset(profileData);
        setMfaEnabled(profileData.mfaEnabled);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [user, form]);
  
  // Handle form submission
  const onSubmit = (data: any) => {
    // Simulate API call
    console.log("Profile data submitted:", data);
    
    // Update local state
    setProfileData({
      ...profileData,
      ...data,
      mfaEnabled
    });
    
    // Display success toast
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
    
    // Exit edit mode
    setIsEditMode(false);
  };
  
  // Handle profile picture upload
  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this file to a server
      // For now, we'll just create a data URL for preview
      const reader = new FileReader();
      reader.onload = () => {
        setProfileData({
          ...profileData,
          profilePicture: reader.result as string
        });
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "Profile Picture Updated",
        description: "Your profile picture has been updated.",
      });
    }
  };
  
  // Toggle MFA
  const handleToggleMfa = () => {
    const newMfaState = !mfaEnabled;
    setMfaEnabled(newMfaState);
    
    // If enabling MFA, redirect to MFA setup page
    if (newMfaState) {
      navigate("/mfa-setup");
    } else {
      toast({
        title: "MFA Disabled",
        description: "Two-factor authentication has been disabled.",
      });
    }
  };
  
  if (!user || !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-14 w-14 mx-auto bg-primary/20 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleNavigateToDashboard}
              className="flex items-center"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
            {!isEditMode ? (
              <Button 
                onClick={() => setIsEditMode(true)}
                className="flex items-center"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <Button 
                onClick={form.handleSubmit(onSubmit)}
                className="flex items-center"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left sidebar with avatar and basic info */}
          <div>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <Avatar className="h-32 w-32">
                      {profileData.profilePicture ? (
                        <AvatarImage src={profileData.profilePicture} alt="Profile" />
                      ) : (
                        <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                          {profileData.firstName?.[0]}{profileData.lastName?.[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {isEditMode && (
                      <div className="absolute -bottom-2 -right-2">
                        <label htmlFor="profile-pic-upload" className="cursor-pointer">
                          <div className="bg-primary text-white p-2 rounded-full">
                            <Upload className="h-4 w-4" />
                          </div>
                          <input 
                            id="profile-pic-upload" 
                            type="file" 
                            accept="image/*" 
                            className="hidden"
                            onChange={handleProfilePictureUpload}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold mb-1">
                    {profileData.firstName} {profileData.lastName}
                  </h2>
                  <p className="text-muted-foreground capitalize mb-2">{user.role}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 mr-1" />
                    {profileData.email}
                  </div>
                </div>
                
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-sm font-medium mb-2">Security Settings</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Two-Factor Authentication</span>
                    </div>
                    <Switch 
                      checked={mfaEnabled} 
                      onCheckedChange={handleToggleMfa}
                      disabled={!isEditMode}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content area */}
          <div className="md:col-span-2">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="profile">Profile Information</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details and profile settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      {/* Common fields for all users */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName" 
                            placeholder="First Name"
                            {...form.register("firstName")}
                            disabled={!isEditMode}
                          />
                          {form.formState.errors.firstName && (
                            <p className="text-sm text-destructive">{form.formState.errors.firstName.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName" 
                            placeholder="Last Name"
                            {...form.register("lastName")}
                            disabled={!isEditMode}
                          />
                          {form.formState.errors.lastName && (
                            <p className="text-sm text-destructive">{form.formState.errors.lastName.message}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="email" 
                            className="pl-10" 
                            readOnly
                            {...form.register("email")}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">Your email address cannot be changed</p>
                      </div>
                      
                      {/* Role-specific fields */}
                      {user.role === "admin" && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="organizationName">Organization Name</Label>
                            <div className="relative">
                              <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                id="organizationName" 
                                className="pl-10" 
                                placeholder="Organization Name"
                                {...form.register("organizationName")}
                                disabled={!isEditMode}
                              />
                            </div>
                            {form.formState.errors.organizationName && (
                              <p className="text-sm text-destructive">{form.formState.errors.organizationName.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contactPhone">Contact Phone</Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                id="contactPhone" 
                                className="pl-10" 
                                placeholder="Contact Phone"
                                {...form.register("contactPhone")}
                                disabled={!isEditMode}
                              />
                            </div>
                            {form.formState.errors.contactPhone && (
                              <p className="text-sm text-destructive">{form.formState.errors.contactPhone.message}</p>
                            )}
                          </div>
                        </>
                      )}
                      
                      {user.role === "instructor" && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea 
                              id="bio" 
                              placeholder="Tell us about yourself..."
                              className="min-h-[100px]"
                              {...form.register("bio")}
                              disabled={!isEditMode}
                            />
                            {form.formState.errors.bio && (
                              <p className="text-sm text-destructive">{form.formState.errors.bio.message}</p>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="qualifications">Qualifications</Label>
                              <Input 
                                id="qualifications" 
                                placeholder="Your qualifications"
                                {...form.register("qualifications")}
                                disabled={!isEditMode}
                              />
                              {form.formState.errors.qualifications && (
                                <p className="text-sm text-destructive">{form.formState.errors.qualifications.message}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="expertise">Areas of Expertise</Label>
                              <Input 
                                id="expertise" 
                                placeholder="Your areas of expertise"
                                {...form.register("expertise")}
                                disabled={!isEditMode}
                              />
                              {form.formState.errors.expertise && (
                                <p className="text-sm text-destructive">{form.formState.errors.expertise.message}</p>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="portfolio">Portfolio URL</Label>
                              <div className="relative">
                                <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  id="portfolio" 
                                  className="pl-10" 
                                  placeholder="https://your-portfolio.com"
                                  {...form.register("portfolio")}
                                  disabled={!isEditMode}
                                />
                              </div>
                              {form.formState.errors.portfolio && (
                                <p className="text-sm text-destructive">{form.formState.errors.portfolio.message}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="linkedin">LinkedIn URL</Label>
                              <div className="relative">
                                <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  id="linkedin" 
                                  className="pl-10" 
                                  placeholder="https://linkedin.com/in/username"
                                  {...form.register("linkedin")}
                                  disabled={!isEditMode}
                                />
                              </div>
                              {form.formState.errors.linkedin && (
                                <p className="text-sm text-destructive">{form.formState.errors.linkedin.message}</p>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                      
                      {user.role === "learner" && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="education">Educational Background</Label>
                            <div className="relative">
                              <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                id="education" 
                                className="pl-10" 
                                placeholder="Your educational background"
                                {...form.register("education")}
                                disabled={!isEditMode}
                              />
                            </div>
                            {form.formState.errors.education && (
                              <p className="text-sm text-destructive">{form.formState.errors.education.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="goals">Career Goals</Label>
                            <Textarea 
                              id="goals" 
                              placeholder="What are your career goals?"
                              className="min-h-[100px]"
                              {...form.register("goals")}
                              disabled={!isEditMode}
                            />
                            {form.formState.errors.goals && (
                              <p className="text-sm text-destructive">{form.formState.errors.goals.message}</p>
                            )}
                          </div>
                        </>
                      )}
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>
                      Manage your password and security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="space-y-0.5">
                          <h3 className="text-base font-medium">Change Password</h3>
                          <p className="text-sm text-muted-foreground">Update your password regularly to keep your account secure</p>
                        </div>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            toast({
                              title: "Password Change",
                              description: "Password change functionality would be shown here.",
                            });
                          }}
                        >
                          Change Password
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="space-y-0.5">
                          <h3 className="text-base font-medium">Two-Factor Authentication</h3>
                          <p className="text-sm text-muted-foreground">
                            {mfaEnabled 
                              ? "Two-factor authentication is currently enabled" 
                              : "Add an extra layer of security to your account"}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${mfaEnabled ? "text-green-600" : "text-muted-foreground"}`}>
                            {mfaEnabled ? "Enabled" : "Disabled"}
                          </span>
                          <Switch 
                            checked={mfaEnabled} 
                            onCheckedChange={handleToggleMfa}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="space-y-0.5">
                          <h3 className="text-base font-medium">Account Sessions</h3>
                          <p className="text-sm text-muted-foreground">Manage your active sessions and sign out from other devices</p>
                        </div>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            toast({
                              title: "Sessions",
                              description: "In a real app, this would show your active sessions.",
                            });
                          }}
                        >
                          Manage Sessions
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
