export interface CartItem {
  sweetId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  maxQuantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (sweetId: string) => void;
  updateQuantity: (sweetId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
  isInCart: (sweetId: string) => boolean;
}