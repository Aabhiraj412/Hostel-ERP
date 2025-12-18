import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set) => ({
      user: '',
      setUser: (name) => set({ user: name }),
      data: null,
      setData: (d) => set({ data: d }),
      localhost: null,
      setLocalhost: (h) => set({ localhost: h }),
    }),
    {
      name: "Hostel-ERP", // Name of the key in local storage
      partialize: (state) => state, // Optionally persist only specific keys (currently persists all)
    }
  )
);

export default useStore;
