import { useCartStore } from "../store/use-cart-store";

export function useCart(storeSubdomain: string) {
  const {
    addProduct,
    clearAllCarts,
    clearCart,
    getCartByStore,
    removeProduct,
  } = useCartStore();

  const productIds = getCartByStore(storeSubdomain);

  function toggleProduct(productId: string) {
    if (productIds.includes(productId)) {
      removeProduct(storeSubdomain, productId);
    } else {
      addProduct(storeSubdomain, productId);
    }
  }

  function isProductInCart(productId: string) {
    return productIds.includes(productId);
  }

  function clearStoreCart() {
    clearCart(storeSubdomain);
  }

  return {
    productIds,
    addProduct: (productId: string) => addProduct(storeSubdomain, productId),
    removeProduct: (productId: string) =>
      removeProduct(storeSubdomain, productId),
    clearCart: clearStoreCart,
    clearAllCarts,
    toggleProduct,
    isProductInCart,
    totalItems: productIds.length,
  };
}
