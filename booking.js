const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    firstName = '',
    lastName = '',
    email = '',
    instagram = '',
    service = '',
    budget = '',
    message = ''
  } = req.body || {};

  if (!firstName || !email || !service) {
    return res.status(400).json({ error: 'Please fill in your first name, email, and service.' });
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return res.status(500).json({ error: 'Email server is not configured yet.' });
  }

  const toEmail = process.env.TO_EMAIL || 'kcharnae1@gmail.com';

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  const subject = `New CHARK.CO Booking Inquiry: ${service}`;

  const text = `
New booking inquiry from your website:

Name: ${firstName} ${lastName}
Email: ${email}
Instagram: ${instagram || 'Not provided'}
Service: ${service}
Budget: ${budget || 'Not provided'}

Message:
${message || 'No message provided'}
  `.trim();

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1A1410;">
      <h2>New CHARK.CO Booking Inquiry</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Instagram:</strong> ${instagram || 'Not provided'}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Budget:</strong> ${budget || 'Not provided'}</p>
      <p><strong>Message:</strong></p>
      <p>${(message || 'No message provided').replace(/\n/g, '<br>')}</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `CHARK.CO Website <${process.env.GMAIL_USER}>`,
      to: toEmail,
      replyTo: email,
      subject,
      text,
      html
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Email send failed:', error);
    return res.status(500).json({ error: 'Could not send your inquiry. Please email kcharnae1@gmail.com.' });
  }
};
