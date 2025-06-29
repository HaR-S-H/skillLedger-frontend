
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie'; 
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { connectWallet } from '@/blockchain';
import { useAuth } from '@/contexts/AuthContext';
import { login } from '@/api/auth';
import { useToast } from '@/hooks/use-toast';
import FullScreenLoader from './FullScreenLoader';
const NavItem = ({ href, children, className }) => (
  <Link
    to={href}
    className={`text-foreground/80 hover:text-primary transition-colors px-4 py-2 rounded-lg ${className}`}
  >
    {children}
  </Link>
);

const Navbar = () => {
  const { setRole, setWalletAddress,role ,loading} = useAuth();
  let isConnected=!!role;
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const handleConnect = async() => {
   try {
     const { account, signer, provider } = await connectWallet();
     const data = await login(account);
     setWalletAddress(account);
     setRole(data.role);
     console.log(data.role);
     
     
     toast.success("Login Successful"); 
     isConnected = true;
   } catch (error) {
     console.log(error);  
     toast.error("Login Failed");
   }
  };
const handleLogout = () => {

  Cookies.remove('token');

  // Reset auth context
  setRole(null);
  setWalletAddress(null);

  // Navigate to home or login
  navigate('/');

  // Optional: show toast
  toast.success('Logged out successfully');
};
  const NavItems = () => (
    <>
      <NavItem href="/">Home</NavItem>
      {isConnected && <NavItem href={`/${role}/dashboard`}>Dashboard</NavItem>}
      <NavItem href="/issuers">Issuers</NavItem>
      <NavItem href="/about">About</NavItem>
    </>
  );
  if (loading) {
    return (
      <FullScreenLoader/>
    )
  }
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b py-4">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-credverse-purple to-credverse-teal rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">SL</span>
          </div>
          <span className="font-bold  italianno-regular text-xl" style={{fontSize:"35px"}}>SkillLedger</span>
        </Link>

        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-6 mt-10">
                <NavItems />
                {isConnected ? (
                  <div className="flex items-center gap-2 w-full p-2 rounded-lg bg-green-50 border border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-700 font-medium" onClick={handleLogout}>Connected</span>
                  </div>
                ) : (
                  <Button className="w-full" onClick={handleConnect}>
                    Connect Wallet
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
              <NavItems />
            </div>
            {isConnected ? (
              <div className="flex items-center gap-2 ml-4 px-4 py-2 rounded-lg bg-green-50 border border-green-200 cursor-pointer"  onClick={handleLogout}>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-700 font-medium">Connected</span>
              </div>
            ) : (
              <Button className="ml-4" onClick={handleConnect}>
                Connect Wallet
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
