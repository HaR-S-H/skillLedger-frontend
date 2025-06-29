
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-credverse-purple/10 to-credverse-teal/10"></div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Ready to Build Your Verified Credential Profile?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join the CredVerse ecosystem today and take control of your professional identity with blockchain-verified credentials.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-gradient-to-r from-credverse-purple to-credverse-deep-purple hover:opacity-90">
              <Link to="/explore">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
