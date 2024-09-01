import React, { useContext, useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
    const customerDetails = useContext(CustomerContext); // Assuming CustomerContext provides customer details
    const paymentDetails = useSelector((state) => state.cart.cart); // Assuming paymentDetails is fetched using Redux
    const [minOrderValue, setMinOrderValue] = useState("");
    const [deliveryCharge, setDeliveryCharge] = useState("");
  console.log("the location of the customer",customerDetails.customerTable);
    useEffect(() => {
        const fetchMinOrderDetails = async () => {
            try {
                const response = await axios.get('https://backendcafe-ceaj.onrender.com/min-order-delivery');
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
                            <td className="border px-4 py-2">{totalforbill.toFixed(2)}</td>
                        </tr>
                        {applicableDeliveryCharge > 0 && (
                            <tr>
                                <td colSpan="3" className="border px-4 py-2 text-right">Delivery Charge:</td>
                                <td className="border px-4 py-2">{applicableDeliveryCharge.toFixed(2)}</td>
                            </tr>
                        )}
                        <tr>
                            <td colSpan="3" className="border px-4 py-2 text-right font-bold">Grand Total:</td>
                            <td className="border px-4 py-2 font-bold">{grandTotalforbill.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>

                {/* Footer */}
                <div className="text-center pt-4 border-t mt-4">
                    <p className="text-gray-600">Thank you for dining with us!</p>
                    <p className="text-gray-600">Please visit us again.</p>
                </div>
            </div>

            {/* Download Button */}
            <div className="flex-1 text-center items-center">
                <button
                    onClick={downloadPDF}
                    className="h-16 w-32 p-3 m-3 border-2 border-black bg-black text-white rounded-xl font-bold">
                    <div className="flex items-center ">
                        <div>
                            Download
                        </div>
                        <div>
                            <FaFilePdf fill="white" className='h-4 w-4 m-2 ' />
                        </div>
                    </div>
                </button>
                <button onClick={() => window.open(whatsappLink, '_blank')} className="h-16 w-32 p-4 m-3 border-2 border-black bg-black text-white rounded-xl font-bold">
                    <div className="flex items-center ">
                        <div>
                            Whatsapp
                        </div>
                        <div>
                            <FaWhatsapp fill="white" className='h-4 w-4 m-2 ' />
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
}

export default Invoicecompo;
