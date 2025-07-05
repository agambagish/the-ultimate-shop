import { useReducer } from "react";

import type { CartItem } from "../lib/types";

interface State {
  isOpen: boolean;
  isLoading: boolean;
  isMounted: boolean;
  subtotal: number;
  discount: number;
  total: number;
  cart: CartItem[];
}

type Action =
  | { type: "SET_IS_OPEN"; payload: boolean }
  | { type: "SET_IS_LOADING"; payload: boolean }
  | { type: "SET_IS_MOUNTED"; payload: boolean }
  | { type: "SET_SUBTOTAL"; payload: number }
  | { type: "SET_DISCOUNT"; payload: number }
  | { type: "SET_TOTAL"; payload: number }
  | { type: "SET_CART"; payload: CartItem[] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_IS_OPEN":
      return { ...state, isOpen: action.payload };
    case "SET_IS_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_IS_MOUNTED":
      return { ...state, isMounted: action.payload };
    case "SET_SUBTOTAL":
      return { ...state, subtotal: action.payload };
    case "SET_DISCOUNT":
      return { ...state, discount: action.payload };
    case "SET_TOTAL":
      return { ...state, total: action.payload };
    case "SET_CART":
      return { ...state, cart: action.payload };
    default:
      return state;
  }
}

export function useCartSheetStates() {
  const [state, dispatch] = useReducer(reducer, {
    isOpen: false,
    isLoading: false,
    isMounted: false,
    subtotal: 0,
    discount: 0,
    total: 0,
    cart: [],
  });

  return {
    state,
    setState: dispatch,
  };
}
