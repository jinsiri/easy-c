import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DeptStore {
	expandedIds: string[];
	selectedId: number | null;
	_hasHydrated: boolean;
	setExpandedIds: (ids: string[]) => void;
	setSelectedId: (id: number | null) => void;
	setHasHydrated: (state: boolean) => void;
}

export const useDeptTreeStore = create<DeptStore>()(
	persist(
		(set) => ({
			expandedIds: [],
			selectedId: null,
			_hasHydrated: false,
			setExpandedIds: (ids) => set({ expandedIds: ids }),
			setSelectedId: (id) => set({ selectedId: id }),
			setHasHydrated: (state) => set({ _hasHydrated: state }),
		}),
		{
			name: 'dept-tree-storage',
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
			},
		},
	),
);
