
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LockKeyhole, Mail, ShieldCheck, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const MfaSetup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [mfaMethod, setMfaMethod] = useState<"email" | "app">("email");
  const [isEnabled, setIsEnabled] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  
  // Mock QR code URL - in a real app, this would come from your backend
  const qrCodeUrl = "https://via.placeholder.com/200x200.png?text=MFA+QR+Code";
  
  const handleEnableMfa = () => {
    setShowVerification(true);
    toast({
      title: "Verification Code Sent",
      description: mfaMethod === "email" 
        ? "We've sent a verification code to your email address." 
        : "Please scan the QR code with your authenticator app.",
    });
  };
  
  const handleVerify = () => {
    // Mock verification - in a real app, validate with backend
    if (mfaCode === "123456") {
      setIsEnabled(true);
      setShowVerification(false);
      toast({
        title: "MFA Enabled",
        description: "Two-factor authentication has been successfully enabled for your account.",
      });
    } else {
      toast({
        title: "Invalid Code",
        description: "The verification code you entered is incorrect. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDisableMfa = () => {
    setIsEnabled(false);
    toast({
      title: "MFA Disabled",
      description: "Two-factor authentication has been disabled for your account.",
    });
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-xl text-center">Multi-Factor Authentication</CardTitle>
          <CardDescription className="text-center">
            Add an extra layer of security to your account by enabling two-factor authentication.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {isEnabled ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  <span className="font-medium">MFA is currently enabled</span>
                </div>
                <Switch checked={true} onCheckedChange={handleDisableMfa} />
              </div>
              
              <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800 border border-yellow-200">
                <p>
                  Your account is protected with two-factor authentication. 
                  When signing in, you'll need to provide your password and a verification code.
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium">Recovery Options</h3>
                <div className="rounded-lg border p-4 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    If you lose access to your authentication method, you can use recovery codes to sign in.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Recovery Codes
                  </Button>
                </div>
              </div>
            </div>
          ) : showVerification ? (
            <div className="space-y-4">
              {mfaMethod === "app" && (
                <div className="flex justify-center my-4">
                  <img src={qrCodeUrl} alt="MFA QR Code" className="border rounded-lg h-48 w-48" />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="verificationCode">Enter Verification Code</Label>
                <Input 
                  id="verificationCode" 
                  placeholder="123456" 
                  value={mfaCode} 
                  onChange={(e) => setMfaCode(e.target.value)}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowVerification(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleVerify}
                >
                  Verify
                </Button>
              </div>
              
              {mfaMethod === "email" && (
                <p className="text-sm text-center text-muted-foreground">
                  Didn't receive a code? <a href="#" className="text-primary hover:underline">Resend</a>
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Enable two-factor authentication</span>
                </div>
                <Switch checked={false} onCheckedChange={() => handleEnableMfa()} />
              </div>
              
              <div className="rounded-lg bg-primary/5 p-4 space-y-4">
                <h3 className="font-medium">Choose Authentication Method</h3>
                
                <div className="space-y-3">
                  <div 
                    className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer ${
                      mfaMethod === "email" ? "border-primary bg-primary/5" : ""
                    }`}
                    onClick={() => setMfaMethod("email")}
                  >
                    <div className={`p-2 rounded-full ${mfaMethod === "email" ? "bg-primary/10" : "bg-gray-100"}`}>
                      <Mail className={`h-5 w-5 ${mfaMethod === "email" ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <h4 className="font-medium">Email Authentication</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive a verification code via email when you sign in.
                      </p>
                    </div>
                  </div>
                  
                  <div 
                    className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer ${
                      mfaMethod === "app" ? "border-primary bg-primary/5" : ""
                    }`}
                    onClick={() => setMfaMethod("app")}
                  >
                    <div className={`p-2 rounded-full ${mfaMethod === "app" ? "bg-primary/10" : "bg-gray-100"}`}>
                      <Smartphone className={`h-5 w-5 ${mfaMethod === "app" ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <h4 className="font-medium">Authenticator App</h4>
                      <p className="text-sm text-muted-foreground">
                        Use Google Authenticator, Authy, or similar apps to generate codes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleGoBack}>
            Back
          </Button>
          {!isEnabled && !showVerification && (
            <Button onClick={handleEnableMfa}>
              Continue
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default MfaSetup;
