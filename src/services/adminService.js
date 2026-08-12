import httpClient from './httpClient';

/**
 * Admin endpoints (require an ADMIN role via JWT).
 * All methods return the resolved response `.data` for convenience.
 */
export const adminService = {
  // ----- Products -----
  async getProducts() {
    const { data } = await httpClient.get('/api/admin/products');
    return data; // ProductResponse[]
  },

  async addProduct(payload) {
    const { data } = await httpClient.post('/api/admin/products', payload);
    return data; // ProductResponse
  },

  async deleteProduct(productId) {
    await httpClient.delete(`/api/admin/products/${productId}`);
  },

  // ----- Users -----
  async getUser(userId) {
    const { data } = await httpClient.get(`/api/admin/users/${userId}`);
    return data; // UserResponse
  },

  async updateUser(userId, payload) {
    const { data } = await httpClient.put(`/api/admin/users/${userId}`, payload);
    return data; // UserResponse
  },

  // ----- Business analytics -----
  async getDayBusiness(date) {
    const { data } = await httpClient.get('/api/admin/analytics/day', { params: { date } });
    return data; // BusinessAnalyticsResponse
  },

  async getMonthBusiness(month) {
    const { data } = await httpClient.get('/api/admin/analytics/month', { params: { month } });
    return data; // BusinessAnalyticsResponse
  },

  async getYearBusiness(year) {
    const { data } = await httpClient.get('/api/admin/analytics/year', { params: { year } });
    return data; // BusinessAnalyticsResponse
  },

  async getOverallBusiness() {
    const { data } = await httpClient.get('/api/admin/analytics/overall');
    return data; // BusinessAnalyticsResponse
  },
};
