'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';

const CartContext = createContext(null);

function toCartItems(raw) {
  if (!raw) return [];
  if (Array.isArray(raw.items)) return raw.items;
  if (Array.isArray(raw.cartItems)) return raw.cartItems;
  if (Array.isArray(raw)) return raw;
  return [];
}

export function CartProvider({ children }) {
  const queryClient = useQueryClient();
  const { accessToken, isAuthenticated } = useAuth();

  const cartQuery = useQuery({
    queryKey: ['cart'],
    enabled: isAuthenticated,
    queryFn: ({ signal }) => userApi.getCart(accessToken, signal),
  });

  const cartItems = useMemo(() => toCartItems(cartQuery.data), [cartQuery.data]);

  const refreshCart = async () => {
    if (!isAuthenticated) return;
    await queryClient.invalidateQueries({ queryKey: ['cart'] });
  };

  const addItemMutation = useMutation({
    mutationFn: ({ productId, quantity }) =>
      userApi.addCartItem(accessToken, { productId, quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const setQuantityMutation = useMutation({
    mutationFn: ({ productId, quantity }) =>
      userApi.patchCartItem(accessToken, productId, { quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const removeItemMutation = useMutation({
    mutationFn: ({ productId }) => userApi.deleteCartItem(accessToken, productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const checkoutMutation = useMutation({
    mutationFn: ({ shippingAddress }) => userApi.checkout(accessToken, { shippingAddress }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.alert('Please log in to add items to your cart.');
      }
      return false;
    }

    await addItemMutation.mutateAsync({ productId, quantity });
    return true;
  };

  const getTotalItems = () =>
    cartItems.reduce((total, item) => total + (item.quantity || 0), 0);

  const getTotalPrice = () =>
    cartItems.reduce((total, item) => {
      const price = item?.product?.price ?? item?.price ?? 0;
      return total + price * (item.quantity || 0);
    }, 0);

  return (
    <CartContext.Provider
      value={{
        cart: cartQuery.data ?? null,
        cartItems,
        isLoading: cartQuery.isLoading,
        error: cartQuery.error ?? null,
        refreshCart,
        addToCart,
        setQuantity: (productId, quantity) => setQuantityMutation.mutateAsync({ productId, quantity }),
        removeItem: (productId) => removeItemMutation.mutateAsync({ productId }),
        checkout: (shippingAddress) => checkoutMutation.mutateAsync({ shippingAddress }),
        getTotalItems,
        getTotalPrice,
        isMutating:
          addItemMutation.isPending ||
          setQuantityMutation.isPending ||
          removeItemMutation.isPending ||
          checkoutMutation.isPending,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
