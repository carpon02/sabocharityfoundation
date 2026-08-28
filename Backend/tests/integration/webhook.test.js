import crypto from "crypto";
import request from "supertest";
import app from "../../app.js";
import * as dbHandler from "../dbHandler.js";
import IdempotencyKey from "../../src/models/IdempotencyKey.js";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || "sk_test_webhook";

const sign = (payload) => {
  const raw = JSON.stringify(payload);
  const signature = crypto
    .createHmac("sha512", PAYSTACK_SECRET)
    .update(raw)
    .digest("hex");
  return { raw, signature };
};

describe("Paystack webhook", () => {
  beforeAll(async () => {
    process.env.PAYSTACK_SECRET_KEY = PAYSTACK_SECRET;
    await dbHandler.connect();
  });

  afterEach(async () => {
    await dbHandler.clearDatabase();
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  it("rejects requests without a signature", async () => {
    const { raw } = sign({ event: "charge.success", data: { id: 1 } });
    const response = await request(app)
      .post("/api/v1/donations/webhook")
      .set("Content-Type", "application/json")
      .send(raw)
      .expect(400);

    expect(response.body.success).toBe(false);
  });

  it("rejects an invalid signature", async () => {
    const { raw } = sign({ event: "charge.success", data: { id: 1 } });
    const response = await request(app)
      .post("/api/v1/donations/webhook")
      .set("Content-Type", "application/json")
      .set("x-paystack-signature", "deadbeef")
      .send(raw)
      .expect(401);

    expect(response.body.success).toBe(false);
  });

  it("accepts a signed event and stores a completed idempotency key", async () => {
    const payload = {
      event: "charge.success",
      data: { id: 9001, reference: "ref-missing-donation" },
    };
    const { raw, signature } = sign(payload);

    const response = await request(app)
      .post("/api/v1/donations/webhook")
      .set("Content-Type", "application/json")
      .set("x-paystack-signature", signature)
      .send(raw)
      .expect(200);

    expect(response.body.success).toBe(true);

    const stored = await IdempotencyKey.findOne({
      key: "paystack-charge.success-9001",
    });
    expect(stored).toBeTruthy();
    expect(stored.status).toBe("completed");
  });

  it("ignores a duplicate event after successful processing", async () => {
    const payload = {
      event: "charge.failed",
      data: { id: 9002, reference: "ref-dup" },
    };
    const { raw, signature } = sign(payload);

    await request(app)
      .post("/api/v1/donations/webhook")
      .set("Content-Type", "application/json")
      .set("x-paystack-signature", signature)
      .send(raw)
      .expect(200);

    const duplicate = await request(app)
      .post("/api/v1/donations/webhook")
      .set("Content-Type", "application/json")
      .set("x-paystack-signature", signature)
      .send(raw)
      .expect(200);

    expect(duplicate.body.message).toMatch(/duplicate/i);
  });
});
