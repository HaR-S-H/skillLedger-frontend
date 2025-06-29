
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorksSection = () => {
  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground">
            CredVerse makes it simple for everyone in the ecosystem to participate in the future of skill verification.
          </p>
        </div>
        
        <Tabs defaultValue="users" className="max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="users">For Users</TabsTrigger>
            <TabsTrigger value="issuers">For Issuers</TabsTrigger>
            <TabsTrigger value="employers">For Employers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-credverse-soft-purple flex items-center justify-center text-2xl font-semibold">1</div>
                <h3 className="text-lg font-medium">Connect Wallet</h3>
                <p className="text-muted-foreground text-sm">Connect your Web3 wallet to create and access your credential profile.</p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-credverse-soft-purple flex items-center justify-center text-2xl font-semibold">2</div>
                <h3 className="text-lg font-medium">Request Credentials</h3>
                <p className="text-muted-foreground text-sm">Complete courses or projects and request credentials from verified issuers.</p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-credverse-soft-purple flex items-center justify-center text-2xl font-semibold">3</div>
                <h3 className="text-lg font-medium">Showcase Skills</h3>
                <p className="text-muted-foreground text-sm">Display your verified credentials on your public profile and share with employers.</p>
              </div>
            </div>
            
            <div className="flex justify-center pt-4">
              <Button asChild className="bg-gradient-to-r from-credverse-purple to-credverse-deep-purple hover:opacity-90">
                <Link to="/explore">
                  Build Your Profile <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="issuers" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-credverse-soft-teal flex items-center justify-center text-2xl font-semibold">1</div>
                <h3 className="text-lg font-medium">Apply as Issuer</h3>
                <p className="text-muted-foreground text-sm">Register your institution and get verified to issue credentials on the platform.</p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-credverse-soft-teal flex items-center justify-center text-2xl font-semibold">2</div>
                <h3 className="text-lg font-medium">Create Credentials</h3>
                <p className="text-muted-foreground text-sm">Design skill certifications with metadata and verification criteria.</p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-credverse-soft-teal flex items-center justify-center text-2xl font-semibold">3</div>
                <h3 className="text-lg font-medium">Issue to Recipients</h3>
                <p className="text-muted-foreground text-sm">Issue blockchain-verified credentials to recipients' wallets.</p>
              </div>
            </div>
            
            <div className="flex justify-center pt-4">
              <Button asChild variant="outline">
                <Link to="/issuers">
                  Become an Issuer <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="employers" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-credverse-soft-purple flex items-center justify-center text-2xl font-semibold">1</div>
                <h3 className="text-lg font-medium">Search Profiles</h3>
                <p className="text-muted-foreground text-sm">Search for talent based on verified skills and credentials.</p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-credverse-soft-purple flex items-center justify-center text-2xl font-semibold">2</div>
                <h3 className="text-lg font-medium">Verify Instantly</h3>
                <p className="text-muted-foreground text-sm">Instantly verify candidate credentials without lengthy background checks.</p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-credverse-soft-purple flex items-center justify-center text-2xl font-semibold">3</div>
                <h3 className="text-lg font-medium">Make Informed Decisions</h3>
                <p className="text-muted-foreground text-sm">Hire with confidence based on tamper-proof skill verification.</p>
              </div>
            </div>
            
            <div className="flex justify-center pt-4">
              <Button asChild variant="secondary">
                <Link to="/explore">
                  Find Talent <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default HowItWorksSection;
