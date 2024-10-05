import React, { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import html2canvas from "html2canvas";
import { FaWhatsapp, FaFilePdf } from "react-icons/fa";
import jsPDF from 'jspdf';

function BillingPage() {
    const { _id } = useParams();
    const pdfRef = useRef();
    const [customerData, setCustomerData] = useState(null);
    const [minOrderValue, setMinOrderValue] = useState(0);
    const [deliveryCharge, setDeliveryCharge] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0); // New state for discount

    useEffect(() => {
        fetchData();
        fetchMinOrderDetails();
    }, [_id]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`https://backendcafe-zqt8.onrender.com/api/payments/${_id}`);
            setCustomerData(response.data);
            
            // Fetch discount amount if it exists
            if (response.data.discountamount) {
                setDiscountAmount(response.data.discountamount);
            }
        } catch (error) {
            console.error('Error fetching payment details:', error.message);
        }
    };

    const fetchMinOrderDetails = async () => {
        try {
            const response = await axios.get('https://backendcafe-zqt8.onrender.com/min-order-delivery');
            setMinOrderValue(response.data.minOrderValue);
            setDeliveryCharge(response.data.deliveryCharge);
        } catch (error) {
            console.error('Error fetching minimum order details:', error.message);
        }
    };

    const calculateSubtotal = () => {
        if (!customerData) return 0;
        return customerData.cartforpayment
            .map((item) => item.price * item.quantity)
            .reduce((prev, curr) => prev + curr, 0);
    };

    const calculateAdditionalCharge = () => {
        const subtotal = calculateSubtotal();
        const isWebsiteOrder = customerData.customerTable === "Website";
        return isWebsiteOrder && subtotal < minOrderValue ? deliveryCharge : 0;
    };

    const calculateGrandTotal = () => {
        const subtotal = calculateSubtotal();
        const additionalCharge = calculateAdditionalCharge();
        const totalBeforeDiscount = subtotal + additionalCharge;
        return totalBeforeDiscount - discountAmount; // Subtract discount amount if applicable
    };

    const downloadPDF = () => {
        const input = pdfRef.current;
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('invoice.pdf');
        });
    };

    const whatsappInvoice = () => {
        const invoiceLink = `https://cafehouse.vercel.app/billdata/${_id}`;
        const message = `Dear ${customerData.name}, Here is your bill: ${invoiceLink}`;
        const whatsappLink = `https://api.whatsapp.com/send?phone=91${customerData.customerPhoneNo}&text=${encodeURIComponent(message)}`;
        window.open(whatsappLink, '_blank');
    };

    if (!customerData) {
        return (
            <div className="flex justify-center items-center h-screen text-center font-lg font-extrabold">
                <h1 className='text-2xl text-gray-500 font-bold'>Loading the bill details...</h1>
            </div>
        );
    }

    return (
        <div>
            <div ref={pdfRef} className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mb-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                    <div>
                        <h1 className="text-2xl font-extrabold">Cafe House</h1>
                        <p className="text-gray-600">Da11 Defence Colony Ghz, Up</p>
                        <p className="text-gray-600">Phone: 9971299049</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-extrabold">Bill Details</h2>
                        <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="mb-4">
                    <h3 className="text-lg font-bold mb-2">Bill To:</h3>
                    <p><strong>Name:</strong> {customerData.name}</p>
                    <p><strong>Venue:</strong> {customerData.customerTable || 'Table 1'}</p>
                    <p><strong>Phone:</strong> {customerData.customerPhoneNo}</p>
                    <p><strong>Email:</strong> {customerData.email || 'undefined'}</p>
                    <p><strong>Payment:</strong> {customerData.paymentmode || 'undefined'}</p>
                </div>

                {/* Items Table */}
                <table className="w-full mb-4">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-4 py-2">Item</th>
                            <th className="border px-4 py-2">Price</th>
                            <th className="border px-4 py-2">Quantity</th>
                            <th className="border px-4 py-2">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customerData.cartforpayment.map((item, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">{item.name}</td>
                                <td className="border px-4 py-2">{item.price.toFixed(2)}</td>
                                <td className="border px-4 py-2">{item.quantity}</td>
                                <td className="border px-4 py-2">{(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="3" className="border px-4 py-2 text-right">Subtotal:</td>
                            <td className="border px-4 py-2">{calculateSubtotal().toFixed(2)}</td>
                        </tr>
                        {calculateAdditionalCharge() > 0 && (
                            <tr>
                                <td colSpan="3" className="border px-4 py-2 text-right">Delivery Charge:</td>
                                <td className="border px-4 py-2">{deliveryCharge.toFixed(2)}</td>
                            </tr>
                        )}
                        {discountAmount > 0 && (
                            <tr>
                                <td colSpan="3" className="border px-4 py-2 text-right">Discount:</td>
                                <td className="border px-4 py-2">-{discountAmount.toFixed(2)}</td>
                            </tr>
                        )}
                        <tr>
                            <td colSpan="3" className="border px-4 py-2 text-right font-bold">Grand Total:</td>
                            <td className="border px-4 py-2 font-bold">{calculateGrandTotal().toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>

                {/* Footer */}
                <div className="text-center pt-4 border-t mt-4">
                    <p className="text-gray-600">Thank you for your Order!</p>
                    <p className="text-gray-600">We appreciate your patronage.</p>
                    <p className="text-gray-600 text-sm mt-2">Note: The status of the payment will change to "Received" after the payment has been received by the merchant.</p>
                </div>
            </div>

            {/* Download and WhatsApp Buttons */}
            <div className="flex justify-center items-center mt-4">
                <button onClick={whatsappInvoice} className="bg-green-500 text-white px-4 py-2 rounded mr-2 flex items-center">
                    <FaWhatsapp className="mr-2" />
                    Send on WhatsApp
                </button>
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
                    onClick={downloadPDF}
                >
                    <FaFilePdf className="mr-2" />
                    Download Invoice
                </button>
            </div>
        </div>
    );
}

export default BillingPage;
