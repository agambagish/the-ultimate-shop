import { useReducer } from "react";

import type { Product } from "@/db/schema";

export type CartItem = Pick<
  Product,
  "title" | "slug" | "price" | "discountPercentage" | "thumbnailImageURL"
> & {
  category: string;
  storeId: number;
};

interface State {
  isOrderSummaryLoading: boolean;
  cart: CartItem[];
  isLoading: boolean;
  subtotal: number;
  discount: number;
  total: number;
}

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ORDER_SUMMARY_LOADING"; payload: boolean }
  | { type: "SET_CART"; payload: CartItem[] }
  | { type: "SET_SUBTOTAL"; payload: number }
  | { type: "SET_DISCOUNT"; payload: number }
  | { type: "SET_TOTAL"; payload: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ORDER_SUMMARY_LOADING":
      return { ...state, isOrderSummaryLoading: action.payload };
    case "SET_CART":
      return { ...state, cart: action.payload };
    case "SET_SUBTOTAL":
      return { ...state, subtotal: action.payload };
    case "SET_DISCOUNT":
      return { ...state, discount: action.payload };
    case "SET_TOTAL":
      return { ...state, total: action.payload };
    default:
      return state;
  }
}

export function useCheckoutStates() {
  const [state, dispatch] = useReducer(reducer, {
    isOrderSummaryLoading: false,
    cart: [],
    isLoading: false,
    subtotal: 0,
    discount: 0,
    total: 0,
  });

  return {
    state,
    setState: dispatch,
  };
}
