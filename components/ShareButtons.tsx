"use client";

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

  function shareEmail() {
    const label = docType === "bill" ? "Bill" : "Quotation";
    const subject = `AMS Civil Construction — ${label} ${docNumber}`;
    const body =
      `Dear ${clientName || "Valued Client"},\n\n` +
      `Please find your ${label} (${docNumber}) from AMS Civil Construction attached below.\n` +
      `Grand Total: ₹${grandTotal}\n\n` +
      `📄 View / Download your document here: ${pdfUrl()}\n\n` +
      `Thank you for choosing AMS Civil Construction. We look forward to providing you with the highest quality of service.\n\n` +
      `Best Regards,\n\n` +
      `=========================================\n` +
      `🏗️ AMS CIVIL CONSTRUCTION\n` +
      `Mumbai's Trusted Construction Partner\n` +
      `Bungalow Construction | Renovation | Interior | Waterproofing\n` +
      `=========================================\n\n` +
      `🔗 CONNECT WITH US:\n` +
      `🌍 Website:    https://www.amscivilwork.in\n` +
      `📸 Instagram:  https://www.instagram.com/amscivilwork/\n` +
      `👍 Facebook:   https://www.facebook.com/profile.php?id=61570712849063\n` +
      `⭐ Reviews:    https://share.google/2MVNrHEWCCTqYsU3O\n\n` +
      `📞 Contact:    +91 87793 91690 | +91 90042 98911\n` +
      `📧 Email:      ams.constructionwork@gmail.com\n` +
      `=========================================`;
      
    const url = `mailto:${clientEmail || ""}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
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
        className="flex h-[38px] items-center justify-center rounded-md bg-orange px-4 text-sm font-medium text-white hover:bg-orange/90 w-full sm:w-auto transition-colors"
      >
        ✉ Share via Email
      </button>
    </div>
  );
}
