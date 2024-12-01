// store.js
// import create from 'zustand';

import { create } from "zustand";

const useStore = create((set) => ({
    cookie: '',
    setCookie: (c) => set({ cookie: c }),
    username: '',
    setUsername: (name) => set({ username: name }),
}));

export default useStore;
