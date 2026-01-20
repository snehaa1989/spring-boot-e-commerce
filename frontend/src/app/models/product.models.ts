export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
  categoryId: string;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  shippingAddress?: ShippingAddress;
  billingAddress?: ShippingAddress;
  paymentMethod?: string;
  shippingMethod?: string;
  subtotal?: number;
  tax?: number;
  shipping?: number;
  orderNotes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal?: number;
  product?: Product;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}
