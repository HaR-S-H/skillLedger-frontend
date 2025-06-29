import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Building, CheckCircle, Clock, XCircle, User, Shield, Award, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import API from "@/api";
import FullScreenLoader from "@/components/FullScreenLoader";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  withCredentials:true,
});
const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [subscribedAppId, setSubscribedAppId] = useState(null);
  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await API.get('/dashboard');
        setApplications(res.data.data)
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
   fetchDashboard()
  },[])

useEffect(() => {
  if (!socket.connected) {
    socket.on("connect", () => {
      socket.emit("subscribeToOrganizations");
    });
  } else {
    socket.emit("subscribeToOrganizations");
  }

  socket.on("organizationUpdate", (newApplication) => {
    console.log("New organization received:", newApplication);
    // CHANGE ONLY THIS LINE - put new application first:
    setApplications((prev) => [newApplication, ...prev]);  // <- CHANGE: newApplication first
  });

  return () => {
    socket.off("organizationUpdate");
    socket.off("connect");
  };
}, []);

const handleApprove = async (applicationId) => {
  setApplications(prev =>
    prev.map(app =>
      app._id === applicationId
        ? { ...app, status: 'accepted', updatedAt: new Date().toISOString(), rejectedDate: undefined, rejectionReason: undefined }
        : app
    )
  );

  setIsApproveDialogOpen(false);

  try {
    await API.post("/admin/accept", { id: applicationId });
    toast.success('Issuer approved');
    
    // 👇 Set the approved ID to trigger socket subscription
    setSubscribedAppId(applicationId);
  } catch (error) {
    console.error(error);
    console.log(error);
    toast.error("Something went wrong");
  }
};

useEffect(() => {
  if (!subscribedAppId) return;

  const handleOrgStatusUpdate = (newApplication) => {
    console.log("New organization received:", newApplication);
   setApplications((prev) =>
  prev.map(app =>
    app._id === newApplication._id ? newApplication : app
  )
);
  };

  const subscribe = () => {
    socket.emit("subscribeToOrgStatus", subscribedAppId);
  };

  socket.on("connect", subscribe);
  socket.on("orgStatusUpdate", handleOrgStatusUpdate);

  if (socket.connected) {
    subscribe();
  }

  return () => {
    socket.off("connect", subscribe);
    socket.off("orgStatusUpdate", handleOrgStatusUpdate);
  };
}, [subscribedAppId]); // 🔁 only runs when this changes
  
  if(loading) return <FullScreenLoader/>
  
  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setIsDetailsOpen(true);
  };
  

  
  const handleReject = async (applicationId) => {
    if (!rejectionReason) {
      toast.error('Please provide a rejection reason.');
      return;
    }
    
    setApplications(prev => 
      prev.map(app => 
        app._id === applicationId 
          ? { 
              ...app, 
              status: 'rejected', 
              rejectedDate: new Date().toISOString(),
              rejectionReason: rejectionReason,
              updatedAt: undefined 
            } 
          : app
      )
    );
    setIsRejectDialogOpen(false);
    try {
        await API.post("/admin/reject",{id:applicationId,reason:rejectionReason});
         toast.success('Issuer Rejected');
         setRejectionReason("");
      } catch (error) {
      toast.error('something went wrong');
    }
    
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-200 text-yellow-800';
      case 'accepted':
        return 'bg-green-200 text-green-800';
      case 'rejected':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const pendingApplications = applications.filter(app => app.status === 'pending');
  const approvedApplications = applications.filter(app => app.status === 'accepted');
  const rejectedApplications = applications.filter(app => app.status === 'rejected');

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - CredVerse</title>
        <meta name="description" content="CredVerse admin dashboard for managing issuer applications" />
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
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-credverse-purple to-credverse-teal bg-clip-text text-transparent font-display">
                    Admin Dashboard
                  </h1>
                </div>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Manage issuer applications and maintain platform integrity
                </p>
              </div>
            </div>
            
            {/* Enhanced Tabs */}
            <Card className="glass-card p-2">
              <Tabs defaultValue="pending">
                <TabsList className="grid w-full grid-cols-3 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm h-16">
                  <TabsTrigger value="pending" className="flex flex-col items-center gap-1 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-credverse-purple transition-all duration-300">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Pending
                    </div>
                    <Badge className="bg-yellow-200 text-yellow-800 text-xs">{pendingApplications.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="approved" className="flex flex-col items-center gap-1 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-credverse-purple transition-all duration-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Approved
                    </div>
                    <Badge className="bg-green-200 text-green-800 text-xs">{approvedApplications.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="rejected" className="flex flex-col items-center gap-1 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-credverse-purple transition-all duration-300">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Rejected
                    </div>
                    <Badge className="bg-red-200 text-red-800 text-xs">{rejectedApplications.length}</Badge>
                  </TabsTrigger>
                </TabsList>
                
                <div className="mt-8">
                  <TabsContent value="pending" className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-2xl font-semibold bg-gradient-to-r from-credverse-purple to-credverse-teal bg-clip-text text-transparent">
                        Pending Applications
                      </h2>
                      <div className="h-px flex-1 bg-gradient-to-r from-credverse-purple/20 to-credverse-teal/20"></div>
                    </div>
                    {pendingApplications.length > 0 ? (
                      <div className="grid gap-6">
                        {pendingApplications.map((application, index) => (
                          <Card key={application._id} className="glass-card hover:scale-[1.02] transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                            <CardContent className="p-0">
                              <div className="flex flex-col md:flex-row justify-between p-6">
                                <div className="mb-4 md:mb-0 flex-1">
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 rounded-full bg-gradient-to-r from-credverse-purple/10 to-credverse-teal/10">
                                      <Building className="h-5 w-5 text-credverse-purple" />
                                    </div>
                                    <h3 className="font-semibold text-xl text-credverse-purple">{application.name}</h3>
                                    <Badge className={`${getStatusColor(application.status)} animate-pulse-slow`}>
                                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                    </Badge>
                                  </div>
                                  <div className="space-y-2 text-sm text-muted-foreground">
                                    <p className="flex items-center gap-2">
                                      <User className="h-4 w-4" />
                                      Contact: {application.contactPerson} ({application.email})
                                    </p>
                                    <p>Applied: {formatDate(application.createdAt)}</p>
                                  </div>
                                </div>
                                <div className="flex gap-3 md:self-center">
                                  <Button
                                    variant="outline"
                                    onClick={() => handleViewDetails(application)}
                                    className="hover:bg-credverse-soft-purple hover:border-credverse-purple transition-all duration-300"
                                  >
                                    View Details
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300"
                                    onClick={() => {
                                      setSelectedApplication(application);
                                      setIsRejectDialogOpen(true);
                                    }}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                  <Button
                                    className="bg-gradient-to-r from-credverse-purple to-credverse-teal hover:from-credverse-deep-purple hover:to-credverse-teal text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                    onClick={() => {
                                      setSelectedApplication(application);
                                      setIsApproveDialogOpen(true);
                                    }}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card className="glass-card">
                        <CardContent className="flex flex-col items-center justify-center p-12">
                          <div className="relative mb-6">
                            <Clock className="h-20 w-20 text-muted-foreground animate-pulse-slow" />
                            <div className="absolute inset-0 rounded-full bg-credverse-purple/10 blur-xl"></div>
                          </div>
                          <h3 className="text-xl font-semibold mb-2 text-credverse-purple">No pending applications</h3>
                          <p className="text-muted-foreground text-center max-w-md">
                            All caught up! New issuer applications will appear here for your review.
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                  
                  
                  
                  <TabsContent value="approved" className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-2xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        Approved Issuers
                      </h2>
                      <div className="h-px flex-1 bg-gradient-to-r from-green-200 to-emerald-200"></div>
                    </div>
                    {approvedApplications.length > 0 ? (
                      <div className="grid gap-6">
                        {approvedApplications.map((application, index) => (
                          <Card key={application._id} className="glass-card hover:scale-[1.02] transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                            
                            <CardContent className="p-0">
                              <div className="flex flex-col md:flex-row justify-between p-6">
                                <div className="mb-4 md:mb-0 flex-1">
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 rounded-full bg-green-100">
                                      <Building className="h-5 w-5 text-green-600" />
                                    </div>
                                    <h3 className="font-semibold text-xl text-green-600">{application.name}</h3>
                                    <Badge className={application.blockNumber?getStatusColor(application.status):getStatusColor('pending')}>
                                      {application.blockNumber?application.status.charAt(0).toUpperCase() + application.status.slice(1):'confirming...'}
                                    </Badge>
                                  </div>
                                  <div className="space-y-2 text-sm text-muted-foreground">
                                    <p className="flex items-center gap-2">
                                      <User className="h-4 w-4" />
                                      Contact: {application.contactPerson} ({application.email})
                                    </p>
                                    <p>Approved: {application.updatedAt ? formatDate(application.updatedAt) : 'N/A'}</p>
                                  </div>
                                </div>
                                <div className="flex gap-3 md:self-center">
                                  <Button
                                    variant="outline"
                                    onClick={() => handleViewDetails(application)}
                                    className="hover:bg-green-50 hover:border-green-200 transition-all duration-300"
                                  >
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card className="glass-card">
                        <CardContent className="flex flex-col items-center justify-center p-12">
                          <div className="relative mb-6">
                            <CheckCircle className="h-20 w-20 text-muted-foreground" />
                            <div className="absolute inset-0 rounded-full bg-green-500/10 blur-xl"></div>
                          </div>
                          <h3 className="text-xl font-semibold mb-2 text-green-600">No approved issuers yet</h3>
                          <p className="text-muted-foreground text-center max-w-md">
                            Approved issuers will appear here once applications are reviewed and accepted.
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="rejected" className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-2xl font-semibold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                        Rejected Applications
                      </h2>
                      <div className="h-px flex-1 bg-gradient-to-r from-red-200 to-pink-200"></div>
                    </div>
                    {rejectedApplications.length > 0 ? (
                      <div className="grid gap-6">
                        {rejectedApplications.map((application, index) => (
                          <Card key={application._id} className="glass-card hover:scale-[1.02] transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                            
                            <CardContent className="p-0">
                              <div className="flex flex-col md:flex-row justify-between p-6">
                                <div className="mb-4 md:mb-0 flex-1">
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 rounded-full bg-red-100">
                                      <Building className="h-5 w-5 text-red-600" />
                                    </div>
                                    <h3 className="font-semibold text-xl text-red-600">{application.name}</h3>
                                    <Badge className={getStatusColor(application.status)}>
                                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                    </Badge>
                                  </div>
                                  <div className="space-y-2 text-sm text-muted-foreground">
                                    <p className="flex items-center gap-2">
                                      <User className="h-4 w-4" />
                                      Contact: {application.contactPerson} ({application.email})
                                    </p>
                                    <p>Rejected: {application.updatedAt ? formatDate(application.updatedAt) : 'N/A'}</p>
                                  </div>
                                </div>
                                <div className="flex gap-3 md:self-center">
                                  <Button
                                    variant="outline"
                                    onClick={() => handleViewDetails(application)}
                                    className="hover:bg-red-50 hover:border-red-200 transition-all duration-300"
                                  >
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card className="glass-card">
                        <CardContent className="flex flex-col items-center justify-center p-12">
                          <div className="relative mb-6">
                            <XCircle className="h-20 w-20 text-muted-foreground" />
                            <div className="absolute inset-0 rounded-full bg-red-500/10 blur-xl"></div>
                          </div>
                          <h3 className="text-xl font-semibold mb-2 text-red-600">No rejected applications</h3>
                          <p className="text-muted-foreground text-center max-w-md">
                            Rejected applications will appear here for reference and review.
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>

      
      
      {selectedApplication && (
        <AlertDialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <AlertDialogContent className="max-w-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-credverse-purple" />
                {selectedApplication.name}
                <Badge className={`ml-2 ${getStatusColor(selectedApplication.status)}`}>
                  {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                </Badge>
              </AlertDialogTitle>
              <AlertDialogDescription>
                Applied on {formatDate(selectedApplication.createdAt)}
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="space-y-4 my-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Contact Person</h4>
                  <p className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {selectedApplication.contactPerson}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Email</h4>
                  <p>{selectedApplication.email}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Website</h4>
                  <p className="break-all">{selectedApplication.website}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Wallet Address</h4>
                  <p className="break-all font-mono text-sm">{selectedApplication.walletAddress}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Credential Types</h4>
                <p>{selectedApplication.credentialTypes}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                <p>{selectedApplication.description}</p>
              </div>
             {selectedApplication.blockNumber && <div><div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">blockNumber</h4>
                <p>{selectedApplication.blockNumber}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">transactionHash</h4>
                <p>{selectedApplication.transactionHash}</p>
              </div></div>}
              
              {selectedApplication.status === 'rejected' && selectedApplication.rejectionReason && (
                <div>
                  <h4 className="text-sm font-medium text-red-500 mb-1">Rejection Reason</h4>
                  <p className="text-red-500">{selectedApplication.rejectionReason}</p>
                </div>
              )}
            </div>
            
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
              {selectedApplication.status === 'pending' && (
                <>
                  <Button
                    variant="outline"
                    className="border-credverse-purple text-credverse-purple hover:bg-credverse-soft-purple hover:text-credverse-deep-purple"
                    onClick={() => {
                      setIsDetailsOpen(false);
                      setIsRejectDialogOpen(true);
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <AlertDialogAction 
                    className="bg-credverse-purple hover:bg-credverse-deep-purple"
                    onClick={() => {
                      setIsDetailsOpen(false);
                      setIsApproveDialogOpen(true);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </AlertDialogAction>
                </>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      
      {selectedApplication && (
        <AlertDialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Approve Issuer</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to approve {selectedApplication.name} as a credential issuer? 
                This will grant them access to the issuer dashboard.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-credverse-purple hover:bg-credverse-deep-purple"
                onClick={() => handleApprove(selectedApplication._id)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve Issuer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      
      {selectedApplication && (
        <Dialog open={isRejectDialogOpen} onOpenChange={(open) => {
          setIsRejectDialogOpen(open);
          if (!open) setRejectionReason("");
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Application</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting the application from {selectedApplication.name}.
              </DialogDescription>
            </DialogHeader>
            
            <div className="my-4">
              <label htmlFor="rejectionReason" className="text-sm font-medium">
                Rejection Reason
              </label>
              <Textarea
                id="rejectionReason"
                placeholder="Please explain why this application is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsRejectDialogOpen(false);
                  setRejectionReason("");
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-credverse-purple hover:bg-credverse-deep-purple"
                onClick={() => handleReject(selectedApplication._id)}
                disabled={!rejectionReason.trim()}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject Application
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AdminDashboard;
