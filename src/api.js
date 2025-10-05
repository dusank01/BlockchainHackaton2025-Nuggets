import axios from "axios";

// Podesavanje axios instance
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // Laravel API URL
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json", // 👈 OVO dodaj
  },
});

// 🔹 Funkcija za dohvatanje svih zahteva
export const getRequests = async () => {
  const res = await api.get("/requests");
  return res.data;
};

// 🔹 Funkcija za kreiranje novog zahteva
export const createRequest = async (data) => {
  const res = await api.post("/requests", data);
  return res.data;
};

// 🔹 Funkcija za kreiranje blockchain zapisa
export const createBlockchainRecord = async (data) => {
  const res = await api.post("/blockchain-records", data);
  return res.data;
};

export default api;
