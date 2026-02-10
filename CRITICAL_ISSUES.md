# 🚨 CRITICAL ISSUES TO FIX IMMEDIATELY

## Syntax Errors

### 1. `Backend/src/controllers/donationController.js` - Line 193
**Issue**: Incomplete if statement
```javascript
if (verificationResponse.status &&
```
**Fix**: Should be:
```javascript
if (verificationResponse.status && verificationResponse.data.status === 'success') {
```

### 2. `Backend/src/controllers/donationController.js` - Line 10
**Issue**: Missing import statement
```javascript
import { sendEmail } from '../services/emailService.js';
```
**Status**: Already present, but verify it's correct

## Missing Functions

### 3. `Backend/src/services/paystackService.js`
**Issue**: `refundTransaction` function is referenced in `paymentController.js` but doesn't exist
**Location**: Referenced in:
- `Backend/src/controllers/paymentController.js` line 587
- `Backend/src/controllers/donationController.js` line 680

**Required Function**:
```javascript
export const refundTransaction = async (reference, amount = null) => {
  try {
    const refundData = amount 
      ? { transaction: reference, amount: amount * 100 }
      : { transaction: reference };
    
    const response = await paystackClient.post('/refund', refundData);
    return response.data;
  } catch (error) {
    console.error('Paystack refund error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Refund failed');
  }
};
```

### 4. Paystack Webhook Handler
**Issue**: No dedicated webhook endpoint for Paystack
**Required**: Create webhook handler with signature verification

## Model Inconsistencies

### 5. Campaign Model - Field Name Mismatch
**Issue**: `paymentController.js` uses `currentAmount` but `Campaign.js` model uses `raisedAmount`
**Locations**:
- `Backend/src/controllers/paymentController.js` line 488: `campaign.currentAmount`
- `Backend/src/models/Campaign.js` line 40: `raisedAmount`

**Fix**: Use `raisedAmount` consistently (it's the correct field name in the model)

## Missing Webhook Route

### 6. Paystack Webhook Endpoint
**Issue**: No route for Paystack webhook callbacks
**Required**: Add webhook route that:
- Verifies webhook signature
- Handles payment events (charge.success, charge.failed, etc.)
- Updates donation status automatically

---

## Priority Order

1. **Fix syntax error in donationController.js** (breaks code execution)
2. **Add refundTransaction function** (referenced but missing)
3. **Fix Campaign field name inconsistency** (causes runtime errors)
4. **Add Paystack webhook handler** (critical for production)

---

## Quick Fixes Summary

```javascript
// 1. Fix donationController.js line 193
if (verificationResponse.status && verificationResponse.data.status === 'success') {

// 2. Add to paystackService.js
export const refundTransaction = async (reference, amount = null) => { ... }

// 3. Fix paymentController.js line 488
campaign.raisedAmount = (campaign.raisedAmount || 0) + payment.amount;

// 4. Create webhook route in donationRoutes.js
router.post('/webhook', handlePaystackWebhook);
```

