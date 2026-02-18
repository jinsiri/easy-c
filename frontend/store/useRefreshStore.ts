import { create } from 'zustand';

interface RefreshState {
	refreshTicket: number;
	triggerRefresh: () => void;
}

const useRefreshStore = create<RefreshState>((set) => ({
	refreshTicket: 0,
	triggerRefresh: () => set((state) => ({ refreshTicket: state.refreshTicket + 1 })),
}));

export default useRefreshStore;
