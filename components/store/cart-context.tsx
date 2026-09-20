'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export interface CartItem {
  productId: string;
  name: string;
  category: string;
  unitPrice: number;
  imageUrl: string | null;
  sizes: string[];
  customizable: boolean;
  size: string | null;
  customText: string | null;
  quantity: number;
}

export interface CheckoutLine {
  productId: string;
  size: string | null;
  customText: string | null;
  quantity: number;
}

const STORAGE_KEY = 'ekhaya-cart.v1';
const MAX_QTY = 10;

type StoreCartValue = {
  items: CartItem[];
  count: number;
  total: number;
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  updateQuantity: (productId: string, size: string | null, customText: string | null, delta: number) => void;
  removeItem: (productId: string, size: string | null, customText: string | null) => void;
  clearCart: () => void;
  toCheckoutLines: () => CheckoutLine[];
};

const StoreCartContext = createContext<StoreCartValue | null>(null);

export function StoreCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      // Ignore corrupt storage.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable (private mode) — cart still works in memory.
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.productId === item.productId && i.size === item.size && i.customText === item.customText,
      );
      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, quantity: Math.min(i.quantity + 1, MAX_QTY) } : i,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback(
    (productId: string, size: string | null, customText: string | null, delta: number) => {
      setItems((prev) =>
        prev
          .map((i) =>
            i.productId === productId && i.size === size && i.customText === customText
              ? { ...i, quantity: Math.min(Math.max(i.quantity + delta, 0), MAX_QTY) }
              : i,
          )
          .filter((i) => i.quantity > 0),
      );
    },
    [],
  );

  const removeItem = useCallback((productId: string, size: string | null, customText: string | null) => {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.size === size && i.customText === customText)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const toCheckoutLines = useCallback(
    (): CheckoutLine[] =>
      items.map((i) => ({ productId: i.productId, size: i.size, customText: i.customText, quantity: i.quantity })),
    [items],
  );

  const value = useMemo<StoreCartValue>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.quantity, 0),
      total: items.reduce((n, i) => n + i.unitPrice * i.quantity, 0),
      isOpen,
      openDrawer: () => setIsOpen(true),
      closeDrawer: () => setIsOpen(false),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      toCheckoutLines,
    }),
    [items, isOpen, addItem, updateQuantity, removeItem, clearCart, toCheckoutLines],
  );

  return <StoreCartContext.Provider value={value}>{children}</StoreCartContext.Provider>;
}

export function useStoreCart(): StoreCartValue {
  const value = useContext(StoreCartContext);
  if (!value) throw new Error('useStoreCart must be used within a StoreCartProvider');
  return value;
}