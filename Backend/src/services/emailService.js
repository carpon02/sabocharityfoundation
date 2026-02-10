// services/emailService.js - Updated with Password Reset Template
import nodemailer from "nodemailer";

// ✅ Create transporter using Gmail service
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail", // Use Gmail's built-in service
    auth: {
      user: process.env.EMAIL_USER, // your Gmail address
      pass: process.env.EMAIL_PASSWORD, // your 16-char Google App Password
    },
  });
};

// ✅ Modern HTML Email Templates
const templates = {
  emailVerification: (data) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Verify Your Email</title>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
      <style>
        :root {
          --primary: #6366f1;
          --secondary: #a855f7;
          --accent: #22c55e;
          --bg: #0f172a;
          --card: #1e293b;
          --text: #f8fafc;
          --muted: #94a3b8;
        }
        body {
          margin: 0; padding: 0;
          background-color: var(--bg);
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          color: var(--text);
          line-height: 1.6;
        }
        .wrapper {
          width: 100%;
          table-layout: fixed;
          background-color: var(--bg);
          padding-bottom: 40px;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: var(--card);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .header {
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          padding: 60px 40px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -1px;
          color: #ffffff;
          text-transform: uppercase;
        }
        .content {
          padding: 40px;
          text-align: center;
        }
        .content h2 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #ffffff;
        }
        .content p {
          color: var(--muted);
          font-size: 16px;
          margin-bottom: 32px;
        }
        .btn {
          display: inline-block;
          padding: 16px 40px;
          background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 100px;
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
          transition: transform 0.2s;
        }
        .footer {
          padding: 32px;
          background: rgba(15, 23, 42, 0.5);
          text-align: center;
          font-size: 12px;
          color: var(--muted);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .accent-bar {
          height: 4px;
          background: linear-gradient(90deg, var(--primary), var(--secondary), var(--accent));
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <h1>Sabo Ibadan</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">Youth Charity Foundation</p>
          </div>
          <div class="accent-bar"></div>
          <div class="content">
            <h2>Welcome Home, ${data.name}!</h2>
            <p>You're one step away from joining our mission of positive impact. Verify your identity to unlock full access to our community.</p>
            <a href="${data.verificationUrl}" class="btn">Verify Access</a>
            <div style="margin-top: 40px; font-size: 13px; color: #475569;">
              <p>Or paste this link into your browser:<br>
              <span style="color: var(--primary); text-decoration: underline;">${data.verificationUrl}</span></p>
            </div>
          </div>
          <div class="footer">
            <p>&copy; 2026 Sabo Ibadan Youth Charity Foundation. Built with ❤️ for the community.</p>
            <p>123 impact Drive, Ibadan, Nigeria</p>
          </div>
        </div>
      </div>
    </body>
  </html>
  `,

  passwordReset: (data) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Reset Password</title>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
      <style>
        :root {
          --primary: #f59e0b;
          --secondary: #d97706;
          --bg: #0f172a;
          --card: #1e293b;
          --text: #f8fafc;
          --muted: #94a3b8;
        }
        body { margin: 0; padding: 0; background-color: var(--bg); font-family: 'Outfit', sans-serif; color: var(--text); }
        .container { max-width: 600px; margin: 40px auto; background: var(--card); border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
        .header { background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%); padding: 60px 40px; text-align: center; }
        .header h1 { margin: 0; font-size: 32px; font-weight: 800; color: #ffffff; text-transform: uppercase; }
        .content { padding: 40px; text-align: center; }
        .btn { display: inline-block; padding: 16px 40px; background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%); color: #ffffff !important; text-decoration: none; border-radius: 100px; font-weight: 600; box-shadow: 0 10px 15px -3px rgba(245, 158, 11, 0.3); }
        .footer { padding: 32px; text-align: center; font-size: 12px; color: var(--muted); border-top: 1px solid rgba(255, 255, 255, 0.05); }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Sabo Ibadan</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">Security Protocol</p>
        </div>
        <div class="content">
          <div style="font-size: 48px; margin-bottom: 24px;">🔑</div>
          <h2 style="color: #ffffff;">Reset Your Signature</h2>
          <p style="color: var(--muted);">Hello ${data.name}, we received a request to recalibrate your account access. If this was you, proceed with the button below.</p>
          <a href="${data.resetUrl}" class="btn">Reset Password</a>
          <p style="margin-top: 32px; font-size: 14px; color: #ef4444; font-weight: 600;">⚠️ This protocol expires in 1 hour.</p>
        </div>
        <div class="footer">&copy; 2026 Sabo Ibadan Youth Charity Foundation. Secure & Transparent.</div>
      </div>
    </body>
  </html>
  `,

  donationReceipt: (data) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Donation Receipt</title>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
      <style>
        :root { --primary: #10b981; --secondary: #059669; --bg: #0f172a; --card: #1e293b; --text: #f8fafc; --muted: #94a3b8; }
        body { margin: 0; padding: 0; background-color: var(--bg); font-family: 'Outfit', sans-serif; color: var(--text); }
        .container { max-width: 600px; margin: 40px auto; background: var(--card); border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
        .header { background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%); padding: 40px; text-align: center; }
        .content { padding: 40px; }
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 32px 0; }
        .stats-card { background: rgba(15, 23, 42, 0.4); padding: 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); }
        .amount { font-size: 32px; font-weight: 800; color: #ffffff; margin: 8px 0; }
        .footer { padding: 32px; text-align: center; font-size: 12px; color: var(--muted); background: rgba(15,23,42,0.3); }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div style="font-size: 40px; margin-bottom: 12px;">🌱</div>
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; text-transform: uppercase;">Impact Manifested</h1>
        </div>
        <div class="content">
          <h2 style="color: #ffffff; text-align: center;">Thank You, Hero!</h2>
          <p style="color: var(--muted); text-align: center;">Your contribution to <strong>${data.campaign || "General Mission"}</strong> has been officially inscribed in our mission logs.</p>
          
          <div class="stats-grid">
            <div class="stats-card">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--primary);">Mobilized</div>
              <div class="amount">₦${data.amount ? Number(data.amount).toLocaleString() : "0"}</div>
            </div>
            <div class="stats-card">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--primary);">Reference</div>
              <div style="font-size: 14px; font-weight: 600; color: #ffffff; margin-top: 15px;">#${data.donationId || "N/A"}</div>
            </div>
          </div>

          <div style="background: rgba(16, 185, 129, 0.1); padding: 20px; border-radius: 16px; border: 1px dashed var(--primary); margin-top: 32px; text-align: center;">
            <p style="margin: 0; color: var(--primary); font-weight: 600;">Action Complete: Your generosity has been converted into local impact.</p>
          </div>
          
          <div style="text-align: center; margin-top: 32px;">
            <a href="${data.receiptUrl || "#"}" style="color: var(--primary); text-decoration: none; font-weight: 600; font-size: 14px;">📄 VIEW DIGITAL DOSSIER</a>
          </div>
        </div>
        <div class="footer">&copy; 2026 Sabo Ibadan Youth Charity Foundation. Transparency in every Naira.</div>
      </div>
    </body>
  </html>
  `,

  paymentPending: (data) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
      <style>
        :root { --primary: #f59e0b; --bg: #0f172a; --card: #1e293b; --text: #f8fafc; }
        body { margin: 0; padding: 0; background-color: var(--bg); font-family: 'Outfit', sans-serif; color: var(--text); }
        .container { max-width: 600px; margin: 40px auto; background: var(--card); border-radius: 24px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px; text-align: center; }
        .content { padding: 40px; text-align: center; }
        .instr-box { background: rgba(15,23,42,0.4); padding: 24px; border-radius: 16px; margin: 24px 0; text-align: left; border: 1px solid rgba(245,158,11,0.2); }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1 style="color:#ffffff; margin:0; font-weight:800; font-size:24px; text-transform:uppercase;">Protocol Initialized</h1></div>
        <div class="content">
          <div style="font-size:48px; margin-bottom:20px;">⏳</div>
          <h2 style="color:#ffffff;">Review in Progress</h2>
          <p style="color:#94a3b8;">Your manual donation of <strong>₦${Number(data.amount).toLocaleString()}</strong> is currently undergoing our verification protocol.</p>
          <div class="instr-box">
             <div style="color:#f59e0b; font-size:11px; font-weight:800; text-transform:uppercase; margin-bottom:8px;">Identity Log</div>
             <p style="margin:4px 0; font-size:14px;"><strong>Reference:</strong> ${data.donationId}</p>
             <p style="margin:4px 0; font-size:14px;"><strong>Mission:</strong> ${data.campaignTitle}</p>
          </div>
          <p style="font-size:13px; color:#64748b;">Our stewards will finalize the verification within 24 hours. You will receive a secure confirmation once complete.</p>
        </div>
      </div>
    </body>
  </html>
  `,

  paymentApproved: (data) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
      <style>
        :root { --primary: #10b981; --bg: #0f172a; --card: #1e293b; --text: #f8fafc; }
        body { margin: 0; padding: 0; background-color: var(--bg); font-family: 'Outfit', sans-serif; color: var(--text); }
        .container { max-width: 600px; margin: 40px auto; background: var(--card); border-radius: 24px; overflow: hidden; box-shadow:0 30px 60px rgba(0,0,0,0.5); }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 50px; text-align: center; }
        .content { padding: 40px; text-align: center; }
        .impact-msg { font-style: italic; color: #10b981; margin: 24px 0; padding: 20px; background: rgba(16, 185, 129, 0.05); border-radius: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div style="font-size:50px; margin-bottom:15px;">✅</div>
          <h1 style="color:#ffffff; margin:0; font-weight:800; font-size:28px; text-transform:uppercase;">Protocol Verified</h1>
        </div>
        <div class="content">
          <h2 style="color:#ffffff;">Magnificent Impact, ${data.donorName}!</h2>
          <p style="color:#94a3b8;">Your contribution to <strong>${data.campaignTitle}</strong> has been successfully verified and deployed.</p>
          
          <div style="font-size:36px; font-weight:800; color:#ffffff; margin:30px 0;">₦${Number(data.amount).toLocaleString()}</div>

          ${data.impactMessage ? `<div class="impact-msg">"${data.impactMessage}"</div>` : ""}

          <a href="${data.receiptUrl}" style="display:inline-block; padding:16px 32px; background:#10b981; color:#ffffff; text-decoration:none; border-radius:12px; font-weight:800; font-size:12px; text-transform:uppercase; letter-spacing:1px; margin-top:10px;">Download Fiscal Receipt</a>
        </div>
        <div style="padding:24px; text-align:center; color:#475569; font-size:11px;">&copy; 2026 SABO IBADAN • EMPOWERING COMMUNITIES</div>
      </div>
    </body>
  </html>
  `,

  paymentRejected: (data) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
      <style>
        :root { --primary: #ef4444; --bg: #0f172a; --card: #1e293b; --text: #f8fafc; }
        body { margin: 0; padding: 0; background-color: var(--bg); font-family: 'Outfit', sans-serif; color: var(--text); }
        .container { max-width: 600px; margin: 40px auto; background: var(--card); border-radius: 24px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%); padding: 40px; text-align: center; }
        .content { padding: 40px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1 style="color:#ffffff; margin:0; font-weight:800; font-size:24px; text-transform:uppercase;">Protocol Nullified</h1></div>
        <div class="content">
          <div style="font-size:48px; margin-bottom:20px;">⚠️</div>
          <h2 style="color:#ffffff;">Validation Unsuccessful</h2>
          <p style="color:#94a3b8;">We were unable to verify your donation to <strong>${data.campaignTitle}</strong>.</p>
          <div style="background:rgba(239,68,68,0.1); padding:20px; border-radius:12px; color:#f87171; text-align:left; margin:24px 0;">
            <strong>Stewart Feedback:</strong><br>${data.rejectionReason}
          </div>
          <p style="font-size:13px; color:#64748b;">If you believe this is an anomaly, please contact our support unit with your reference ID: <strong>${data.donationId}</strong></p>
        </div>
      </div>
    </body>
  </html>
  `,

  welcomeEmail: (data) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
      <style>
        :root { --primary: #6366f1; --bg: #0f172a; --card: #1e293b; --text: #f8fafc; }
        body { margin: 0; padding: 0; background-color: var(--bg); font-family: 'Outfit', sans-serif; color: var(--text); }
        .container { max-width: 600px; margin: 40px auto; background: var(--card); border-radius: 24px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); padding: 50px; text-align: center; }
        .content { padding: 40px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div style="font-size:60px; margin-bottom:15px;">💎</div>
          <h1 style="color:#ffffff; margin:0; font-weight:800; font-size:28px; text-transform:uppercase;">Identity Confirmed</h1>
        </div>
        <div class="content">
          <h2 style="color:#ffffff;">Protocol Active, ${data.name}!</h2>
          <p style="color:#94a3b8;">Your verification is complete. You are now a fully authorized member of the Sabo Ibadan Youth Charity Foundation.</p>
          <p style="margin-top:30px; color:#94a3b8;">Ready to spark change? Explore our active missions and start your journey of impact today.</p>
          <a href="${process.env.FRONTEND_URL}/campaigns" style="display:inline-block; padding:16px 32px; background:linear-gradient(90deg, #6366f1, #a855f7); color:#ffffff; text-decoration:none; border-radius:100px; font-weight:800; font-size:12px; text-transform:uppercase; letter-spacing:1px; margin-top:20px;">Explore Missions</a>
        </div>
        <div style="padding:24px; text-align:center; color:#475569; font-size:11px;">&copy; 2026 SABO IBADAN • FOR THE YOUTH, BY THE YOUTH</div>
      </div>
    </body>
  </html>
  `,
};

// ✅ Send Single Email
export const sendEmail = async ({
  to,
  subject,
  template,
  data,
  attachments = [],
}) => {
  try {
    const transporter = createTransporter();

    const htmlContent = templates[template]
      ? templates[template](data)
      : data.html || "<p>No content</p>";

    const mailOptions = {
      from:
        process.env.EMAIL_FROM ||
        `"Sabo Youth Foundation" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
    console.log("   To:", to);
    console.log("   Subject:", subject);
    return info;
  } catch (error) {
    console.error("❌ Email sending error:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// ✅ Send Bulk Emails
export const sendBulkEmails = async (
  recipients,
  subject,
  template,
  commonData = {},
) => {
  try {
    const promises = recipients.map((recipient) =>
      sendEmail({
        to: recipient.email,
        subject,
        template,
        data: { ...commonData, ...recipient },
      }),
    );

    const results = await Promise.allSettled(promises);

    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    console.log(
      `✅ Bulk email completed: ${successful} sent, ${failed} failed`,
    );

    return results;
  } catch (error) {
    console.error("❌ Bulk email error:", error);
    throw new Error("Failed to send bulk emails");
  }
};

export default {
  sendEmail,
  sendBulkEmails,
};
