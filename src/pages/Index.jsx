
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import VerificationSection from "@/components/VerificationSection";
import StudentSearch from "@/components/StudentSearch";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>CredVerse - Decentralized Skill Verification Platform</title>
        <meta name="description" content="A Web3 platform for verifying and showcasing your skills as blockchain-verified credentials" />
      </Helmet>
      
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-credverse-soft-purple/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navbar />
        
        <main className="flex-1">
          <div className="space-y-24">
            <HeroSection />
            <div className="container mx-auto px-4">
              <FeatureSection />
            </div>
            <div className="bg-gradient-to-r from-credverse-soft-purple/10 to-credverse-soft-teal/10 py-16">
              <div className="container mx-auto px-4">
                <HowItWorksSection />
              </div>
            </div>
            <div className="container mx-auto px-4">
              <StudentSearch />
            </div>
            <div className="bg-gradient-to-l from-credverse-soft-purple/10 to-credverse-soft-teal/10 py-16">
              <div className="container mx-auto px-4">
                <VerificationSection />
              </div>
            </div>
            <div className="container mx-auto px-4">
              <CTASection />
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Index;
