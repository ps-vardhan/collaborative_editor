import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);
export const createRoom = (data) => API.post("/rooms", data);
export const getRoom = (id) => API.get(`/rooms/${id}`);
export const joinRoom = (data) => API.post("/rooms/join", data);
