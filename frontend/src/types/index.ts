export interface User {
  id: number;
  username: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_qty: number;
}

export interface OrderItem {
  id?: number;
  order_id?: number;
  product_id: number;
  quantity: number;
  unit_price?: number;
  total_price?: number;
}

export interface Order {
  id: number;
  customer_id: number;
  order_date: string;
  total_amount: number;
  status: string;
  items?: OrderItem[];
}
