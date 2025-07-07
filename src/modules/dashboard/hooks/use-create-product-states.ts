import { useReducer } from "react";

import type { ProductCategory } from "@/db/schema";

interface State {
  isLoading: boolean;
  isCategoriesLoading: boolean;
  categories: Pick<ProductCategory, "id" | "label">[];
}

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_CATEGORIES_LOADING"; payload: boolean }
  | {
      type: "SET_CATEGORIES";
      payload: Pick<ProductCategory, "id" | "label">[];
    };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_CATEGORIES_LOADING":
      return { ...state, isCategoriesLoading: action.payload };
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };
    default:
      return state;
  }
}

export function useCreateProductStates() {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    isCategoriesLoading: false,
    categories: [],
  });

  return {
    state,
    setState: dispatch,
  };
}
