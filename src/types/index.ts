export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  colors?: string[];
  sizes?: string[];
  stock: number;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  onSale?: boolean;
}

export interface CartItem extends Product {
  cartItemId: string; // Unique ID for cart item
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface CategoryInfo {
  name: string;
  slug: string;
  image: string;
  description: string;
  itemCount: number;
}

export interface BrandInfo {
  name: string;
  slug: string;
  description: string;
  itemCount: number;
  featured?: boolean;
}

export interface ToastNotification {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

export interface UserProfile {
  id: string; // Made id required
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  isLoggedIn: boolean;
}

export interface UserAccount extends UserProfile {
  passwordHash: string;
}

export interface UserData {
  cart: CartItem[];
  wishlist: Product[];
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  notifications: Notification[];
  recentlyViewed: Product[];
  preferences: {
    orderUpdates: boolean;
    shippingUpdates: boolean;
    promotions: boolean;
    priceDrops: boolean;
  };
  selectedAddressId: string | null;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  date: string;
  total: number;
  status: 'Order Confirmed' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Returned';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  items: {
    productId?: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  shippingAddress?: Address;
  paymentMethod?: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'Visa' | 'Mastercard' | 'Amex' | 'UPI' | 'Other';
  last4: string;
  expiry: string;
  isDefault?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'order' | 'promo' | 'alert';
}
