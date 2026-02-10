import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const BASE_URL = "http://localhost:5000/api/v1"; // Adjust port if needed
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

if (!PAYSTACK_SECRET_KEY) {
  console.error(
    "Error: PAYSTACK_SECRET_KEY not found in environment variables."
  );
  process.exit(1);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests() {
  console.log("Starting Paystack Integration Tests...");
  console.log("----------------------------------------");

  try {
    // 1. Initialize Donation
    console.log("\n[1] Testing Donation Initialization...");
    const initData = {
      amount: 5000,
      email: "test_donor@example.com",
      campaignId: null, // Depending on backend logic, might need a valid ID.
      // If campaignId is required, we might need to fetch one first or create a dummy one.
      // Based on Donation.jsx, it fetches campaigns. Let's try to fetch campaigns first.
    };

    // Fetch a campaign to use
    let campaignId;
    try {
      const campaignsRes = await axios.get(`${BASE_URL}/campaigns`);
      if (campaignsRes.data.data && campaignsRes.data.data.length > 0) {
        campaignId = campaignsRes.data.data[0]._id;
        console.log(`    Using Campaign ID: ${campaignId}`);
      }
    } catch (e) {
      console.warn("    Could not fetch campaigns:", e.message);
      if (e.response) {
        console.warn("    Response Status:", e.response.status);
        console.warn("    Response Data:", JSON.stringify(e.response.data));
      }
    }

    if (campaignId) {
      initData.campaignId = campaignId;
    } else {
      console.warn(
        "    No active campaign found. Using dummy ID for validation test."
      );
      initData.campaignId = "507f1f77bcf86cd799439011"; // Dummy valid ObjectID
    }

    // Add other required fields based on Donation.jsx payload
    const payload = {
      amount: initData.amount,
      email: initData.email,
      campaignId: initData.campaignId,
      donorInfo: {
        firstName: "Test",
        lastName: "User",
        phone: "08012345678",
      },
      paymentMethod: "card",
      anonymous: false,
      isRecurring: false,
    };

    let initializationData;
    try {
      const initRes = await axios.post(
        `${BASE_URL}/donations/initialize`,
        payload
      );
      initializationData = initRes.data;
      console.log("    ✅ Initialization Successful");
      console.log(
        `    Reference: ${initializationData.data.payment.reference}`
      );
    } catch (error) {
      console.error(
        "    ❌ Initialization Failed:",
        error.response?.data || error.message
      );
      // If init fails (e.g. invalid keys), we can't fully proceed, but we can test webhook signature logic locally
    }

    const reference =
      initializationData?.data?.payment?.reference || "TEST_REF_" + Date.now();

    // 2. Test Webhook Signature Verification
    console.log("\n[2] Testing Webhook Signature Verification...");

    const eventBody = {
      event: "charge.success",
      data: {
        reference: reference,
        status: "success",
        amount: 500000, // kobo
        gateway_response: "Successful",
        channel: "card",
        currency: "NGN",
        ip_address: "127.0.0.1",
        metadata: {},
        log: {},
        fees: 100,
        customer: { email: "test_donor@example.com" },
        authorization: {},
        plan: {},
      },
    };

    const bodyString = JSON.stringify(eventBody);
    const signature = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(bodyString)
      .digest("hex");

    try {
      // Note: The endpoint might be /donations/webhook or just /webhook depending on routes
      // Checking webhookController.js route annotation: POST /api/v1/donations/webhook
      const webhookRes = await axios.post(
        `${BASE_URL}/donations/webhook`,
        eventBody,
        {
          headers: {
            "x-paystack-signature": signature,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(`    ✅ Webhook Request Status: ${webhookRes.status}`);
      console.log(
        "    ✅ Signature Verification Passed (Server accepted request)"
      );
    } catch (error) {
      if (error.response?.status === 401) {
        console.error(
          "    ❌ Signature Verification Failed: Server returned 401"
        );
      } else {
        console.error(
          "    ❌ Webhook Request Failed:",
          error.response?.data || error.message
        );
      }
    }

    // 3. Test Invalid Signature
    console.log("\n[3] Testing Invalid Webhook Signature...");
    try {
      await axios.post(`${BASE_URL}/donations/webhook`, eventBody, {
        headers: {
          "x-paystack-signature": "invalid_signature_hash",
          "Content-Type": "application/json",
        },
      });
      console.error("    ❌ Failed: Server accepted invalid signature");
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("    ✅ Success: Server rejected invalid signature (401)");
      } else {
        console.log(
          `    ❓ Server returned ${error.response?.status} (Expected 401)`
        );
      }
    }
  } catch (err) {
    console.error("\nTest Suite Error:", err.message);
  } finally {
    console.log("\nDone.");
  }
}

runTests();
