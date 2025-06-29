import { createContext, useContext, useState, useEffect } from "react";
import { getUser } from "@/api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUser();
        setRole(res.role);
        setWalletAddress(res.walletAddress);
      } catch (error) {
        setRole(null);
        setWalletAddress(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        walletAddress,
        setWalletAddress,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
