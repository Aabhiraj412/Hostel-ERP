import { create } from "zustand";

const useStore = create((set) => ({
    cookie: '',
    setCookie: (c) => set({ cookie: c }),
    user: '',
    setUser: (name) => set({ user: name }),
    data: null,
    setData: (d) => set({ data: d }),
    localhost: null,
    setLocalhost: (h) => set({ localhost: h }),
    testlocalhost: null,
    setTestLocalhost: (t) => set({ testlocalhost: t }),
}));

export default useStore;
