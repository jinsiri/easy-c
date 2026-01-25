import { create } from 'zustand';

interface LoaderState {
	loader: boolean;
	setLoader: (value: boolean) => void;
}

export const useLoaderStore = create<LoaderState>((set) => ({
	loader: false,
	setLoader: (value) => set({ loader: value }),
}));

export default useLoaderStore;
