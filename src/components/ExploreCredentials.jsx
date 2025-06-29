
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CredentialCard from "@/components/CredentialCard";

const categories = ["All", "Development", "Design", "Business", "Marketing", "Data Science"];

const mockCredentials = [
  {
    id: "1",
    title: "Full Stack Web Developer",
    issuer: "CodeAcademy",
    issuedDate: "May 2023",
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
    id: "3",
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
  },
  {
    id: "4",
    title: "Digital Marketing Expert",
    issuer: "Marketing Institute",
    issuedDate: "Jul 2023",
    category: "Marketing",
    icon: "📊",
    color: "from-green-500 to-emerald-400",
    programType: "course",
    description: "Expert-level digital marketing course covering SEO, SEM, and analytics",
    courseName: "Advanced Digital Marketing Certification",
    courseLink: "https://marketinginstitute.com/digital",
    coursePdf: "https://example.com/marketing-course.pdf",
    startDate: "May 1, 2023",
    endDate: "July 15, 2023",
    performanceReport: "https://example.com/marketing-performance.pdf",
    certificate: "https://example.com/marketing-cert.pdf",
    transactionHash: "0x5432109876fedcba5432109876fedcba54321098",
    blockNumber: "18756789",
    organizationWalletAddress: "0xMarketingInstitute234567890abcdef123"
  },
  {
    id: "5",
    title: "Data Analysis and Visualization",
    issuer: "DataCamp",
    issuedDate: "Apr 2023",
    category: "Data Science",
    icon: "📈",
    color: "from-blue-500 to-cyan-400",
    programType: "course",
    description: "Data analysis and visualization course using Python and R",
    courseName: "Data Science Fundamentals",
    courseLink: "https://datacamp.com/data-science",
    coursePdf: "https://example.com/data-course.pdf",
    startDate: "February 1, 2023",
    endDate: "April 15, 2023",
    performanceReport: "https://example.com/data-performance.pdf",
    certificate: "https://example.com/data-cert.pdf",
    transactionHash: "0x109876fedcba5432109876fedcba543210987654",
    blockNumber: "18678912",
    organizationWalletAddress: "0xDataCamp567890abcdef1234567890abcdef"
  },
  {
    id: "6",
    title: "Project Management Professional",
    issuer: "PMI",
    issuedDate: "Feb 2023",
    category: "Business",
    icon: "📋",
    color: "from-amber-500 to-orange-400",
    programType: "course",
    description: "Professional project management certification program",
    courseName: "PMP Certification Program",
    courseLink: "https://pmi.org/certifications/project-management-pmp",
    coursePdf: "https://example.com/pmp-course.pdf",
    startDate: "December 1, 2022",
    endDate: "February 15, 2023",
    performanceReport: "https://example.com/pmp-performance.pdf",
    certificate: "https://example.com/pmp-cert.pdf",
    transactionHash: "0x76fedcba543210987654321098765432109876fe",
    blockNumber: "18589034",
    organizationWalletAddress: "0xPMI890abcdef1234567890abcdef1234567"
  }
];

const ExploreCredentials = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredCredentials = mockCredentials.filter(cred => {
    const matchesCategory = activeCategory === "All" || cred.category === activeCategory;
    const matchesSearch = cred.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cred.issuer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  return (
    <section className="py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Explore Credentials
            </h2>
            <p className="text-muted-foreground">
              Discover verified skills and credentials from trusted issuers
            </p>
          </div>
          
          <div className="w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search credentials or issuers..."
                className="pl-10 w-full md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="grid" className="mb-8">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
            
            <TabsList>
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="grid" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCredentials.map((credential) => (
                <CredentialCard
                  key={credential.id}
                  credential={credential}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="mt-6">
            <div className="space-y-4">
              {filteredCredentials.map((credential) => (
                <div
                  key={credential.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-2xl">
                    {credential.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{credential.title}</h3>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <span>{credential.issuer}</span>
                      <span className="mx-2">•</span>
                      <span>{credential.issuedDate}</span>
                    </div>
                  </div>
                  <Badge variant="secondary">{credential.category}</Badge>
                  <Button variant="ghost" size="sm">
                    <Search className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {filteredCredentials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No credentials found matching your criteria.</p>
            <Button 
              variant="link" 
              onClick={() => {setSearchQuery(''); setActiveCategory('All');}}
            >
              Clear filters
            </Button>
          </div>
        )}
        
        <div className="flex justify-center mt-8">
          <Button variant="outline">Load More</Button>
        </div>
      </div>
    </section>
  );
};

export default ExploreCredentials;
