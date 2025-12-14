import { createContext, useContext, useReducer, ReactNode, useMemo } from 'react';
import { CartItem, CartContextType } from '../types/cart';

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { sweetId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.find(item => item.sweetId === action.payload.sweetId);
      
      if (existingItem) {
        return state.map(item =>
          item.sweetId === action.payload.sweetId
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + 1,
                  action.payload.maxQuantity
                ),
              }
            : item
        );
      }

      return [...state, { ...action.payload, quantity: 1 }];
    }

    case 'REMOVE_ITEM':
      return state.filter(item => item.sweetId !== action.payload);

    case 'UPDATE_QUANTITY':
      return state.map(item =>
        item.sweetId === action.payload.sweetId
          ? {
              ...item,
              quantity: Math.min(
                Math.max(1, action.payload.quantity),
                item.maxQuantity
              ),
            }
          : item
      );

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, dispatch] = useReducer(cartReducer, [], () => {
    // Load cart from localStorage on initial render
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // Save cart to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (sweetId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: sweetId });
  };

  const updateQuantity = (sweetId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { sweetId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const isInCart = (sweetId: string) => {
    return items.some(item => item.sweetId === sweetId);
  };

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    total,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};