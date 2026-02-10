import axios from 'axios';
import crypto from 'crypto';
import logger from '../config/logger.js';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

const paystackClient = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  headers: {
    'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json'
  }
});

/**
 * Initialize a payment transaction with Paystack
 * @param {Object} data - Payment initialization data
 * @param {string} data.email - Customer email
 * @param {number} data.amount - Amount in kobo (NGN) or cents
 * @param {string} data.reference - Unique transaction reference
 * @param {string} [data.callback_url] - Callback URL after payment
 * @param {Object} [data.metadata] - Additional metadata
 * @returns {Promise<Object>} Paystack response with authorization URL
 */
export const initializePayment = async (data) => {
  try {
    const response = await paystackClient.post('/transaction/initialize', data);
    return response.data;
  } catch (error) {
    logger.error('Paystack initialization error:', {
      error: error.response?.data || error.message,
      data: { email: data.email, amount: data.amount }
    });
    throw new Error(error.response?.data?.message || 'Payment initialization failed');
  }
};

/**
 * Verify a payment transaction with Paystack
 * @param {string} reference - Transaction reference to verify
 * @returns {Promise<Object>} Verified transaction data
 */
export const verifyPayment = async (reference) => {
  try {
    const response = await paystackClient.get(`/transaction/verify/${reference}`);
    return response.data;
  } catch (error) {
    logger.error('Paystack verification error:', {
      error: error.response?.data || error.message,
      reference
    });
    throw new Error(error.response?.data?.message || 'Payment verification failed');
  }
};

/**
 * Get transaction details by transaction ID
 * @param {string|number} transactionId - Paystack transaction ID
 * @returns {Promise<Object>} Transaction details
 */
export const getTransaction = async (transactionId) => {
  try {
    const response = await paystackClient.get(`/transaction/${transactionId}`);
    return response.data;
  } catch (error) {
    logger.error('Paystack get transaction error:', {
      error: error.response?.data || error.message,
      transactionId
    });
    throw new Error('Failed to fetch transaction details');
  }
};

/**
 * Refund a transaction (full or partial)
 * @param {string} reference - Transaction reference to refund
 * @param {number} [amount] - Amount to refund in kobo (if not provided, full refund)
 * @param {string} [currency] - Currency code (default: NGN)
 * @param {string} [customer_note] - Customer-facing note
 * @param {string} [merchant_note] - Internal note
 * @returns {Promise<Object>} Refund response
 */
export const refundTransaction = async (reference, amount = null, currency = 'NGN', customer_note = '', merchant_note = '') => {
  try {
    const refundData = {
      transaction: reference,
      ...(amount && { amount: amount * 100 }), // Convert to kobo
      ...(currency && { currency }),
      ...(customer_note && { customer_note }),
      ...(merchant_note && { merchant_note })
    };

    const response = await paystackClient.post('/refund', refundData);
    
    if (response.data.status) {
      logger.info('Paystack refund successful:', {
        reference,
        amount: amount || 'full',
        refundReference: response.data.data?.transaction?.reference
      });
    }
    
    return response.data;
  } catch (error) {
    logger.error('Paystack refund error:', {
      error: error.response?.data || error.message,
      reference,
      amount
    });
    throw new Error(error.response?.data?.message || 'Refund failed');
  }
};

/**
 * Verify Paystack webhook signature
 * @param {string} signature - X-Paystack-Signature header value
 * @param {string|Object} body - Raw request body (string or object)
 * @returns {boolean} True if signature is valid
 */
export const verifyWebhookSignature = (signature, body) => {
  try {
    // If body is already a string, use it directly
    // Otherwise, stringify it
    const bodyString = typeof body === 'string' 
      ? body 
      : JSON.stringify(body);
    
    const hash = crypto
      .createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(bodyString)
      .digest('hex');
    
    return hash === signature;
  } catch (error) {
    logger.error('Webhook signature verification error:', {
      error: error.message,
      stack: error.stack
    });
    return false;
  }
};

/**
 * List transactions with filters
 * @param {Object} [filters] - Filter options
 * @param {number} [filters.perPage] - Results per page (default: 50)
 * @param {number} [filters.page] - Page number (default: 1)
 * @param {string} [filters.customer] - Customer email or ID
 * @param {string} [filters.status] - Transaction status
 * @param {Date} [filters.from] - Start date
 * @param {Date} [filters.to] - End date
 * @returns {Promise<Object>} List of transactions
 */
export const listTransactions = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.perPage) params.append('perPage', filters.perPage);
    if (filters.page) params.append('page', filters.page);
    if (filters.customer) params.append('customer', filters.customer);
    if (filters.status) params.append('status', filters.status);
    if (filters.from) params.append('from', filters.from.toISOString());
    if (filters.to) params.append('to', filters.to.toISOString());

    const response = await paystackClient.get(`/transaction?${params.toString()}`);
    return response.data;
  } catch (error) {
    logger.error('Paystack list transactions error:', {
      error: error.response?.data || error.message,
      filters
    });
    throw new Error('Failed to fetch transactions');
  }
};
