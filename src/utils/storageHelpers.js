// Local Storage utilities for product management
export const PRODUCTS_STORAGE_KEY = 'AABHARANAM_products';
export const INITIAL_PRODUCTS_KEY = 'AABHARANAM_initial_products';

// Get all products from localStorage
export const getProductsFromStorage = (initialProducts) => {
  if (typeof window === 'undefined') return initialProducts;
  
  try {
    const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (storedProducts) {
      return JSON.parse(storedProducts);
    }
    // If no products in storage, initialize with default products
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initialProducts));
    return initialProducts;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return initialProducts;
  }
};

// Save products to localStorage
export const saveProductsToStorage = (products) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Add a new product
export const addProductToStorage = (newProduct, currentProducts) => {
  const id = Math.max(...currentProducts.map(p => p.id), 0) + 1;
  const product = {
    ...newProduct,
    id,
    rating: 5,
    reviews: 0,
    stock: parseInt(newProduct.stock) || 50,
  };
  
  const updatedProducts = [product, ...currentProducts];
  saveProductsToStorage(updatedProducts);
  return updatedProducts;
};

// Delete a product
export const deleteProductFromStorage = (productId, currentProducts) => {
  const updatedProducts = currentProducts.filter(p => p.id !== productId);
  saveProductsToStorage(updatedProducts);
  return updatedProducts;
};

// Update a product
export const updateProductInStorage = (productId, updatedData, currentProducts) => {
  const updatedProducts = currentProducts.map(p =>
    p.id === productId ? { ...p, ...updatedData } : p
  );
  saveProductsToStorage(updatedProducts);
  return updatedProducts;
};
