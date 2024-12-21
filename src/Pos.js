import React, { useState, useEffect, useContext } from 'react';
import { MdDelete } from 'react-icons/md';
import axios from 'axios';
import { BuyerContext } from './components/Buyercontext.js';
import QRCode from 'qrcode.react';
import { UPIDetailsContext } from "./components/UPIDetailsContext.js";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeToCart ,emptyCart} from './redux/cartSlice.js';
import { useNavigate } from 'react-router-dom';
import { CiBarcode } from "react-icons/ci";
import Barcode from "./Barcode.js";
import { HiArchiveBoxArrowDown } from "react-icons/hi2";


const Pos = () => {

  const navigate = useNavigate(); 
  const dispatch = useDispatch();
  const { walletamount, customerDetails } = useContext(BuyerContext);
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [discountAmount ,setdiscountAmount] = useState(0); 
  const [quantity, setQuantity] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [showQRModal, setShowQRModal] = useState(false);
  const { upinumber, upiname } = useContext(UPIDetailsContext);
  const [location,setlocation]= useState("Pickup");
  const [cash, setCash] = useState(0);
  const [category, setCategory] = useState('All');
  const [whatsappNumbers, setWhatsappNumbers] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [showNumberModal, setShowNumberModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [showBill, setShowBill] = useState(false); 
  const [customerName, setCustomerName] = useState('');
  const [walletamt,setwalletamt] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0); // Final total after wallet
  const [message, setMessage] = useState("");
  const [walletApplied, setWalletApplied] = useState(false); // Track wallet application
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [prizeAmount, setPrizeAmount] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [message2, setMessage2] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [balance,setbalance]= useState(0);
  const [amountpaid,setamountpaid]= useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedDish, setDish] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [isBarcodeVisible, setIsBarcodeVisible] = useState(false);
  const [selectedCostPrice, setSelectedCostPrice] = useState(0);
  const [filterQuickBill, setFilterQuickBill] = useState(false); // New state to track QuickBill filter

 
  useEffect(() => {
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCode(randomCode);
    console.log(randomCode);
  }, [showQRModal]);

  const upiString = `upi://pay?pa=${upinumber}&pn=${upiname}&am=${finalAmount}&cu=INR&tn=${generatedCode}`;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('https://backendcafe-nefw.onrender.com/getdish');
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchItems();
  }, []);

  const fetchDishDetails = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://backendcafe-nefw.onrender.com/getdish/${id}`);
      const data = response.data;
      setDish(data);
      setSelectedSize(data.sizes[0]?.size || '');
      setSelectedPrice(data.sizes[0]?.price || 0);
      setSelectedCostPrice(data.sizes[0]?.costPrice || 0);
    } catch (error) {
      console.error('Error fetching dish details:', error);
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    const totalPrize = cart.reduce(
      (sum, item) => sum + item.points * item.quantity,
      0
    );
    setPrizeAmount(totalPrize);
  }, [cart]);

  useEffect(() => {
    const fetchwallet = async () => {
      try {
        const response = await axios.get(`https://backendcafe-nefw.onrender.com/api/customer/${customerPhone}`);
        setwalletamt(response.data.wallet);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching wallet:', error);
      }
    };
    fetchwallet(); 
  }, [customerPhone]);
  useEffect(() => {
    calculateTotal();
}, [cart, discount, walletApplied]);

const handleSendBill = async () => {
  if (!prizeAmount || isNaN(prizeAmount)) {
    setMessage("Please enter a valid prize amount.");
    return;
  }
  try {
    const response = await axios.get("https://backendcafe-nefw.onrender.com/unredeemed-unspinned-qr");
    if (response.data.success) {
      const qrData = response.data.data;
      const billLink = `https://cafehouse.vercel.app/loyal/CARD/${qrData.id}/${prizeAmount}`;
      const whatsappLink = `https://wa.me/${customerPhone}?text=Hello!%20Here%20is%20your%20bill%20link:%20${encodeURIComponent(
        billLink
      )}`;
      // Open the WhatsApp link
      window.open(whatsappLink, "_blank");
      setMessage("WhatsApp message link generated!");
    } else {
      setMessage("Failed to retrieve QR data.");
    }
  } catch (error) {
    console.error("Error fetching QR data:", error);
    setMessage("Error fetching QR data.");
  }
};

const handlePayment = async () => {
  try {
    // Calculate the updated balance
    const updatedBalance = finalAmount - amountpaid;
    // Prepare payment data
    const paymentData = {
      name: customerName || "",
      amount: finalAmount || 0,
      customerTable: location || "Table 1",
      paymentmode: paymentMode || "",
      customerPhoneNo: customerPhone,
      discountamount: discountAmount || 0,
      balance: updatedBalance, // Include the calculated balance
      amountpaid: amountpaid || 0,
      cartforpayment: cart || [],
      verificationCode: verificationCode || "",
    };

    console.log("Sending payment data:", paymentData); // Debug log

    // Make API request
    const response = await axios.post("https://backendcafe-nefw.onrender.com/api/payments", paymentData);

    if (response.data) {
      // Set the payment ID received from API
      setPaymentId(response.data.payment._id);
      console.log("Payment ID:", response.data.payment._id);
    }
    alert("Payment successful!");
    emptyCart();
    setShowBill(false);
    setShowModal(true); // Open the modal
  } catch (error) {
    console.error("Payment error:", error.response || error);
    if (error.response) {
      alert(`Payment failed: ${error.response.data.error || "Unknown error"}`);
    } else {
      alert("Payment failed. Please check your connection and try again.");
    }
  }
};

// Update balance dynamically when `finalAmount` or `amountpaid` changes
useEffect(() => {
  if (finalAmount && amountpaid) {
    const calculatedBalance = finalAmount - amountpaid;
    setbalance(calculatedBalance); // Update state
    console.log("Updated Balance:", calculatedBalance);
  }
}, [finalAmount, amountpaid]);

  
const sendReceiptToWhatsApp = async () => {
  if (!paymentId) {
    alert("Payment ID is missing. Cannot send the receipt.");
    return;
  }

  try {
    let scratchCardLink = "";
    // Fetch QR data and generate scratch card link only if prizeAmount > 0
    if (prizeAmount > 0 && !isNaN(prizeAmount)) {
      const qrResponse = await axios.get("https://backendcafe-nefw.onrender.com/unredeemed-unspinned-qr");
      if (qrResponse.data.success) {
        const qrData = qrResponse.data.data;
        scratchCardLink = `https://cafehouse.vercel.app/loyal/CARD/${qrData.id}/${prizeAmount}`;
      } else {
        setMessage("Failed to generate QR data for scratch card.");
        return;
      }
    }

    // Generate the invoice link
    const invoiceLink = `https://cafehouse.vercel.app/billdata/${paymentId}`;

    // Construct the WhatsApp message with conditional scratch card link
    const message = prizeAmount > 0
      ? `Dear ${customerName}, 
      Here is your bill: ${invoiceLink} 
      And here is your scratch card: ${scratchCardLink}. 
      Thank you for choosing CafeHouse!`
      : `Dear ${customerName}, 
      Here is your bill: ${invoiceLink}. 
     Thank you for choosing CafeHouse!`;

    // Generate the WhatsApp link
    const whatsappLink = `https://api.whatsapp.com/send?phone=91${customerPhone}&text=${encodeURIComponent(message)}`;

    // Open WhatsApp with the generated link
    window.open(whatsappLink, "_blank");

    setMessage("WhatsApp message sent successfully!");
  } catch (error) {
    console.error("Error generating QR data or sending WhatsApp message:", error);
    alert("Failed to send the WhatsApp message. Please try again.");
  }
};

  const calculateTotal = () => {
    let baseAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    baseAmount -= discount;
    let updatedAmount = walletApplied && baseAmount > walletamt ? baseAmount - walletamt : baseAmount;
    setTotal(baseAmount); // Set raw total
    setFinalAmount(updatedAmount); // Set final total considering wallet
    let totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
    setQuantity(totalQuantity);
};

 

  const handleWalletToggle = () => {
    setWalletApplied(!walletApplied);
};

{walletApplied && finalAmount !== total && (
    <p className="text-gray-800 font-semibold">After Wallet Deduction: ₹{finalAmount}</p>
)}
  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
  };

  
  const handlePaymentChange = (e) => {
    const selectedMode = e.target.value;
    setPaymentMode(selectedMode);

    // Open QR modal if UPI is selected
    if (selectedMode === 'UPI') {
      setShowQRModal(true);
    } else {
      setShowQRModal(false);
    }
  };

  const handlelocationChange = (e) => {
    const selectedMode = e.target.value;
    setlocation(selectedMode);
    console.log(selectedMode); // Logs the current selected value
};

 const handleVerify = () => {
    if (verificationCode === generatedCode) {
      setIsVerified(true);
      alert('Verification successful! You can proceed with the payment.');
    } else {
      alert('Invalid code. Please try again.');
    }
  };


  useEffect(() => {
    const savedNumbers = JSON.parse(localStorage.getItem('whatsappNumbers')) || [];
    setWhatsappNumbers(savedNumbers);
  }, []);

  // Save numbers to localStorage whenever the list updates
  useEffect(() => {
    localStorage.setItem('whatsappNumbers', JSON.stringify(whatsappNumbers));
  }, [whatsappNumbers]);

  // Open WhatsApp with the KOT message for selected number
  const whatsappkot = () => {
    const message = cart
      .map((item) => `Name: ${item.name}\nQuantity: ${item.quantity}\nPrice: ${item.price}\n\n`)
      .join('');
    if (selectedNumber) {
      const whatsappLink = `https://api.whatsapp.com/send?phone=${selectedNumber.phone}&text=${encodeURIComponent(message)}`;
      window.open(whatsappLink, '_blank');
      setShowNumberModal(false);
    }
  };

  // Add a new number to the list
  const addNumber = () => {
    if (newName && newPhone) {
      const newNumber = { name: newName, phone: newPhone };
      setWhatsappNumbers([...whatsappNumbers, newNumber]);
      setNewName('');
      setNewPhone('');
    }
  };

  // Delete a number from the list
  const deleteNumber = (index) => {
    const updatedNumbers = whatsappNumbers.filter((_, i) => i !== index);
    setWhatsappNumbers(updatedNumbers);
  };
  
  const addToCart = (item, size, price, costPrice) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item._id && cartItem.size === size);
    if (existingItem) {
      setCart((prevCart) =>
        prevCart.map((cartItem) =>
          cartItem.id === item._id && cartItem.size === size
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart((prevCart) => [
        ...prevCart,
        {
          id: item._id,
          name: item.name,
          size,
          price,
          costPrice,
          quantity: 1,
        },
      ]);
    }
  };

  const incrementQuantity = (id, size) => {
    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.id === id && cartItem.size === size
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      )
    );
  };

  const decrementQuantity = (id, size) => {
    setCart((prevCart) =>
      prevCart
        .map((cartItem) =>
          cartItem.id === id && cartItem.size === size
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0)
    );
  };

  const filteredItems = items
  .filter((item) => category === 'All' || item.category === category)
  .filter((item) => !filterQuickBill || item.quickbill); // Apply filter based on quickBill


  const categories = ['All', ...new Set(items.map(item => item.category))];
  console.log(cart);

  return (
       <div className=" flex flex-col justify-between">  
       <div className='flex'>
       <div>
       <h2 className="text-2xl font-bold mb-2">POS System</h2>
       </div>
        <div className="ml-3">
        <button
        onClick={() => setIsBarcodeVisible((prev) => !prev)}
        className="flex items-center justify-center mb-3"
        >
        <CiBarcode className="h-8 w-8 " />
        <span>{isBarcodeVisible ? '' : ''}</span>
        </button>
        {isBarcodeVisible && <Barcode addToCart={addToCart} />}
        </div>
        <div>
        <button
          onClick={() => setFilterQuickBill(!filterQuickBill)} // Toggle the filter state
          className="p-2 rounded"
        >
        <HiArchiveBoxArrowDown className="h-8 w-8 mr-2" />
        </button>
        </div>
        </div>
         {/* Dynamic Category Selection */}
         <div className="flex space-x-2 mb-2  ">
         {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-2 py-1 rounded-lg ${category === cat ? 'bg-[#f6931e] text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {cat}
          </button>
        ))}
        </div>
          {/* Items Grid */}
          <div className="grid grid-cols-2 lg:grid lg:grid-cols-4 gap-2 mb-4">
          {items
          .filter((item) => category === 'All' || item.category === category)
          .map((item) => (
            <div key={item._id} className="p-4 border rounded shadow-md">
              <img src={item.image} alt={item.name} className="w-32 h-32 object-cover mx-auto" />
              <h4 className="text-center font-semibold">{item.name}</h4>
              <select
                onChange={(e) => {
                  const sizeOption = item.sizes.find((s) => s.size === e.target.value);
                  if (sizeOption) {
                    setSelectedSize(sizeOption.size);
                    setSelectedPrice(sizeOption.price);
                    setSelectedCostPrice(sizeOption.costPrice);
                  }
                }}
                className="w-full p-2 border rounded mt-2"
              >
                <option value="">Choose size</option>
                {item.sizes.map((sizeOption) => (
                  <option key={sizeOption.size} value={sizeOption.size}>
                    {sizeOption.size} - ₹{sizeOption.price}
                  </option>
                ))}
              </select>
              <button
                onClick={() =>
                  addToCart(item, selectedSize, selectedPrice, selectedCostPrice)
                }
                className="bg-blue-500 text-white w-full mt-2 p-2 rounded-full"
              >
                Add to Cart
              </button>
              <div className="flex justify-between items-center mt-2">
                <button
                  onClick={() => decrementQuantity(item._id, selectedSize)}
                  className="bg-red-500 text-white p-1 rounded-full"
                >
                  -
                </button>
                <span className="px-2">
                  {
                    cart.find(
                      (cartItem) =>
                        cartItem.id === item._id && cartItem.size === selectedSize
                    )?.quantity || 0
                  }
                </span>
                <button
                  onClick={() => incrementQuantity(item._id, selectedSize)}
                  className="bg-green-500 text-white p-1 rounded-full"
                >
                  +
                </button>
              </div>
            </div>
          ))}
         </div>
   
      <div>
      </div>
        <div className="fixed bottom-0 left-0 w-full  bg-white p-4 shadow-lg  ">
      <div className="flex justify-between items-center">
      <div>
      <p className="text-gray-600">Total Items: {quantity}</p>
      <p className="text-lg font-bold">Total: ₹{total}</p>
      </div>
      <div >
      <button
        className="bg-green-500 text-white px-6 py-2 mr-2 rounded-lg"
        onClick={() => setShowNumberModal(true)}
      >
        KOT
      </button>
      <button
        className="bg-[#f6931e] text-white px-6 py-2 rounded-lg"
        onClick={() => setShowBill(!showBill)}
      >
        {showBill ? 'Hide Bill' : 'Show Bill'}
      </button>
      </div>
      </div>
      
      {/* Modal for sharing receipt */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-lg font-bold mb-4">Share Receipt</h2>
            <p>Do you want to share the receipt via WhatsApp to {newPhone}?</p>
            <div className="mt-4 flex justify-center gap-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={sendReceiptToWhatsApp}
              >
                Yes, Share
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for WhatsApp number selection */}
      {showNumberModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Select WhatsApp Number</h2>

            {/* List of saved numbers */}
            {whatsappNumbers.length > 0 ? (
              <ul className="mb-4">
                {whatsappNumbers.map((num, index) => (
                  <li
                    key={index}
                    className={`flex justify-between items-center mb-2 p-2 rounded-lg cursor-pointer 
                      ${selectedNumber && selectedNumber.phone === num.phone ? 'bg-green-100' : 'hover:bg-gray-300'}`}
                    onClick={() => setSelectedNumber(num)}
                  >
                    <span>{num.name} - {num.phone}</span>
                    <button
                      className="text-red-500"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the click event from selecting this number
                        deleteNumber(index);
                      }}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mb-4 text-gray-600">No numbers saved yet.</p>
            )}

            {/* Add new number */}
            <div className="flex mb-4">
              <input
                type="text"
                placeholder="Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border p-2 mr-2 w-full rounded-lg"
              />
              <input
                type="text"
                placeholder="Phone"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="border p-2 mr-2 w-full rounded-lg"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={addNumber}>
                Add
              </button>
            </div>

            {/* Confirm and Close buttons */}
            <div className="flex justify-end">
              <button className="bg-green-500 text-white px-4 py-2 mr-2 rounded-lg" onClick={whatsappkot}>
                Send KOT
              </button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded-lg" onClick={() => setShowNumberModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
        )}
        </div>

           {/* Bill Section */}
           {showBill && (
           <div className="fixed top-0 left-0 w-full h-screen bg-white p-4 overflow-y-auto z-50">
           <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold mb-2">Bill Summary</h3>
            <div>
            <button
                onClick={() => setShowCustomerForm(!showCustomerForm)}
                className=" px-4 py-2 bg-[#f6931e] text-white rounded-lg font-bold hover:bg-[#f6931e] focus:outline-none"
            >
              + Add
            </button>
            </div>
            <button
              className="text-gray-500"
              onClick={() => setShowBill(false)}
            >
              Close
            </button>
          </div>
           {/* Render form on "Add Customer" button click */}
           {showCustomerForm && (
                <div className="mt-4">
                     <label className="block text-lg font-bold mb-2">Name:</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded-md text-gray-600"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                    />
                    <label className="block text-lg font-bold mb-2">Phone No:</label>
                    <input
                        type="number"
                        className="w-full p-2 border rounded-md text-gray-600"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                    
                    {/* Wallet option */}
                    <label className="flex items-center cursor-pointer mt-2">
                        <input
                            type="checkbox"
                            checked={walletApplied}
                            onChange={handleWalletToggle}
                            className="form-checkbox text-blue-600 h-5 w-5 mr-2"
                        />
                        <span className="text-gray-700">Apply Wallet: ₹{walletamt}</span>
                    </label>
                    
                    {/* Wallet usage warning */}
                    {walletApplied && total < walletamt && (
                        <p className="text-red-500 text-sm mt-1">Add more items to use wallet balance.</p>
                    )}
                </div>
            )}
        {cart.length === 0 ? (
  <p>No items in the cart.</p>
) : (
  cart.map((item, index) => (
    <div key={index} className="flex justify-between items-center border-b pb-2 mb-2">
      {/* Item Details */}
      <div>
        <h4 className="text-lg font-bold">{item.name}</h4>
        <p>Size: {item.size}</p>
        <p>Quantity: {item.quantity}</p>
        <p>Price: ₹{item.price * item.quantity}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => decrementQuantity(item.id, item.size)}
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        >
          -
        </button>
        <span className="px-4 py-1 border rounded">{item.quantity}</span>
        <button
          onClick={() => incrementQuantity(item.id, item.size)}
          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
        >
          +
        </button>
      </div>
    </div>
  ))
)}


            {/* Payment Section */}
               <label className="block text-lg font-bold mb-2 mt-3">Discount:</label>
              <input
                type="text"
                placeholder="Discount"
                value={discountAmount}
                onChange={(e) => setdiscountAmount(e.target.value)}
                className="border p-2 mr-2 w-full rounded-lg"
              />
          
            <label className="block text-lg font-bold mb-2 mt-3">Amount Paid:</label>
              <input
                type="text"
                placeholder="Paid Amount"
                value={amountpaid}
                onChange={(e) => setamountpaid(e.target.value)}
                className="border p-2 mr-2 w-full rounded-lg"
              />

            <label className="block text-lg font-bold mb-2 mt-3">Payment Mode:</label>
            <select
              className="w-full p-2 border rounded-md text-gray-600"
              value={paymentMode}
              onChange={handlePaymentChange}
            >
              <option value="">Choose payment mode</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Wallet">Wallet</option>
            </select>
            

            <div className="mt-4">
            <label className="block text-lg font-bold mb-2">Location:</label>
            <select
              className="w-full p-2 border rounded-md text-gray-600"
              value={location}
                onChange={handlelocationChange}  
             >
             <option value="PickUp">PickUp</option>
              <option value="Table 1">Table 1</option>
              <option value="Table 2">Table 2</option>
              <option value="Table 3">Table 3</option>
            </select>
            <div>
          

            {showQRModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 sm:w-1/2 md:w-1/3">
            <h2 className="text-2xl font-semibold mb-4">Scan UPI QR Code</h2>
            <div className="flex justify-center mb-4">
              {/* Render QR Code with UPI details */}
              <QRCode 
                value={upiString}
                size={256}
                level="H" 
                includeMargin={true} 
              />
              </div>
             <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Enter Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Enter 4-digit code"
              />
              </div>
              <button
              onClick={handleVerify}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 mr-2"
              >
              Verify
              </button>
               <button
               onClick={() => {
                if (isVerified) {
                  setShowQRModal(false);
                } else {
                  alert('Please complete verification first.');
                }
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
          </div>
          
          <button
              className="mt-4 w-full bg-[#f6931e] text-white px-6 py-2 rounded-lg"
              onClick={handlePayment}
            >
              Pay ₹{finalAmount}
            </button>            
          </div>
        </div>
      )}
    </div>
  );
};

export default Pos;














