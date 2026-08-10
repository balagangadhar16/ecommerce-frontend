import httpClient from './httpClient';

/**
 * Order history endpoint (requires a logged-in user via JWT).
 * Returns the mentor-style payload: { role, username, orders: { products: [...] } }.
 */
export const orderService = {
  async getOrderHistory() {
    const { data } = await httpClient.get('/api/orders');
    return data;
  },
};