import React, { useContext, useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import html2canvas from "html2canvas";
import jsPDF from 'jspdf';
import { CustomerContext } from './CustomerContext.js';

function Invoicecompo() {
    const { _id } = useParams();
    const pdfRef = useRef();
    const [paymentDetails, setPaymentDetails] = useState(null);
   
    const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://backendcafe-ceaj.onrender.com/api/payments/${_id}`);
        setPaymentDetails(response.data);
        setIsDataLoaded(true); // Set data loaded to true on successful fetch
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching payment details:', error.message);
        setIsDataLoaded(false); // Set data loaded to false on error
      }
    };

    fetchData();

    // Set a timer to reload the page after 3 seconds if data is not loaded
    const timer = setTimeout(() => {
      if (!isDataLoaded) {
        window.location.reload();
      }
    }, 8000);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, [_id, isDataLoaded]);


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

    if (!paymentDetails) {
        return <div className="text-center font-lg font-extrabold">Loading the invoice..</div>;
    }

    const totalforinvoice = paymentDetails.cartforpayment.map((item) => item.price * item.quantity).reduce((prev, curr) => prev + curr, 0);
    const grandTotalforinvoice = totalforinvoice + 50; // Assuming 50 is some additional charge (like tax or delivery fee)

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
                    <p><strong>Name:</strong> {paymentDetails.name}</p>
                    <p><strong>Table:</strong> {paymentDetails.customerTable ? paymentDetails.customerTable : 'Table 1'}</p>
                    <p><strong>Phone:</strong> {paymentDetails.customerPhoneNo}</p>
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
                        {paymentDetails.cartforpayment.map((item, index) => (
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
                            <td className="border px-4 py-2">{totalforinvoice.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colSpan="3" className="border px-4 py-2 text-right">Additional Charges:</td>
                            <td className="border px-4 py-2">50.00</td>
                        </tr>
                        <tr>
                            <td colSpan="3" className="border px-4 py-2 text-right font-bold">Grand Total:</td>
                            <td className="border px-4 py-2 font-bold">{grandTotalforinvoice.toFixed(2)}</td>
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
            <div className="text-center">
                <button 
                    onClick={downloadPDF} 
                    className="h-16 w-28 p-3 m-3 border-2 border-black bg-black text-white rounded-xl font-bold">
                    Download Bill
                </button>
            </div>
        </div>
    );
}

export default Invoicecompo;
