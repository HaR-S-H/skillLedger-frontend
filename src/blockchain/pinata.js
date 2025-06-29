import axios from "axios";
import mime from "mime-types";

// Upload a file to IPFS via Pinata
const pinFileToIPFS = async (file, fileName) => {
  try {
    const formData = new FormData();
    
    // Get content type from the file object first, then fallback to mime lookup
    const contentType = file.type || mime.lookup(fileName) || "application/octet-stream";

    // Attach file with correct filename and content type
    formData.append("file", file, {
      filename: fileName,
      contentType: contentType
    });

    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
  } catch (error) {
    console.error("Error pinning file to IPFS:", error);
    throw new Error(`Failed to pin file to IPFS: ${error.message}`);
  }
};

// Upload JSON metadata to IPFS via Pinata
const pinJSONToIPFS = async (jsonData) => {
  try {
    const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

    const body = {
      pinataMetadata: {
        name: "metadata",
      },
      pinataContent: jsonData,
    };

    const res = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
      },
    });

    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
  } catch (error) {
    console.error("Error pinning JSON to IPFS:", error);
    throw new Error(`Failed to pin JSON to IPFS: ${error.message}`);
  }
};

export { pinFileToIPFS, pinJSONToIPFS };