import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface StoreCart {
  productIds: string[];
}

interface CartState {
  storeCarts: Record<string, StoreCart>;
  addProduct: (storeSubdomain: string, productId: string) => void;
  removeProduct: (storeSubdomain: string, productId: string) => void;
  clearCart: (storeSubdomain: string) => void;
  clearAllCarts: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      storeCarts: {},
      addProduct: (storeSubdomain, productId) =>
        set((state) => ({
          storeCarts: {
            ...state.storeCarts,
            [storeSubdomain]: {
              productIds: [
                ...(state.storeCarts[storeSubdomain]?.productIds || []),
                productId,
              ],
            },
          },
        })),
      removeProduct: (storeSubdomain, productId) =>
        set((state) => ({
          storeCarts: {
            ...state.storeCarts,
            [storeSubdomain]: {
              productIds:
                state.storeCarts[storeSubdomain]?.productIds.filter(
                  (id) => id !== productId,
                ) || [],
            },
          },
        })),
      clearCart: (storeSubdomain) =>
        set((state) => ({
          storeCarts: {
            ...state.storeCarts,
            [storeSubdomain]: {
              productIds: [],
            },
          },
        })),
      clearAllCarts: () =>
        set({
          storeCarts: {},
        }),
    }),
    {
      name: "tus-cart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
