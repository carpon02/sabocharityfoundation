import axios from 'axios';
import crypto from 'crypto';
import logger from '../config/logger.js';

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

/**
 * Returns a configured Axios client using the live process.env value.
 * Lazy initialization prevents the ESM import-hoisting race where keys
 * are undefined because this module loads before dotenv.config() runs.
 */
const getPaystackClient = () => {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new Error(
      'PAYSTACK_SECRET_KEY is not set. Check your Backend/.env file.'
    );
  }
  return axios.create({
    baseURL: PAYSTACK_BASE_URL,
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
  });
};

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
    const response = await getPaystackClient().post('/transaction/initialize', data);
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
    const response = await getPaystackClient().get(`/transaction/verify/${reference}`);
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
    const response = await getPaystackClient().get(`/transaction/${transactionId}`);
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
export const refundTransaction = async (
  reference,
  amount = null,
  currency = 'NGN',
  customer_note = '',
  merchant_note = ''
) => {
  try {
    const refundData = {
      transaction: reference,
      ...(amount && { amount: amount * 100 }), // Convert to kobo
      ...(currency && { currency }),
      ...(customer_note && { customer_note }),
      ...(merchant_note && { merchant_note })
    };

    const response = await getPaystackClient().post('/refund', refundData);

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
    const bodyString = typeof body === 'string'
      ? body
      : JSON.stringify(body);

    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(bodyString)
      .digest('hex');

    // Use timingSafeEqual to prevent timing attacks
    const hashBuffer = Buffer.from(hash);
    const signatureBuffer = Buffer.from(signature);

    if (hashBuffer.length !== signatureBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(hashBuffer, signatureBuffer);
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

    const response = await getPaystackClient().get(`/transaction?${params.toString()}`);
    return response.data;
  } catch (error) {
    logger.error('Paystack list transactions error:', {
      error: error.response?.data || error.message,
      filters
    });
    throw new Error('Failed to fetch transactions');
  }
};

/**
 * Charge a previously authorized card using Paystack Charge Authorization
 * Used for recurring donations where the donor has already approved the initial charge.
 * @param {Object} data - Charge authorization data
 * @param {string} data.authorization_code - The reusable authorization code from the initial transaction
 * @param {string} data.email - Customer email (must match the original charge)
 * @param {number} data.amount - Amount in kobo
 * @param {string} data.reference - Unique reference for this charge
 * @param {Object} [data.metadata] - Additional metadata
 * @returns {Promise<Object>} Paystack response
 */
export const chargeAuthorization = async (data) => {
  try {
    const response = await getPaystackClient().post('/transaction/charge_authorization', data);
    logger.info('Paystack charge_authorization success:', {
      reference: data.reference,
      amount: data.amount,
    });
    return response.data;
  } catch (error) {
    logger.error('Paystack charge_authorization error:', {
      error: error.response?.data || error.message,
      reference: data.reference,
    });
    throw new Error(error.response?.data?.message || 'Charge authorization failed');
  }
};
