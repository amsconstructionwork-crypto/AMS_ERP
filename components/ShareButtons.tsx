"use client";
import { useState } from "react";

export default function ShareButtons({
  docNumber,
  docType,
  clientName,
  clientPhone,
  clientEmail,
  grandTotal,
  id,
}: {
  docNumber: string;
  docType: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  grandTotal: string;
  id: number;
}) {
  const [isSending, setIsSending] = useState(false);

  function pdfUrl() {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/api/quotations/${id}/pdf`;
  }

  function shareWhatsApp() {
    const label = docType === "bill" ? "Bill" : "Quotation";
    const message =
      `Namaste${clientName ? " " + clientName : ""}, please find your ${label} ${docNumber} from AMS Civil Construction.\n` +
      `Total: ₹${grandTotal}\n` +
      `View / Download: ${pdfUrl()}`;
    const phone = clientPhone ? clientPhone.replace(/\D/g, "") : "";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  async function shareEmail() {
    if (!clientEmail) {
      alert("Please provide a client email address in the quotation details first.");
      return;
    }

    setIsSending(true);
    try {
      const htmlBody = `
        <div style="font-family: sans-serif; color: #333; max-width: 600px;">
          <p>Dear ${clientName || "Valued Client"},</p>
          <p>Please find your ${docType === "bill" ? "Bill" : "Quotation"} (${docNumber}) from <strong>AMS Civil Construction</strong> attached to this email.</p>
          <p><strong>Grand Total: ₹${grandTotal}</strong></p>
          <br/>
          <div style="text-align: left; margin: 15px 0;">
            <a href="${pdfUrl()}" style="display: inline-block; padding: 12px 24px; background-color: #F26430; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 6px; font-size: 15px;">📥 View / Download Document</a>
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
            <p style="margin: 5px 0;"><img src="https://img.icons8.com/color/48/domain--v1.png" width="16" height="16" style="vertical-align: middle; margin-right: 6px;" alt="Web"/> <a href="https://www.amscivilwork.in" style="color: #0F2138; text-decoration: none; vertical-align: middle;">www.amscivilwork.in</a></p>
            <p style="margin: 5px 0;"><img src="https://img.icons8.com/color/48/instagram-new--v1.png" width="16" height="16" style="vertical-align: middle; margin-right: 6px;" alt="Instagram"/> <a href="https://www.instagram.com/amscivilwork/" style="color: #0F2138; text-decoration: none; vertical-align: middle;">Instagram Profile</a></p>
            <p style="margin: 5px 0;"><img src="https://img.icons8.com/color/48/facebook-new.png" width="16" height="16" style="vertical-align: middle; margin-right: 6px;" alt="Facebook"/> <a href="https://www.facebook.com/profile.php?id=61570712849063" style="color: #0F2138; text-decoration: none; vertical-align: middle;">Facebook Page</a></p>
            <p style="margin: 5px 0;"><img src="https://img.icons8.com/color/48/google-logo.png" width="16" height="16" style="vertical-align: middle; margin-right: 6px;" alt="Google"/> <a href="https://share.google/2MVNrHEWCCTqYsU3O" style="color: #0F2138; text-decoration: none; vertical-align: middle;">Google Reviews</a></p>
            <br/>
            <p style="margin: 3px 0; font-weight: bold;">📞 +91 87793 91690 | +91 90042 98911</p>
            <p style="margin: 3px 0;">📧 ams.constructionwork@gmail.com</p>
          </div>
        </div>
      `;

      const res = await fetch(`/api/quotations/${id}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: clientEmail, html: htmlBody })
      });

      if (!res.ok) {
        throw new Error("Failed to send email");
      }
      alert("Email sent successfully with the PDF attached!");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to send email");
    } finally {
      setIsSending(false);
    }
  }

  function downloadPdf() {
    window.open(pdfUrl(), "_blank");
  }

  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 w-full sm:w-auto">
      <button
        onClick={downloadPdf}
        className="flex h-[38px] items-center justify-center rounded-md border border-navy/20 bg-white px-4 text-sm font-medium text-navy hover:bg-navy/5 w-full sm:w-auto transition-colors"
      >
        ⬇ Download PDF
      </button>
      <button
        onClick={shareWhatsApp}
        className="flex h-[38px] items-center justify-center rounded-md border border-[#25D366]/40 bg-[#25D366]/5 px-4 text-sm font-medium text-[#128C3E] hover:bg-[#25D366]/15 w-full sm:w-auto transition-colors"
      >
        <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        Share on WhatsApp
      </button>
      <button 
        onClick={shareEmail} 
        disabled={isSending}
        className="flex h-[38px] items-center justify-center rounded-md bg-orange px-4 text-sm font-medium text-white hover:bg-orange/90 w-full sm:w-auto transition-colors disabled:opacity-50"
      >
        {isSending ? "⏳ Sending..." : "✉ Share via Email"}
      </button>
    </div>
  );
}
