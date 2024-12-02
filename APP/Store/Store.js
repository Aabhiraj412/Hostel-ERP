// store.js
// import create from 'zustand';

import { create } from "zustand";

const useStore = create((set) => ({
    cookie: '',
    setCookie: (c) => set({ cookie: c }),
    user: '',
    setUser: (name) => set({ user: name }),
}));

export default useStore;
