import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";

export type CartItemProps = {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  discount: number;
  inStock: boolean;
  count: number;
  sizes: {
    label: "Small" | "Medium" | "Large";
    priceModifier: number;
  }[];
  selectedSize: "Small" | "Medium" | "Large" | null;
};

// Define store state and actions
interface CartState {
  items: CartItemProps[];

  addItem: (data: Omit<CartItemProps, "count">, count?: number) => void;
  updateItemCount: (
    id: string | number,
    selectedSize: CartItemProps["selectedSize"],
    newCount: number
  ) => void;
  removeItem: (
    id: string | number,
    selectedSize: CartItemProps["selectedSize"]
  ) => void;
  removeAll: () => void;
  getItemCount: (
    id: string | number,
    selectedSize: CartItemProps["selectedSize"]
  ) => number;
  getTotalCount: () => number;
  getTotalPrice: () => number;
}

// Zustand store with persistence
const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (data, count = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) =>
            item.id === data.id && item.selectedSize === data.selectedSize
        );

        if (existingItem) {
          toast.info("Item is already in cart.");
          return;
        }

        set({ items: [...currentItems, { ...data, count }] });
        toast.success("Item added to cart.");
      },

      updateItemCount: (id, selectedSize, newCount) => {
        const updatedItems = get().items.map((item) =>
          item.id === id && item.selectedSize === selectedSize
            ? { ...item, count: newCount }
            : item
        );
        set({ items: updatedItems });
        toast.success("Cart updated.");
      },

      removeItem: (id, selectedSize) => {
        set({
          items: get().items.filter(
            (item) => !(item.id === id && item.selectedSize === selectedSize)
          ),
        });
        toast.success("Item removed from the cart.");
      },

      removeAll: () => {
        set({ items: [] });
      },

      getItemCount: (id, selectedSize) => {
        const item = get().items.find(
          (item) => item.id === id && item.selectedSize === selectedSize
        );
        return item ? item.count : 0;
      },

      getTotalCount: () => {
        return get().items.reduce((total, item) => total + item.count, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.count,
          0
        );
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;