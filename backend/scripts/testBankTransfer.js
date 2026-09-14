/**
 * Bank Transfer End-to-End Test Script
 * ─────────────────────────────────────
 * Simulates the full bank transfer flow:
 *  1. Initialize transfer → get reference + account details
 *  2. Poll transfer-status → should be "not verified yet"
 *  3. Simulate admin approval (mark paymentVerified = true in DB)
 *  4. Poll transfer-status again → should now be "verified"
 *
 * Usage: node scripts/testBankTransfer.js
 */

import "dotenv/config";
import dns from "dns";
import mongoose from "mongoose";
import Donation from "../src/models/Donation.js";

const BASE = "http://localhost:5000/api/v1";

const CAMPAIGN_ID = process.env.TEST_CAMPAIGN_ID || "6a8c5400ea760d4bbd7ad254";

const color = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red:   (s) => `\x1b[31m${s}\x1b[0m`,
  cyan:  (s) => `\x1b[36m${s}\x1b[0m`,
  bold:  (s) => `\x1b[1m${s}\x1b[0m`,
  dim:   (s) => `\x1b[2m${s}\x1b[0m`,
};

const log = {
  step: (n, msg) => console.log(`\n${color.bold(color.cyan(`[STEP ${n}]`))} ${msg}`),
  ok:   (msg)    => console.log(`  ${color.green("✅")} ${msg}`),
  fail: (msg)    => console.log(`  ${color.red("❌")} ${msg}`),
  info: (msg)    => console.log(`  ${color.dim("ℹ")}  ${msg}`),
};

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  return res.json();
}

async function run() {
  console.log(color.bold("\n══════════════════════════════════════════"));
  console.log(color.bold("  Bank Transfer Flow — End-to-End Test"));
  console.log(color.bold("══════════════════════════════════════════"));

  // ── Step 1: Initialize transfer ──────────────────────────────────────────
  log.step(1, "Initialize bank transfer");

  const initRes = await post("/donations/initialize-transfer", {
    campaignId: CAMPAIGN_ID,
    amount: 5000,
    email: "testuser@example.com",
    donorInfo: {
      firstName: "Test",
      lastName: "User",
      phone: "08012345678",
    },
  });

  if (!initRes.success) {
    log.fail(`Initialize failed: ${initRes.message}`);
    process.exit(1);
  }

  const { reference, accountDetails, expiresAt } = initRes.data.payment;
  const { donationId, amount } = initRes.data.donation;

  log.ok(`Donation created: ${donationId}`);
  log.info(`Reference:       ${reference}`);
  log.info(`Amount:          ₦${amount.toLocaleString()}`);
  log.info(`Expires at:      ${new Date(expiresAt).toLocaleTimeString()}`);
  log.info(`Bank:            ${accountDetails.bankName}`);
  log.info(`Account Number:  ${accountDetails.accountNumber}`);
  log.info(`Account Name:    ${accountDetails.accountName}`);

  // ── Step 2: Poll before approval (should be NOT verified) ────────────────
  log.step(2, "Poll transfer-status BEFORE approval (expect: not verified)");

  const statusBefore = await get(`/donations/transfer-status/${reference}`);

  if (!statusBefore.data?.paymentVerified) {
    log.ok(`paymentVerified = false  ✓ (correct — no transfer made yet)`);
    log.info(`status: ${statusBefore.data?.status}`);
  } else {
    log.fail("Unexpectedly already verified!");
  }

  // ── Step 3: Simulate admin marking as verified ────────────────────────────
  log.step(3, "Simulate admin approval (set paymentVerified = true in DB)");

  try {
    // Match server's DNS + DB name setup
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
    await mongoose.connect(`${process.env.MONGODB_URI}/saboFoundation`);

    const updated = await Donation.findOneAndUpdate(
      { paymentReference: reference },
      {
        paymentVerified: true,
        status: "verified",
        approvalStatus: "approved",
        verifiedAt: new Date(),
      },
      { new: true }
    ).select("donationId status paymentVerified approvalStatus");

    await mongoose.disconnect();

    if (updated?.paymentVerified) {
      log.ok(`Donation marked as verified in DB`);
      log.info(`status: ${updated.status} | approvalStatus: ${updated.approvalStatus}`);
    } else {
      log.fail(`Document not found in DB for reference: ${reference}`);
      process.exit(1);
    }
  } catch (err) {
    log.fail(`DB error: ${err.message}`);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }

  // ── Step 4: Poll after approval (should now be verified) ─────────────────
  log.step(4, "Poll transfer-status AFTER approval (expect: verified)");

  const statusAfter = await get(`/donations/transfer-status/${reference}`);

  if (statusAfter.data?.paymentVerified) {
    log.ok(`paymentVerified = true  ✓ (transfer confirmed!)`);
    log.info(`status: ${statusAfter.data?.status}`);
    log.info(`approvalStatus: ${statusAfter.data?.approvalStatus}`);
  } else {
    log.fail(`Still not verified. Response: ${JSON.stringify(statusAfter.data)}`);
    process.exit(1);
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log(color.bold("\n══════════════════════════════════════════"));
  console.log(color.green(color.bold("  ✅  ALL STEPS PASSED — Flow works correctly!")));
  console.log(color.bold("══════════════════════════════════════════\n"));

  console.log(color.dim("What this confirms:"));
  console.log(color.dim("  • POST /donations/initialize-transfer → creates DB record + returns account details"));
  console.log(color.dim("  • GET  /donations/transfer-status/:ref → returns paymentVerified: false before approval"));
  console.log(color.dim("  • GET  /donations/transfer-status/:ref → returns paymentVerified: true after approval"));
  console.log(color.dim("  • The frontend 'I've Transferred' button polling will correctly detect the verification\n"));
}

run().catch((err) => {
  console.error(color.red("\n❌ Test failed with error:"), err.message);
  mongoose.disconnect().catch(() => {});
  process.exit(1);
});
