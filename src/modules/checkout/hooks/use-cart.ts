import { useCallback } from "react";

import { useShallow } from "zustand/react/shallow";

import { useCartStore } from "../store/use-cart-store";

export function useCart(storeSubdomain: string) {
  const addProduct = useCartStore((state) => state.addProduct);
  const clearAllCarts = useCartStore((state) => state.clearAllCarts);
  const clearCart = useCartStore((state) => state.clearCart);
  const removeProduct = useCartStore((state) => state.removeProduct);

  const productIds = useCartStore(
    useShallow((state) => state.storeCarts[storeSubdomain]?.productIds || []),
  );

  const toggleProduct = useCallback(
    (productId: string) => {
      if (productIds.includes(productId)) {
        removeProduct(storeSubdomain, productId);
      } else {
        addProduct(storeSubdomain, productId);
      }
    },
    [addProduct, removeProduct, productIds, storeSubdomain],
  );

  const isProductInCart = useCallback(
    (productId: string) => {
      return productIds.includes(productId);
    },
    [productIds],
  );

  const clearStoreCart = useCallback(() => {
    clearCart(storeSubdomain);
  }, [storeSubdomain, clearCart]);

  const handleAddProduct = useCallback(
    (productId: string) => {
      addProduct(storeSubdomain, productId);
    },
    [addProduct, storeSubdomain],
  );

  const handleRemoveProduct = useCallback(
    (productId: string) => {
      removeProduct(storeSubdomain, productId);
    },
    [removeProduct, storeSubdomain],
  );

  return {
    productIds,
    addProduct: handleAddProduct,
    removeProduct: handleRemoveProduct,
    clearCart: clearStoreCart,
    clearAllCarts,
    toggleProduct,
    isProductInCart,
    totalItems: productIds.length,
  };
}
