import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface Item {
  productId: number;
  qty: number;
}

interface Store {
  items: Item[];
  addItem: (item: Item) => void;
  removeItem: (id: number) => void;
  incrementQty: (id: number) => void;
  decrementQty: (id: number) => void;
  clearCart: () => void;
  totalItems: () => number;
}

export const useCart = create<Store>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existingItem = get().items.find(
          (i) => i.productId === item.productId
        );
        if (existingItem) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId
                ? { ...i, qty: i.qty + item.qty }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.productId !== id) });
      },
      incrementQty: (id) => {
        const existingItem = get().items.find((i) => i.productId === id);

        if (existingItem) {
          set({
            items: get().items.map((i) =>
              i.productId === id ? { ...i, qty: i.qty + 1 } : i
            ),
          });
        }
      },
      decrementQty: (id) => {
        const existingItem = get().items.find((i) => i.productId === id);

        if (existingItem) {
          set({
            items: get().items.map((i) =>
              i.productId === id ? { ...i, qty: i.qty - 1 } : i
            ),
          });
        }
      },
      clearCart: () => set({ items: [] }),
      totalItems: () =>
        get().items.reduce((total, item) => total + item.qty, 0),
    }),
    {
      name: "cart-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
