import { create } from 'zustand';

interface ModalState {
	modalData: any;
	isRefresh: boolean;
	setModalData: (value: any) => void;
	resetModalData: () => void;
	setIsRefresh: (value: boolean) => void;
}

export const useModalStore = create<ModalState>((set, get) => ({
	modalData: null,
	isRefresh: false,
	setModalData: (value) => set({ modalData: value }),
	resetModalData: () => set({ modalData: null }),
	setIsRefresh: (value: boolean) => set({ isRefresh: value }),
}));

export default useModalStore;
