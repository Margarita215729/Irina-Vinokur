import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addToCart = (artwork) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === artwork.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === artwork.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...artwork, quantity: 1 }];
    });
  };

  const removeFromCart = (artworkId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== artworkId));
  };

  const updateQuantity = (artworkId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(artworkId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === artworkId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalAmount = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalAmount,
    getTotalItems,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};