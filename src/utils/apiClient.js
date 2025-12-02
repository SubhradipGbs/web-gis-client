import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_MAIN_URL
});

export default apiClient;