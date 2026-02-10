# 🏗️ Refactoring Step 1: Foundation Layer

## What We've Done

### 1. Created Constants Module
**File**: `Backend/src/constants/index.js`

**Purpose**: Centralized all magic numbers and strings to avoid duplication and improve maintainability.

**Benefits**:
- Single source of truth for status values, payment amounts, etc.
- Easy to update values across the entire application
- Type safety through constants
- Better IDE autocomplete support

**Example**:
```javascript
// Before: Magic strings scattered everywhere
if (donation.status === 'pending') { ... }

// After: Centralized constants
if (donation.status === DONATION_STATUS.PENDING) { ... }
```

---

### 2. Created Repository Layer
**Files**: 
- `Backend/src/repositories/BaseRepository.js`
- `Backend/src/repositories/DonationRepository.js`
- `Backend/src/repositories/CampaignRepository.js`
- `Backend/src/repositories/UserRepository.js`

**Purpose**: Abstract database operations from business logic.

**Benefits**:
- **Separation of Concerns**: Controllers and services don't need to know about Mongoose
- **Testability**: Can easily mock repositories for unit testing
- **Reusability**: Same repository methods can be used by multiple services
- **Atomic Operations**: Built-in support for transactions and atomic updates
- **Query Optimization**: Centralized `.lean()`, `.populate()`, `.select()` usage

**Key Features**:
- `BaseRepository`: Common CRUD operations
- `DonationRepository`: Donation-specific queries (findByPaymentReference, findByStatus, etc.)
- `CampaignRepository`: Campaign-specific queries with atomic increment operations
- `UserRepository`: User-specific queries (findByEmail, verifyEmail, etc.)

**Example**:
```javascript
// Before: Direct model access in controller
const donation = await Donation.findOne({ paymentReference: ref });

// After: Repository abstraction
const donation = await donationRepository.findByPaymentReference(ref);
```

---

### 3. Created Service Layer Structure
**File**: `Backend/src/services/domain/DonationService.js`

**Purpose**: Business logic layer that orchestrates operations.

**Benefits**:
- **Business Logic Separation**: All business rules in one place
- **Transaction Support**: Uses repository's transaction methods
- **Error Handling**: Custom errors for better error messages
- **Atomic Operations**: Prevents race conditions with atomic increments
- **Reusability**: Can be used by controllers, background jobs, CLI tools

**Key Features**:
- `initializeDonation()`: Handles donation initialization with validation
- `verifyDonationPayment()`: Payment verification logic
- `approveDonation()`: **CRITICAL**: Uses transactions to prevent race conditions
- `rejectDonation()`: Rejection logic with email notifications

**Example - Race Condition Fix**:
```javascript
// Before: Race condition risk
campaign.raisedAmount += donation.amount;
await campaign.save();

// After: Atomic operation with transaction
await donationRepository.withTransaction(async (session) => {
  await donationRepository.approve(donationId, approvedBy);
  await campaignRepository.incrementRaisedAmount(campaignId, amount);
  await campaignRepository.incrementDonorCount(campaignId);
});
```

---

### 4. Organized External Services
**Files**:
- `Backend/src/services/external/PaystackService.js`
- `Backend/src/services/external/EmailService.js`
- `Backend/src/services/external/ReceiptService.js`

**Purpose**: Separate external API integrations from domain logic.

**Benefits**:
- Clear distinction between internal and external services
- Easy to swap payment providers (e.g., Paystack → Stripe)
- Better organization and discoverability

---

### 5. Refactored Controller (Example)
**File**: `Backend/src/controllers/donationController.refactored.js`

**Purpose**: Shows how controllers should look after refactoring.

**Changes**:
- **Thin Controllers**: Only handle HTTP request/response
- **Service Calls**: All business logic delegated to services
- **Standardized Responses**: Uses `ApiResponse` utility
- **Error Handling**: Uses custom error classes
- **No Direct DB Access**: Uses repositories through services

**Before vs After**:
```javascript
// BEFORE: 880 lines with business logic mixed in
export const initializeDonation = async (req, res) => {
  // 150+ lines of business logic, validation, DB queries
  const campaign = await Campaign.findById(campaignId);
  // ... validation logic ...
  const donation = await Donation.create({...});
  // ... payment initialization ...
  // ... email sending ...
};

// AFTER: Clean, focused controller
export const initializeDonation = asyncHandler(async (req, res, next) => {
  const result = await donationService.initializeDonation(donationData, donorInfo);
  return ApiResponse.created(res, 'Donation initialized successfully', result);
});
```

---

## Architecture Benefits

### 1. **Testability**
- Services can be unit tested without HTTP layer
- Repositories can be mocked easily
- Business logic isolated from infrastructure

### 2. **Maintainability**
- Clear separation makes code easier to understand
- Changes to business logic don't affect controllers
- Database changes isolated to repositories

### 3. **Scalability**
- Easy to add new features without touching existing code
- Can optimize data access layer independently
- Services can be extracted to microservices if needed

### 4. **Reliability**
- Transaction support prevents data inconsistencies
- Atomic operations prevent race conditions
- Better error handling with custom error classes

---

## Next Steps

1. **Update existing donationController.js** to use the refactored version
2. **Refactor paymentController.js** similarly
3. **Refactor authController.js** to use service layer
4. **Add database indexes** for performance
5. **Implement connection pooling** configuration
6. **Add comprehensive error handling** across all controllers

---

## Migration Strategy

To migrate existing code:

1. **Keep old controllers** temporarily (rename to `.old.js`)
2. **Create new refactored controllers** (`.refactored.js`)
3. **Test thoroughly** with both versions
4. **Switch routes** to use refactored controllers
5. **Remove old controllers** after verification

This incremental approach minimizes risk and allows for gradual migration.




