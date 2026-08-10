import httpClient from './httpClient';

/**
 * Razorpay test-mode payment endpoints (JWT-protected).
 */
export const paymentService = {
  async createOrder() {
    const { data } = await httpClient.post('/api/payment/create-order');
    return data;
  },

  async verifyPayment({ razorpayPaymentId, razorpayOrderId, razorpaySignature }) {
    const { data } = await httpClient.post('/api/payment/verify', {
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    });
    return data;
  },
};