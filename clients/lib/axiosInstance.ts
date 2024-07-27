import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Backend API URL
  withCredentials: true, // Ensure cookies are sent with requests
});

export default axiosInstance;
