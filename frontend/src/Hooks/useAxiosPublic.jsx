import axios from "axios";

// const baseURL = "https://admin-pannel-1.onrender.com";
// const baseURL = "http://localhost:5000";
const baseURL = "https://backend-delta-wine.vercel.app";


const axiosPublic = axios.create({
  baseURL: baseURL,
});

export default function useAxiosPublic() {
  return axiosPublic;
}
