# Paystack Donation Payment — Final Implementation Guide

> **This is the authoritative version.** It supersedes the earlier draft guide.
> One deliberate change from the original spec, explained below — everything
> else (signature verification, raw body handling, idempotency, security
> checklist) carries over unchanged.

---

## Deviation from the original spec

The original guide's core principle was:

> Paystack confirms whether money was successfully paid. **The admin
> separately decides** whether to approve the verified donation.

In practice this makes every donation wait on a human being online — and
the admin isn't always reachable from a phone or PC. So this version
changes one rule:

| | Original guide | This version |
|---|---|---|
| Who approves a verified payment | Admin, manually, every time | Automatic, the instant Paystack verifies it |
| Webhook's job | Confirm only (`approvalStatus` stays `pending`) | Confirm **and** approve |
| Admin's role | Gatekeeper (must act before it counts) | Auditor (can revoke after the fact if something's wrong) |
| `bank_transfer` payment method | Exempted from verification in `isApprovable` | Requires the same webhook verification as card |

Everything else below — webhook signature verification, raw-body
preservation, one reference per donation, trusted server-side metadata,
idempotency, the security checklist — is unchanged from the original spec
and still applies exactly as written.

---

## Goal

Build a **simple, secure, reliable, and seamless** Paystack donation flow
for the charity website. Do not over-engineer it with unnecessary payment
states, services, queues, or abstractions unless the existing codebase
genuinely needs them. The backend remains the source of truth for payment
status; the frontend just reflects it.

---

## 1. The Bug Being Fixed

- Donation target: ₦4,000,000
- User attempts to donate: ₦10,000,000
- Paystack reports insufficient funds / failed payment
- The donation still appears in the admin dashboard as `processing`
- An admin could see or approve a payment that never actually succeeded

Root cause, traced through the actual codebase:

```js
// BEFORE — too broad
const isApprovable =
  payment.paymentVerified ||
  payment.paymentMethod === 'bank_transfer' ||
  (payment.paymentMethod === 'card' && payment.paystackReference); // ← WRONG
```

This passes because `paystackReference` is set at *initialization* time,
before Paystack has confirmed anything — so a failed card payment, and any
`bank_transfer` payment at all, could be approved without verification.

Five cooperating gaps, all closed below:

| # | Location | Gap |
|---|---|---|
| 1 | `PaymentService.approvePayment` | Card + `paystackReference` → approvable without verification |
| 2 | `PaymentService.approvePayment` | `bank_transfer` exempted from verification entirely |
| 3 | `Donation.canBeApproved()` | `status === "processing"` treated as approvable |
| 4 | `DonationRepository.findPendingApproval` | Returns `"processing"` donations alongside `"verified"` ones |
| 5 | `webhookController.handleSuccessfulCharge` | No amount/currency validation; failed verification didn't mark the donation `failed` |

---

## 2. Architecture (unchanged, kept simple)

```text
React Donation Form
        ↓
Donation API
        ↓
Paystack
        ↓
Paystack Webhook
        ↓
MongoDB
        ↓
(Admin can revoke, but doesn't gate)
```

No payment microservice, no queueing system, no duplicated Paystack logic
across controllers. One backend payment flow, reused everywhere.

---

## 3. State Fields

```js
paymentStatus: "pending" | "successful" | "failed" | "abandoned" | "reversed"
// (in the existing codebase this is called `status`, with values
//  "pending" | "processing" | "verified" | "failed" | "completed" — adapt
//  the field names to whatever the project already uses)

approvalStatus: "pending" | "approved" | "rejected"
```

- **`paymentStatus`** answers: *did Paystack confirm the payment?*
- **`approvalStatus`** answers: *is this donation counted?* — now set
  automatically on verification, with `rejected` as the admin's manual
  override.

---

## 4. State Flow

| Stage | paymentStatus | approvalStatus |
|---|---|---|
| A. Donor starts a donation | `pending` | `pending` |
| B. Paystack checkout initialized | `processing` | `pending` |
| C. Payment fails / verification fails / amount or currency mismatch | `failed` | n/a — never counted |
| D. Paystack confirms payment (webhook, fully validated) | `successful` | **`approved`** (automatic) |
| E. Admin revokes a bad donation after the fact | `successful` | `rejected` |

A `failed` record must never count as a donation. A `successful` +
`approved` record counts immediately — no separate human step in between.

---

## 5. Donation Initialization

Frontend calls the backend; the backend calls Paystack. The frontend never
touches the secret key.

```http
POST /api/donations/initialize
```

```json
{
  "amount": 10000,
  "email": "donor@example.com",
  "campaignId": "campaign_id_here",
  "donorName": "John Doe"
}
```

Backend responsibilities:

1. Validate input and campaign.
2. Convert amount to kobo: `const amountInKobo = amount * 100;` (₦10,000 = 1,000,000 kobo).
3. Create a unique payment reference, e.g. `DON-66f9a4c1-1726312345678`, stored unique + indexed:
   ```js
   reference: { type: String, required: true, unique: true, index: true }
   ```
4. Create the pending donation record.
5. Initialize Paystack, including trusted metadata:
   ```js
   metadata: {
     donationId: donation._id.toString(),
     campaignId: campaign._id.toString()
   }
   ```
   Generate this from the database, never from arbitrary browser input.
6. Return Paystack checkout info to the frontend.

---

## 6. Payment Channels — Card, Bank Transfer, USSD

No code is required to accept these — it's a Paystack dashboard setting:

- **Settings → Preferences → "Accept payments via"** — toggle Card, Bank
  Transfer, USSD. Card is available on every Paystack account by default;
  Bank Transfer and USSD are Nigeria-specific and just need enabling there.
- Once enabled, the existing Popup/Redirect checkout automatically offers
  every enabled channel — no frontend change needed unless the `channels`
  array is currently hardcoded to `['card']` in the initialize call.
- **Settlement account** (where the charity's money is paid *out* to) is a
  separate, one-time business-verification step in the dashboard —
  unrelated to this codebase.

**Important distinction:** Paystack's own "Pay with Transfer" channel
generates a dedicated virtual account per transaction and confirms via the
same `charge.success` webhook as card — it is *not* the same as an
offline transfer a donor makes directly into the charity's account outside
Paystack. Only the latter has no webhook and would need its own manual
confirmation path (see Section 10).

---

## 7. Keep Paystack Keys Secure

```env
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxx
```

Never put `PAYSTACK_SECRET_KEY` in React or expose it to the browser. Use
the public key only where Paystack's frontend checkout requires it.

---

## 8. Paystack Callback Is Not the Source of Truth

When the donor returns from Paystack, the frontend may receive a
reference. Send it to the backend for verification:

```http
GET /api/donations/verify/:reference
```

Never do this client-side:

```js
donation.status = "successful"; // ← never trust the frontend
```

A user landing on the callback URL is not proof of payment. Only the
webhook (or an explicit server-side verify call) is.

---

## 9. Webhook — Signature, Validation, and Auto-Approval

**Endpoint:** `POST /api/paystack/webhook`

### 9.1 Verify the signature

```js
const hash = crypto
  .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
  .update(rawBody)
  .digest("hex");

if (hash !== req.headers["x-paystack-signature"]) {
  return res.sendStatus(401); // do not update MongoDB
}
```

### 9.2 Preserve the raw body

The signature is computed over the raw request body, so it must be
captured before JSON parsing changes it:

```js
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
```

Check the current middleware order before adding this — don't blindly
paste it in if something already handles raw bodies.

### 9.3 Filter to the relevant event

```js
if (event.event !== "charge.success") {
  return res.sendStatus(200);
}
```

Don't assume every failure arrives as a `charge.failed` webhook — use the
transaction verification endpoint (Section 11) where explicit checking is
needed.

### 9.4 Validate, then confirm and auto-approve

```js
// Look up the donation by reference first — needed for idempotency (9.5)
const donation = await DonationRepository.findByReference(reference);

// Non-success verification → mark failed, don't leave it hanging
if (!verificationResponse.status || verificationResponse.data.status !== 'success') {
  logger.error('Payment verification failed in webhook', { reference });
  donation.status = 'failed';
  donation.failureReason = verificationResponse.data?.gateway_response
    || 'Paystack verification did not return success';
  await donation.save();
  return res.sendStatus(200);
}

const paystackData = verificationResponse.data;

// Validate currency
if (paystackData.currency !== 'NGN') {
  logger.error('Webhook currency mismatch', { expected: 'NGN', actual: paystackData.currency, reference });
  donation.status = 'failed';
  donation.failureReason = `Currency mismatch: expected NGN, received ${paystackData.currency}`;
  await donation.save();
  return res.sendStatus(200);
}

// Validate amount (Paystack sends kobo)
const expectedKobo = Math.round(donation.amount * 100);
if (paystackData.amount !== expectedKobo) {
  logger.error('Webhook amount mismatch', { expectedKobo, actualKobo: paystackData.amount, reference });
  donation.status = 'failed';
  donation.failureReason = `Amount mismatch: expected ${expectedKobo} kobo, received ${paystackData.amount} kobo`;
  await donation.save();
  return res.sendStatus(200);
}

// All checks passed — confirm AND auto-approve
donation.status = 'verified';
donation.paymentVerified = true;
donation.approvalStatus = 'approved';
donation.approvedAt = new Date();
donation.approvedBy = null; // system-approved, not a human action
donation.paidAt = new Date();
await donation.save();

return res.sendStatus(200);
```

Also confirm the `reference` matches an existing record and, where used,
that `metadata` matches the intended donation/campaign — don't trust the
payload blindly.

### 9.5 Idempotency

The webhook may be delivered more than once. Look up the donation by its
unique `reference` before processing; if it's already `verified` /
`approved`, return `200` without reprocessing. Never create a duplicate
donation or repeat side effects on redelivery.

The webhook should **not**: create duplicate donations, trust frontend
data, or leave a donation ambiguous — it should always resolve to a
terminal, unambiguous state (`verified`+`approved` or `failed`).

---

## 10. Removing the Unverified `bank_transfer` Bypass

```js
// AFTER — every Paystack-routed payment (card or transfer) requires webhook verification
const isApprovable = payment.paymentVerified;

if (!isApprovable) {
  throw new Error(
    'Cannot approve: payment has not been verified by Paystack. ' +
    'Only successfully verified payments can be approved.'
  );
}
```

If the project needs a genuinely **offline** manual transfer (donor pays
directly into the charity's bank account outside Paystack, staff confirm
by hand), give it its own explicit `paymentMethod` value — e.g.
`manual_transfer` — with its own proof-of-payment field. Don't let it
inherit auto-approval from Section 9; a manual transfer still needs a
human to confirm the money actually arrived. That path keeps the original
Approve/Reject flow from Section 12 below.

---

## 11. Transaction Verification Endpoint

Use Paystack's verify transaction API server-side when explicit checking
is needed (e.g. from the frontend callback, or a manual re-check):

```http
GET /transaction/verify/:reference
```

Possible statuses: `success`, `failed`, `abandoned`, `pending`, `ongoing`,
`reversed`. Map these consistently to the project's `paymentStatus`
values. Secret key stays server-side.

---

## 12. Model, Repository, and the Manual-Transfer Exception

**`Donation.js`**

```js
donationSchema.methods.canBeApproved = function () {
  return (
    this.paymentVerified &&
    this.approvalStatus === "pending" &&
    this.status === "verified"
  );
};
```

With auto-approval in place, this is now only relevant to the
manual-transfer path — Paystack-verified donations never sit in `pending`.

**`DonationRepository.js`**

```js
async findPendingApproval(options = {}) {
  return await this.find(
    {
      approvalStatus: "pending",
      status: "verified",
    },
    options,
  );
}
```

This will typically only surface manual-transfer donations awaiting
confirmation.

**Recommended donation model** (adapt to the existing schema — don't
duplicate fields the project already has):

```js
{
  reference: String,
  donorName: String,
  donorEmail: String,
  amount: Number,
  currency: "NGN",

  paymentStatus: {
    type: String,
    enum: ["pending", "successful", "failed", "abandoned", "reversed"],
    default: "pending"
  },

  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  paymentMethod: {
    type: String,
    enum: ["card", "bank_transfer", "ussd", "manual_transfer"]
  },

  campaign: ObjectId,
  paystackTransactionId: Number,
  paidAt: Date,
  approvedBy: ObjectId,
  approvedAt: Date,
  rejectionReason: String
}
```

---

## 13. Minimal API Structure

```text
POST   /api/donations/initialize        → create/prepare payment, initialize Paystack
GET    /api/donations/verify/:reference → explicit server-side verification
POST   /api/paystack/webhook            → receive Paystack events, confirm + auto-approve
PATCH  /api/donations/:id/revoke        → admin revokes an already-approved donation
PATCH  /api/donations/:id/approve       → admin approves a manual-transfer donation
PATCH  /api/donations/:id/reject        → admin rejects a manual-transfer donation
```

Reuse existing routes where equivalent functionality already exists;
don't duplicate endpoints.

---

## 14. Admin UI

- Paystack-verified donations show **Confirmed** with a single **Revoke**
  action (flips `approvalStatus` to `rejected` — for refunds, duplicates,
  fraud, etc., discovered after the fact).
- Manual-transfer donations (if kept) still show **Approve / Reject**,
  gated on `status === "verified"` for that record.
- Status badges, so intent is unambiguous at a glance:

| `status` / `approvalStatus` | Display | Color |
|---|---|---|
| `verified` + `approved` | Confirmed | Green |
| `processing` | Awaiting Payment | Amber |
| `failed` | Payment Failed | Red |
| `pending` | Not Started | Gray |
| `verified` + `pending` (manual transfer) | Awaiting Review | Blue |

---

## 15. Frontend Messaging

Donor-facing copy should always reflect actual backend state — never say
"donation successful" before the backend has confirmed it.

**Card / Paystack bank-transfer / USSD — confirmed instantly:**

```jsx
<div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 mb-8">
  <p className="text-xs font-bold text-green-700 uppercase mb-1">
    Donation Confirmed
  </p>
  <p className="text-sm text-green-800">
    Your donation has been received and confirmed. Thank you!
  </p>
</div>
```

**Payment failed:**

```text
Payment was not completed. No donation was confirmed. Please try again.
```

**Manual/offline transfer only** — still pending a human:

```text
Payment received successfully. Your donation is awaiting charity approval.
```

**Initialization failure:**

```text
We couldn't start your payment. Please try again.
```
(log the technical error server-side)

**Duplicate webhook:** no error shown to the donor — handled silently as
an already-processed event.

**Invalid webhook:** rejected and logged with enough detail to debug,
without exposing secrets.

---

## 16. Public and Admin Totals

Only records satisfying both conditions count toward campaign progress,
confirmed-donation totals, and public totals:

```js
{
  paymentStatus: "successful", // or status: "verified"
  approvalStatus: "approved"
}
```

Since verification now auto-approves, this effectively means: **any
Paystack-confirmed donation counts immediately.** A `failed` payment never
counts. A revoked donation (`approvalStatus: "rejected"`) is excluded the
moment it's revoked.

---

## 17. Security Checklist

**Always:**
- Keep the Paystack secret key on the backend only.
- Verify `x-paystack-signature`.
- Preserve the raw request body for signature validation.
- Validate reference, amount, currency, transaction status, and relevant metadata before confirming.
- Make webhook processing idempotent.
- Prevent duplicate donation records.
- Require successful verification before anything counts as a donation — via any path (card, transfer, or otherwise).

**Never:**
- Mark a donation successful just because the Paystack popup closed.
- Trust the frontend callback as proof of payment.
- Trust client-provided payment status.
- Expose the Paystack secret key.
- Let `bank_transfer` or any payment method bypass verification.

---

## 18. Testing Checklist

| Test | Expected Result |
|---|---|
| Paystack succeeds (test card) → webhook arrives | `status: verified`, `approvalStatus: approved`, counted in totals immediately — no admin action needed |
| Paystack fails (insufficient funds — the original ₦10m bug) | `status: failed`, excluded from totals, no approval controls shown |
| User closes Paystack checkout | No successful donation created |
| Webhook arrives twice | Idempotent — second delivery ignored, no duplicate, no double-count |
| Amount mismatch in webhook | `status: failed`, logged, excluded from totals |
| Currency mismatch in webhook | `status: failed`, logged, excluded from totals |
| Invalid webhook signature | `401`, no database update |
| Admin revokes an auto-approved donation | `approvalStatus: rejected`, immediately excluded from totals |
| Manual/offline transfer donation (if kept) | Stays `approvalStatus: pending` until admin confirms funds arrived |
| Admin attempts to approve a `processing` or `failed` donation | Rejected — `isApprovable` is false |

---

## 19. Agent Instructions

Before changing any code, inspect the current implementation and find:
Donation model, donation controller/service, Paystack init logic, webhook
logic, callback handling, admin approval endpoint, admin donation table,
public totals/campaign progress queries, existing env variable names.

Then implement with the **smallest clean change set**:

1. Preserve existing project architecture where practical.
2. Do not rewrite unrelated code.
3. Do not introduce unnecessary complexity, states, services, or queues.
4. Do not duplicate Paystack API logic across controllers.
5. Keep `paymentStatus`/`status` and `approvalStatus` as separate fields, even though `approvalStatus` now defaults to `approved` on verification.
6. Fix the root cause of the `processing` bug — don't just hide it in the UI.
7. Use `charge.success` for successful webhook processing.
8. Verify the webhook signature; preserve the raw request body for that check.
9. Validate status, reference, amount, and currency before confirming any payment.
10. Make the webhook idempotent.
11. Keep Paystack secret credentials server-side, always.
12. Auto-approve verified payments in the webhook — don't leave them in a manual-approval queue.
13. Never let an unverified payment reach `approved`, by any path — card, `bank_transfer`, or otherwise.
14. If a distinct manual/offline-transfer method is introduced, keep it fully separate from Paystack-verified `bank_transfer` and require explicit human confirmation for that path only.
15. Keep donor-facing messaging accurate to actual backend state at every step.
16. Reuse existing models/routes/services when equivalent functionality already exists.
17. After implementation, list exactly which files were changed and why.

---

## 20. Files Expected to Change

| File | Change |
|---|---|
| `Backend/src/controllers/webhookController.js` | Add amount + currency validation; mark `failed` on non-success; auto-approve on success |
| `Backend/src/services/domain/PaymentService.js` | Remove `paystackReference`-only and unverified `bank_transfer` bypasses from `isApprovable` |
| `Backend/src/models/Donation.js` | Remove `"processing"` from `canBeApproved()` |
| `Backend/src/repositories/DonationRepository.js` | Remove `"processing"` from `findPendingApproval` |
| `admin/src/component/pages/Payments.jsx` | Replace Approve/Reject with Revoke for auto-approved rows; keep Approve/Reject for manual-transfer rows; add status badges |
| `frontend/src/components/DonationModal.jsx` | Success message → "confirmed" instead of "awaiting approval" for Paystack-verified payments |

No new files, no route changes beyond adding `/revoke`, no schema
rewrites, no service rewrites.

---

## 21. Official Paystack Documentation

- Webhooks: https://paystack.com/docs/payments/webhooks/
- Verify Payments: https://paystack.com/docs/payments/verify-payments/
- Accept Payments: https://paystack.com/docs/payments/accept-payments/
- Payment Channels: https://paystack.com/docs/payments/payment-channels/
- Transaction API: https://paystack.com/docs/api/transaction/

If current Paystack documentation differs from an assumption in this
document, follow the official documentation and adapt accordingly.
