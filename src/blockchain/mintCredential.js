import { getContract } from "./contracts.js";
import axios from "axios";
import { pinFileToIPFS, pinJSONToIPFS } from "./pinata.js";
import { useWallet } from "@/contexts/WalletContext.jsx";
import API from "@/api/index.js";
async function mintCredential(job, account,signer) {
  try {
    // Validate required parameters
    if (!account) {
      throw new Error("Account parameter is required");
    }
    // const { account, signer, provider } = await connectWallet();
    const contract = await getContract(signer);
    const { name, email, walletAddress, courseId, performanceReport, certificate } = job;
    
    // Validate job data
    if (!name || !email || !walletAddress || !courseId || !performanceReport || !certificate) {
      throw new Error("Missing required job data");
    }
    
    // console.log("📤 Uploading files to IPFS...");
    // Upload files to IPFS
    // console.log(certificate,performanceReport);
    
    const certificateUrl = await pinFileToIPFS(certificate, "certificate.pdf");
    const performanceReportUrl = await pinFileToIPFS(performanceReport, "performance-report.pdf");
    
    const combinedData = {
      certificateUrl,
      performanceReportUrl,
    };
    
    // console.log("📤 Uploading metadata to IPFS...");
    const finalIpfsUrl = await pinJSONToIPFS(combinedData);
    
    // console.log("⚡ Minting certificate on blockchain...");
    // Mint the certificate
    const tx = await contract.mintCertificate(walletAddress, account, finalIpfsUrl);
    const receipt = await tx.wait();
    
    let tokenId;

    try {
      // Parse transaction logs to find the token ID
      const parsedLogs = receipt.logs.map((log) => {
        try {
          return contract.interface.parseLog(log);
        } catch {
          return null;
        }
      }).filter(Boolean);

      const mintedEvent = parsedLogs.find(log => log.name === 'CertificateMinted');

      if (mintedEvent?.args?.tokenId) {
        tokenId = mintedEvent.args.tokenId.toString();
        // console.log("✅ Token ID from event:", tokenId);
      } else {
        // console.log("⚠️ Event not found. Using fallback...");
        // Get current token ID as fallback
        const currentTokenId = await contract.getCurrentTokenId();
        tokenId = (currentTokenId - 1n).toString();
      }

    } catch (err) {
      console.error("❌ Event parsing failed:", err);
      // Fallback: get current token ID from contract
      const currentId = await contract.getCurrentTokenId();
      tokenId = (currentId - 1n).toString();
    }

    // console.log("💾 Saving to database...");
    // Save to database
    // console.log(receipt.hash,receipt.blockNumber,finalIpfsUrl,tokenId);
    
    const res = await API.post("/organization/course", {
      name,
      email,
      walletAddress,
      courseId,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      tokenURI: finalIpfsUrl,
      tokenId
    });
    
    // console.log("✅ Minted! Tx Hash:", receip);
    return {
      success: true,
      transactionHash: receipt.hash,
      blockNumber:receipt.blockNumber,
      tokenId,
      tokenURI: finalIpfsUrl,
      dbResponse: res.data
    };
    
  } catch (error) {
    console.error("❌ Minting failed:", error);
    throw error;
  }
}
async function mintCredentialInternship(job, account,signer) {
  try {
    // Validate required parameters
    if (!account) {
      throw new Error("Account parameter is required");
    }
    // const { account, signer, provider } = await connectWallet();
    const contract = await getContract(signer);
    // console.log(job);
    
    const { name, email, walletAddress, internshipId, githubUrl, certificate ,stipend} = job;
    
    // Validate job data
    if (!name || !email || !walletAddress || !internshipId || !githubUrl || !certificate || !stipend) {
      throw new Error("Missing required job data");
    }
    
    // console.log("📤 Uploading files to IPFS...");
    // Upload files to IPFS
    // console.log(,performanceReport);
    
    const certificateUrl = await pinFileToIPFS(certificate, "certificate.pdf");
    // const perUrl = await pinFileToIPFS(githubUrl, "githubUrl.pdf");
    
    const combinedData = {
      certificateUrl,
      githubUrl,
    };
    
    // console.log("📤 Uploading metadata to IPFS...");
    const finalIpfsUrl = await pinJSONToIPFS(combinedData);
    
    // console.log("⚡ Minting certificate on blockchain...");
    // Mint the certificate
    const tx = await contract.mintCertificate(walletAddress, account, finalIpfsUrl);
    const receipt = await tx.wait();
    
    let tokenId;

    try {
      // Parse transaction logs to find the token ID
      const parsedLogs = receipt.logs.map((log) => {
        try {
          return contract.interface.parseLog(log);
        } catch {
          return null;
        }
      }).filter(Boolean);

      const mintedEvent = parsedLogs.find(log => log.name === 'CertificateMinted');

      if (mintedEvent?.args?.tokenId) {
        tokenId = mintedEvent.args.tokenId.toString();
        // console.log("✅ Token ID from event:", tokenId);
      } else {
        // console.log("⚠️ Event not found. Using fallback...");
        // Get current token ID as fallback
        const currentTokenId = await contract.getCurrentTokenId();
        tokenId = (currentTokenId - 1n).toString();
      }

    } catch (err) {
      console.error("❌ Event parsing failed:", err);
      // Fallback: get current token ID from contract
      const currentId = await contract.getCurrentTokenId();
      tokenId = (currentId - 1n).toString();
    }

    // console.log("💾 Saving to database...");
    // Save to database
    // console.log(receipt.hash,receipt.blockNumber,finalIpfsUrl,tokenId);
    
    const res = await API.post("/organization/internship", {
      name,
      email,
      walletAddress,
      internshipId,
      stipend,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      tokenURI: finalIpfsUrl,
      tokenId
    });
    
    // console.log("✅ Minted! Tx Hash:", receip);
    return {
      success: true,
      transactionHash: receipt.hash,
      blockNumber:receipt.blockNumber,
      tokenId,
      tokenURI: finalIpfsUrl,
      dbResponse: res.data
    };
    
  } catch (error) {
    console.error("❌ Minting failed:", error);
    throw error;
  }
}

export { mintCredential, mintCredentialInternship };