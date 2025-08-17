import { axiosInstance } from "../../lib/axios";

export const verifyTokenAPI = () => axiosInstance.get("/auth/verifyJWT");
export const refreshTokenAPI = () => axiosInstance.post("/auth/refreshToken");
export const loginAPI = (userDetails) => axiosInstance.post("/auth/login", userDetails);
export const signupAPI = (userDetails) => axiosInstance.post("/auth/signup", userDetails);
export const logoutAPI = () => axiosInstance.post("/auth/logout");
