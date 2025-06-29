
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Globe, Zap, Award, Lock, Briefcase, GraduationCap } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Shield,
      title: "Blockchain Security",
      description: "Tamper-proof credentials secured by blockchain technology"
    },
    {
      icon: Users,
      title: "Global Recognition",
      description: "Instantly verifiable credentials accepted worldwide"
    },
    {
      icon: Globe,
      title: "Decentralized Network",
      description: "No single point of failure, owned by the community"
    },
    {
      icon: Zap,
      title: "Instant Verification",
      description: "Verify credentials in seconds, not days"
    }
  ];

  const stats = [
    { number: "10K+", label: "Verified Credentials", icon: Award },
    { number: "500+", label: "Partner Institutions", icon: GraduationCap },
    { number: "25K+", label: "Active Users", icon: Users },
    { number: "100%", label: "Fraud Prevention", icon: Lock }
  ];

  const team = [
    {
      name: "Alex Rodriguez",
      role: "CEO & Founder",
      bio: "Former blockchain architect at leading fintech companies",
      avatar: "👨‍💼"
    },
    {
      name: "Sarah Chen",
      role: "CTO",
      bio: "Expert in distributed systems and cryptography",
      avatar: "👩‍💻"
    },
    {
      name: "Michael Johnson",
      role: "Head of Education",
      bio: "15+ years in educational technology and credentialing",
      avatar: "👨‍🎓"
    },
    {
      name: "Emma Thompson",
      role: "Product Designer",
      bio: "UX specialist focused on Web3 user experiences",
      avatar: "👩‍🎨"
    }
  ];

  return (
    <>
      <Helmet>
        <title>About CredVerse - Decentralized Skill Verification</title>
        <meta name="description" content="Learn about CredVerse, a blockchain-powered platform for verifiable credentials and skill verification" />
      </Helmet>
      
      <div className="flex min-h-screen flex-col">
        <Navbar />
        
        <main className="flex-1 pt-20">
          {/* Hero Section */}
          <section className="relative py-20 md:py-28 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-credverse-soft-purple via-credverse-soft-teal to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"></div>
            <div className="hero-blob w-96 h-96 bg-credverse-purple/20 -top-48 -right-48"></div>
            <div className="hero-blob w-64 h-64 bg-credverse-teal/20 -bottom-32 -left-32"></div>
            
            <div className="container relative px-4 md:px-6">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <Badge variant="outline" className="mb-4 text-credverse-purple border-credverse-purple/30">
                  🚀 Revolutionizing Credentials
                </Badge>
                <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight">
                  About{" "}
                  <span className="bg-gradient-to-r from-credverse-purple to-credverse-teal bg-clip-text text-transparent">
                    CredVerse
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-3xl mx-auto">
                  Building the future of skill verification on the blockchain. 
                  Where trust meets technology, and credentials become truly yours.
                </p>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <div className="container px-4 md:px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-credverse-purple to-credverse-teal text-white mb-3">
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div className="text-3xl md:text-4xl font-display font-bold text-credverse-purple">
                      {stat.number}
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Mission Section */}
          <section className="py-20">
            <div className="container px-4 md:px-6">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                    Our <span className="text-credverse-purple">Mission</span>
                  </h2>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    To create a world where skills and achievements can be verified instantly and trusted completely
                  </p>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                      <Card className="glass-card p-8">
                        <CardContent className="space-y-4">
                          <Briefcase className="h-8 w-8 text-credverse-purple mb-4" />
                          <h3 className="text-2xl font-display font-semibold">The Problem</h3>
                          <p className="text-muted-foreground leading-relaxed">
                            Traditional credential verification is slow, expensive, and prone to fraud. 
                            HR departments waste countless hours verifying qualifications, while 25% of 
                            resumes contain significant falsehoods.
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-6">
                      <Card className="glass-card p-8">
                        <CardContent className="space-y-4">
                          <Shield className="h-8 w-8 text-credverse-teal mb-4" />
                          <h3 className="text-2xl font-display font-semibold">Our Solution</h3>
                          <p className="text-muted-foreground leading-relaxed">
                            CredVerse uses blockchain technology to create tamper-proof, instantly 
                            verifiable credentials. Skills become portable assets that follow you 
                            throughout your career journey.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 bg-gradient-to-r from-credverse-soft-purple/50 to-credverse-soft-teal/50">
            <div className="container px-4 md:px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                  Why Choose <span className="text-credverse-purple">CredVerse?</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Experience the next generation of credential verification with these powerful features
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <Card key={index} className="glass-card group hover:scale-105 transition-all duration-300">
                    <CardContent className="p-8 text-center space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-credverse-purple to-credverse-teal text-white group-hover:animate-pulse">
                        <feature.icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-display font-semibold">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="py-20">
            <div className="container px-4 md:px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                  Meet Our <span className="text-credverse-teal">Team</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Passionate experts in blockchain, education, and technology working to revolutionize credentials
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {team.map((member, index) => (
                  <Card key={index} className="glass-card group hover:scale-105 transition-all duration-300">
                    <CardContent className="p-8 text-center space-y-4">
                      <div className="text-4xl mb-4">{member.avatar}</div>
                      <h3 className="text-xl font-display font-semibold">
                        {member.name}
                      </h3>
                      <Badge variant="outline" className="text-credverse-purple border-credverse-purple/30">
                        {member.role}
                      </Badge>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {member.bio}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Vision Section */}
          <section className="py-20 bg-gradient-to-br from-credverse-purple/10 to-credverse-teal/10">
            <div className="container px-4 md:px-6">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <h2 className="text-4xl md:text-5xl font-display font-bold">
                  Our <span className="text-credverse-purple">Vision</span>
                </h2>
                <div className="space-y-8">
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    We envision a world where verified credentials are the norm, not the exception. 
                    Where individuals own their professional identities and can showcase their skills 
                    across borders and industries without friction.
                  </p>
                  
                  <Card className="glass-card p-8 md:p-12">
                    <CardContent className="space-y-6">
                      <Globe className="h-12 w-12 text-credverse-teal mx-auto" />
                      <h3 className="text-2xl font-display font-semibold">
                        Building a Trustworthy Future
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        By connecting the worlds of education, employment, and blockchain technology, 
                        CredVerse is building the infrastructure for a more trustworthy and efficient 
                        credential ecosystem. Where hiring becomes faster and more reliable, based on 
                        verified capabilities rather than self-reported claims.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>
          
          <CTASection />
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default About;
