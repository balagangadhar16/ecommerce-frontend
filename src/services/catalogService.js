import httpClient from './httpClient';

/**
 * Catalog endpoints (public GETs).
 * All methods return the resolved response `.data`.
 */
export const catalogService = {
  async getProducts() {
    const { data } = await httpClient.get('/api/products');
    return data;
  },

  async getProduct(productId) {
    const { data } = await httpClient.get(`/api/products/${productId}`);
    return data;
  },

  async getCategories() {
    const { data } = await httpClient.get('/api/categories');
    return data;
  },

  async getProductsByCategory(categoryId) {
    const { data } = await httpClient.get(`/api/categories/${categoryId}/products`);
    return data;
  },
};
