// src/api/auth.js
import API from ".";
export const login = async (walletAddress) => {
    const res = await API.post("/auth/login", { walletAddress });
    return res.data.data;
};

export const organizationLogin = async (formData) => {
    const res = await API.post("/auth/organization/signup",  formData );
    return res.data.data;
};



export const getUser = async () => {
    const res = await API.post("/auth/me");
    return res.data.data;
}

