import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../services/cartService';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { getApiError } from '../utils/errorParser';

const CartContext = createContext(null);

/**
 * Owns the shopping cart state for the whole app (items, totals, count).
 * Every mutation reuses the CartResponse returned by the backend to stay in sync
 * without extra requests. Must be rendered inside <BrowserRouter>.
 */
export function CartProvider({ children }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { notify } = useToast();

  const [items, setItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const loadingRef = useRef(false);

  const applyCart = useCallback((cart) => {
    setItems(cart.items ?? []);
    setGrandTotal(Number(cart.grandTotal ?? 0));
    setTotalQuantity(Number(cart.totalQuantity ?? 0));
  }, []);

  const fetchCart = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      const cart = await cartService.getCart();
      applyCart(cart);
    } catch (e) {
      notify('error', getApiError(e).message);
    } finally {
      loadingRef.current = false;
      setLoaded(true);
    }
  }, [applyCart, notify]);

  // Load cart once the user is authenticated.
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setItems([]);
      setGrandTotal(0);
      setTotalQuantity(0);
      setLoaded(false);
    }
  }, [isAuthenticated, fetchCart]);

  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      if (!isAuthenticated) {
        notify('info', 'Please sign in to add items to your cart.');
        navigate('/login');
        return;
      }
      try {
        const cart = await cartService.addToCart(productId, quantity);
        applyCart(cart);
        notify('success', 'Added to cart');
      } catch (e) {
        notify('error', getApiError(e).message);
      }
    },
    [isAuthenticated, navigate, notify, applyCart],
  );

  const updateQuantity = useCallback(
    async (id, quantity) => {
      if (quantity < 1) return;
      try {
        const cart = await cartService.updateCartItem(id, quantity);
        applyCart(cart);
      } catch (e) {
        notify('error', getApiError(e).message);
      }
    },
    [applyCart, notify],
  );

  const removeItem = useCallback(
    async (id) => {
      try {
        const cart = await cartService.deleteCartItem(id);
        applyCart(cart);
        notify('success', 'Item removed from cart');
      } catch (e) {
        notify('error', getApiError(e).message);
      }
    },
    [applyCart, notify],
  );

  const value = useMemo(
    () => ({
      items,
      grandTotal,
      totalQuantity,
      count: totalQuantity,
      loaded,
      fetchCart,
      addToCart,
      updateQuantity,
      removeItem,
    }),
    [items, grandTotal, totalQuantity, loaded, fetchCart, addToCart, updateQuantity, removeItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}