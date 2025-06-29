import { useState,useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { User, Github, Linkedin, Camera } from "lucide-react";
import {toast} from "react-toastify";
import API from "@/api";
import FullScreenLoader from "./FullScreenLoader";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  description: z.string().max(500, {
    message: "Description cannot be more than 500 characters.",
  }).optional(),
  phone: z.string().optional(),
  github: z.string().url({
    message: "Please enter a valid URL.",
  }).optional().or(z.literal("")),
  linkedin: z.string().url({
    message: "Please enter a valid URL.",
  }).optional().or(z.literal("")),
});
const defaultDummyData = {
  name: "John Doe",
  email: "john.doe@example.com",
  description: "Student passionate about blockchain technology.",
  phone: "+1234567890",
  github: "https://github.com/johndoe",
  linkedin: "https://linkedin.com/in/johndoe",
};

const StudentProfile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null); // Added this to track the file
  const{walletAddress}=useAuth();
  const form =  useForm({
    resolver: zodResolver(formSchema),
    defaultValues:defaultDummyData,
  });
  
    useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await API.get(`${import.meta.env.VITE_BACKEND_URL}/dashboard`);
        const data = res.data.data;           
        if (data?.student?.name) {
          form.reset(data.student);
          setProfileImage(data.student.avatar)
        } else {
          form.reset(defaultDummyData);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Could not load profile. Showing defaults.");
        form.reset(defaultDummyData);
      } finally {
        setLoading(false);
      }
    }
      fetchProfile();
  }, []);

async function onSubmit(values) {
  try {
    const formData = new FormData();
    for (const key in values) {
      formData.append(key, values[key]);
    }

    if (selectedFile) {
      formData.append("avatar", selectedFile);
    }
    setIsEditing(false);
    await toast.promise(
      API.post(`/student`, formData),
      {
        pending: 'Updating profile and uploading image...',
        success: 'Profile updated successfully!',
        error: 'Update failed. Please try again.',
      }
    );
    setSelectedFile(null);
  } catch (err) {
    console.error("Update error:", err);
  }
}

  if (loading) return <FullScreenLoader/>;
  
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file); // Store the actual file object
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isEditing) {
    const { name, email, description, phone, github, linkedin } = form.getValues();
    
    return (
      <Card className="w-full mb-6">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Profile Information</span>
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          </CardTitle>
          <CardDescription>Manage your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="mx-auto sm:mx-0">
              <Avatar className="h-24 w-24 border-2 border-muted">
                {profileImage ? (
                  <AvatarImage src={profileImage} alt={name} />
                ) : (
                  <AvatarFallback>
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{name}</h3>
                <p className="text-muted-foreground">{walletAddress}</p>
                <p className="text-muted-foreground">{email}</p>
              </div>
              {description && <p>{description}</p>}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {phone && (
                  <div className="flex items-center gap-2">
                    <div className="bg-muted p-2 rounded-full">
                      <User className="h-4 w-4" />
                    </div>
                    <span>{phone}</span>
                  </div>
                )}
                
                {github && (
                  <div className="flex items-center gap-2">
                    <div className="bg-muted p-2 rounded-full">
                      <Github className="h-4 w-4" />
                    </div>
                    <a href={github} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">{github}</a>
                  </div>
                )}
                
                {linkedin && (
                  <div className="flex items-center gap-2">
                    <div className="bg-muted p-2 rounded-full">
                      <Linkedin className="h-4 w-4" />
                    </div>
                    <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">{linkedin}</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle>Edit Profile Information</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="mx-auto sm:mx-0">
                <div className="relative w-24 h-24">
                  <Avatar className="h-24 w-24 border-2 border-muted">
                    {profileImage ? (
                      <AvatarImage src={profileImage} alt={form.getValues().name} />
                    ) : (
                      <AvatarFallback>
                        <User className="h-12 w-12" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <Label 
                    htmlFor="profile-image" 
                    className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 cursor-pointer"
                  >
                    <Camera className="h-4 w-4" />
                  </Label>
                  <Input 
                    id="profile-image" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="hidden" 
                  />
                </div>
              </div>
              
              <div className="flex-1 space-y-4 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          value={field.value || ""}
                          placeholder="Tell us a bit about yourself" 
                        />
                      </FormControl>
                      <FormDescription>
                        Max 500 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="github"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Github className="absolute top-1/2 left-3 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input {...field} value={field.value || ""} className="pl-10" placeholder="https://github.com/username" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Linkedin className="absolute top-1/2 left-3 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input {...field} value={field.value || ""} className="pl-10" placeholder="https://linkedin.com/in/username" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default StudentProfile;