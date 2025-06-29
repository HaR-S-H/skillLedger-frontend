
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Issuers from "./pages/Issuers";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import IssuerDashboard from "./pages/IssuerDashboard";
import StudentDashboard from "./pages/StudentDashboard";
const queryClient = new QueryClient();
import { ToastContainer, toast } from 'react-toastify';
const App = () => (
  <QueryClientProvider client={queryClient}>
     <ToastContainer position="bottom-left" autoClose={3000} />
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/issuers" element={<Issuers />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/organization/dashboard" element={<IssuerDashboard />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
