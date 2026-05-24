const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    name = '',
    email = '',
    instagram = '',
    tiktok = '',
    niche = '',
    followers = '',
    portfolio = '',
    why = ''
  } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ error: 'Please fill in your name and email.' });
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return res.status(500).json({ error: 'Email server not configured.' });
  }

  const toEmail = process.env.TO_EMAIL || 'kcharnae1@gmail.com';

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1A1410;">
      <div style="background:#2C1810;padding:32px;text-align:center;">
        <h1 style="color:#FAF7F2;font-family:Georgia,serif;font-weight:300;font-size:32px;margin:0;">CHARK HAUS</h1>
        <p style="color:#BFA07A;font-size:12px;letter-spacing:3px;text-transform:uppercase;margin:8px 0 0;">New Creator Application</p>
      </div>
      <div style="padding:32px;background:#FAF7F2;border:1px solid #EDE0D6;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;border-bottom:1px solid #EDE0D6;font-size:12px;color:#7A6E68;text-transform:uppercase;letter-spacing:1px;width:120px;">Name</td><td style="padding:10px 0;border-bottom:1px solid #EDE0D6;font-size:14px;color:#1A1410;"><strong>${name}</strong></td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #EDE0D6;font-size:12px;color:#7A6E68;text-transform:uppercase;letter-spacing:1px;">Email</td><td style="padding:10px 0;border-bottom:1px solid #EDE0D6;font-size:14px;"><a href="mailto:${email}" style="color:#C4867A;">${email}</a></td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #EDE0D6;font-size:12px;color:#7A6E68;text-transform:uppercase;letter-spacing:1px;">Instagram</td><td style="padding:10px 0;border-bottom:1px solid #EDE0D6;font-size:14px;color:#1A1410;">${instagram || 'Not provided'}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #EDE0D6;font-size:12px;color:#7A6E68;text-transform:uppercase;letter-spacing:1px;">TikTok</td><td style="padding:10px 0;border-bottom:1px solid #EDE0D6;font-size:14px;color:#1A1410;">${tiktok || 'Not provided'}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #EDE0D6;font-size:12px;color:#7A6E68;text-transform:uppercase;letter-spacing:1px;">Niche</td><td style="padding:10px 0;border-bottom:1px solid #EDE0D6;font-size:14px;color:#C4867A;"><strong>${niche || 'Not provided'}</strong></td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #EDE0D6;font-size:12px;color:#7A6E68;text-transform:uppercase;letter-spacing:1px;">Followers</td><td style="padding:10px 0;border-bottom:1px solid #EDE0D6;font-size:14px;color:#1A1410;">${followers || 'Not provided'}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #EDE0D6;font-size:12px;color:#7A6E68;text-transform:uppercase;letter-spacing:1px;">Portfolio</td><td style="padding:10px 0;border-bottom:1px solid #EDE0D6;font-size:14px;"><a href="${portfolio}" style="color:#C4867A;">${portfolio || 'Not provided'}</a></td></tr>
        </table>
        <div style="margin-top:24px;padding:20px;background:#F2E8E1;border-left:3px solid #BFA07A;">
          <p style="font-size:12px;color:#7A6E68;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Why They Want to Join</p>
          <p style="font-size:14px;color:#1A1410;margin:0;line-height:1.6;">${(why || 'No reason provided').replace(/\n/g, '<br>')}</p>
        </div>
        <div style="margin-top:28px;text-align:center;">
          <a href="mailto:${email}" style="background:#BFA07A;color:#ffffff;padding:14px 28px;text-decoration:none;font-size:12px;letter-spacing:2px;text-transform:uppercase;display:inline-block;">Reply to ${name}</a>
        </div>
      </div>
      <div style="background:#1A1410;padding:16px;text-align:center;">
        <p style="color:#7A6E68;font-size:11px;margin:0;">CHARK HAUS · kcharnae1@gmail.com · @chark.haus</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `CHARK HAUS Website <${process.env.GMAIL_USER}>`,
      to: toEmail,
      replyTo: email,
      subject: `New Creator Application — ${name} (${niche || 'Unknown niche'})`,
      html
    });
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Creator email error:', error);
    return res.status(500).json({ error: 'Could not send email. Please try again.' });
  }
};
