import { create } from 'zustand';
import { Dept } from './Types';

interface ItemStore {
    item: Dept | null;
    setItem: (newItem: Dept | null) => void;
    clearItem: () => void;
}

const useItemStore = create<ItemStore>((set) => ({
    item: { id: 1, name: 'Target', shortcut: 'target' },
    setItem: (newItem) => set({ item: newItem }),
    clearItem: () => set({ item: null }),
}));

export const useItem = () => useItemStore(state => state.item);
export const useSetItem = () => useItemStore(state => state.setItem);
export const useClearItem = () => useItemStore(state => state.clearItem);

export default useItemStore;
