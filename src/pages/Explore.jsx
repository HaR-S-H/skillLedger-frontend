
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import ExploreCredentials from "@/components/ExploreCredentials";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Explore = () => {
  return (
    <>
      <Helmet>
        <title>Explore Credentials - CredVerse</title>
        <meta name="description" content="Explore verified skills and credentials from trusted issuers on the CredVerse platform" />
      </Helmet>
      
      <div className="flex min-h-screen flex-col">
        <Navbar />
        
        <main className="flex-1 pt-20">
          <div className="container px-4 md:px-6 py-10">
            <h1 className="text-4xl font-bold tracking-tight mb-3">
              Explore Credentials
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover and verify skills from across the CredVerse ecosystem
            </p>
          </div>
          <ExploreCredentials />
          <CTASection />
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Explore;
