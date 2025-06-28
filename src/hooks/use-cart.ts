import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CartItem {
  slug: string;
}

interface State {
  items: CartItem[];
  addItem: (slug: string) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
}

export const useCart = create<State>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (slug) =>
        set((state) => ({
          items: state.items.some((item) => item.slug === slug)
            ? state.items
            : [...state.items, { slug }],
        })),
      removeItem: (slug) =>
        set((state) => ({
          items: state.items.filter((item) => item.slug !== slug),
        })),
      clearCart: () => set({ items: [] }),
      getItemCount: () => get().items.reduce((total) => total + 1, 0),
    }),
    {
      name: "cart-state",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
