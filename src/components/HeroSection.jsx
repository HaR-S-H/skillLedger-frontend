
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Link as LinkIcon, User, Search } from 'lucide-react';
import StudentSearchResults from './StudentSearchResults';

const HeroSection = () => {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    console.log("Searching for:", searchQuery);
    setShowResults(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-credverse-purple/30 hero-blob -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-credverse-teal/30 hero-blob translate-x-1/2 translate-y-1/2" />
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-credverse-purple to-credverse-teal">
                Verify Skills on the Blockchain
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Skill ledger is a decentralized platform for verifiable skills and credentials. 
                Build your trusted Web3 profile and showcase your achievements to the world.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="bg-gradient-to-r from-credverse-purple to-credverse-deep-purple hover:opacity-90 transition-opacity">
                <Link to="/explore">
                  Explore Credentials
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/issuers">
                  For Institutions
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center text-gray-500">
                <Award className="h-5 w-5 mr-1" />
                <span>100% Verifiable</span>
              </div>
              <div className="flex items-center text-gray-500">
                <LinkIcon className="h-5 w-5 mr-1" />
                <span>Blockchain Secured</span>
              </div>
              <div className="flex items-center text-gray-500">
                <User className="h-5 w-5 mr-1" />
                <span>Self-Sovereign</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            {/* Search Bar */}
            <div className="w-full max-w-xs mt-[-40px] mb-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Enter wallet address..."
                  className="pl-10 bg-white/90 backdrop-blur-sm border-white/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>

            {/* Jane Developer Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="w-full h-full absolute -inset-1 rounded-3xl bg-gradient-to-r from-credverse-purple to-credverse-teal blur-lg opacity-50 animate-pulse-slow" />
              <div className="relative bg-card border shadow-xl rounded-3xl p-6 overflow-hidden backdrop-blur-sm">
                <div className="w-full max-w-md space-y-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-credverse-purple to-credverse-teal flex items-center justify-center">
                      <span className="text-white text-xl font-bold">JD</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Jane Developer</h3>
                      <p className="text-sm text-muted-foreground">0xf3b8...e92a</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm uppercase text-muted-foreground tracking-wider">Verified Credentials</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { title: "React Expert", issuer: "CodeAcademy", icon: "🔷" },
                        { title: "Solidity Developer", issuer: "Ethereum Foundation", icon: "⛓️" },
                        { title: "UX Designer", issuer: "Design Guild", icon: "🎨" },
                        { title: "Project Management", issuer: "PMI", icon: "📊" }
                      ].map((cred) => (
                        <div key={cred.title} className="credential-card p-4">
                          <div className="text-2xl mb-2">{cred.icon}</div>
                          <h5 className="font-semibold text-sm">{cred.title}</h5>
                          <p className="text-xs opacity-70">{cred.issuer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-between items-center border-t border-border mt-8">
                    <p className="text-xs text-muted-foreground">Verified on Ethereum</p>
                    <Button variant="ghost" size="sm">View Profile</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {showResults && (
        <StudentSearchResults 
          searchQuery={searchQuery} 
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
};

export default HeroSection;
