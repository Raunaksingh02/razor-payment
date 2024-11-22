import React, { useState, useContext } from "react";
import QRCode from "qrcode.react";
import Confetti from "react-confetti";
import axios from "axios";
import { BuyerContext } from "./components/Buyercontext.js";
import { UPIDetailsContext } from "./components/UPIDetailsContext.js";

const Dynamicqr = () => {
  const { buyer } = useContext(BuyerContext); // Retrieve buyer email
  const { upinumber, upiname } = useContext(UPIDetailsContext); // Retrieve UPI details
  const [amount, setAmount] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [userInputCode, setUserInputCode] = useState("");
  const [success, setSuccess] = useState(false);

  const handleGenerateQR = () => {
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount!");
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit numeric code
    setGeneratedCode(code);

    setSuccess(false);
  };

  const handleVerifyCode = async () => {
    if (userInputCode === generatedCode) {
      setSuccess(true);

      // Start a timer to stop confetti after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);

      try {
        console.log(generatedCode);
        console.log( buyer.email);
        console.log(amount);
        await axios.post("http://localhost:1000/api/send-confirmation-email", {
        
         
          email: buyer.email,
          amount,
          verificationCode: generatedCode,
        });
        alert("Confirmation email sent successfully!");
      } catch (error) {
        console.error("Error sending email:", error);
        alert("Failed to send confirmation email!");
      }
    } else {
      alert("Invalid verification code!");
    }
  };

  const generateUPILink = () => {
    if (!upinumber || !upiname) {
      alert("UPI details are missing!");
      return "";
    }
    return `upi://pay?pa=${upinumber}&pn=${encodeURIComponent(
      upiname
    )}&am=${amount}&cu=INR&tn=Verification_Code:${generatedCode}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Dynamic UPI QR Code Generator
        </h2>

        {/* Input for Amount */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Enter Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* QR Code Display */}
        {generatedCode && (
          <div className="flex justify-center my-4">
            <QRCode
              value={generateUPILink()}
              size={200}
              className="border border-gray-300 shadow-md"
            />
          </div>
        )}

        {/* Generate QR Button */}
        <button
          onClick={handleGenerateQR}
          className="w-full bg-orange-500 text-white py-2 rounded-lg shadow-md hover:bg-orange-600 transition"
        >
          Generate QR Code
        </button>

        {/* Verification Code Input */}
        {generatedCode && (
          <div className="mt-6">
            <label className="block text-gray-700 font-medium mb-2">
              Enter Verification Code
            </label>
            <input
              type="text"
              value={userInputCode}
              onChange={(e) => setUserInputCode(e.target.value)}
              placeholder="Enter code from QR"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleVerifyCode}
              className="w-full bg-green-500 text-white mt-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
            >
              Verify Code
            </button>
          </div>
        )}
      </div>

      {/* Success Confetti */}
      {success && <Confetti />}
    </div>
  );
};

export default Dynamicqr;
