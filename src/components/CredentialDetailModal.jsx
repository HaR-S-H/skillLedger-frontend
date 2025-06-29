
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Check, 
  ExternalLink, 
  Calendar, 
  Building, 
  Award, 
  FileText, 
  Download, 
  Github, 
  DollarSign,
  BookOpen,
  Briefcase,
  TrendingUp,
  Link,
  Hash,
  Wallet
} from "lucide-react";
import { useState ,useEffect} from "react";
import FullScreenLoader from "./FullScreenLoader";

const CredentialDetailModal = ({ isOpen, onClose, credential }) => {
  const [ipfsData, setIpfsData] = useState(null);
  const [loading, setLoading] = useState(false); // Also, `false` not `null`

  useEffect(() => {
    const fetchIpfsData = async () => {
      if (!credential?.tokenURI) return;

      try {
        setLoading(true);
        const response = await fetch(credential.tokenURI);
        const data = await response.json();
        setIpfsData(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch IPFS data", error);
        setLoading(false); // Important to reset loading on error
      }
    };

    fetchIpfsData();
  }, [credential?.tokenURI]);

  // ✅ SAFE to do this here (after hooks)
  if (!credential) return null;
  if (loading) return <FullScreenLoader />;
  console.log(credential);
  
  const etherscanUrl = `https://etherscan.io/tx/${credential.transactionHash}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-credverse-purple to-credverse-teal bg-clip-text text-transparent">
            Credential Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header with icon and title */}
          <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-credverse-purple/10 to-credverse-teal/10 rounded-xl border">
            {/* <div className={`w-20 h-20 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-4xl shadow-lg`}>
              {credential.icon}
            </div> */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {credential.programType === 'course' ? (
                  <BookOpen className="h-6 w-6 text-credverse-purple" />
                ) : (
                  <Briefcase className="h-6 w-6 text-credverse-teal" />
                )}
                <Badge variant="secondary" className="capitalize text-sm font-semibold">
                  {credential.programType}
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mb-2">{credential.programId.skillName}</h3>
              <p className="text-muted-foreground mb-3">{credential.programId.description}</p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Check className="h-4 w-4" />
                <span className="font-medium">Blockchain Verified</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Program Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-credverse-purple" />
                    Program Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Program Name</span>
                    <span className="font-semibold">
                      {credential.programType === 'course' ? credential.programId.courseName : credential.programId.skillName}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Duration</span>
                    <div className="text-right">
                      <div className="font-semibold">{new Date(credential.programId.startDate).toLocaleDateString('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})} - {new Date(credential.programId.endDate).toLocaleDateString('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})}</div>
                    </div>
                  </div>

                  {credential.programType === 'internship' && credential.stipend && (
                    <>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Stipend</span>
                        <div className="flex items-center gap-1 font-semibold text-green-600">
                          <DollarSign className="h-4 w-4" />
                          {credential.stipend}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Organization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-credverse-teal" />
                    Organization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    {credential.issuerLogo ? (
                      <img src={credential.issuerLogo} alt={`${credential.issuer} logo`} className="w-8 h-8 rounded-full" />
                    ) : (
                      <Award className="h-8 w-8 text-primary" />
                    )}
                    <div>
                      <div className="font-semibold">{credential.organization.name}</div>
                      <div className="text-sm text-muted-foreground">Verified Issuer</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Wallet Address</span>
                    <div className="font-mono text-sm bg-muted p-2 rounded mt-1 break-all">
                      {credential.organization.walletAddress}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Downloads & Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-credverse-purple" />
                    Documents & Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Certificate */}
                  {ipfsData?.certificateUrl &&
                    <Button variant="outline" className="w-full justify-start gap-2" asChild>
                      <a href={ipfsData.certificateUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4" />
                        Download Certificate
                      </a>
                    </Button>
                  }

                  {credential.programType === 'course' && (
                    <>
                      {credential.programId.courseLink && (
                        <Button variant="outline" className="w-full justify-start gap-2" asChild>
                          <a href={credential.programId.courseLink} target="_blank" rel="noopener noreferrer">
                            <Link className="h-4 w-4" />
                            Course Link
                          </a>
                        </Button>
                      )}
                      
                      {credential.programId.coursePdfLink && (
                        <Button variant="outline" className="w-full justify-start gap-2" asChild>
                          <a href={credential.programId.coursePdfLink} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                            Course Materials
                          </a>
                        </Button>
                      )}
                      
                      {ipfsData?.performanceReportUrl && (
                        <Button variant="outline" className="w-full justify-start gap-2" asChild>
                          <a href={ipfsData.performanceReportUrl} target="_blank" rel="noopener noreferrer">
                            <TrendingUp className="h-4 w-4" />
                            Performance Report
                          </a>
                        </Button>
                      )}
                    </>
                  )}

                  {credential.programType === 'internship' && ipfsData?.githubUrl && (
                    <Button variant="outline" className="w-full justify-start gap-2" asChild>
                      <a href={ipfsData.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                        GitHub Repository
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Blockchain Verification */}
              <Card className="border-green-200 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Hash className="h-5 w-5" />
                    Blockchain Verification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Transaction Hash</span>
                      <div className="font-mono text-xs bg-white p-2 rounded mt-1 break-all border">
                        {credential.transactionHash}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Block Number</span>
                      <div className="font-mono text-sm bg-white p-2 rounded mt-1 border">
                        #{credential.blockNumber}
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-credverse-purple to-credverse-teal text-white" asChild>
                    <a href={etherscanUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Verify on Etherscan
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
              <Check className="h-3 w-3 mr-1" />
              Blockchain Verified
            </Badge>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button className="bg-gradient-to-r from-credverse-purple to-credverse-teal text-white">
                <Download className="h-4 w-4 mr-2" />
                Download All Documents
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CredentialDetailModal;
