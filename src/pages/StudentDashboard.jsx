
import { Helmet } from "react-helmet";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StudentProfile from "@/components/StudentProfile";
import StudentCredentials from "@/components/StudentCredentials";
import { User, Award, Sparkles } from "lucide-react";

const StudentDashboard = () => {
  return (
    <>
      <Helmet>
        <title>Student Dashboard - CredVerse</title>
        <meta name="description" content="Manage your profile and credentials on CredVerse" />
      </Helmet>
      
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-credverse-soft-purple/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navbar />
        
        <main className="flex-1 pt-20 pb-8">
          <div className="container px-4 md:px-6">
            {/* Enhanced Header */}
            <div className="text-center mb-12 relative">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="hero-blob absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-r from-credverse-purple/10 to-credverse-teal/10"></div>
                <div className="hero-blob absolute top-5 right-1/4 w-56 h-56 bg-gradient-to-r from-credverse-teal/10 to-credverse-purple/10"></div>
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 rounded-full bg-gradient-to-r from-credverse-purple to-credverse-teal mr-4">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-credverse-purple to-credverse-teal bg-clip-text text-transparent font-display">
                    Student Dashboard
                  </h1>
                </div>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Manage your profile, showcase your credentials, and track your learning journey
                </p>
              </div>
            </div>
            
            {/* Enhanced Tabs */}
            <Card className="glass-card p-2">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm h-14">
                  <TabsTrigger 
                    value="profile" 
                    className="flex items-center gap-2 text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-credverse-purple transition-all duration-300"
                  >
                    <User className="h-5 w-5" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger 
                    value="credentials"
                    className="flex items-center gap-2 text-base font-medium data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-credverse-purple transition-all duration-300"
                  >
                    <Award className="h-5 w-5" />
                    My Credentials
                  </TabsTrigger>
                </TabsList>
                
                <div className="mt-8">
                  <TabsContent value="profile" className="mt-0">
                    <div className="animate-fade-in-up">
                      <StudentProfile />
                    </div>
                  </TabsContent>
                  <TabsContent value="credentials" className="mt-0">
                    <div className="animate-fade-in-up">
                      <StudentCredentials />
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default StudentDashboard;
