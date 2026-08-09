import { create } from 'zustand';
import type { DataType } from '@/Types';

type Actions = {
  setHoveredItem: (item?: DataType) => void;
  setEventPos: (pos?: [number, number]) => void;
  setHoveredElement: (element?: 'avgTemp' | 'heatIndex' | 'precipitation') => void;
};

type Store = {
  hoveredItem?: DataType;
  eventPos?: [number, number];
  hoveredElement?: 'avgTemp' | 'heatIndex' | 'precipitation';
  actions: Actions;
};

export const useHoverStore = create<Store>((set) => ({
  hoveredItem: undefined,
  eventPos: undefined,
  hoveredElement: undefined,
  actions: {
    setHoveredItem: (item?: DataType) => set({ hoveredItem: item }),
    setEventPos: (pos?: [number, number]) => set({ eventPos: pos }),
    setHoveredElement: (element?: 'avgTemp' | 'heatIndex' | 'precipitation') =>
      set({ hoveredElement: element }),
  },
}));

export const useHoveredItem = () => useHoverStore((s) => s.hoveredItem);
export const useEventPos = () => useHoverStore((s) => s.eventPos);
export const useHoveredElement = () => useHoverStore((s) => s.hoveredElement);

export const useHoverActions = () => useHoverStore((s) => s.actions);
