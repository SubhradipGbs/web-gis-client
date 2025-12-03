import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_MAIN_URL || "https://wbpdcl.gbsit.co.in/",
});

export default apiClient;