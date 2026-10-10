import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem, ToastNotification, UserProfile, Address, Order, Notification, PaymentMethod, UserAccount, UserData } from '../types';

const DEFAULT_USER_DATA: UserData = {
  cart: [],
  wishlist: [],
  addresses: [],
  paymentMethods: [],
  notifications: [],
  recentlyViewed: [],
  preferences: {
    orderUpdates: true,
    shippingUpdates: true,
    promotions: false,
    priceDrops: true
  },
  selectedAddressId: null
};

interface StoreState {
  cart: CartItem[];
  wishlist: Product[];
  isCartOpen: boolean;
  isMobileMenuOpen: boolean;
  toasts: ToastNotification[];
  user: UserProfile | null;
  coupon: { code: string; discountPercent: number } | null;
  
  // Account Data
  addresses: Address[];
  orders: Order[];
  notifications: Notification[];
  paymentMethods: PaymentMethod[];
  recentlyViewed: Product[];
  preferences: {
    orderUpdates: boolean;
    shippingUpdates: boolean;
    promotions: boolean;
    priceDrops: boolean;
  };

  // Delivery Address Selector
  selectedAddressId: string | null;
  guestZipCode: string | null;
  setSelectedAddressId: (id: string | null) => void;
  setGuestZipCode: (zip: string | null) => void;

  // Account Actions
  updateProfile: (profile: Partial<UserProfile>) => void;
  addAddress: (address: Address) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  
  // Payment Methods Actions
  addPaymentMethod: (pm: PaymentMethod) => void;
  deletePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
  
  // Orders Actions
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  updateOrderPayment: (id: string, payment: Order['paymentStatus']) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  updatePreferences: (prefs: Partial<StoreState['preferences']>) => void;
  addRecentlyViewed: (product: Product) => void;
  
  // Cart Actions
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedSize?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Wishlist Actions
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  moveToCart: (product: Product, selectedColor?: string, selectedSize?: string) => void;
  
  // Drawer / Menu
  setCartOpen: (isOpen: boolean) => void;
  setMobileMenuOpen: (isOpen: boolean) => void;
  
  // Toasts
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  
  // Auth
  setUser: (user: UserProfile | null) => void;
  logout: () => void;
  registeredUsers: UserAccount[];
  userDataRecord: Record<string, UserData>;
  registerUser: (account: UserAccount) => void;
  loginUser: (email: string, passwordHash: string) => { success: boolean; user?: UserProfile; message?: string };
  
  // Coupon
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      isCartOpen: false,
      isMobileMenuOpen: false,
      toasts: [],
      user: {
        id: 'user-1',
        name: 'John Customer',
        email: 'customer@tetravate.com',
        phone: '+1 (555) 234-5678',
        role: 'customer',
        isLoggedIn: true,
      },
      coupon: null,
      
      addresses: [
        {
          id: 'addr-1',
          name: 'John Customer',
          phone: '+1 (555) 234-5678',
          street: '742 Evergreen Terrace',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94102',
          country: 'United States',
          isDefault: true
        }
      ],
      orders: [
        {
          id: 'ORD-7829-XV',
          customerId: 'user-1',
          customerName: 'John Customer',
          customerEmail: 'customer@tetravate.com',
          date: 'June 10, 2026',
          total: 247.00,
          status: 'Shipped',
          paymentStatus: 'Paid',
          items: [
            {
              productId: '1',
              name: 'Tetra Pro Wireless Headphones',
              quantity: 1,
              price: 247.00,
              image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop'
            }
          ],
          shippingAddress: {
            id: 'addr-1',
            name: 'John Customer',
            phone: '+1 (555) 234-5678',
            street: '742 Evergreen Terrace',
            city: 'San Francisco',
            state: 'CA',
            postalCode: '94102',
            country: 'United States'
          }
        }
      ],
      notifications: [
        {
          id: 'notif-1',
          title: 'Order Shipped',
          message: 'Your order #ORD-7829-XV has been shipped and is on its way.',
          date: 'June 12, 2026',
          read: false,
          type: 'order'
        },
        {
          id: 'notif-2',
          title: 'Welcome to Tetravate',
          message: 'Thank you for joining. Explore our latest collections.',
          date: 'June 01, 2026',
          read: true,
          type: 'alert'
        }
      ],
      paymentMethods: [
        {
          id: 'pm-1',
          type: 'Visa',
          last4: '4242',
          expiry: '08/29',
          isDefault: true
        }
      ],
      recentlyViewed: [],
      preferences: {
        orderUpdates: true,
        shippingUpdates: true,
        promotions: false,
        priceDrops: true
      },
      selectedAddressId: null,
      guestZipCode: null,
      
      registeredUsers: [
        {
          id: 'user-1',
          name: 'John Customer',
          email: 'customer@tetravate.com',
          phone: '+1 (555) 234-5678',
          role: 'customer',
          isLoggedIn: true,
          passwordHash: 'Y3VzdG9tZXIxMjM=' // 'customer123'
        },
        {
          id: 'admin-1',
          name: 'Admin User',
          email: 'admin@tetravate.com',
          role: 'admin',
          isLoggedIn: true,
          passwordHash: 'YWRtaW4xMjM=' // 'admin123'
        }
      ],
      userDataRecord: {
        'user-1': {
          cart: [],
          wishlist: [],
          addresses: [
            {
              id: 'addr-1',
              name: 'John Customer',
              phone: '+1 (555) 234-5678',
              street: '742 Evergreen Terrace',
              city: 'San Francisco',
              state: 'CA',
              postalCode: '94102',
              country: 'United States',
              isDefault: true
            }
          ],
          paymentMethods: [
            {
              id: 'pm-1',
              type: 'Visa',
              last4: '4242',
              expiry: '08/29',
              isDefault: true
            }
          ],
          notifications: [
            {
              id: 'notif-1',
              title: 'Order Shipped',
              message: 'Your order #ORD-7829-XV has been shipped and is on its way.',
              date: 'June 12, 2026',
              read: false,
              type: 'order'
            }
          ],
          recentlyViewed: [],
          preferences: {
            orderUpdates: true,
            shippingUpdates: true,
            promotions: false,
            priceDrops: true
          },
          selectedAddressId: null
        }
      },
      
      addToCart: (product, quantity = 1, selectedColor, selectedSize) => {
        const cart = get().cart;
        const color = selectedColor || product.colors?.[0] || undefined;
        const size = selectedSize || product.sizes?.[0] || undefined;
        
        const existingItemIndex = cart.findIndex(
          (item) => item.id === product.id && item.selectedColor === color && item.selectedSize === size
        );
        
        if (existingItemIndex >= 0) {
          const newCart = [...cart];
          newCart[existingItemIndex].quantity += quantity;
          set({ cart: newCart });
        } else {
          const cartItemId = `${product.id}-${color || 'def'}-${size || 'def'}-${Date.now()}`;
          set({ 
            cart: [
              ...cart, 
              { 
                ...product, 
                quantity, 
                selectedColor: color, 
                selectedSize: size, 
                cartItemId 
              }
            ] 
          });
        }
        
        get().addToast(`"${product.name}" added to cart`, 'success');
        set({ isCartOpen: true });
      },
      
      removeFromCart: (cartItemId) => {
        const item = get().cart.find(i => i.cartItemId === cartItemId);
        set({ cart: get().cart.filter((i) => i.cartItemId !== cartItemId) });
        if (item) {
          get().addToast(`Removed "${item.name}" from cart`, 'info');
        }
      },
      
      updateCartQuantity: (cartItemId, quantity) => {
        if (quantity < 1) {
          get().removeFromCart(cartItemId);
          return;
        }
        set({
          cart: get().cart.map((item) => 
            item.cartItemId === cartItemId ? { ...item, quantity } : item
          )
        });
      },
      
      clearCart: () => {
        set({ cart: [] });
        get().addToast('Cart cleared', 'info');
      },
      
      toggleWishlist: (product) => {
        const wishlist = get().wishlist;
        const exists = wishlist.some(item => item.id === product.id);
        if (exists) {
          set({ wishlist: wishlist.filter(item => item.id !== product.id) });
          get().addToast(`Removed "${product.name}" from wishlist`, 'info');
        } else {
          set({ wishlist: [...wishlist, product] });
          get().addToast(`Added "${product.name}" to wishlist`, 'success');
        }
      },

      removeFromWishlist: (productId) => {
        set({ wishlist: get().wishlist.filter(item => item.id !== productId) });
      },

      clearWishlist: () => {
        set({ wishlist: [] });
        get().addToast('Wishlist cleared', 'info');
      },

      moveToCart: (product, selectedColor, selectedSize) => {
        get().removeFromWishlist(product.id);
        get().addToCart(product, 1, selectedColor, selectedSize);
        get().addToast(`Moved "${product.name}" to cart`, 'success');
      },
      
      setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
      setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
      
      addToast: (message, type = 'success') => {
        const id = `${Date.now()}-${Math.random()}`;
        const newToast: ToastNotification = { id, message, type };
        set({ toasts: [...get().toasts, newToast] });
        
        // Auto remove after 3.5 seconds
        setTimeout(() => {
          get().removeToast(id);
        }, 3500);
      },
      
      removeToast: (id) => {
        set({ toasts: get().toasts.filter(t => t.id !== id) });
      },

      setUser: (user) => set({ user }),
      logout: () => {
        set({ 
          user: null,
          cart: DEFAULT_USER_DATA.cart,
          wishlist: DEFAULT_USER_DATA.wishlist,
          addresses: DEFAULT_USER_DATA.addresses,
          paymentMethods: DEFAULT_USER_DATA.paymentMethods,
          notifications: DEFAULT_USER_DATA.notifications,
          recentlyViewed: DEFAULT_USER_DATA.recentlyViewed,
          preferences: DEFAULT_USER_DATA.preferences,
          selectedAddressId: DEFAULT_USER_DATA.selectedAddressId
        });
        get().addToast('You have been signed out', 'info');
      },

      registerUser: (account) => {
        set({ registeredUsers: [...get().registeredUsers, account] });
      },

      loginUser: (email, passwordHash) => {
        const user = get().registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === passwordHash);
        if (user) {
          const userProfile: UserProfile = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isLoggedIn: true
          };
          
          const data = get().userDataRecord[user.id] || DEFAULT_USER_DATA;
          
          set({ 
            user: userProfile,
            cart: data.cart,
            wishlist: data.wishlist,
            addresses: data.addresses,
            paymentMethods: data.paymentMethods,
            notifications: data.notifications,
            recentlyViewed: data.recentlyViewed,
            preferences: data.preferences,
            selectedAddressId: data.selectedAddressId
          });
          
          get().addToast(`Welcome back, ${user.name}!`, 'success');
          return { success: true, user: userProfile };
        } else {
          return { success: false, message: 'Invalid email or password' };
        }
      },

      applyCoupon: (code) => {
        const cleanCode = code.trim().toUpperCase();
        if (cleanCode === 'TETRA10' || cleanCode === 'TETRAVATE10') {
          set({ coupon: { code: cleanCode, discountPercent: 10 } });
          get().addToast('Coupon applied! 10% discount added.', 'success');
          return { success: true, message: '10% discount applied!' };
        } else if (cleanCode === 'VIP20') {
          set({ coupon: { code: cleanCode, discountPercent: 20 } });
          get().addToast('VIP Coupon applied! 20% discount added.', 'success');
          return { success: true, message: '20% VIP discount applied!' };
        } else {
          get().addToast('Invalid promo code. Try TETRA10', 'error');
          return { success: false, message: 'Invalid promo code. Try TETRA10' };
        }
      },

      removeCoupon: () => {
        set({ coupon: null });
        get().addToast('Promo code removed', 'info');
      },

      updateProfile: (profile) => {
        const user = get().user;
        if (user) {
          set({ user: { ...user, ...profile } });
          get().addToast('Profile updated successfully', 'success');
        }
      },

      addAddress: (address) => {
        const newAddresses = [...get().addresses, address];
        if (address.isDefault) {
          newAddresses.forEach(a => { if (a.id !== address.id) a.isDefault = false; });
        }
        set({ addresses: newAddresses });
        get().addToast('Address saved successfully', 'success');
      },

      updateAddress: (id, updates) => {
        let newAddresses = get().addresses.map(a => a.id === id ? { ...a, ...updates } : a);
        if (updates.isDefault) {
          newAddresses = newAddresses.map(a => a.id === id ? a : { ...a, isDefault: false });
        }
        set({ addresses: newAddresses });
        get().addToast('Address updated successfully', 'success');
      },

      deleteAddress: (id) => {
        set({ addresses: get().addresses.filter(a => a.id !== id) });
        get().addToast('Address removed', 'info');
      },

      setDefaultAddress: (id) => {
        set({
          addresses: get().addresses.map(a => ({
            ...a,
            isDefault: a.id === id
          }))
        });
        get().addToast('Default address updated', 'success');
      },

      addPaymentMethod: (pm) => {
        const newMethods = [...get().paymentMethods, pm];
        if (pm.isDefault) {
          newMethods.forEach(m => { if (m.id !== pm.id) m.isDefault = false; });
        }
        set({ paymentMethods: newMethods });
        get().addToast('Payment method added successfully', 'success');
      },

      deletePaymentMethod: (id) => {
        set({ paymentMethods: get().paymentMethods.filter(m => m.id !== id) });
        get().addToast('Payment method removed', 'info');
      },

      setDefaultPaymentMethod: (id) => {
        set({
          paymentMethods: get().paymentMethods.map(m => ({
            ...m,
            isDefault: m.id === id
          }))
        });
        get().addToast('Default payment method updated', 'success');
      },

      addOrder: (order) => {
        set({ orders: [order, ...get().orders] });
      },

      updateOrderStatus: (id, status) => {
        set({
          orders: get().orders.map(o => o.id === id ? { ...o, status } : o)
        });
      },

      updateOrderPayment: (id, payment) => {
        set({
          orders: get().orders.map(o => o.id === id ? { ...o, paymentStatus: payment } : o)
        });
      },

      markNotificationRead: (id) => {
        set({
          notifications: get().notifications.map(n => n.id === id ? { ...n, read: true } : n)
        });
      },

      markAllNotificationsRead: () => {
        set({
          notifications: get().notifications.map(n => ({ ...n, read: true }))
        });
      },

      deleteNotification: (id) => {
        set({ notifications: get().notifications.filter(n => n.id !== id) });
      },

      updatePreferences: (prefs) => {
        set({ preferences: { ...get().preferences, ...prefs } });
        get().addToast('Preferences saved', 'success');
      },

      addRecentlyViewed: (product) => {
        const current = get().recentlyViewed.filter(p => p.id !== product.id);
        set({ recentlyViewed: [product, ...current].slice(0, 10) });
      },
      setSelectedAddressId: (id) => set({ selectedAddressId: id }),
      setGuestZipCode: (zip) => set({ guestZipCode: zip }),
    }),
    {
      name: 'luxora-storage-v2',
      partialize: (state) => ({ 
        cart: state.cart, 
        wishlist: state.wishlist, 
        user: state.user,
        coupon: state.coupon,
        addresses: state.addresses,
        orders: state.orders,
        notifications: state.notifications,
        paymentMethods: state.paymentMethods,
        recentlyViewed: state.recentlyViewed,
        preferences: state.preferences,
        selectedAddressId: state.selectedAddressId,
        guestZipCode: state.guestZipCode,
        registeredUsers: state.registeredUsers,
        userDataRecord: state.userDataRecord,
      }),
    }
  )
);

useStore.subscribe((state, prevState) => {
  if (state.user && (
    state.cart !== prevState.cart ||
    state.wishlist !== prevState.wishlist ||
    state.addresses !== prevState.addresses ||
    state.paymentMethods !== prevState.paymentMethods ||
    state.notifications !== prevState.notifications ||
    state.recentlyViewed !== prevState.recentlyViewed ||
    state.preferences !== prevState.preferences ||
    state.selectedAddressId !== prevState.selectedAddressId
  )) {
    useStore.setState({
      userDataRecord: {
        ...state.userDataRecord,
        [state.user.id]: {
          cart: state.cart,
          wishlist: state.wishlist,
          addresses: state.addresses,
          paymentMethods: state.paymentMethods,
          notifications: state.notifications,
          recentlyViewed: state.recentlyViewed,
          preferences: state.preferences,
          selectedAddressId: state.selectedAddressId,
        }
      }
    });
  }
});
