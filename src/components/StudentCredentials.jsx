
import React, { useState ,useEffect} from 'react';
import { Search, Filter, Award, TrendingUp, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CredentialCard from './CredentialCard';
import CredentialDetailModal from './CredentialDetailModal';
import API from '@/api';
import FullScreenLoader from './FullScreenLoader';
 


const StudentCredentials = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCredential, setSelectedCredential] = useState(null);
   const defaultcredentials= [
    {
      id: '1',
      title: 'Full Stack Web Development',
      issuer: 'TechEd Institute',
      issuedDate: '2024-03-15',
      category: 'Technology',
      icon: '💻',
      color: 'from-blue-500 to-cyan-500',
      programType: 'course',
      description: 'Comprehensive full-stack web development course covering modern technologies',
      courseName: 'Full Stack Web Development Bootcamp',
      courseLink: 'https://techinstitute.com/fullstack',
      coursePdf: 'https://example.com/course-syllabus.pdf',
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      performanceReport: 'https://example.com/performance.pdf',
      certificate: 'https://example.com/certificate.pdf',
      certificatePdf: 'https://example.com/certificate.pdf',
      transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
      blockNumber: '18567432',
      organizationWalletAddress: '0xabcd1234567890abcdef1234567890abcdef1234'
    },
    {
      id: '2',
      title: 'Software Engineering Internship',
      issuer: 'InnovaCorp',
      issuedDate: '2024-02-20',
      category: 'Technology',
      icon: '🚀',
      color: 'from-purple-500 to-pink-500',
      programType: 'internship',
      description: '3-month software engineering internship focusing on backend development',
      internshipName: 'Backend Development Internship',
      stipend: '$2000/month',
      startDate: '2023-11-01',
      endDate: '2024-02-01',
      githubRepo: 'https://github.com/innovacorp/intern-project',
      certificate: 'https://example.com/internship-certificate.pdf',
      certificatePdf: 'https://example.com/internship-certificate.pdf',
      blockNumber: '18456789',
      transactionHash: '0xabcdef1234567890abcdef1234567890abcdef12',
      organizationWalletAddress: '0x9876543210abcdef9876543210abcdef98765432'
    },
    {
      id: '3',
      title: 'Data Science Fundamentals',
      issuer: 'DataLearn Academy',
      issuedDate: '2024-01-10',
      category: 'Data Science',
      icon: '📊',
      color: 'from-green-500 to-emerald-500',
      programType: 'course',
      description: 'Introduction to data science concepts and practical applications',
      courseName: 'Data Science Fundamentals',
      courseLink: 'https://datalearn.com/fundamentals',
      coursePdf: 'https://example.com/ds-syllabus.pdf',
      startDate: '2023-10-01',
      endDate: '2024-01-10',
      performanceReport: 'https://example.com/ds-performance.pdf',
      certificate: 'https://example.com/ds-certificate.pdf',
      certificatePdf: 'https://example.com/ds-certificate.pdf',
      transactionHash: '0xfedcba0987654321fedcba0987654321fedcba09',
      blockNumber: '18345123',
      organizationWalletAddress: '0x1357924680acbd1357924680acbd13579246'
    }
  ];
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
    useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await API.get(`${import.meta.env.VITE_BACKEND_URL}/dashboard`);
        const data = res.data.data;         
        if (data?.skills) {
          console.log(data.skills);
          setCredentials(data.skills);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Could not load credentials.");
      } finally {
        setLoading(false);
      }
    }
      fetchProfile();
  }, []);
  // Updated mock data with complete structure


  const filteredCredentials = credentials.filter(credential => {
    const matchesSearch = credential.programId.skillName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         credential.organization.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
  
  if(loading) return <FullScreenLoader/>

  const stats = {
    total: credentials.length,
    thisMonth: credentials.filter(c => {
      const issueDate = new Date(c.createdAt);
      const now = new Date();
      return issueDate.getMonth() === now.getMonth() && issueDate.getFullYear() === now.getFullYear();
    }).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-credverse-soft-purple/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header with Floating Elements */}
        <div className="text-center space-y-6 relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="hero-blob absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-r from-credverse-purple/20 to-credverse-teal/20"></div>
            <div className="hero-blob absolute top-10 right-1/4 w-64 h-64 bg-gradient-to-r from-credverse-teal/15 to-credverse-purple/15"></div>
          </div>
          <div className="relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-credverse-purple via-credverse-teal to-credverse-purple bg-clip-text text-transparent font-display animate-fade-in-up">
              My Credentials
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
              Your verified achievements and certifications stored securely on the blockchain, 
              showcasing your skills to the world
            </p>
          </div>
        </div>

        {/* Enhanced Stats Cards with Hover Effects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="glass-card hover:scale-105 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-credverse-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Credentials</CardTitle>
              <div className="p-2 rounded-full bg-credverse-purple/10 group-hover:bg-credverse-purple/20 transition-colors duration-300">
                <Award className="h-5 w-5 text-credverse-purple" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-credverse-purple">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">Blockchain verified</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card hover:scale-105 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-credverse-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
              <div className="p-2 rounded-full bg-credverse-teal/10 group-hover:bg-credverse-teal/20 transition-colors duration-300">
                <TrendingUp className="h-5 w-5 text-credverse-teal" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-credverse-teal">{stats.thisMonth}</div>
              <p className="text-xs text-muted-foreground mt-1">Recent achievements</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Search and Filter Section */}
        <Card className="glass-card p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search your credentials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-lg border-none bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm focus:bg-white dark:focus:bg-slate-800 transition-all duration-300"
              />
            </div>
          </div>
        </Card>

        {/* Enhanced Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCredentials.map((credential, index) => (
            <div key={credential._id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <CredentialCard
                credential={credential}
                onClick={() => setSelectedCredential(credential)}
              />
            </div>
          ))}
        </div>

        {filteredCredentials.length === 0 && (
          <Card className="glass-card">
            <CardContent className="text-center py-16">
              <div className="relative">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-6 animate-pulse-slow" />
                <div className="absolute inset-0 rounded-full bg-credverse-purple/10 blur-xl"></div>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-credverse-purple">No credentials found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Try adjusting your search or filter criteria to discover your achievements
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <CredentialDetailModal
        credential={selectedCredential}
        isOpen={!!selectedCredential}
        onClose={() => setSelectedCredential(null)}
      />
    </div>
  );
};

export default StudentCredentials;
