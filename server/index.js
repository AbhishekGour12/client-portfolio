import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from local server directory
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration - allow frontend development server
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5000'],
  credentials: true
}));

app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Endpoint for receiving Contact bookings
app.post('/api/contact', async (req, res) => {
  try {
    const {
      user_name,
      user_email,
      user_phone,
      event_type,
      event_date,
      event_location,
      event_budget,
      message,
      honey
    } = req.body;

    // Honeypot spam prevention check
    if (honey) {
      console.warn('Spam request detected via honeypot field.');
      return res.status(200).json({ success: true, message: 'Form submitted successfully (spam check).' });
    }

    // Server-side validation
    if (!user_name || !user_email || !user_phone || !event_type || !event_date || !event_location || !event_budget || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Configure Nodemailer Transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify transporter configuration
    await transporter.verify();

    // Visual HTML Email Template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f7f9fa;
            color: #1a202c;
            margin: 0;
            padding: 20px;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            overflow: hidden;
            border: 1px solid #e2e8f0;
          }
          .header {
            background: linear-gradient(135deg, #1e1e24 0%, #c5a880 100%);
            padding: 30px;
            text-align: center;
            color: #ffffff;
          }
          .header h1 {
            margin: 0;
            font-size: 22px;
            letter-spacing: 2px;
            text-transform: uppercase;
          }
          .header p {
            margin: 5px 0 0 0;
            font-size: 14px;
            opacity: 0.8;
          }
          .content {
            padding: 30px;
          }
          .section-title {
            font-size: 16px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #c5a880;
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 8px;
            margin-top: 0;
            margin-bottom: 20px;
          }
          .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          .info-table td {
            padding: 10px 0;
            border-bottom: 1px solid #f1f5f9;
            font-size: 15px;
          }
          .info-table td.label {
            font-weight: 600;
            color: #4a5568;
            width: 35%;
          }
          .info-table td.value {
            color: #1a202c;
          }
          .message-box {
            background-color: #f8fafc;
            border-left: 4px solid #c5a880;
            padding: 15px 20px;
            border-radius: 4px;
            font-size: 14px;
            line-height: 1.6;
            color: #334155;
            white-space: pre-wrap;
          }
          .footer {
            background-color: #f8fafc;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>New Booking Request</h1>
            <p>Anushi Kothari Portfolio - Contact Form</p>
          </div>
          
          <div class="content">
            <h2 class="section-title">Client Details</h2>
            <table class="info-table">
              <tr>
                <td class="label">Full Name</td>
                <td class="value">${user_name}</td>
              </tr>
              <tr>
                <td class="label">Email Address</td>
                <td class="value"><a href="mailto:${user_email}">${user_email}</a></td>
              </tr>
              <tr>
                <td class="label">Phone Number</td>
                <td class="value"><a href="tel:${user_phone}">${user_phone}</a></td>
              </tr>
            </table>

            <h2 class="section-title">Event Information</h2>
            <table class="info-table">
              <tr>
                <td class="label">Event Category</td>
                <td class="value">${event_type}</td>
              </tr>
              <tr>
                <td class="label">Event Date</td>
                <td class="value">${event_date}</td>
              </tr>
              <tr>
                <td class="label">Event Location</td>
                <td class="value">${event_location}</td>
              </tr>
              <tr>
                <td class="label">Expected Budget</td>
                <td class="value">${event_budget}</td>
              </tr>
            </table>

            <h2 class="section-title">Message & Itinerary Details</h2>
            <div class="message-box">${message}</div>
          </div>
          
          <div class="footer">
            This inquiry was sent automatically from the Anushi Kothari Portfolio website.
          </div>
        </div>
      </body>
      </html>
    `;

    // Mail options
    const mailOptions = {
      from: `"${user_name}" <${process.env.SMTP_USER}>`, // standard practice: send from authenticated user, set replyTo to user
      replyTo: user_email,
      to: process.env.ADMIN_EMAIL,
      subject: `[Booking Inquiry] ${event_type} - ${user_name}`,
      html: emailHtml,
      text: `New Booking Inquiry from ${user_name}\n\n` +
        `Client Email: ${user_email}\n` +
        `Client Phone: ${user_phone}\n` +
        `Event Type: ${event_type}\n` +
        `Event Date: ${event_date}\n` +
        `Event Location: ${event_location}\n` +
        `Expected Budget: ${event_budget}\n\n` +
        `Message:\n${message}`,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    return res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Nodemailer Error:', error);
    return res.status(500).json({ error: 'Internal Server Error. Failed to send email.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
