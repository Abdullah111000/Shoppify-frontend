import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, wishlistAPI } from '../services/apiServices';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = useCallback(async () => {
    try {
      const { data } = await wishlistAPI.get();
      setWishlist(data.wishlist || []);
    } catch {
      setWishlist([]);
    }
  }, []);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await authAPI.getMe();
      setUser(data.user);
      await loadWishlist();
    } catch {
      localStorage.removeItem('token');
      setUser(null);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, [loadWishlist]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (credentials) => {
    const { data } = await authAPI.login(credentials);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    await loadWishlist();
    return data;
  };

  const register = async (userData) => {
    const { data } = await authAPI.register(userData);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    setWishlist([]);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setWishlist([]);
  };

  const addToWishlist = async (productId) => {
    if (!user) return { success: false, message: 'Please login to add favorites' };
    const { data } = await wishlistAPI.add(productId);
    setWishlist(data.wishlist);
    return data;
  };

  const removeFromWishlist = async (productId) => {
    const { data } = await wishlistAPI.remove(productId);
    setWishlist(data.wishlist);
    return data;
  };

  const isInWishlist = (productId) =>
    wishlist.some((item) => (item._id || item).toString() === productId.toString());

  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      return removeFromWishlist(productId);
    }
    return addToWishlist(productId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        wishlist,
        login,
        register,
        logout,
        loadWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
