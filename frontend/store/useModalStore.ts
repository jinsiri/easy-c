import { create } from 'zustand';

interface ModalState {
	modalData: any;
	setModalData: (value: any) => void;
	resetModalData: () => void;
}

export const useModalStore = create<ModalState>((set, get) => ({
	modalData: null,
	setModalData: (value) => set({ modalData: value }),
	resetModalData: () => set({ modalData: null }),
}));

export default useModalStore;
