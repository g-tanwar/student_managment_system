import API from './api';

/**
 * feeService.js
 * All fee-related API calls for the student front-end.
 */

/**
 * Fetch the logged-in student's own fee records.
 * Hits: GET /api/v1/fees/me
 * Returns: { data: [] }
 */
export const getMyFees = async () => {
  const response = await API.get('/fees/me');
  return response.data; // { success, data }
};

/**
 * Fetch all fee invoices (admin use).
 * Hits: GET /api/v1/fees
 */
export const getAllFees = async (params = {}) => {
  const response = await API.get('/fees', { params });
  return response.data;
};

/**
 * Record a fee payment (admin use).
 * Hits: POST /api/v1/fees/:feeId/pay
 */
export const recordPayment = async (feeId, paymentData) => {
  const response = await API.post(`/fees/${feeId}/pay`, paymentData);
  return response.data;
};
