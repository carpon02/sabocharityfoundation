/**
 * Paystack Service
 * External service integration for Paystack payment gateway
 * Moved from services/paystackService.js to services/external/
 */
import axios from 'axios';
import crypto from 'crypto';
import logger from '../../config/logger.js';

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
 */
export const verifyWebhookSignature = (signature, body) => {
  try {
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

export default {
  initializePayment,
  verifyPayment,
  getTransaction,
  refundTransaction,
  verifyWebhookSignature,
  listTransactions
};

