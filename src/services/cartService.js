import httpClient from './httpClient';

/**
 * Cart endpoints (all require a logged-in user via JWT).
 * Each mutation returns the full CartResponse so the UI can stay in sync.
 */
export const cartService = {
  async getCart() {
    const { data } = await httpClient.get('/api/cart/items');
    return data;
  },

  async getCartCount() {
    const { data } = await httpClient.get('/api/cart/items/count');
    return data;
  },

  async addToCart(productId, quantity = 1) {
    const { data } = await httpClient.post('/api/cart/add', { productId, quantity });
    return data;
  },

  async updateCartItem(id, quantity) {
    const { data } = await httpClient.put('/api/cart/update', { id, quantity });
    return data;
  },

  async deleteCartItem(id) {
    const { data } = await httpClient.delete(`/api/cart/delete/${id}`);
    return data;
  },
};
