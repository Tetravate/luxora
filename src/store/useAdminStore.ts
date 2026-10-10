import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { products as initialProducts, categories as initialCategories } from '../lib/data';
import type { Product, CategoryInfo, UserProfile } from '../types';



export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  active: boolean;
  usageLimit: number | null;
  used: number;
}

export interface Review {
  id: string;
  productId: string;
  customerId?: string;
  customerName: string;
  rating: number;
  title?: string;
  comment: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Hidden';
  verifiedPurchase?: boolean;
  helpfulVotes?: number;
}

export interface Settings {
  storeName: string;
  contactEmail: string;
  shippingFlatRate: number;
  freeShippingThreshold: number;
  taxRate: number;
  currency: string;
  orderNotifications: boolean;
}

interface AdminStoreState {
  products: Product[];
  categories: CategoryInfo[];

  customers: UserProfile[];
  coupons: Coupon[];
  reviews: Review[];
  settings: Settings;

  // Products
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateInventory: (id: string, quantity: number) => void;

  // Categories
  addCategory: (category: CategoryInfo) => void;
  updateCategory: (slug: string, category: Partial<CategoryInfo>) => void;
  deleteCategory: (slug: string) => void;



  // Customers
  addCustomer: (customer: UserProfile) => void;
  updateCustomer: (id: string, customer: Partial<UserProfile>) => void;
  deleteCustomer: (id: string) => void;

  // Discounts
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (id: string, coupon: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;

  // Reviews
  addReview: (review: Review) => void;
  updateReviewStatus: (id: string, status: Review['status']) => void;
  deleteReview: (id: string) => void;
  voteReviewHelpful: (id: string) => void;

  // Settings
  updateSettings: (settings: Partial<Settings>) => void;
}

export const useAdminStore = create<AdminStoreState>()(
  persist(
    (set) => ({
      products: initialProducts,
      categories: initialCategories,

      customers: [
        { id: 'usr-1', name: 'Eleanor Vance', email: 'eleanor@example.com', phone: '555-0101', role: 'customer', isLoggedIn: false },
        { id: 'usr-2', name: 'Marcus Sterling', email: 'marcus@example.com', phone: '555-0102', role: 'customer', isLoggedIn: false },
        { id: 'usr-3', name: 'Sophia Chen', email: 'sophia@example.com', phone: '555-0103', role: 'customer', isLoggedIn: false },
      ],
      coupons: [
        { id: 'c-1', code: 'TETRA10', type: 'percentage', value: 10, minOrder: 0, active: true, usageLimit: null, used: 145 },
        { id: 'c-2', code: 'VIP20', type: 'percentage', value: 20, minOrder: 200, active: true, usageLimit: 100, used: 84 },
        { id: 'c-3', code: 'WINTER50', type: 'fixed', value: 50, minOrder: 250, active: false, usageLimit: 50, used: 50 },
      ],
      reviews: [
        { id: 'rev-1', productId: '1', customerId: 'usr-1', customerName: 'Eleanor Vance', rating: 5, title: 'Amazing quality', comment: 'Exceeded every expectation. Highly recommended.', date: '2023-10-25', status: 'Approved', verifiedPurchase: true, helpfulVotes: 12 },
        { id: 'rev-2', productId: '2', customerId: 'usr-2', customerName: 'Marcus Sterling', rating: 4, title: 'Good but delayed', comment: 'Great quality but shipping was slightly delayed.', date: '2023-10-22', status: 'Approved', verifiedPurchase: true, helpfulVotes: 2 },
        { id: 'rev-3', productId: '1', customerName: 'Anonymous', rating: 1, title: 'Terrible', comment: 'Spam comment here.', date: '2023-10-20', status: 'Pending', verifiedPurchase: false, helpfulVotes: 0 },
      ],
      settings: {
        storeName: 'Tetravate',
        contactEmail: 'support@tetravate.com',
        shippingFlatRate: 15,
        freeShippingThreshold: 100,
        taxRate: 8.5,
        currency: 'USD',
        orderNotifications: true,
      },

      addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
      updateProduct: (id, updates) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
      })),
      updateInventory: (id, quantity) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, stock: quantity } : p)
      })),

      addCategory: (category) => set((state) => ({ categories: [...state.categories, category] })),
      updateCategory: (slug, updates) => set((state) => ({
        categories: state.categories.map(c => c.slug === slug ? { ...c, ...updates } : c)
      })),
      deleteCategory: (slug) => set((state) => ({
        categories: state.categories.filter(c => c.slug !== slug)
      })),



      addCustomer: (customer) => set((state) => ({ customers: [customer, ...state.customers] })),
      updateCustomer: (id, updates) => set((state) => ({
        customers: state.customers.map(c => c.id === id ? { ...c, ...updates } : c)
      })),
      deleteCustomer: (id) => set((state) => ({
        customers: state.customers.filter(c => c.id !== id)
      })),

      addCoupon: (coupon) => set((state) => ({ coupons: [...state.coupons, coupon] })),
      updateCoupon: (id, updates) => set((state) => ({
        coupons: state.coupons.map(c => c.id === id ? { ...c, ...updates } : c)
      })),
      deleteCoupon: (id) => set((state) => ({
        coupons: state.coupons.filter(c => c.id !== id)
      })),

      addReview: (review) => set((state) => ({ reviews: [review, ...state.reviews] })),
      updateReviewStatus: (id, status) => set((state) => ({
        reviews: state.reviews.map(r => r.id === id ? { ...r, status } : r)
      })),
      deleteReview: (id) => set((state) => ({
        reviews: state.reviews.filter(r => r.id !== id)
      })),
      voteReviewHelpful: (id) => set((state) => ({
        reviews: state.reviews.map(r => r.id === id ? { ...r, helpfulVotes: (r.helpfulVotes || 0) + 1 } : r)
      })),

      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),
    }),
    {
      name: 'luxora-admin-v1',
    }
  )
);
