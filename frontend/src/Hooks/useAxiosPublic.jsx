import axios from "axios";

// const baseURL = "http://localhost:5000";
const baseURL = "https://backend-ochre-five-43.vercel.app";


const axiosPublic = axios.create({
  baseURL: baseURL,
});

export default function useAxiosPublic() {
  return axiosPublic;
}
