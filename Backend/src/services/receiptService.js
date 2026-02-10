// ============================================
// FILE: services/receiptService.js
// ============================================
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "../config/cloudinary.js";
import Donation from "../models/Donation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure receipts directory exists
const receiptsDir = path.join(__dirname, "../../uploads/receipts");
if (!fs.existsSync(receiptsDir)) {
  fs.mkdirSync(receiptsDir, { recursive: true });
}

/**
 * Generate a unique receipt number
 * Format: RCP-YYYYMMDD-XXXXX
 */
const generateReceiptNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();

  return `RCP-${year}${month}${day}-${random}`;
};

/**
 * Format currency (Nigerian Naira)
 */
const formatCurrency = (amount) => {
  const value = typeof amount === "number" ? amount : 0;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    currencyDisplay: "narrowSymbol",
  }).format(value);
};

/**
 * Format date
 */
const formatDate = (date) => {
  if (!date) return "N/A";
  try {
    return new Intl.DateTimeFormat("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  } catch (e) {
    return "Invalid Date";
  }
};

/**
 * Generate PDF receipt for a donation
 * @param {Object} donation - Donation document (must be populated with campaign and donor)
 * @param {Boolean} skipUpload - Whether to skip Cloudinary upload
 * @returns {Object} - Receipt details { url, number, path }
 */
export const generateReceipt = async (donation, skipUpload = false) => {
  try {
    // Populate if not already populated
    if (!donation.populated("campaign")) {
      await donation.populate("campaign");
    }
    if (!donation.populated("donor")) {
      await donation.populate("donor");
    }

    const receiptNumber = generateReceiptNumber();
    const fileName = `receipt-${donation.donationId}-${Date.now()}.pdf`;
    const filePath = path.join(receiptsDir, fileName);

    // Create PDF document
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    });

    // Pipe to file
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // ============================================
    // THEME: PROFESSIONAL BANKING (OPay/Access/First Bank)
    // ============================================
    const THEME = {
      primary: "#0f172a", // Deep Navy
      accent: "#10b981", // Success Green (OPay style)
      border: "#e2e8f0", // Light stroke
      bg: "#ffffff", // Pure White
      text: "#1e293b", // Dark Slate
      muted: "#64748b", // Slate 500
    };

    // Register a font that supports the Naira symbol (₦)
    try {
      doc.registerFont("MainFont", "C:\\Windows\\Fonts\\arial.ttf");
      doc.font("MainFont");
    } catch (e) {
      doc.font("Helvetica");
    }

    // White Background
    doc.rect(0, 0, 595, 842).fill(THEME.bg);

    // ============================================
    // TOP LOGO & HEADER
    // ============================================
    doc
      .fillColor(THEME.primary)
      .fontSize(16)
      .text("Sabo Ibadan Youth Charity Foundation", 50, 45, {
        align: "center",
        width: 495,
      });

    doc
      .fontSize(8)
      .fillColor(THEME.muted)
      .text("RC: 1234567 | CONTACT: +234 813 393 0690", 50, 65, {
        align: "center",
        width: 495,
      });

    // Success Checkmark (Simulated Circle)
    const checkX = 297,
      checkY = 120;
    doc.circle(checkX, checkY, 25).fill(THEME.accent);
    doc.lineWidth(4).strokeColor("#ffffff");
    doc
      .moveTo(checkX - 12, checkY)
      .lineTo(checkX - 4, checkY + 8)
      .lineTo(checkX + 12, checkY - 8)
      .stroke();

    doc
      .fontSize(14)
      .fillColor(THEME.accent)
      .text("Transaction Successful", 50, 155, { align: "center", width: 495 });

    // ============================================
    // AMOUNT SECTION (Fintech Style)
    // ============================================
    doc
      .fontSize(28)
      .fillColor(THEME.primary)
      .text(formatCurrency(donation.amount), 50, 180, {
        align: "center",
        width: 495,
      });

    doc
      .fontSize(9)
      .fillColor(THEME.muted)
      .text("Total Donation Amount", 50, 212, { align: "center", width: 495 });

    // ============================================
    // TRANSACTION DETAILS (Professional Table)
    // ============================================
    const startY = 240;
    const rowHeight = 32;
    const col1 = 60,
      col2 = 250;

    const drawRow = (label, value, y) => {
      // Subtle Separator
      doc.rect(col1, y + rowHeight - 2, 475, 0.5).fill(THEME.border);

      doc
        .fontSize(9)
        .fillColor(THEME.muted)
        .text(label.toUpperCase(), col1, y + 10);

      doc
        .fontSize(10)
        .fillColor(THEME.primary)
        .text(value || "N/A", col2, y + 10, { width: 285, align: "right" });
    };

    drawRow("Donation Reference", donation.donationId, startY);
    drawRow("Receipt Number", receiptNumber, startY + rowHeight);
    drawRow("Transaction Date", formatDate(new Date()), startY + rowHeight * 2);
    drawRow(
      "Benefactor Name",
      donation.anonymous
        ? "Anonymous Donor"
        : donation.donor?.fullName ||
            (donation.guestInfo
              ? `${donation.guestInfo.firstName} ${donation.guestInfo.lastName}`
              : "Guest Donor"),
      startY + rowHeight * 3,
    );
    drawRow(
      "Impact Mission",
      donation.campaign?.title || "General Foundation fund",
      startY + rowHeight * 4,
    );
    drawRow(
      "Payment Method",
      donation.paymentMethod.replace("_", " ").toUpperCase(),
      startY + rowHeight * 5,
    );
    drawRow("Status", "VERIFIED & APPROVED", startY + rowHeight * 6);

    // ============================================
    // MESSAGES / LOGS
    // ============================================
    let logY = startY + rowHeight * 7 + 20;
    if (donation.donorNote || donation.impactMessage) {
      doc.rect(60, logY, 475, 100).fill("#f8fafc");

      let subLogY = logY + 15;
      if (donation.donorNote) {
        doc
          .fontSize(8)
          .fillColor(THEME.muted)
          .text("Donor Message:", 75, subLogY);
        doc
          .fontSize(9)
          .fillColor(THEME.primary)
          .text(`"${donation.donorNote}"`, 75, subLogY + 12, { width: 445 });
        subLogY += 40;
      }
      if (donation.impactMessage) {
        doc
          .fontSize(8)
          .fillColor(THEME.muted)
          .text("Foundation Response:", 75, subLogY);
        doc
          .fontSize(9)
          .fillColor(THEME.accent)
          .text(donation.impactMessage, 75, subLogY + 12, { width: 445 });
      }
    }

    // ============================================
    // FOOTER
    // ============================================
    const footY = 650; // Moved up to ensure one page

    // Official Stamp Simulation
    doc.save();
    doc.translate(450, 630);
    doc.rotate(-15);
    doc.rect(0, 0, 100, 40).lineWidth(2).strokeColor(THEME.accent).stroke();
    doc
      .fontSize(8)
      .fillColor(THEME.accent)
      .text("OFFICIAL RECEIPT", 10, 10)
      .text("SABO IBADAN", 10, 25);
    doc.restore();

    doc
      .fontSize(8)
      .fillColor(THEME.muted)
      .text(
        "This is an electronically generated receipt for your donation. No signature is required. We appreciate your partnership in making a difference.",
        60,
        footY,
        { align: "center", width: 475 },
      );

    doc
      .fontSize(7)
      .fillColor(THEME.muted)
      .text(
        `Digital Fingerprint: ${donation.paymentReference}`,
        60,
        footY + 30,
        { align: "center", width: 475 },
      );

    doc
      .fontSize(9)
      .fillColor(THEME.primary)
      .text(
        "© 2026 Sabo Ibadan Youth Charity Foundation. All Rights Reserved.",
        60,
        footY + 55,
        { align: "center", width: 475 },
      );

    // Finalize PDF
    doc.end();

    // Wait for PDF to be written
    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    // Upload to Cloudinary
    let receiptUrl = donation.receiptUrl || "";

    if (!skipUpload && process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
          folder: "receipts",
          resource_type: "auto",
          public_id: `receipt-${donation.donationId}`,
          format: "pdf",
        });

        receiptUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        // Fallback to local URL path
        receiptUrl = `/uploads/receipts/${fileName}`;
      }
    } else {
      // Use local file path if Cloudinary not configured
      receiptUrl = `/uploads/receipts/${fileName}`;
    }

    return {
      url: receiptUrl,
      number: receiptNumber,
      path: filePath, // Always return the local path for immediate use (e.g. email attachment)
      fileName: fileName,
      generatedAt: new Date(),
    };
  } catch (error) {
    console.error("Generate receipt error:", error);
    throw new Error(`Failed to generate receipt: ${error.message}`);
  }
};

/**
 * Regenerate receipt for an existing donation
 * @param {String} donationId - Donation ID
 * @returns {Object} - Receipt details
 */
export const regenerateReceipt = async (donationId) => {
  try {
    const donation =
      await Donation.findById(donationId).populate("campaign donor");

    if (!donation) {
      throw new Error("Donation not found");
    }

    if (
      donation.status !== "completed" &&
      donation.approvalStatus !== "approved"
    ) {
      throw new Error(
        "Can only generate receipts for approved/completed donations",
      );
    }

    // Delete old receipt from Cloudinary if exists
    if (donation.receiptUrl && donation.receiptUrl.includes("cloudinary")) {
      const publicId = donation.receiptUrl
        .split("/")
        .slice(-2)
        .join("/")
        .replace(".pdf", "");
      try {
        await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
      } catch (deleteError) {
        console.error("Error deleting old receipt:", deleteError);
      }
    }

    // Generate new receipt
    const receipt = await generateReceipt(donation);

    // Update donation record
    donation.receiptUrl = receipt.url;
    donation.receiptNumber = receipt.number;
    donation.receiptGenerated = true;
    await donation.save();

    return receipt;
  } catch (error) {
    console.error("Regenerate receipt error:", error);
    throw new Error(`Failed to regenerate receipt: ${error.message}`);
  }
};

/**
 * Send receipt via email
 * @param {String} donationId - Donation ID
 * @param {String} email - Recipient email
 * @returns {Boolean} - Success status
 */
export const sendReceiptEmail = async (donationId, email) => {
  try {
    const donation =
      await Donation.findById(donationId).populate("campaign donor");

    if (!donation || !donation.receiptUrl) {
      throw new Error("Donation or receipt not found");
    }

    const { sendEmail } = await import("./emailService.js");

    // Generate a fresh receipt for attachment
    const receipt = await generateReceipt(donation, true);

    await sendEmail({
      to: email,
      subject: `Your Donation Impact Report - ${donation.donationId}`,
      template: "donationReceipt",
      data: {
        donorName: donation.anonymous
          ? "Anonymous Donor"
          : donation.donor?.fullName || "Donor",
        amount: donation.amount,
        campaign: donation.campaign.title,
        donationId: donation.donationId,
        receiptUrl: donation.receiptUrl,
      },
      attachments: [
        {
          filename: `receipt-${donation.donationId}.pdf`,
          path: receipt.path,
        },
      ],
    });

    // Cleanup temporary file
    if (receipt.path && fs.existsSync(receipt.path)) {
      try {
        fs.unlinkSync(receipt.path);
      } catch (err) {
        console.warn(
          "Could not delete temporary resend receipt file:",
          receipt.path,
        );
      }
    }

    return true;
  } catch (error) {
    console.error("Send receipt email error:", error);
    throw new Error(`Failed to send receipt: ${error.message}`);
  }
};

export default {
  generateReceipt,
  regenerateReceipt,
  sendReceiptEmail,
};
