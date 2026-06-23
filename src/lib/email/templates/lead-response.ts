/**
 * Lead Response Email Template
 * This template is used to send automated responses to leads when they submit the contact form
 */

export interface LeadResponseEmailData {
  leadName: string
  leadEmail: string
  siteName?: string
  siteUrl?: string
  contactEmail?: string
  contactPhone?: string
}

export function generateLeadResponseEmail(data: LeadResponseEmailData): string {
  const {
    leadName,
    siteName = 'Shamal Technologies',
    siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://shamal.sa',
    contactEmail = process.env.CONTACT_EMAIL || 'hello@shamal.sa',
    contactPhone = process.env.CONTACT_PHONE || '',
  } = data

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Contacting Us</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .email-container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #0066cc;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #0066cc;
      margin-bottom: 10px;
    }
    h1 {
      color: #0066cc;
      font-size: 28px;
      margin: 20px 0;
      text-align: center;
    }
    .content {
      margin: 30px 0;
    }
    .content p {
      margin: 15px 0;
      font-size: 16px;
      color: #555555;
    }
    .highlight-box {
      background-color: #f0f7ff;
      border-left: 4px solid #0066cc;
      padding: 20px;
      margin: 25px 0;
      border-radius: 4px;
    }
    .contact-info {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 4px;
      margin: 25px 0;
    }
    .contact-info p {
      margin: 8px 0;
      font-size: 15px;
    }
    .contact-info strong {
      color: #0066cc;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      font-size: 14px;
      color: #888888;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background-color: #0066cc;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: bold;
      text-align: center;
    }
    .button:hover {
      background-color: #0052a3;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        padding: 20px;
      }
      h1 {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo">${siteName}</div>
    </div>
    
    <h1>Thank You for Contacting Us!</h1>
    
    <div class="content">
      <p>Dear ${leadName},</p>
      
      <p>Thank you for reaching out to ${siteName}. We have received your inquiry and our team will review it shortly.</p>
      
      <div class="highlight-box">
        <p style="margin: 0; font-weight: bold; color: #0066cc;">What happens next?</p>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>Our team will review your inquiry within 24 hours</li>
          <li>We'll contact you using the information you provided</li>
          <li>We'll discuss your requirements and how we can help</li>
        </ul>
      </div>
      
      <p>We're committed to providing you with the best service and look forward to working with you.</p>
      
      <div class="contact-info">
        <p><strong>Need immediate assistance?</strong></p>
        ${contactEmail ? `<p><strong>Email:</strong> <a href="mailto:${contactEmail}" style="color: #0066cc;">${contactEmail}</a></p>` : ''}
        ${contactPhone ? `<p><strong>Phone:</strong> <a href="tel:${contactPhone}" style="color: #0066cc;">${contactPhone}</a></p>` : ''}
      </div>
      
      <div style="text-align: center;">
        <a href="${siteUrl}" class="button">Visit Our Website</a>
      </div>
    </div>
    
    <div class="footer">
      <p>Best regards,<br>The ${siteName} Team</p>
      <p style="margin-top: 20px; font-size: 12px;">
        This is an automated confirmation. For assistance, use the contact details above.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

