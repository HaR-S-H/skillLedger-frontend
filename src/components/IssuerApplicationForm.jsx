import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "react-toastify";
import { X, Building, Shield, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { organizationLogin } from "@/api/auth";

const IssuerApplicationForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    website: "",
    walletAddress: "",
    credentialTypes: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
   onClose();
  try {
    const data = await toast.promise(
      organizationLogin(formData),
      {
        pending: "Application submitting...",
        success: "Application Submitted",
        error: {
          render({ data }) {
            return data?.response?.data?.message || "Application rejected";
          },
        },
      }
    );
    console.log("Organization login response:", data);
  } catch (err) {
    console.error("Login error:", err);
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-2xl h-[85vh] relative flex flex-col">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onClose}
          className="absolute right-2 top-2 z-10"
        >
          <X className="h-4 w-4" />
        </Button>
        
        <ScrollArea className="flex-1 p-6">
          <div className="pr-4">
            <div className="flex items-center mb-6">
              <Building className="h-8 w-8 text-credverse-purple mr-3" />
              <div>
                <h2 className="text-2xl font-bold">Become a Credential Issuer</h2>
                <p className="text-muted-foreground">Join our network of trusted credential issuers</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col items-center text-center p-3 border border-border rounded-md">
                <Shield className="h-6 w-6 text-credverse-teal mb-2" />
                <h3 className="font-medium text-sm">Issue Credentials</h3>
                <p className="text-xs text-muted-foreground">Provide blockchain-verified skills and certifications</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-3 border border-border rounded-md">
                <Award className="h-6 w-6 text-credverse-purple mb-2" />
                <h3 className="font-medium text-sm">Build Reputation</h3>
                <p className="text-xs text-muted-foreground">Gain recognition as a trusted credential provider</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-3 border border-border rounded-md">
                <Building className="h-6 w-6 text-credverse-teal mb-2" />
                <h3 className="font-medium text-sm">Access Dashboard</h3>
                <p className="text-xs text-muted-foreground">Manage credentials with our intuitive tools</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 ml-2">
              <div className="space-y-2">
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input
                  id="organizationName"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Person</Label>
                  <Input
                    id="contactName"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="walletAddress">Issuer Wallet Address</Label>
                  <Input
                    id="walletAddress"
                    name="walletAddress"
                    value={formData.walletAddress}
                    onChange={handleChange}
                    placeholder="0x..."
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="credentialTypes">Types of Credentials You'll Issue</Label>
                <Input
                  id="credentialTypes"
                  name="credentialTypes"
                  value={formData.credentialTypes}
                  onChange={handleChange}
                  placeholder="e.g., Course Completions, Skills, Certifications"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Give some description about your company."
                  rows={3}
                  required
                />
              </div>
              
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-credverse-purple to-credverse-deep-purple hover:opacity-90 h-12 text-md font-medium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting Application..." : "Submit Issuer Application"}
                </Button>
                <p className="text-xs text-center mt-2 text-muted-foreground">
                  By submitting, you agree to our verification process and terms for credential issuers
                </p>
              </div>
            </form>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default IssuerApplicationForm;