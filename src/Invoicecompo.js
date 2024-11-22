import React, { useContext, useRef, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import html2canvas from "html2canvas";
import { FaWhatsapp } from "react-icons/fa";
import jsPDF from 'jspdf';
import { FaFilePdf } from "react-icons/fa6";
import { CustomerContext } from './CustomerContext.js';

function Invoicecompo() {
    const { _id } = useParams();
    const pdfRef = useRef();
    const location = useLocation(); 
    const customerDetails = useContext(CustomerContext);
    const paymentDetails = useSelector((state) => state.cart.cart); 
    const [minOrderValue, setMinOrderValue] = useState("");
    const [deliveryCharge, setDeliveryCharge] = useState("");
    console.log("the location of the customer", customerDetails.customerTable);

    const queryParams = new URLSearchParams(location.search);
    const paymentmode = queryParams.get('paymentmode'); 
    const discountAmount = parseFloat(queryParams.get('discountAmount')) || 0; // Extract discountAmount and convert it to a float

    useEffect(() => {
        const fetchMinOrderDetails = async () => {
            try {
                const response = await axios.get('https://backendcafe-nefw.onrender.com/min-order-delivery');
                setMinOrderValue(response.data.minOrderValue);
                setDeliveryCharge(response.data.deliveryCharge);
                console.log("the min order value -", response.data.minOrderValue);
                console.log("the delivery charge is -", response.data.deliveryCharge);
            } catch (error) {
                console.error('Error fetching minimum order details', error);
            }
        };

        fetchMinOrderDetails();
    }, []);

    const downloadPDF = () => {
        const input = pdfRef.current;
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4', true);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            let imgWidth = canvas.width;
            let imgHeight = canvas.height;

            let imgX = 0;
            let imgY = 0;
            let imgRatio = 1;

            if (imgWidth > pdfWidth || imgHeight > pdfHeight) {
                imgRatio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
                imgWidth = imgWidth * imgRatio;
                imgHeight = imgHeight * imgRatio;
            }

            imgX = (pdfWidth - imgWidth) / 2;
            imgY = (pdfHeight - imgHeight) / 2;

            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth, imgHeight);
            pdf.save('Invoice.pdf');
        });
    };

    if (!paymentDetails) {
        return <div className="text-center font-lg font-extrabold">Loading the invoice...</div>;
    }

    const totalforbill = paymentDetails.map((item) => item.price * item.quantity).reduce((prev, curr) => prev + curr, 0);
    console.log(totalforbill);
    
    // Calculate grand total considering customerTable and minimum order value
    let applicableDeliveryCharge = 0;
    let grandTotalforbill = totalforbill;

    if (customerDetails.customerTable === "Website") {
        if (totalforbill < minOrderValue) {
            applicableDeliveryCharge = deliveryCharge;
            grandTotalforbill += deliveryCharge;
        }
    }

    // Subtract discount amount from grand total if applicable
    if (discountAmount > 0) {
        grandTotalforbill -= discountAmount;
    }

    const invoiceLink = `https://cafehouse.vercel.app/billdata/${_id}`;
    const message = `Dear Customer, Here is your invoice: ${invoiceLink}`;
    const whatsappLink = `https://api.whatsapp.com/send?phone=91${customerDetails.customerPhone}&text=${encodeURIComponent(message)}`;

    return (
        <div>
            <div
                ref={pdfRef}
                className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mb-4">

                {/* Header */}
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                    <div>
                        <h1 className="text-2xl font-extrabold">Cafe House</h1>
                        <p className="text-gray-600">123 Coffee St, Coffee City</p>
                        <p className="text-gray-600">Phone: (123) 456-7890</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-extrabold">Invoice</h2>
                        <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                        <p className="text-gray-600">Invoice #: {paymentDetails.invoiceNumber}</p>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="mb-4">
                    <h3 className="text-lg font-bold mb-2">Bill To:</h3>
                    <p><strong>Name:</strong> {customerDetails.customerName}</p>
                    <p><strong>Venue:</strong> {customerDetails.customerTable ? customerDetails.customerTable : 'Table 1'}</p>
                    <p><strong>Phone:</strong> {customerDetails.customerPhone}</p>
                    <p><strong>Payment:</strong> {paymentmode}</p>
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
                        {paymentDetails.map((item, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">{item.name}</td>
                                <td className="border px-4 py-2">{item.price}</td>
                                <td className="border px-4 py-2">{item.quantity}</td>
                                <td className="border px-4 py-2">{(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="3" className="border px-4 py-2 text-right">Subtotal:</td>
                            <td className="border px-4 py-2">{totalforbill}</td>
                        </tr>
                        {applicableDeliveryCharge > 0 && (
                            <tr>
                                <td colSpan="3" className="border px-4 py-2 text-right">Delivery Charge:</td>
                                <td className="border px-4 py-2">{applicableDeliveryCharge}</td>
                            </tr>
                        )}
                        {discountAmount > 0 && (
                            <tr>
                                <td colSpan="3" className="border px-4 py-2 text-right">Discount:</td>
                                <td className="border px-4 py-2">-{discountAmount}</td>
                            </tr>
                        )}
                        <tr>
                            <td colSpan="3" className="border px-4 py-2 text-right font-bold">Grand Total:</td>
                            <td className="border px-4 py-2 font-bold">{grandTotalforbill}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className="text-center pt-4 border-t mt-4">
                    <p className="text-gray-600">Thank you for your Order!</p>
                    <p className="text-gray-600">We appreciate your patronage.</p>
                    <p className="text-gray-600 text-sm mt-2">Note: The status of the payment will change to "Received" after the payment has been received by the merchant.</p>
                </div>

            {/* WhatsApp and PDF Buttons */}
            <div className="flex justify-center items-center mt-4">
                <a href={whatsappLink} className="bg-green-500 text-white px-4 py-2 rounded mr-2 flex items-center">
                    <FaWhatsapp className="mr-2" />
                    Send on WhatsApp
                </a>
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

export default Invoicecompo;
