/**
 * Dynamically loads an external script once and resolves when it is ready.
 * Used to load the Razorpay Checkout SDK on demand.
 *
 * @param {string} src The script URL to load.
 * @param {string} [id] Optional id attribute to dedupe.
 * @returns {Promise<void>}
 */
export function loadScript(src, id) {
  return new Promise((resolve, reject) => {
    if (id && document.getElementById(id)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    if (id) script.id = id;
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      script.remove();
      reject(new Error(`Failed to load script: ${src}`));
    };
    document.body.appendChild(script);
  });
}

export const RAZORPAY_CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';
export const RAZORPAY_SCRIPT_ID = 'razorpay-checkout-sdk';