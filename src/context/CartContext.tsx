/* eslint-disable max-len */
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { TypeOfItem } from "../types/item";

interface CartItem extends TypeOfItem {
  quantity: number;
  selectedVolume: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: TypeOfItem, volume: number) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  getCartTotal: () => number;
}

const CART_STORAGE_KEY = "maroon-cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: TypeOfItem, selectedVolume: number) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prevItems, { ...item, quantity: 1, selectedVolume }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prevItems) => prevItems.map((item) => (item.id === itemId ? { ...item, quantity } : item)));
  };

  const getCartTotal = () => cartItems.reduce((total, item) => {
    const variant = item.variants.find(
      (v) => v.volume === item.selectedVolume,
    );
    return total + (variant?.price || 0) * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
