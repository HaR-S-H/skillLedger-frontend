
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import CredentialCard from "@/components/CredentialCard";


const mockStudentData = {
  walletAddress: "0xf3b8...e92a",
  name: "Jane Developer",
  avatar: "",
  bio: "Full-stack developer passionate about blockchain technology and Web3 development.",
  credentials: [
    {
      id: "1",
      title: "Full Stack Web Development",
      issuer: "CodeAcademy",
      issuedDate: "May 15, 2023",
      category: "Development",
      icon: "🔷",
      color: "from-blue-500 to-purple-500",
      programType: "course",
      description: "Comprehensive full-stack web development course covering modern technologies",
      courseName: "Full Stack Web Development Bootcamp",
      courseLink: "https://codeacademy.com/fullstack",
      coursePdf: "https://example.com/course-materials.pdf",
      startDate: "March 1, 2023",
      endDate: "May 15, 2023",
      performanceReport: "https://example.com/performance.pdf",
      certificate: "https://example.com/certificate.pdf",
      transactionHash: "0x1234567890abcdef1234567890abcdef12345678",
      blockNumber: "18567432",
      organizationWalletAddress: "0xabcd1234567890abcdef1234567890abcdef1234"
    },
    {
      id: "2",
      title: "Software Engineering Internship",
      issuer: "TechCorp",
      issuedDate: "August 30, 2023",
      category: "Internship",
      icon: "💼",
      color: "from-green-500 to-emerald-500",
      programType: "internship",
      description: "3-month software engineering internship focusing on backend development",
      internshipName: "Backend Development Internship",
      stipend: "$2500/month",
      startDate: "June 1, 2023",
      endDate: "August 30, 2023",
      githubRepo: "https://github.com/techcorp/intern-projects",
      certificate: "https://example.com/internship-certificate.pdf",
      transactionHash: "0xabcdef1234567890abcdef1234567890abcdef12",
      blockNumber: "18456789",
      organizationWalletAddress: "0x9876543210abcdef9876543210abcdef98765432"
    },
    {
      id: "3",
      title: "Blockchain Developer",
      issuer: "Ethereum Foundation",
      issuedDate: "Jan 2023",
      category: "Development",
      icon: "⛓️",
      color: "from-indigo-500 to-cyan-400",
      programType: "course",
      description: "Advanced blockchain development course covering smart contracts and DApps",
      courseName: "Ethereum Smart Contract Development",
      courseLink: "https://ethereum.org/developers",
      coursePdf: "https://example.com/blockchain-course.pdf",
      startDate: "November 1, 2022",
      endDate: "January 15, 2023",
      performanceReport: "https://example.com/blockchain-performance.pdf",
      certificate: "https://example.com/blockchain-cert.pdf",
      transactionHash: "0x9876543210fedcba9876543210fedcba98765432",
      blockNumber: "18623451",
      organizationWalletAddress: "0xEthereumFoundation1234567890abcdef123"
    },
    {
      id: "4",
      title: "UX/UI Design Master",
      issuer: "Design Guild",
      issuedDate: "Mar 2023",
      category: "Design",
      icon: "🎨",
      color: "from-pink-500 to-orange-400",
      programType: "course",
      description: "Master-level UX/UI design program focusing on user research and prototyping",
      courseName: "Advanced UX/UI Design Mastery",
      courseLink: "https://designguild.com/courses/ux-ui-master",
      coursePdf: "https://example.com/design-course.pdf",
      startDate: "January 10, 2023",
      endDate: "March 20, 2023",
      performanceReport: "https://example.com/design-performance.pdf",
      certificate: "https://example.com/design-cert.pdf",
      transactionHash: "0xfedcba9876543210fedcba9876543210fedcba98",
      blockNumber: "18698765",
      organizationWalletAddress: "0xDesignGuild7890abcdef1234567890abcdef"
    }
  ]
};

const StudentSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    
    // Simulate API call
    setTimeout(() => {
      if (searchQuery.toLowerCase().includes("0xf3b8") || searchQuery.toLowerCase().includes("jane")) {
        setSearchResult(mockStudentData);
      } else {
        setSearchResult(null);
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="py-12 bg-secondary/20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-3">
            Search Student Profiles
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Find and verify student credentials by wallet address
          </p>
          
          <div className="max-w-2xl mx-auto flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Enter wallet address (e.g., 0xf3b8...e92a)"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>

        {hasSearched && (
          <div className="max-w-4xl mx-auto">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Searching for student profile...</p>
              </div>
            ) : searchResult ? (
              <div className="space-y-8">
                {/* Student Profile Card */}
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-credverse-purple to-credverse-teal text-white">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-20 h-20 border-4 border-white">
                        <AvatarImage src={searchResult.avatar} />
                        <AvatarFallback className="text-2xl font-bold bg-white text-credverse-purple">
                          {searchResult.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold">{searchResult.name}</h3>
                        <p className="text-white/80 font-mono text-sm">{searchResult.walletAddress}</p>
                        <p className="text-white/90 mt-2">{searchResult.bio}</p>
                      </div>
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        {searchResult.credentials.length} Credentials
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>

                {/* Credentials Grid */}
                <div>
                  <h4 className="text-xl font-semibold mb-6">Verified Credentials</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResult.credentials.map((credential) => (
                      <CredentialCard
                        key={credential.id}
                        credential={credential}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No student profile found for this wallet address.</p>
                <p className="text-sm text-muted-foreground mt-2">Try searching for: 0xf3b8...e92a</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default StudentSearch;
