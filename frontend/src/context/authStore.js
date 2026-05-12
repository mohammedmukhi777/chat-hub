import { create } from "zustand";
import api from "../services/api";

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  isLoading: false,

  // Set user after login
  setAuth: (user, token) => {
    localStorage.setItem("token", token);
    set({ user, token });
  },

  // Fetch current user from backend
  fetchMe: async () => {
    try {
      set({ isLoading: true });
      const res = await api.get("/auth/me");
      set({ user: res.data.user, isLoading: false });
    } catch  {
      localStorage.removeItem("token");
      set({ user: null, token: null, isLoading: false });
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));

export default useAuthStore;