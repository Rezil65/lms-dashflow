
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Copy, QrCode, Mail, Smartphone, Shield, ArrowRight, Check } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { setupMfa } from "@/utils/authService";

const MfaSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [method, setMethod] = useState("app");
  const [setupCode, setSetupCode] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  
  // Generate a fake setup code on component mount
  useEffect(() => {
    setSetupCode("ABCDEF123456");
  }, []);
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(setupCode);
    setCopied(true);
    toast({
      title: "Code copied",
      description: "Setup code copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const result = await setupMfa(method, verificationCode);
      if (result.success) {
        toast({
          title: "MFA setup successful",
          description: "Your account is now protected with multi-factor authentication",
        });
        navigate("/profile");
      } else {
        setError(result.message || "Invalid verification code");
      }
    } catch (err) {
      setError("An error occurred during MFA setup");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <Shield className="h-12 w-12 text-primary" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Set Up Two-Factor Authentication</h2>
        </div>
        
        <Card>
          <form onSubmit={handleVerify}>
            <CardHeader>
              <CardTitle>Enhance your account security</CardTitle>
              <CardDescription>
                Choose a method for two-factor authentication to protect your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Tabs defaultValue="app" value={method} onValueChange={setMethod}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="app" className="flex items-center justify-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Authenticator App
                  </TabsTrigger>
                  <TabsTrigger value="email" className="flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="app" className="space-y-4 pt-4">
                  <div className="flex justify-center">
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <QrCode className="h-48 w-48" />
                    </div>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Scan the QR code with your authenticator app or enter the code manually
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                        {setupCode}
                      </code>
                      <Button 
                        type="button" 
                        size="icon" 
                        variant="outline" 
                        onClick={handleCopyCode}
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="email" className="space-y-4 pt-4">
                  <Alert>
                    <AlertDescription>
                      When you enable email-based two-factor authentication, we'll send a verification code to your email whenever you sign in.
                    </AlertDescription>
                  </Alert>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: "Test code sent",
                        description: "We've sent a verification code to your email address",
                      });
                    }}
                  >
                    Send test code to your email
                  </Button>
                </TabsContent>
              </Tabs>
              
              <div className="pt-4 space-y-2">
                <p className="text-sm font-medium">Enter verification code</p>
                <div className="flex justify-center py-2">
                  <InputOTP maxLength={6} value={verificationCode} onChange={setVerificationCode}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                type="submit" 
                disabled={loading || verificationCode.length < 6}
              >
                {loading ? "Verifying..." : "Verify and Enable"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default MfaSetup;
