

PASSWORD OF TWILIO = HOTLAUNDA123456,HOTLAUNDA



  const invoiceLink = `https://cafehouse.vercel.app/invoice/${_id}`;
        const message = `Here is your invoice: ${invoiceLink}`;
        const whatsappLink = `https://api.whatsapp.com/send?phone=91${paymentDetails.customerPhoneNo}&text=${encodeURIComponent(message)}`;       
    
    <div>
                <button onClick={() => window.open(whatsappLink, '_blank')} className="btn btn-primary">
                    Send via WhatsApp
                </button>
            </div>

















