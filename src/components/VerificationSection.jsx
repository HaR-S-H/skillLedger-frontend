
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Check, X, ArrowRight } from "lucide-react";


const VerificationSection = () => {
  const [address, setAddress] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState(null);
  
  const handleVerify = () => {
    if (!address) return;
    
    setIsVerifying(true);
    
    // Simulate verification with a mock response
    setTimeout(() => {
      // Mock verification success
      if (address.startsWith("0x") && address.length > 10) {
        setResult({
          isVerified: true,
          title: "Full Stack Web Developer",
          issuer: "CodeAcademy",
          recipient: "John Developer",
          issuedDate: "May 15, 2023",
          expirationDate: "May 15, 2025",
          transactionId: "0x3a4b...8f12"
        });
      } else {
        // Mock verification failure
        setResult({ isVerified: false });
      }
      
      setIsVerifying(false);
    }, 1500);
  };
  
  return (
    <section className="py-20 bg-gradient-to-r from-credverse-soft-purple to-credverse-soft-teal">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Verify Credentials
          </h2>
          <p className="text-muted-foreground">
            Check the authenticity of any credential by entering a wallet address or credential ID
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-card shadow-lg rounded-xl p-6 border">
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Input
                placeholder="Enter wallet address or credential ID"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleVerify} 
                disabled={isVerifying || !address}
                className="bg-gradient-to-r from-credverse-purple to-credverse-deep-purple hover:opacity-90"
              >
                {isVerifying ? "Verifying..." : "Verify"}
                {!isVerifying && <Search className="ml-2 h-4 w-4" />}
              </Button>
            </div>
            
            {result && (
              <Card className={`border-2 ${result.isVerified ? "border-green-500/30" : "border-red-500/30"}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {result.isVerified ? "Credential Verified" : "Verification Failed"}
                    </CardTitle>
                    {result.isVerified ? (
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                        <Check className="h-5 w-5" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center">
                        <X className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <CardDescription>
                    {result.isVerified 
                      ? "This credential has been verified on the blockchain" 
                      : "We could not verify this credential. Please check the address and try again."}
                  </CardDescription>
                </CardHeader>
                
                {result.isVerified && (
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div className="text-muted-foreground">Credential Title</div>
                        <div className="font-medium">{result.title}</div>
                        
                        <div className="text-muted-foreground">Issuer</div>
                        <div className="font-medium">{result.issuer}</div>
                        
                        <div className="text-muted-foreground">Recipient</div>
                        <div className="font-medium">{result.recipient}</div>
                        
                        <div className="text-muted-foreground">Issued Date</div>
                        <div className="font-medium">{result.issuedDate}</div>
                        
                        <div className="text-muted-foreground">Expiration Date</div>
                        <div className="font-medium">{result.expirationDate}</div>
                        
                        <div className="text-muted-foreground">Transaction ID</div>
                        <div className="font-medium text-primary truncate">{result.transactionId}</div>
                      </div>
                      
                      <div className="pt-4">
                        <Button variant="link" size="sm" className="pl-0">
                          View on blockchain <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            )}
            
            <p className="text-muted-foreground text-sm mt-4 text-center">
              All verifications are performed directly on the blockchain, ensuring 100% reliability.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerificationSection;
