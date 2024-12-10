import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set) => ({
      cookie: "",
      setCookie: (c) => set({ cookie: c }),

      user: "",
      setUser: (name) => set({ user: name }),

      data: null,
      setData: (d) => set({ data: d }),

      localhost: null,
      setLocalhost: (h) => set({ localhost: h }),

      testlocalhost: null,
      setTestLocalhost: (t) => set({ testlocalhost: t }),
    }),
    {
      name: "zustand-storage", // Key to store data in AsyncStorage
      getStorage: () => AsyncStorage, // Use AsyncStorage for persistence
    }
  )
);

export default useStore;
