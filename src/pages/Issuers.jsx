
import { useState } from "react";
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/Footer";
import { ArrowRight, Badge, Check, Shield } from "lucide-react";
import IssuerApplicationForm from "@/components/IssuerApplicationForm";

const Issuers = () => {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  
  const handleApplyClick = () => {
    setShowApplicationForm(true);
  };

  return (
    <>
      <Helmet>
        <title>For Issuers - CredVerse</title>
        <meta name="description" content="Join CredVerse as a credential issuer and provide blockchain-verified credentials to your students or employees" />
      </Helmet>
      
      <div className="flex min-h-screen flex-col">
        <Navbar />
        
        <main className="flex-1 pt-20">
          <section className="py-12 md:py-20 bg-gradient-to-r from-credverse-soft-purple to-credverse-soft-teal">
            <div className="container px-4 md:px-6">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl font-bold tracking-tight mb-4">
                  Become a Credential Issuer
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Join the CredVerse ecosystem and issue blockchain-verified credentials that are trusted worldwide
                </p>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-credverse-purple to-credverse-deep-purple hover:opacity-90"
                  onClick={handleApplyClick}
                >
                  Apply Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </section>
          
          <section className="py-12">
            <div className="container px-4 md:px-6">
              <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
                <Card>
                  <CardHeader>
                    <div className="rounded-full bg-secondary w-12 h-12 flex items-center justify-center mb-2">
                      <Badge className="h-6 w-6 text-credverse-purple" />
                    </div>
                    <CardTitle>Trusted Authority</CardTitle>
                    <CardDescription>
                      Establish your organization as a verified issuer of blockchain credentials
                    </CardDescription>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="rounded-full bg-secondary w-12 h-12 flex items-center justify-center mb-2">
                      <Shield className="h-6 w-6 text-credverse-teal" />
                    </div>
                    <CardTitle>Tamper-Proof</CardTitle>
                    <CardDescription>
                      Issue credentials that cannot be forged or falsified
                    </CardDescription>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="rounded-full bg-secondary w-12 h-12 flex items-center justify-center mb-2">
                      <Check className="h-6 w-6 text-credverse-purple" />
                    </div>
                    <CardTitle>Global Recognition</CardTitle>
                    <CardDescription>
                      Provide credentials that are recognized and verified worldwide
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </section>
          
          <section className="py-12 bg-secondary">
            <div className="container px-4 md:px-6">
              <div className="max-w-3xl mx-auto text-center mb-10">
                <h2 className="text-3xl font-bold tracking-tight mb-4">
                  How It Works for Issuers
                </h2>
                <p className="text-muted-foreground">
                  Joining the CredVerse ecosystem as a credential issuer is simple
                </p>
              </div>
              
              <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-3">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-credverse-soft-teal flex items-center justify-center text-2xl font-semibold">1</div>
                  <h3 className="text-lg font-medium">Apply</h3>
                  <p className="text-muted-foreground text-sm">Complete the application process to become a verified issuer on CredVerse.</p>
                </div>
                
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-credverse-soft-teal flex items-center justify-center text-2xl font-semibold">2</div>
                  <h3 className="text-lg font-medium">Create</h3>
                  <p className="text-muted-foreground text-sm">Design your credentials with detailed metadata and verification criteria.</p>
                </div>
                
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-credverse-soft-teal flex items-center justify-center text-2xl font-semibold">3</div>
                  <h3 className="text-lg font-medium">Issue</h3>
                  <p className="text-muted-foreground text-sm">Issue blockchain-verified credentials directly to recipients' wallets.</p>
                </div>
              </div>
            </div>
          </section>
          
          <section className="py-12">
            <div className="container px-4 md:px-6">
              <div className="max-w-4xl mx-auto">
                <Card className="border-2 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-center">Ready to Join as an Issuer?</CardTitle>
                    <CardDescription className="text-center">
                      Complete the application form to start the verification process
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-center">
                      <p>
                        Our team will review your application and guide you through the onboarding process.
                        Once approved, you'll gain access to the issuer dashboard where you can create and
                        manage your credentials.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-credverse-purple to-credverse-deep-purple hover:opacity-90"
                      onClick={handleApplyClick}
                    >
                      Apply as Issuer
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <IssuerApplicationForm onClose={() => setShowApplicationForm(false)} />
      )}
    </>
  );
};

export default Issuers;
