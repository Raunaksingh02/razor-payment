import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate ,Link} from 'react-router-dom';
import backarrowlogo from './images/backarrowlogo.png';


const PaymentDetails = () => {
    const [payments, setPayments] = useState([]); 
    const [loading, setLoading] = useState(true);
    
    const move= useNavigate();
    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await axios.get('https://backendcafe-ceaj.onrender.com/api/payments');
                setPayments(response.data);
            } catch (error) {
                console.error("There was an error fetching the payments!", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, [payments]);

    const handleDelete = async (paymentId) => {
      try {
          console.log(paymentId);
          const response = await axios.delete(`https://backendcafe-ceaj.onrender.com/${paymentId}`);
          console.log('Delete response:', response);
          // Filter out the deleted payment from the state
          setPayments(payments.filter(payment => payment._id !== paymentId));
      } catch (error) {
          console.error('There was an error deleting the payment!', error);
          if (error.response) {
              console.error('Error response data:', error.response.data);
              console.error('Error response status:', error.response.status);
              console.error('Error response headers:', error.response.headers);
          } else if (error.request) {
              console.error('Error request data:', error.request);
          } else {
              console.error('Error message:', error.message);
          }
      }
  };

    if (loading) {
        return <div className="font-bold text-center">Loading the data..... please wait</div>
    }
    const handlemove=(_id)=>{
        console.log(_id);
        move(`/update/${_id}`);

    }

    return (
        <div>
            <div className="flex items-center" >
              <div>
              <Link to="/Owner">
              <img
            src={backarrowlogo}
            className='h-10 w-10 m-2'
            />
            </Link>
                        </div>

                        <div >
                      <h1 className=" text-3xl font-bold ml-12" >Order Details</h1>
                    </div>
                </div>
        <div className="container mx-auto p-6">
        <div>
            {payments.map(payment => (
                <div key={payment.paymentId} className='border-2 border-gray-300 rounded-lg shadow-lg m-4 p-6'>
                    <h1 className="text-xl font-semibold">PaymentId: {payment.paymentId}</h1>
                    <h1 className="text-lg">Name: {payment.name}</h1>
                    <h1 className="text-lg">Customer Table: {payment.customerTable}</h1>
                    <h1 className="text-lg">Amount: {payment.amount}</h1>
                    <h1 className="text-lg">Contact No: {payment.customerPhoneNo}</h1>
                    <h1 className={`text-lg ${payment.status === 'pending' ? 'text-red-400' : 'text-green-500'}`}>
                        Status: {payment.status}
                    </h1>
                    <div className="mt-4">
                        {payment.cartforpayment.map(item => (
                            <div key={item.id} className='border-2 border-gray-200 rounded-md shadow-md m-3 p-3'>
                                <h2 className="text-md font-medium">Item Name: {item.name}</h2>
                                <h3 className="text-sm">Category: {item.category}</h3>
                                <h3 className="text-sm">Rating: {item.rating}</h3>
                                <h4 className="text-sm font-semibold">Price: {item.price}</h4>
                                <h4 className="text-sm font-semibold">Size: {item.size}</h4>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-around mt-4">
                        <button
                            onClick={() => handleDelete(payment.paymentId)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => handlemove(payment._id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                        >
                            Update
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
    </div>
    );
};

export default PaymentDetails;










