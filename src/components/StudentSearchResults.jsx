import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import CredentialCard from "@/components/CredentialCard";
import CredentialDetailModal from "@/components/CredentialDetailModal";

const mockStudentProfiles = {
  "0xf3b8": {
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
        programType: "course" ,
        description: "Comprehensive full-stack web development program covering modern frameworks, databases, and deployment strategies.",
        courseName: "Advanced Full Stack Development Bootcamp",
        courseLink: "https://codeacademy.com/courses/fullstack",
        coursePdf: "https://example.com/course-materials.pdf",
        performanceReportPdf: "https://example.com/performance-report.pdf",
        startDate: "March 1, 2023",
        endDate: "May 15, 2023",
        certificatePdf: "https://example.com/certificate.pdf",
        transactionHash: "0x1234567890abcdef1234567890abcdef12345678",
        blockNumber: "18756432",
        organizationWalletAddress: "0xCodeAcademy1234567890abcdef123456789"
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
        description: "3-month intensive software engineering internship focusing on backend development and system architecture.",
        internshipName: "Backend Development Internship",
        stipend: "$2,500/month",
        githubRepoLink: "https://github.com/techcorp/intern-projects",
        startDate: "June 1, 2023",
        endDate: "August 30, 2023",
        certificatePdf: "https://example.com/internship-certificate.pdf",
        transactionHash: "0xabcdef1234567890abcdef1234567890abcdef12",
        blockNumber: "18892341",
        organizationWalletAddress: "0xTechCorp567890abcdef1234567890abcdef"
      },
      {
        id: "3",
        title: "Blockchain Developer",
        issuer: "Ethereum Foundation",
        issuedDate: "Jan 2023",
        category: "Development",
        icon: "⛓️",
        color: "from-indigo-500 to-cyan-400",
        programType: "course" ,
        description: "Advanced blockchain development course covering smart contracts, DApps, and Web3 integration.",
        courseName: "Ethereum Smart Contract Development",
        courseLink: "https://ethereum.org/en/developers/learning-tools/",
        coursePdf: "https://example.com/blockchain-course.pdf",
        performanceReportPdf: "https://example.com/blockchain-performance.pdf",
        startDate: "November 1, 2022",
        endDate: "January 15, 2023",
        certificatePdf: "https://example.com/blockchain-cert.pdf",
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
        programType: "course" ,
        description: "Master-level UX/UI design program focusing on user research, prototyping, and modern design systems.",
        courseName: "Advanced UX/UI Design Mastery",
        courseLink: "https://designguild.com/courses/ux-ui-master",
        coursePdf: "https://example.com/design-course.pdf",
        performanceReportPdf: "https://example.com/design-performance.pdf",
        startDate: "January 10, 2023",
        endDate: "March 20, 2023",
        certificatePdf: "https://example.com/design-cert.pdf",
        transactionHash: "0xfedcba9876543210fedcba9876543210fedcba98",
        blockNumber: "18698765",
        organizationWalletAddress: "0xDesignGuild7890abcdef1234567890abcdef"
      }
    ]
  },
  "0x234567876543": {
    walletAddress: "0x234567876543",
    name: "Alex Chen",
    avatar: "",
    bio: "Senior blockchain architect with expertise in DeFi protocols and smart contract security.",
    credentials: [
      {
        id: "1",
        title: "Smart Contract Security Audit",
        issuer: "ConsenSys Diligence",
        issuedDate: "December 10, 2023",
        category: "Security",
        icon: "🔒",
        color: "from-red-500 to-pink-500",
        programType: "course",
        description: "Professional certification in smart contract security auditing and vulnerability assessment.",
        courseName: "Advanced Smart Contract Security",
        courseLink: "https://consensys.net/diligence/audits/",
        coursePdf: "https://example.com/security-course.pdf",
        performanceReportPdf: "https://example.com/security-performance.pdf",
        startDate: "October 1, 2023",
        endDate: "December 10, 2023",
        certificatePdf: "https://example.com/security-cert.pdf",
        transactionHash: "0x5432109876fedcba5432109876fedcba54321098",
        blockNumber: "18956789",
        organizationWalletAddress: "0xConsenSys234567890abcdef1234567890"
      },
      {
        id: "2",
        title: "DeFi Protocol Developer",
        issuer: "Uniswap Labs",
        issuedDate: "September 22, 2023",
        category: "DeFi",
        icon: "🏦",
        color: "from-purple-500 to-indigo-500",
        programType: "internship" ,
        description: "6-month research and development internship working on next-generation DeFi protocols.",
        internshipName: "DeFi Protocol Research Internship",
        stipend: "$4,000/month",
        githubRepoLink: "https://github.com/uniswap/defi-research",
        startDate: "March 22, 2023",
        endDate: "September 22, 2023",
        certificatePdf: "https://example.com/defi-cert.pdf",
        transactionHash: "0x109876fedcba5432109876fedcba543210987654",
        blockNumber: "18876543",
        organizationWalletAddress: "0xUniswapLabs90abcdef1234567890abcdef123"
      },
      {
        id: "3",
        title: "Solidity Advanced Certification",
        issuer: "Ethereum Foundation",
        issuedDate: "June 15, 2023",
        category: "Development",
        icon: "⛓️",
        color: "from-indigo-500 to-cyan-400",
        programType: "course",
        description: "Advanced Solidity programming certification covering gas optimization, security patterns, and advanced features.",
        courseName: "Solidity Expert Certification",
        courseLink: "https://ethereum.org/en/developers/docs/smart-contracts/languages/#solidity",
        coursePdf: "https://example.com/solidity-course.pdf",
        performanceReportPdf: "https://example.com/solidity-performance.pdf",
        startDate: "April 1, 2023",
        endDate: "June 15, 2023",
        certificatePdf: "https://example.com/solidity-cert.pdf",
        transactionHash: "0x76fedcba543210987654321098765432109876fe",
        blockNumber: "18789012",
        organizationWalletAddress: "0xEthereumFoundation1234567890abcdef123"
      }
    ]
  }
};


const StudentSearchResults = ({ searchQuery, onClose }) => {
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const normalizedQuery = searchQuery.toLowerCase().trim();
        
        // Check if the query matches any of our mock profiles
        let foundProfile = null;
        
        for (const [key, profile] of Object.entries(mockStudentProfiles)) {
          if (normalizedQuery.includes(key.toLowerCase()) || 
              normalizedQuery.includes(profile.name.toLowerCase()) ||
              normalizedQuery === profile.walletAddress.toLowerCase()) {
            foundProfile = profile;
            break;
          }
        }
        
        setSearchResult(foundProfile);
        setIsLoading(false);
      }, 1000);
    }
  }, [searchQuery]);

  const handleCredentialClick = (credential) => {
    setSelectedCredential(credential);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCredential(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Search Results</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

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
                      onClick={() => handleCredentialClick(credential)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No student profile found for this wallet address.</p>
              <p className="text-sm text-muted-foreground mt-2">Try searching for: 0xf3b8...e92a or 0x234567876543</p>
            </div>
          )}
        </div>
      </div>

      {/* Credential Detail Modal */}
      <CredentialDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        credential={selectedCredential}
      />
    </div>
  );
};

export default StudentSearchResults;
