import React, { useContext ,useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import html2canvas from "html2canvas";
import jsPDF from 'jspdf';
import {CustomerContext} from './CustomerContext.js'; // Import your context here

function Invoicecompo() {

    const pdfRef = useRef();

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
              imgWidth = imgWidth*imgRatio;
               imgHeight = imgHeight*imgRatio;
            }
    
            imgX = (pdfWidth - imgWidth) / 2;
            imgY = (pdfHeight - imgHeight) / 2;
    
            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth, imgHeight);
            pdf.save('invoice.pdf');
        });
    }
    
  

    const { customerName, customerTable, customerPhone } = useContext(CustomerContext);
    const dispatch = useDispatch();
    const cartforinvoice = useSelector((state) => state.cart.cart);
    const totalforinvoice = cartforinvoice.map((item) => item.price * item.quantity).reduce((prev, curr) => prev + curr, 0);
    const grandTotalforinvoice = totalforinvoice + 50; // Assuming 50 is some additional charge (like tax or delivery fee)
    const totalquantityforinvoice = cartforinvoice.map((item) => item.quantity).reduce((prev, curr) => prev + curr, 0);

    return (
        <div>
        <div 
        ref={pdfRef}
        className='max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
            <div
            className='text-center mb-4'>
                <h1 className='text-2xl font-bold'>Invoice</h1>
            </div>
            <div className='mb-4'>
                <p><strong>Customer Name:</strong> {customerName}</p>
            <p><strong>Customer Table:</strong> {customerTable ? customerTable : 'Table 1'}</p>
                <p><strong>Customer Phone:</strong> {customerPhone}</p>
            </div>
            <table className='w-full mb-4'>
                <thead>
                    <tr>
                        <th className='border px-4 py-2'>Item</th>
                        <th className='border px-4 py-2'>Price</th>
                        <th className='border px-4 py-2'>Quantity</th>
                        <th className='border px-4 py-2'>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {cartforinvoice.map((item, index) => (
                        <tr key={index}>
                            <td className='border px-4 py-2'>{item.name}</td>
                            <td className='border px-4 py-2'>${item.price}</td>
                            <td className='border px-4 py-2'>{item.quantity}</td>
                            <td className='border px-4 py-2'>${(item.price * item.quantity)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan='3' className='border px-4 py-2 text-right'>Subtotal:</td>
                        <td className='border px-4 py-2'>${totalforinvoice}</td>
                    </tr>
                    <tr>
                        <td colSpan='3' className='border px-4 py-2 text-right'>Additional Charges:</td>
                        <td className='border px-4 py-2'>50.00</td>
                    </tr>
                    <tr>
                        <td colSpan='3' className='border px-4 py-2 text-right font-bold'>Grand Total:</td>
                        <td className='border px-4 py-2 font-bold'>{grandTotalforinvoice}</td>
                    </tr>
                   
                </tfoot>
            </table>
        </div>
       <div>
<button 
 onClick={downloadPDF} 
 className='h-16 w-28 p-3 m-3 ml-24 pb-1 border-2 border-black bg-black text-white rounded-xl font-bold  '>
 Download Bill
</button>
       </div>
     </div>

    );
}

export default Invoicecompo;







