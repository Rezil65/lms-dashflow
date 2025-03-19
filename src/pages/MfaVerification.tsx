
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Shield, ArrowRight } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { verifyMfaCode, setupMfa } from "@/utils/authService";

const MfaVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Get email from location state or redirect to login
  const email = location.state?.email;
  if (!email) {
    navigate("/login");
  }
  
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const result = await verifyMfaCode(email, code);
      if (result.success) {
        toast({
          title: "Verification successful",
          description: "Redirecting to your dashboard...",
        });
        
        // Redirect based on user role
        switch (result.role) {
          case "admin":
            navigate("/admin");
            break;
          case "instructor":
            navigate("/instructor-dashboard");
            break;
          case "learner":
            navigate("/");
            break;
          default:
            navigate("/");
        }
      } else {
        setError(result.message || "Invalid verification code");
      }
    } catch (err) {
      setError("An error occurred during verification");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleResendCode = () => {
    toast({
      title: "Code resent",
      description: "A new verification code has been sent to your email",
    });
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <Shield className="h-12 w-12 text-primary" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Verification Required</h2>
        </div>
        
        <Card>
          <form onSubmit={handleVerify}>
            <CardHeader>
              <CardTitle>Enter verification code</CardTitle>
              <CardDescription>
                We've sent a 6-digit code to your email address or authentication app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="flex justify-center py-4">
                <InputOTP maxLength={6} value={code} onChange={setCode}>
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
              
              <div className="text-center text-sm">
                <Button variant="link" type="button" onClick={handleResendCode}>
                  Didn't receive a code? Resend
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit" disabled={loading || code.length < 6}>
                {loading ? "Verifying..." : "Verify and Continue"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default MfaVerification;
