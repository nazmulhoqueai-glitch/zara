export interface CartItem {
  id: string; // product id
  name: string;
  image: string;
  price: number; // unit price
  quantity: number;
  size?: string;
  color?: string;
  // derived key to differentiate variants of same product
  key: string; // `${id}|${size||''}|${color||''}`
}

export interface CartTotals {
  subtotal: number;
  itemCount: number; // sum of quantities
}
