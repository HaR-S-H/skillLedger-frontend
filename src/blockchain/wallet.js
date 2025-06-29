import { ethers } from "ethers";

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      return { account: accounts[0], provider, signer };
    } catch (err) {
      throw new Error("User rejected MetaMask connection");
    }
  } else {
    throw new Error("MetaMask not detected");
  }
};
