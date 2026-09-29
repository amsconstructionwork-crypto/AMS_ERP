import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "ams.constructionwork@gmail.com",
    pass: "rkpd pvqj wmlu mgce"
  }
});

const htmlBody = `
<div style="font-family: sans-serif; color: #333; max-width: 600px;">
  <p>Dear Nitesh Mandal,</p>
  <p>Please find your Quotation (DEMO-123) from <strong>AMS Civil Construction</strong> attached to this email.</p>
  <p><strong>Grand Total: ₹1,16,000.00</strong></p>
  <br/>
  <div style="text-align: left; margin: 15px 0;">
    <a href="https://erp.amscivilwork.in/api/quotations/123/pdf" style="display: inline-block; padding: 12px 24px; background-color: #F26430; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 6px; font-size: 15px;">📥 View / Download Document</a>
  </div>
  <br/>
  <p>Thank you for choosing AMS Civil Construction. We look forward to providing you with the highest quality of service.</p>
  <br/>
  <p>Best Regards,</p>
  <div style="border-top: 2px solid #F26430; padding-top: 15px; margin-top: 15px;">
    <h3 style="margin: 0; color: #0F2138;">AMS CIVIL CONSTRUCTION</h3>
    <p style="margin: 4px 0; font-size: 14px; color: #555;">Mumbai's Trusted Construction Partner</p>
    <p style="margin: 4px 0; font-size: 13px; color: #777;">Bungalow Construction | Renovation | Interior | Waterproofing</p>
    <br/>
    <p style="margin: 3px 0;">🌐 <a href="https://www.amscivilwork.in" style="color: #0F2138; text-decoration: none;">www.amscivilwork.in</a></p>
    <p style="margin: 3px 0;">📸 <a href="https://www.instagram.com/amscivilwork/" style="color: #0F2138; text-decoration: none;">Instagram Profile</a></p>
    <p style="margin: 3px 0;">👍 <a href="https://www.facebook.com/profile.php?id=61570712849063" style="color: #0F2138; text-decoration: none;">Facebook Page</a></p>
    <p style="margin: 3px 0;">⭐ <a href="https://share.google/2MVNrHEWCCTqYsU3O" style="color: #0F2138; text-decoration: none;">Google Reviews</a></p>
    <br/>
    <p style="margin: 3px 0; font-weight: bold;">📞 +91 87793 91690 | +91 90042 98911</p>
    <p style="margin: 3px 0;">📧 ams.constructionwork@gmail.com</p>
  </div>
</div>
`;

transporter.sendMail({
  from: '"AMS Civil Construction" <ams.constructionwork@gmail.com>',
  to: "mandalnitesh654@gmail.com",
  subject: "AMS Civil Construction - Quotation DEMO-123 (With Button)",
  html: htmlBody,
  attachments: [
    {
      filename: 'Quotation-DEMO-123.pdf',
      content: 'This is a demo PDF file to show you how attachments look.',
      contentType: 'text/plain'
    }
  ]
}).then(info => {
  console.log("Success:", info.messageId);
}).catch(err => {
  console.error("Error:", err);
});
