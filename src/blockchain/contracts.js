// src/blockchain/contracts.js
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./config";
import { ethers } from "ethers";

export const getContract = async (signerOrProvider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
};
    