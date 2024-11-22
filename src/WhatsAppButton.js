import React from "react";
import { FaWhatsapp } from "react-icons/fa"; // Import WhatsApp icon from react-icons

const WhatsAppButton = () => {
    const whatsappLink ="https://api.whatsapp.com/send?phone=+919136441516&text=Hello%2C%0D%0A%0D%0AI+am+at+your+digital+store+and+need+some+help.%0D%0A%0D"
 
    return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition duration-300 ease-in-out z-50"
    >
      <FaWhatsapp className="w-6 h-6" />
    </a>
  );
};

export default WhatsAppButton;