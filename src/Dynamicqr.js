import React, { useState, useContext , useEffect} from "react";
import QRCode from "qrcode.react";
import Confetti from "react-confetti";
import axios from "axios";
import { BuyerContext } from "./components/Buyercontext.js";
import { UPIDetailsContext } from "./components/UPIDetailsContext.js";
import { useLocation, useNavigate } from "react-router-dom";


const Dynamicqr = () => {
  const { buyer } = useContext(BuyerContext); // Retrieve buyer email
  const { upinumber, upiname } = useContext(UPIDetailsContext); // Retrieve UPI details
  const [amount, setAmount] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [userInputCode, setUserInputCode] = useState("");
  const [success, setSuccess] = useState(false);
  const [calcInput, setCalcInput] = useState(""); // Calculator input
  const [activeTab, setActiveTab] = useState("normal"); // Tab state
  const [showModal, setShowModal] = useState(false); // Modal state
  const [showSplash, setShowSplash] = useState(true); // State for splash screen

    const location = useLocation();
  const navigate = useNavigate();

  // Extract the 'table' query parameter
  const queryParams = new URLSearchParams(location.search);
  const table = queryParams.get("table");
  useEffect(() => {
      // Show splash screen for 3 seconds
      const splashTimeout = setTimeout(() => {
          setShowSplash(false);
      }, 3000);
      return () => clearTimeout(splashTimeout);
  }, []);


  const resetComponent = () => {
    setAmount("");
    setGeneratedCode("");
    setUserInputCode("");
    setSuccess(false);
    setCalcInput("");
    setShowModal(false);
  };

  const handleGenerateQR = () => {
    const finalAmount = activeTab === "calculator" ? calcInput : amount;

    if (!finalAmount || finalAmount <= 0 || isNaN(finalAmount)) {
      alert("Please enter a valid amount!");
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit numeric code
    setGeneratedCode(code);
    setAmount(finalAmount); // Use the calculated amount
    setSuccess(false);
    setShowModal(true); // Show the modal
  };

  const handleVerifyCode = async () => {
    if (userInputCode === generatedCode) {
      setSuccess(true);

      try {
        await axios.post("https://backendcafe-nefw.onrender.com/api/send-confirmation-email", {
          email: buyer.email,
          amount,
          verificationCode: generatedCode,
        });
        alert("Confirmation email sent successfully!");
        resetComponent();
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

  const handleCalculate = (value) => {
    if (value === "C") {
      setCalcInput(""); // Clear entire input
    } else if (value === "⌫") {
      setCalcInput((prev) => prev.slice(0, -1)); // Clear one character/place
    } else if (value === "=") {
      try {
        const result = eval(calcInput);
        setCalcInput(result.toFixed(2)); // Limit result to 2 decimal places
      } catch {
        setCalcInput("Error"); // Handle invalid expressions
      }
    } else if (value === "%") {
      try {
        const result = eval(calcInput) / 100; // Calculate percentage
        setCalcInput(result.toFixed(2));
      } catch {
        setCalcInput("Error");
      }
    } else if (value === ".") {
      if (!calcInput.includes(".")) {
        setCalcInput((prev) => prev + value); // Add decimal point
      }
    } else if (value === "Discount") {
      try {
        const result = eval(calcInput) * 0.90; // Apply 10% discount
        setCalcInput(result.toFixed(2));
      } catch {
        setCalcInput("Error");
      }
    } else if (value === "Tax") {
      try {
        const result = eval(calcInput) * 1.18; // Apply 18% tax
        setCalcInput(result.toFixed(2));
      } catch {
        setCalcInput("Error");
      }
    } else {
      setCalcInput((prev) => prev + value); // Append input
    }
  };
 

  if (showSplash) {
    return (
        <div className="flex justify-center items-center h-screen bg-black">
            <video
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
            >
                <source src="https://easypay.in/images/slide3.mp4" type="video/mp4" />
            </video>
        </div>
    );
}
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        {/* Tabs for Switching */}
        <div className="flex justify-around mb-6">
                  <button
            onClick={() => setActiveTab("calculator")}
            className={`py-2 px-4 rounded-t-lg ${
              activeTab === "calculator"
                ? "bg-[#18196c] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Calculator
          </button>
          <button
            onClick={() => setActiveTab("normal")}
            className={`py-2 px-4 rounded-t-lg ${
              activeTab === "normal"
                ? "bg-[#18196c] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Normal Input
          </button>

        </div>

        {/* Tab Content */}
        {activeTab === "normal" && (
          <>
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              Dynamic UPI QR Code Generator
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Enter Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:bg-[#18196c]"
              />
            </div>
          </>
        )}

{activeTab === "calculator" && (
  <>
    <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
      Calculator-Based QR Code Generator
    </h2>
    <div className="mb-6">
    <label className="block text-gray-700 font-medium mb-2">
        Calculator
      </label>
      <div className="mt-2">
        <input
          type="text"
          value={calcInput}
          readOnly
          className="w-full px-4 py-2 border border-gray-600 rounded-lg text-gray-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>
    </div>

    <div className="mb-6">
      
      <div className="grid grid-cols-4 gap-2">
        {[
          "1", "2", "3", "+",
          "4", "5", "6", "-",
          "7", "8", "9", "*",
          "C", "0", "=", "%",
          ".", "⌫", "Dis", "Tax"
        ].map((btn) => (
          <button
            key={btn}
            onClick={() => handleCalculate(btn)}
            className="bg-gray-200 p-3 rounded-lg text-center hover:bg-gray-300 transition"
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  </>
)}


        {/* Generate QR Button */}
        <button
          onClick={handleGenerateQR}
          className="w-full bg-[#18196c] text-white py-2 rounded-lg shadow-md hover:bg-[#18196c] transition"
        >
          Generate QR Code
        </button>
      </div>

      {/* Modal for QR Code and Verification */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md flex flex-col items-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Verification</h3>
            <div className="flex justify-center items-center mb-4">
              <QRCode
                value={generateUPILink()}
                size={200}
                className="border border-gray-300 shadow-md"
              />
            </div>
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
              className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg shadow-md hover:bg-green-600 transition"
            >
              Verify Code
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg shadow-md hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Success Confetti */}
      {success && <Confetti />}
    </div>
  );
};

export default Dynamicqr;
