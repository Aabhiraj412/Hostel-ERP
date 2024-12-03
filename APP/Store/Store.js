// store.js
// import create from 'zustand';

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
}));

export default useStore;
