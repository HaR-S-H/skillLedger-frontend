import { createContext, useState, useEffect,useContext } from "react";
import { connectWallet } from "../blockchain";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
useEffect(() => {
  // Auto-connect wallet if MetaMask is already connected
  const checkConnection = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        const { account, signer, provider } = await connectWallet();
        setAccount(account);
        setSigner(signer);
        setProvider(provider);
      }
    }
  };

  checkConnection();
}, []);


  return (
    <WalletContext.Provider value={{ account, signer, provider}}>
      {children}
    </WalletContext.Provider>
  );
};
export const useWallet = () => useContext(WalletContext);
