import React, { useContext, useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import html2canvas from "html2canvas";
import { FaWhatsapp } from "react-icons/fa";
import jsPDF from 'jspdf';
import { FaFilePdf } from "react-icons/fa";
import { CustomerContext } from './CustomerContext.js';

function Billingpage() {
    const { _id } = useParams();
    const pdfRef = useRef();
    const [customerdata, setcustomerdata] = useState("");
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://backendcafe-ceaj.onrender.com/api/payments/${_id}`);
                setcustomerdata(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching payment details:', error.message);
            }
        };

        fetchData();
    }, [_id]);

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
            pdf.save('invoice.pdf');
        });
    }

    if (!customerdata) {
        return <div className="flex justify-center items-center h-screen text-center font-lg font-extrabold">
            <h1 className='text-2xl text-gray-500 font-bold'>Loading the bill details..</h1>
        </div>;
    }

    const totalforbill = customerdata.cartforpayment.map((item) => item.price * item.quantity).reduce((prev, curr) => prev + curr, 0);
    const grandTotalforbill = totalforbill + 50; // Assuming 50 is some additional charge (like tax or delivery fee)

    const invoiceLink = `https://cafehouse.vercel.app/billdata/${_id}`;
    const message = `Dear ${customerdata.name} , Here is your bill: ${invoiceLink}`;
    const whatsappLink = `https://api.whatsapp.com/send?phone=91${customerdata.customerPhoneNo}&text=${encodeURIComponent(message)}`;

    return (
        <div>
            <div
                ref={pdfRef}
                className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mb-4">

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
                        {/* Assuming invoice number or unique identifier for the bill */}
                       
                    </div>
                </div>

                {/* Customer Info */}
                <div className="mb-4">
                    <h3 className="text-lg font-bold mb-2">Bill To:</h3>
                    <p><strong>Name:</strong> {customerdata.name}</p>
                    <p><strong>Venue:</strong> {customerdata.customerTable? customerdata.customerTable : 'Table 1'}</p>
                    <p><strong>Phone:</strong> {customerdata.customerPhoneNo}</p>
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
                        {customerdata.cartforpayment.map((item, index) => (
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
                        <tr>
                            <td colSpan="3" className="border px-4 py-2 text-right">Additional Charges:</td>
                            <td className="border px-4 py-2">50.00</td>
                        </tr>
                        <tr>
                            <td colSpan="3" className="border px-4 py-2 text-right font-bold">Grand Total:</td>
                            <td className="border px-4 py-2 font-bold">{grandTotalforbill.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>

                {/* Footer */}
                <div className="text-center pt-4 border-t mt-4">
                    <p className="text-gray-600">Thank you for your business!</p>
                    <p className="text-gray-600">We appreciate your patronage.</p>
                </div>
            </div>

            {/* Download and WhatsApp Buttons */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={downloadPDF}
                    className="flex items-center justify-center h-16 w-32 p-3 m-3 border-2 border-black bg-black text-white rounded-xl font-bold">
                    <div className="flex items-center">
                        <div>Download</div>
                        <div><FaFilePdf className="ml-2" /></div>
                    </div>
                </button>
                <button
                    onClick={() => window.open(whatsappLink, '_blank')}
                    className="flex items-center justify-center h-16 w-32 p-4 m-3 border-2 border-black bg-black text-white rounded-xl font-bold">
                    <div className="flex items-center">
                        <div>WhatsApp</div>
                        <div><FaWhatsapp className="ml-2" /></div>
                    </div>
                </button>
            </div>
        </div>
    );
}

export default Billingpage ;





















