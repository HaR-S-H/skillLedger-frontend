
import { useEffect, useState,useRef } from "react";
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Award, Check, Clock, FileText, Plus, Search, Shield, User, Briefcase, BookOpen, Calendar, Github, Edit, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import API from "@/api";
import FullScreenLoader from "@/components/FullScreenLoader";
import { mintCredential, mintCredentialInternship } from "@/blockchain/mintCredential";
import { useWallet } from "@/contexts/WalletContext";

// Mock programs data - updated with date objects
const mockPrograms = [
  {
    _id: "prog-1",
    name: "Full Stack Web Development",
    description: "12-week intensive bootcamp covering modern web development frameworks and practices",
    type: "Course",
    startDate: new Date(2023, 5, 1), // June 1, 2023
    endDate: new Date(2023, 7, 24), // August 24, 2023
    createdAt: "2023-03-01T10:00:00",
    courseLink: "https://example.com/courses/fullstack",
    syllabusFileName: "fullstack-syllabus.pdf",
    prerequisites: "Basic knowledge of HTML, CSS, and JavaScript"
  },
  {
    _id: "prog-2",
    name: "Advanced JavaScript",
    description: "Master JavaScript including ES6+, async programming, and functional patterns",
    type: "Course",
    startDate: new Date(2023, 4, 15), // May 15, 2023
    endDate: new Date(2023, 5, 12), // June 12, 2023
    createdAt: "2023-02-15T09:30:00",
    courseLink: "https://example.com/courses/advanced-js",
    syllabusFileName: "advanced-js-syllabus.pdf",
    prerequisites: "Intermediate JavaScript knowledge"
  },
  {
    _id: "prog-3",
    name: "Frontend Engineering Internship",
    type: "Internship",
    description: "Gain practical experience working on real-world frontend projects",
    startDate: new Date(2023, 0, 10), // Jan 10, 2023
    endDate: new Date(2023, 3, 10), // April 10, 2023
    createdAt: "2023-01-10T14:00:00",
    remotePossible: true
  }
];

// Mock data for issued credentials
const mockCredentials = [
  {
    _id: "cred-1",
    recipientName: "Alice Johnson",
    recipientEmail: "alice@example.com",
    recipientWalletAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    credentialName: "Full Stack Web Development",
    credentialDescription: "Completed 12-week intensive bootcamp covering modern web development frameworks and practices",
    credentialType: "Course",
    issueDate: "2023-04-15T10:30:00",
    txHash: "0x3a1076bf45ab87712ad64ccb3b10217737f7faacbf2872e88fdd9a537d8fe266",
    performanceReportUrl: "https://example.com/reports/alice-performance.pdf",
    certificateUrl: "https://example.com/certificates/alice-certificate.pdf"
  },
  {
    _id: "cred-2",
    recipientName: "Bob Smith",
    recipientEmail: "bob@example.com",
    recipientWalletAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    credentialName: "Frontend Engineering Internship",
    credentialDescription: "Completed 3-month internship working on real-world frontend projects",
    credentialType: "Internship",
    issueDate: "2023-04-10T14:20:00",
    txHash: "0x8929d6c992a7786feae0995be4b3f3937eb6d2b4a672b909a09eee4a6495f4c2",
    githubRepoUrl: "https://github.com/bobsmith/frontend-internship-project",
    certificateUrl: "https://example.com/certificates/bob-internship.pdf"
  },
];


const IssuerDashboard = () => {
  const [credentials, setCredentials] = useState(mockCredentials);
  const [programs, setPrograms] = useState(mockPrograms);
  const [issuingCredential, setIssuingCredential] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);
  const [editingProgramId, setEditingProgramId] = useState(null);
  const [editedProgram, setEditedProgram] = useState({});
  const [isPending, setIsPending] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const [organizationData, setOrganizationData] = useState(null);
  const { account,signer } = useWallet();
  // Program state
  const [activeTab, setActiveTab] = useState("programs"); // default can be "manage"

  const [newProgram, setNewProgram] = useState({
    name: "",
    description: "",
    type: "Course", // Default to Course
    startDate: new Date(),
    endDate: new Date(),
    // Course specific
    courseLink: "",
    syllabus: "",
    syllabusFileName: "",
    skillName: "",
    // Internship specific
    remotePossible: false
  });
  const [ipfsData, setIpfsData] = useState(null);
  // Credential state
  const [newCredential, setNewCredential] = useState({
    recipientName: "",
    recipientEmail: "",
    recipientWalletAddress: "",
    credentialName: "",
    credentialDescription: "",
    credentialType: "",
    performanceReport: null,
    performanceReportFileName: "",
    certificate: null,
    certificateFileName: "",
    stipend:"",
    githubRepoUrl: ""
  });
  
  const [selectedProgram, setSelectedProgram] = useState(null);


  useEffect(() => {
  const fetchIpfsData = async () => {
    if (!selectedCredential?.tokenURI) return;

    try {
      setLoading(true);
      const response = await fetch(selectedCredential.tokenURI);
      const data = await response.json();
      setIpfsData(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch IPFS data", error);
    }
  };

  fetchIpfsData();
}, [selectedCredential]);

useEffect(() => {
  async function fetchOrganization() {
    try {
      const res = await API.get("/dashboard");
      console.log(res);
      setOrganizationData(res.data.data);
   setPrograms( [
  ...res.data.data.courses,
  ...res.data.data.internships
   ]);
      setCredentials(res.data.data.skills)
    } catch (error) {
      console.log(error);
      
      if (error.response?.data?.message === "Your organization is still pending approval") {
        setIsPending(true);
      } else {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  fetchOrganization();
}, []);


  if (loading) return <FullScreenLoader />;
  // if (isPending) return <div>Your organization is pending approval by admin.</div>;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCredential(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFileInputChange = (e, fieldName, fileNameField) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewCredential(prev => ({
        ...prev,
        [fieldName]: file,
        [fileNameField]: file.name
      }));
    }
  };
  
  const handleProgramFileInputChange = (e,fieldName, fileNameField) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewProgram(prev => ({
        ...prev,
        [fieldName]: file,
        [fileNameField]: file.name
      }));
    }
  };
  
  const handleEditProgramFileInputChange = (e, fieldName, fileNameField) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditedProgram(prev => ({
        ...prev,
        [fieldName]: file,
        [fileNameField]: file.name
      }));
    }
  };
  
  const handleProgramInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Special handling for checkbox (remotePossible)
    if (name === "remotePossible" && e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      processedValue = e.target.checked;
    }
    
    setNewProgram(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleEditProgramInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Special handling for checkbox (remotePossible)
    if (name === "remotePossible" && e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      processedValue = e.target.checked;
    }
    
    setEditedProgram(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };
  
  const handleDateChange = (date, fieldName) => {
    if (date) {
      setNewProgram(prev => ({
        ...prev,
        [fieldName]: date
      }));
    }
  };

  const handleEditDateChange = (date, fieldName) => {
    if (date) {
      setEditedProgram(prev => ({
        ...prev,
        [fieldName]: date
      }));
    }
  };
  
  const handleAddProgram = async(e) => {
    e.preventDefault();
    if (!newProgram.startDate || !newProgram.endDate) {
      toast.error('Missing Information');
      return;
    }   

    // console.log(newProgram);
    const newProg = {
      _id: `prog-${programs.length + 1}`,
      name: newProgram.name || "",
      description: newProgram.description || "",
      type: newProgram.type ,
      startDate: newProgram.startDate,
      endDate: newProgram.endDate,
      skillName:newProgram.skillName,
      createdAt: new Date().toISOString(),
      ...(newProgram.type === "Course" ? {
        courseLink: newProgram.courseLink,
        syllabus: newProgram.syllabus,
        syllabusFileName: newProgram.syllabusFileName,
        skillName: newProgram.skillName,
      } : {
        remotePossible: newProgram.remotePossible
      })
    };
    
    // console.log(newProg);
    
    // Reset the form
    setNewProgram({
      name: "",
      description: "",
      type: "Course",
      startDate: new Date(),
      endDate: new Date(),
      courseLink: "",
      syllabus: "",
      syllabusFileName: "",
      skillName: "",
      remotePossible: false
    });
       if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    try {
      
  if (newProg.type === "Course") {
    const form = new FormData();
    form.append("courseName", newProg.name);
    form.append("description", newProg.description);
    form.append("courseLink", newProg.courseLink);
    form.append("skillName", newProg.skillName);
    form.append("startDate", newProg.startDate);
    form.append("endDate", newProg.endDate);
    form.append("coursePdf", newProg.syllabus);

  const res= await toast.promise(
      API.post("/course", form),
      {
        pending: `Adding ${newProg.type}...`,
        success: `${newProg.type} added successfully!`,
        error: "Failed to add the program. Please try again."
    }

    );
    newProg._id = res.data.data._id;
    setPrograms(prev => [newProg, ...prev]);
  } else {
    
    const form = new FormData();
    form.append("skillName", newProg.name);
    form.append("description", newProg.description);
    form.append("startDate", newProg.startDate);
    form.append("endDate", newProg.endDate);
  const res= await toast.promise(
      API.post("/internship", form),
      {
        pending: `Adding ${newProg.type}...`,
        success: `${newProg.type} added successfully!`,
        error: "Failed to add the program. Please try again."
      }
    );
        newProg._id = res.data.data._id;
       setPrograms(prev => [newProg, ...prev]);
      }
} catch (error) {
  console.log(error);
} 

  };

  const handleEditProgram = (program) => {
    setEditingProgramId(program._id);
    setEditedProgram({
      ...program
    });
  };

  const handleUpdateProgram = async(e, program) => {
    e.preventDefault();

    if (!editedProgram.startDate || !editedProgram.endDate) {
      toast.error('Missing Information');
      return;
    }

    try {
      
    } catch (error) {
      
    }

    setPrograms(prevPrograms => 
      prevPrograms.map(prog => 
        prog._id === program._id ? {...prog, ...editedProgram} : prog
      )
    );
    try {
      if (program.type === "Course") {
        const res = await toast.promise(
          API.put(`/course/${program._id}`, {...editedProgram} ),
      {
        pending: `updating ${program.type}...`,
        success: `${program.type} updated successfully!`,
        error: "Failed to update the program. Please try again."
      }
    );
    // console.log(res);
    
    setEditingProgramId(null);
    setEditedProgram({});
      } else {
          await toast.promise(
          API.put(`/internship/${program._id}`, {...editedProgram} ),
      {
        pending: `updating ${program.type}...`,
        success: `${program.type} updated successfully!`,
        error: "Failed to update the program. Please try again."
      }
        );
    setEditingProgramId(null);
    setEditedProgram({});
  }
} catch (error) {
  // console.log(error);
}
  };

  const handleCancelEdit = () => {
    setEditingProgramId(null);
    setEditedProgram({});
  };

  const handleDeleteProgramConfirm = (program) => {
    setProgramToDelete(program);
    setIsDeleteDialogOpen(true);
  };

    const handleDeleteProgram = async() => {
    if (programToDelete) {
      setPrograms(prevPrograms => prevPrograms.filter(prog => prog._id !== programToDelete._id));
      try {
        setIsDeleteDialogOpen(false);
        if (programToDelete.type === "Course") {
           await toast.promise(
          API.delete(`/course/${programToDelete._id}`),
      {
        pending: `deleting ${programToDelete.type}...`,
        success: `${programToDelete.type} deleted successfully!`,
        error: "Failed to delete the program. Please try again."
      }
    );
        } else {
          await toast.promise(
          API.delete(`/internship/${programToDelete._id}`),
      {
        pending: `deleting ${programToDelete.type}...`,
        success: `${programToDelete.type} deleted successfully!`,
        error: "Failed to delete the program. Please try again."
      }
    );
        }
        setProgramToDelete(null);
      } catch (error) {
        console.log(error);
        
      }
    }
  };
  
  const handleSelectProgram = (program) => {
    setSelectedProgram(program);
    setNewCredential(prev => ({
      ...prev,
      credentialName:program.skillName || program.name,
      credentialDescription: program.description,
      credentialType: program.type
    }));

    // Switch to the issue tab
    // const issueTab = document.querySelector('button[value="issue"]');
    // if (issueTab instanceof HTMLElement) {
    //   issueTab.click();
    // }
    setActiveTab("issue");
  };
  


  const handleIssueCredential = async (e) => {
    e.preventDefault();
  const issueCredentialPromise = async () => {
    // Step 1: Prepare credential data
    const issueDate = new Date().toISOString();
    const _id = `cred-${credentials.length + 1}`;
    let newCred;
    
    const getFileUrl = (file) => {
      return file ? URL.createObjectURL(file) : "";
    };
    
    // Step 2: Create credential object based on type
    if (newCredential.credentialType === "Course" && newCredential.performanceReport && newCredential.certificate) {
      const performanceReportUrl = getFileUrl(newCredential.performanceReport);
      const certificateUrl = getFileUrl(newCredential.certificate);
      
      newCred = {
        _id,
        recipientName: newCredential.recipientName,
        recipientEmail: newCredential.recipientEmail,
        recipientWalletAddress: newCredential.recipientWalletAddress,
        credentialName: newCredential.credentialName,
        credentialDescription: newCredential.credentialDescription,
        credentialType: "Course",
        issueDate,
        txHash: "",
        blockNumber: "",
        performanceReportUrl,
        certificateUrl
      };
      
      // Step 3: Mint on blockchain
      const res = await mintCredential({
        name: newCred.credentialName,
        courseId: selectedProgram._id,
        email: newCred.recipientEmail,
        walletAddress: newCred.recipientWalletAddress,
        certificate: newCredential.certificate,
        performanceReport: newCredential.performanceReport
      }, account, signer);
      
      newCred.txHash = res.transactionHash || res.hash;
      newCred.blockNumber = res.blockNumber;
      
    } else if (newCredential.credentialType === "Internship" && newCredential.githubRepoUrl && newCredential.certificate) {
      const certificateUrl = getFileUrl(newCredential.certificate);
      
      newCred = {
        _id,
        recipientName: newCredential.recipientName,
        recipientEmail: newCredential.recipientEmail,
        recipientWalletAddress: newCredential.recipientWalletAddress,
        credentialName: newCredential.credentialName,
        credentialDescription: newCredential.credentialDescription,
        credentialType: "Internship",
        stipend:newCredential.stipend,
        issueDate,
        txHash: "",
        blockNumber: "",
        githubRepoUrl: newCredential.githubRepoUrl,
        certificateUrl
      };
      
      // Mint internship credential
      const res = await mintCredentialInternship({
        name: newCred.credentialName,
        internshipId: selectedProgram._id,
        email: newCred.recipientEmail,
        walletAddress: newCred.recipientWalletAddress,
        stipend:newCred.stipend,
        certificate: newCredential.certificate,
        githubUrl: newCredential.githubRepoUrl
      }, account, signer);
      
      newCred.txHash = res.transactionHash || res.hash;
      newCred.blockNumber = res.blockNumber;
      
    } else {
      throw new Error('Invalid credential type or missing required fields');
    }
    
    // Step 4: Update local state
    setCredentials(prev => [newCred, ...prev]);
    
    // Step 5: Reset form
    setNewCredential({
      recipientName: "",
      recipientEmail: "",
      recipientWalletAddress: "",
      credentialName: selectedProgram ? selectedProgram.name : "",
      credentialDescription: selectedProgram ? selectedProgram.description : "",
      credentialType: selectedProgram ? selectedProgram.type : "",
      performanceReport: null,
      performanceReportFileName: "",
      certificate: null,
      certificateFileName: "",
      stipend:"",
      githubRepoUrl: ""
    });
    
    setSelectedProgram(null);
    
    return {
      credential: newCred,
      txHash: newCred.txHash,
      blockNumber: newCred.blockNumber
    };
  };

  try {
    setIssuingCredential(true);
    
    const result = await toast.promise(
      issueCredentialPromise(),
      {
        pending: {
          render() {
            return "Uploading files to block chain and minting credential...";
          }
        },
        success: {
          render({ data }) {
            return (
              <div>
                <div><strong>Credential issued successfully!</strong></div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>
                  Transaction Hash: {data.txHash?.substring(0, 20)}...
                </div>
                <div style={{ fontSize: '12px' }}>
                  Block: {data.blockNumber}
                </div>
              </div>
            );
          }
        },
        error: {
          render({ data }) {
            return (
              <div>
                <div><strong>Failed to issue credential</strong></div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>
                  {data?.message || 'Unknown error occurred'}
                </div>
              </div>
            );
          }
        }
      },
      {
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored"
      }
    );
    
    console.log('Credential issued:', result);
    
  } catch (error) {
    console.error('Credential issuance failed:', error);
    // Additional error handling if needed
  } finally {
    setIssuingCredential(false);
  }
};

// Call this function when you want to issue a credential
// handleCredentialIssuance();
  
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
  
  const handleViewCredential = (credential) => {
    setSelectedCredential(credential);
    console.log(credential);
    
    setIsDialogOpen(true);
  };
  
  const filteredCredentials = credentials.filter(cred => 
    (cred.recipientName || cred.student?.name || '').toLowerCase().includes(searchTerm.toLowerCase())||
    (cred.recipientWalletAddress || cred.student?.walletAddress || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cred.credentialName || cred.programId?.skillName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Issuer Dashboard - CredVerse</title>
        <meta name="description" content="Issue and manage blockchain credentials on the CredVerse platform" />
      </Helmet>
      
      <div className="flex min-h-screen flex-col">
        <Navbar />
        
        <main className="flex-1 pt-20 pb-8">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">Issuer Dashboard</h1>
                <p className="text-muted-foreground">Manage programs and issue blockchain-verified credentials</p>
              </div> 
              {!isPending && <Badge className="bg-green-200 text-green-800 text-sm">Verified Issuer</Badge>}
            </div>
            {isPending ? <div className="text-center">Your organization is pending approval by admin.</div> :
              <div className="mb-8">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="programs">
                      Manage Programs
                      <Badge className="ml-2 bg-secondary">{programs.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="issue">Issue Credential</TabsTrigger>
                    <TabsTrigger value="manage">
                      Issued Credentials
                      <Badge className="ml-2 bg-secondary">{credentials.length}</Badge>
                    </TabsTrigger>
                  </TabsList>
                
                  <TabsContent value="programs">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <BookOpen className="h-5 w-5 mr-2 text-credverse-purple" />
                          Add New Program
                        </CardTitle>
                        <CardDescription>
                          Create a new course or internship program
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleAddProgram} className="space-y-4">
                          <div className="space-y-1">
                            <Label htmlFor="type">Program Type</Label>
                            <div className="flex gap-4">
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  id="typeCourse"
                                  name="type"
                                  value="Course"
                                  checked={newProgram.type === "Course"}
                                  onChange={handleProgramInputChange}
                                  className="mr-2"
                                />
                                <label htmlFor="typeCourse">Course</label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  id="typeInternship"
                                  name="type"
                                  value="Internship"
                                  checked={newProgram.type === "Internship"}
                                  onChange={handleProgramInputChange}
                                  className="mr-2"
                                />
                                <label htmlFor="typeInternship">Internship</label>
                              </div>
                            </div>
                          </div>
                        
                          {/* Program Details Section */}
                          <div className="space-y-4 p-4 border border-muted rounded-md">
                            <h3 className="font-medium text-base mb-2">Program Details</h3>
                          
                            <div className="space-y-1">
                              <Label htmlFor="name">
                                {newProgram.type === "Course" ? "Course Name" : "Internship Position"}
                              </Label>
                              <Input
                                id="name"
                                name="name"
                                placeholder={`e.g., ${newProgram.type === "Course" ? "Web Development Bootcamp" : "Frontend Engineering Internship"}`}
                                value={newProgram.name}
                                onChange={handleProgramInputChange}
                                required
                              />
                            </div>
                          
                            <div className="space-y-1">
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                name="description"
                                placeholder={`Describe what this ${newProgram.type?.toLowerCase() || 'program'} covers...`}
                                value={newProgram.description}
                                onChange={handleProgramInputChange}
                                required
                              />
                            </div>

                            {/* Date Range Pickers */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <Label htmlFor="startDate">Start Date</Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      id="startDate"
                                      variant={"outline"}
                                      className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !newProgram.startDate && "text-muted-foreground"
                                      )}
                                    >
                                      <Calendar className="mr-2 h-4 w-4" />
                                      {newProgram.startDate ? format(newProgram.startDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <DatePicker
                                      mode="single"
                                      selected={newProgram.startDate}
                                      onSelect={(date) => handleDateChange(date, 'startDate')}
                                      initialFocus
                                      className={cn("p-3 pointer-events-auto")}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>

                              <div className="space-y-1">
                                <Label htmlFor="endDate">End Date</Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      id="endDate"
                                      variant={"outline"}
                                      className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !newProgram.endDate && "text-muted-foreground"
                                      )}
                                    >
                                      <Calendar className="mr-2 h-4 w-4" />
                                      {newProgram.endDate ? format(newProgram.endDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <DatePicker
                                      mode="single"
                                      selected={newProgram.endDate}
                                      onSelect={(date) => handleDateChange(date, 'endDate')}
                                      initialFocus
                                      className={cn("p-3 pointer-events-auto")}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>
                          
                            {/* Course-specific fields */}
                            {newProgram.type === "Course" && (
                              <>
                                <div className="space-y-1">
                                  <Label htmlFor="courseLink">Course Link</Label>
                                  <Input
                                    id="courseLink"
                                    name="courseLink"
                                    placeholder="https://..."
                                    value={newProgram.courseLink}
                                    onChange={handleProgramInputChange}
                                  />
                                  <p className="text-xs text-muted-foreground">URL where students can access the course</p>
                                </div>
                              
                                <div className="space-y-1">
                                  <Label htmlFor="syllabus">Syllabus PDF</Label>
                                  <Input
                                    id="syllabus"
                                    name="syllabus"
                                    type="file"
                                    accept=".pdf"
                                    ref={fileInputRef}
                                    onChange={(e) =>
                                      handleProgramFileInputChange(e, "syllabus", "syllabusFileName")
                                         }
                                            />

                                  <p className="text-xs text-muted-foreground">Upload the course syllabus PDF</p>
                                </div>
    
                                <div className="space-y-1">
                                  <Label htmlFor="prerequisites">Skill Name</Label>
                                  <Input
                                    id="prerequisites"
                                    name="skillName"
                                    placeholder="Enter skill name..."
                                    value={newProgram.skillName}
                                    onChange={handleProgramInputChange}
                                  />
                                </div>
                              </>
                            )}
                          
                            {/* Internship-specific fields - simplified */}
                            {newProgram.type === "Internship" && (
                              <>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="remotePossible"
                                    name="remotePossible"
                                    checked={!!newProgram.remotePossible}
                                    onChange={handleProgramInputChange}
                                    className="rounded"
                                  />
                                  <Label htmlFor="remotePossible">Remote work possible</Label>
                                </div>
                              </>
                            )}
                          </div>
                        
                          <CardFooter className="px-0 pt-6">
                            <Button
                              type="submit"
                              className="w-full bg-gradient-to-r from-credverse-purple to-credverse-deep-purple hover:opacity-90"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add {newProgram.type}
                            </Button>
                          </CardFooter>
                        </form>
                      </CardContent>
                    </Card>
                  
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold mb-4">Your Programs</h3>
                    
                      {programs.length > 0 ? (
                        <div className="space-y-4">
                          {programs.map((program) => (
                            <Card key={program._id} className="overflow-hidden hover:shadow-md transition-shadow">
                              {editingProgramId === program._id ? (
                                <CardContent className="p-4">
                                  <form onSubmit={(e) => handleUpdateProgram(e, program)} className="space-y-4">
                                    <div className="flex justify-between mb-2">
                                      <h3 className="font-semibold text-lg">Edit Program</h3>
                                      <Badge className={program.type === "Course" ?
                                        "bg-credverse-soft-purple text-credverse-deep-purple" :
                                        "bg-soft-blue text-ocean-blue"}
                                      >
                                        {program.type}
                                      </Badge>
                                    </div>
                                  
                                  <div className="space-y-1">
  <Label htmlFor={`edit-name-${program._id}`}>
    {program.type === "Course" ? "Course Name" : "Internship Position"}
  </Label>
  <Input
    id={`edit-name-${program._id}`}
    name={program.type === "Course" ? "courseName" : "skillName"}
    value={(program.name) ||
     ( program.type === "Course"
        ? editedProgram.courseName
        : editedProgram.skillName)
    }
    onChange={handleEditProgramInputChange}
    required
  />
</div>

                                  
                                    <div className="space-y-1">
                                      <Label htmlFor={`edit-description-${program._id}`}>Description</Label>
                                      <Textarea
                                        id={`edit-description-${program._id}`}
                                        name="description"
                                        value={editedProgram.description}
                                        onChange={handleEditProgramInputChange}

                                        required
                                      />
                                    </div>
                                  
                                    {/* Date Range Pickers */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-1">
                                        <Label htmlFor={`edit-startDate-${program._id}`}>Start Date</Label>
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <Button
                                              id={`edit-startDate-${program._id}`}
                                              variant={"outline"}
                                              className="w-full justify-start text-left font-normal"
                                              type="button"
                                            >
                                              <Calendar className="mr-2 h-4 w-4" />
                                              {editedProgram.startDate ?
                                                format(editedProgram.startDate, "PPP") :
                                                format(program.startDate, "PPP")}
                                            </Button>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-auto p-0" align="start">
                                            <DatePicker
                                              mode="single"
                                              selected={editedProgram.startDate || program.startDate}
                                              onSelect={(date) => handleEditDateChange(date, 'startDate')}
                                              initialFocus
                                              className="p-3"
                                            />
                                          </PopoverContent>
                                        </Popover>
                                      </div>

                                      <div className="space-y-1">
                                        <Label htmlFor={`edit-endDate-${program._id}`}>End Date</Label>
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <Button
                                              id={`edit-endDate-${program._id}`}
                                              variant={"outline"}
                                              className="w-full justify-start text-left font-normal"
                                              type="button"
                                            >
                                              <Calendar className="mr-2 h-4 w-4" />
                                              {editedProgram.endDate ?
                                                format(editedProgram.endDate, "PPP") :
                                                format(program.endDate, "PPP")}
                                            </Button>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-auto p-0" align="start">
                                            <DatePicker
                                              mode="single"
                                              selected={editedProgram.endDate || program.endDate}
                                              onSelect={(date) => handleEditDateChange(date, 'endDate')}
                                              initialFocus
                                              className="p-3"
                                            />
                                          </PopoverContent>
                                        </Popover>
                                      </div>
                                    </div>
                                  
                                    {/* Course-specific fields for editing */}
                                    {program.type === "Course" && (
                                      <>
                                        <div className="space-y-1">
                                          <Label htmlFor={`edit-courseLink-${program._id}`}>Course Link</Label>
                                          <Input
                                            id={`edit-courseLink-${program._id}`}
                                            name="courseLink"
                                            placeholder="https://..."
                                            value={editedProgram.courseLink !== undefined ? editedProgram.courseLink : program.courseLink || ""}
                                            onChange={handleEditProgramInputChange}
                                          />
                                        </div>
                                      
                                        {/* <div className="space-y-1">
                                          <Label htmlFor={`edit-syllabus-${program._id}`}>Syllabus PDF</Label>
                                          <Input
                                            id={`edit-syllabus-${program._id}`}
                                            name="syllabus"
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleEditProgramFileInputChange(e, 'syllabus', 'syllabusFileName')}
                                          />
                                          {(editedProgram.syllabusFileName || program.syllabusFileName) && (
                                            <p className="text-xs text-green-600 mt-1">
                                              Current file: {editedProgram.syllabusFileName || program.syllabusFileName}
                                            </p>
                                          )}
                                        </div> */}
        
                                        <div className="space-y-1">
                                          <Label htmlFor={`edit-prerequisites-${program._id}`}>Skill Name</Label>
                                          <Textarea
                                            id={`edit-prerequisites-${program._id}`}
                                            name="skillName"
                                            placeholder="Enter skill name..."
                                            value={editedProgram.skillName !== undefined ? editedProgram.skillName : program.skillName || ""}
                                            onChange={handleEditProgramInputChange}
                                          />
                                        </div>
                                      </>
                                    )}
                                  
                                    {/* Internship-specific fields for editing */}
                                    {program.type === "Internship" && (
                                      <>
                                        <div className="flex items-center space-x-2">
                                          <input
                                            type="checkbox"
                                            id={`edit-remotePossible-${program._id}`}
                                            name="remotePossible"
                                            checked={
                                              editedProgram.remotePossible !== undefined ?
                                                !!editedProgram.remotePossible :
                                                !!program.remotePossible
                                            }
                                            onChange={handleEditProgramInputChange}
                                            className="rounded"
                                          />
                                          <Label htmlFor={`edit-remotePossible-${program._id}`}>Remote work possible</Label>
                                        </div>
                                      </>
                                    )}
                                  
                                    <div className="flex justify-end space-x-2 pt-4">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCancelEdit}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        type="submit"
                                        className="bg-credverse-purple hover:bg-credverse-deep-purple text-white"
                                      >
                                        Save Changes
                                      </Button>
                                    </div>
                                  </form>
                                </CardContent>
                              ) : (
                                <CardContent className="p-4">
                                  <div className="flex flex-col justify-between space-y-4">
                                    <div>
                                      <div className="flex items-center space-x-2 mb-2">
                                        {program.type === "Course" ?
                                          <BookOpen className="h-5 w-5 text-credverse-purple" /> :
                                          <Briefcase className="h-5 w-5 text-credverse-purple" />
                                        }
                                        <h3 className="font-semibold text-lg">{program.name || (program.type === "Course"?program.courseName:program.skillName)}</h3>
                                        <Badge className={
                                          "bg-credverse-soft-purple text-credverse-deep-purple"}
                                        >
                                          {program.type}
                                        </Badge>
                                      </div>
                                      <p className="text-sm mb-2">{program.description}</p>
                                    
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mt-2">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                          <Calendar className="h-3 w-3 mr-1" />
                                          <span>Start: {format(program.startDate, "PP")}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                          <Calendar className="h-3 w-3 mr-1" />
                                          <span>End: {format(program.endDate, "PP")}</span>
                                        </div>
                                      
                                       {program.type === "Course" && program.coursePdfLink && (
  <div className="flex items-center text-sm">
    <FileText className="h-3 w-3 mr-1 text-credverse-purple" />
    <a
      href={program.coursePdfLink}
      target="_blank"
      rel="noopener noreferrer"
      className="text-credverse-purple underline hover:text-credverse-purple/80"
    >
      View Syllabus
    </a>
  </div>
)}

                                      </div>
                                    </div>
                                  
                                    <div className="flex justify-end space-x-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSelectProgram(program)}
                                        className="text-blue-600 hover:text-blue-700"
                                      >
                                        Issue Credential
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditProgram(program)}
                                        className="text-amber-500 hover:text-amber-600"
                                      >
                                        <Edit className="h-4 w-4 mr-1" />
                                        Edit
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDeleteProgramConfirm(program)}
                                        className="text-red-500 hover:text-red-600"
                                      >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              )}
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                          <p className="mt-2 text-muted-foreground">
                            No programs added yet
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                
                  <TabsContent value="issue">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Award className="h-5 w-5 mr-2 text-credverse-purple" />
                          Issue New Credential
                        </CardTitle>
                        <CardDescription>
                          Create and issue a new blockchain-verified credential to a recipient
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleIssueCredential} className="space-y-4">
                          <div className="space-y-1">
                            <Label htmlFor="programSelect">Select Program</Label>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-between"
                                >
                                  {selectedProgram ? (
                                    <div className="flex items-center">
                                      {selectedProgram.type === "Course" ?
                                        <BookOpen className="h-4 w-4 mr-2" /> :
                                        <Briefcase className="h-4 w-4 mr-2" />
                                      }
                                      {(selectedProgram.name) ||(selectedProgram.type === "Course" ?selectedProgram.courseName:selectedProgram.skillName)}
                                    </div>
                                  ) : (
                                    "Select a program..."
                                  )}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-full min-w-[240px]">
                                {programs.length > 0 ? (
                                  programs.map((program) => (
                                    <DropdownMenuItem
                                      key={program._id}
                                      onClick={() => handleSelectProgram(program)}
                                    >
                                      <div className="flex items-center">
                                        {program.type === "Course" ?
                                          <BookOpen className="h-4 w-4 mr-2" /> :
                                          <Briefcase className="h-4 w-4 mr-2" />
                                        }
                                    {(program.name) ||(program.type === "Course"
  ? program.courseName
  : program.skillName)}

                                        <Badge className="ml-2" variant="outline">{program.type}</Badge>
                                      </div>
                                    </DropdownMenuItem>
                                  ))
                                ) : (
                                  <DropdownMenuItem disabled>
                                    No programs available
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        
                          {selectedProgram ? (
                            <>
                              <div className="space-y-1">
                                <Label>Program Details</Label>
                                <div className="p-4 bg-muted rounded-md">
                                  <div className="flex items-center">
                                    <h3 className="font-medium">{selectedProgram.type === "Course" ?selectedProgram.courseName:selectedProgram.skillName}</h3>
                                    <Badge className="ml-2" variant="outline">{selectedProgram.type}</Badge>
                                  </div>
                                  <p className="mt-2 text-sm">{selectedProgram.description}</p>
                                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <p className="text-xs text-muted-foreground">Start: {format(selectedProgram.startDate, "PP")}</p>
                                    <p className="text-xs text-muted-foreground">End: {format(selectedProgram.endDate, "PP")}</p>
                                  </div>
                                </div>
                              </div>
                            
                              <div className="pt-4">
                                <h3 className="text-lg font-medium mb-3">Recipient Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <Label htmlFor="recipientName">Recipient Name</Label>
                                    <Input
                                      id="recipientName"
                                      name="recipientName"
                                      placeholder="Full name of the recipient"
                                      value={newCredential.recipientName}
                                      onChange={handleInputChange}
                                      required
                                    />
                                  </div>
                                
                                  <div className="space-y-1">
                                    <Label htmlFor="recipientEmail">Recipient Email</Label>
                                    <Input
                                      id="recipientEmail"
                                      name="recipientEmail"
                                      type="email"
                                      placeholder="Email address"
                                      value={newCredential.recipientEmail}
                                      onChange={handleInputChange}
                                      required
                                    />
                                  </div>
                                </div>
                              
                                <div className="space-y-1 mt-4">
                                  <Label htmlFor="recipientWalletAddress">Recipient Wallet Address</Label>
                                  <Input
                                    id="recipientWalletAddress"
                                    name="recipientWalletAddress"
                                    placeholder="0x..."
                                    value={newCredential.recipientWalletAddress}
                                    onChange={handleInputChange}
                                    required
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">
                                    The credential will be sent to this blockchain address
                                  </p>
                                </div>
                                <div className="space-y-1 mt-4">
                                  <Label htmlFor="stipend">Stipend</Label>
                                  <Input
                                    type="number"
                                    id="stipend"
                                    name="stipend"
                                    placeholder="$"
                                    value={newCredential.stipend}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                              
                                {/* Course-specific credential fields */}
                                {selectedProgram.type === "Course" && (
                                  <div className="space-y-4 mt-6">
                                    <h3 className="text-lg font-medium">Course Completion Documents</h3>
                                  
                                    <div className="space-y-1">
                                      <Label htmlFor="performanceReport">Performance Report</Label>
                                      <Input
                                        id="performanceReport"
                                        name="performanceReport"
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => handleFileInputChange(e, 'performanceReport', 'performanceReportFileName')}
                                        required
                                      />
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Upload the student's performance evaluation
                                      </p>
                                      {newCredential.performanceReportFileName && (
                                        <p className="text-xs text-green-600 mt-1">
                                          Selected: {newCredential.performanceReportFileName}
                                        </p>
                                      )}
                                    </div>
                                  
                                    <div className="space-y-1">
                                      <Label htmlFor="certificate">Course Certificate</Label>
                                      <Input
                                        id="certificate"
                                        name="certificate"
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => handleFileInputChange(e, 'certificate', 'certificateFileName')}
                                        required
                                      />
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Upload the course completion certificate
                                      </p>
                                      {newCredential.certificateFileName && (
                                        <p className="text-xs text-green-600 mt-1">
                                          Selected: {newCredential.certificateFileName}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                )}
                              
                                {/* Internship-specific credential fields */}
                                {selectedProgram.type === "Internship" && (
                                  <div className="space-y-4 mt-6">
                                    <h3 className="text-lg font-medium">Internship Completion Documents</h3>
                                  
                                    <div className="space-y-1">
                                      <Label htmlFor="githubRepoUrl">GitHub Repository</Label>
                                      <Input
                                        id="githubRepoUrl"
                                        name="githubRepoUrl"
                                        placeholder="https://github.com/username/project"
                                        value={newCredential.githubRepoUrl}
                                        onChange={handleInputChange}
                                        required
                                      />
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Link to the intern's project repository
                                      </p>
                                    </div>
                                  
                                    <div className="space-y-1">
                                      <Label htmlFor="certificate">Internship Certificate</Label>
                                      <Input
                                        id="certificate"
                                        name="certificate"
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => handleFileInputChange(e, 'certificate', 'certificateFileName')}
                                        required
                                      />
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Upload the internship completion certificate
                                      </p>
                                      {newCredential.certificateFileName && (
                                        <p className="text-xs text-green-600 mt-1">
                                          Selected: {newCredential.certificateFileName}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            
                              <CardFooter className="px-0 pt-6">
                                <Button
                                  type="submit"
                                  className="w-full bg-gradient-to-r from-credverse-purple to-credverse-deep-purple hover:opacity-90"
                                  disabled={issuingCredential}
                                >
                                  {issuingCredential ? (
                                    <>
                                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                                      Issuing Credential...
                                    </>
                                  ) : (
                                    <>
                                      <Shield className="mr-2 h-4 w-4" />
                                      Issue Credential on Blockchain
                                    </>
                                  )}
                                </Button>
                              </CardFooter>
                            </>
                          ) : (
                            <div className="text-center py-8">
                              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                              <p className="mt-4 text-muted-foreground">
                                Please select a program to issue a credential
                              </p>
                              <Button
                                variant="link"
                                onClick={() => {
                                  setActiveTab("programs");
                                }}
                                className="mt-2"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add a program first
                              </Button>
                            </div>
                          )}
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                
                  <TabsContent value="manage">
                    <Card>
                      <CardHeader className="flex flex-col md:flex-row justify-between md:items-center space-y-2 md:space-y-0">
                        <div>
                          <CardTitle className="flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-credverse-purple" />
                            Issued Credentials
                          </CardTitle>
                          <CardDescription>
                            View and manage credentials you've issued
                          </CardDescription>
                        </div>
                        <div className="relative">
                          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search credentials..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 w-full md:w-[260px]"
                          />
                        </div>
                      </CardHeader>
                      <CardContent>
                        {filteredCredentials.length > 0 ? (
                          <div className="space-y-4">
                            {filteredCredentials.map((credential) => (
                              <Card key={credential._id} className="overflow-hidden hover:shadow-md transition-shadow">
                                <CardContent className="p-0">
                                  <div className="flex flex-col md:flex-row justify-between p-4">
                                    <div className="mb-2 md:mb-0">
                                      <div className="flex items-center space-x-1">
                                        <h3 className="font-semibold">{credential.credentialName || credential.programId.skillName}</h3>
                                        <Badge className="bg-credverse-soft-purple text-credverse-deep-purple">
                                          {credential.credentialType || credential.programType}
                                        </Badge>
                                      </div>
                                      <p className="text-sm flex items-center mt-1">
                                        <User className="h-3 w-3 mr-1" />
                                        {credential.recipientName || credential.student.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Issued: {formatDate(credential.issueDate || credential.createdAt)}
                                      </p>
                                    </div>
                                    <div className="flex items-center">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewCredential(credential)}
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
                          <div className="text-center py-8">
                            <Shield className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                            <p className="mt-2 text-muted-foreground">
                              {searchTerm ? "No matching credentials found" : "No credentials issued yet"}
                            </p>
                            {searchTerm && (
                              <Button
                                variant="link"
                                onClick={() => setSearchTerm("")}
                                className="mt-2"
                              >
                                Clear search
                              </Button>
                            )}
                            {!searchTerm && (
                              <Button
                                variant="link"
                                onClick={() => {
                                  const issueTab = document.querySelector('button[value="issue"]');
                                  if (issueTab instanceof HTMLElement) {
                                    issueTab.click();
                                  }
                                }}
                                className="mt-2"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Issue your first credential
                              </Button>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>}
          </div>
        </main>
        
        <Footer />
      </div>

      {/* Credential Details Dialog */}
      {selectedCredential && (
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent className="max-w-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-credverse-purple" />
                {selectedCredential.credentialName || selectedCredential.programId.skillName}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Issued on {formatDate(selectedCredential.issueDate || selectedCredential.createdAt)}
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="space-y-4 my-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                <p>{selectedCredential.credentialDescription || selectedCredential.programId.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Recipient</h4>
                  <p className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {selectedCredential.recipientName || selectedCredential.student.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{selectedCredential.recipientEmail || selectedCredential.student.email}</p>
                </div>
                
              <div>
  <h4 className="text-sm font-medium text-muted-foreground mb-1">Credential Type</h4>
  <Badge className="bg-credverse-soft-purple text-credverse-deep-purple">
    {selectedCredential.credentialType || selectedCredential.programType}
  </Badge>
</div>

              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Recipient Wallet Address</h4>
                <p className="font-mono text-sm break-all">{selectedCredential.recipientWalletAddress || selectedCredential.student.walletAddress}</p>
              </div>
              {selectedCredential.stipend && <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">stipend</h4>
                <p className="font-mono text-sm break-all">{selectedCredential.stipend}</p>
              </div>}
              
              {(selectedCredential?.credentialType === "Course" || ipfsData?.performanceReportUrl || selectedCredential?.programTypeRef==="Course") && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Performance Report</h4>
                  <p className="flex items-center">
                    <FileText className="h-4 w-4 mr-1 text-credverse-purple" />
                    <a href={selectedCredential?.performanceReportUrl ||ipfsData?.performanceReportUrl } target="_blank" rel="noopener noreferrer" className="text-credverse-purple hover:underline">
                      View Performance Report
                    </a>
                  </p>
                </div>
              )}
              
              {(selectedCredential?.credentialType === "Internship" || ipfsData?.githubUrl ||  selectedCredential.programTypeRef==="Internship")  && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">GitHub Repository</h4>
                  <p className="flex items-center">
                    <Github className="h-4 w-4 mr-1 text-credverse-purple" />
                    <a href={selectedCredential?.githubRepoUrl ||ipfsData?.githubUrl } target="_blank" rel="noopener noreferrer" className="text-credverse-purple hover:underline">
                      View GitHub Repository
                    </a>
                  </p>
                </div>
              )}
              
             {(selectedCredential?.certificateUrl || ipfsData?.certificateUrl) && (
  <div>
    <h4 className="text-sm font-medium text-muted-foreground mb-1">Certificate</h4>
    <p className="flex items-center">
      <Award className="h-4 w-4 mr-1 text-credverse-purple" />
      <a
        href={selectedCredential?.certificateUrl || ipfsData?.certificateUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-credverse-purple hover:underline"
      >
        View Certificate
      </a>
    </p>
  </div>
)}

              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Block Number</h4>
                 <p className="font-mono text-sm break-all flex items-center gap-1">
                  {/* <Check className="h-4 w-4 text-green-500" /> */}
                  {selectedCredential.blockNumber}
                </p>
             <h4 className="text-sm font-medium text-muted-foreground mb-1">Blockchain Transaction</h4>
                <p className="font-mono text-sm break-all flex items-center gap-1">
                  {/* <Check className="h-4 w-4 text-green-500" /> */}
                  {selectedCredential.txHash || selectedCredential.transactionHash}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <a 
                    href={`https://etherscan.io/tx/${selectedCredential.txHash || selectedCredential.transactionHash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-credverse-purple hover:underline"
                  >
                    View on Etherscan
                  </a>
                </p>
              </div>
            </div>
            
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
              <AlertDialogAction
                className="bg-credverse-purple hover:bg-credverse-deep-purple"
              >
                Revoke Credential
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Delete Program Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete the program 
              <span className="font-semibold"> {programToDelete?.name}</span>. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProgram}
              className="bg-red-500 hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete Program
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default IssuerDashboard;

