import axios from 'axios';
import { API_ENDPOINT } from "@env";

const axiosInstance = axios.create({
  baseURL: API_ENDPOINT,
  withCredentials: false,
  headers: {},
});

export default axiosInstance;
