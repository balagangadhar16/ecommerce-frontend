/**
 * Normalizes Axios errors into a shape the UI can render.
 * Prefers backend messages (GlobalExceptionHandler / ApiError) when present.
 *
 * @param {unknown} error
 * @returns {{ message: string, fieldErrors: Record<string,string> }}
 */
export function getApiError(error) {
  const fieldErrors = {};
  let message = 'Something went wrong. Please try again.';

  const data = error?.response?.data;
  if (data) {
    // Backend ApiError body: { message, fieldErrors: { field: msg } }
    if (typeof data.message === 'string' && data.message) {
      message = data.message;
    }
    if (data.fieldErrors && typeof data.fieldErrors === 'object') {
      Object.assign(fieldErrors, data.fieldErrors);
    }
  } else if (error?.request) {
    message = 'Unable to reach the server. Check your connection.';
  }

  return { message, fieldErrors };
}
