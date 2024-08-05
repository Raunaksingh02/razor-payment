import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import backarrowlogo from './images/backarrowlogo.png';
import Calling from "./Calling.js";



const PaymentDetails = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [selectedTab, setSelectedTab] = useState('today');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
   
    
    const move = useNavigate();

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
    }, []);

    const handleDelete = async (paymentId) => {
        try {
            console.log(paymentId);
            const response = await axios.delete(`https://backendcafe-ceaj.onrender.com/${paymentId}`);
            console.log('Delete response:', response);
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

    const getStatusColor = (status, condition) => {
        return status === condition ? 'text-green-600' : 'text-red-600';
      };

    const handleMove = (_id) => {
        console.log(_id);
        move(`/update/${_id}`);
    };


    const filterPayments = () => {
        const today = new Date().toISOString().split('T')[0];
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        if (selectedTab === 'today') {
            return payments.filter(payment => new Date(payment.date).toISOString().split('T')[0] === today);
        } else if (selectedTab === 'week') {
            return payments.filter(payment => new Date(payment.date) >= weekAgo);
        } else if (selectedTab === 'select') {
            return payments.filter(payment => new Date(payment.date).toISOString().split('T')[0] === selectedDate);
        } else {
            return payments;
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
    };

    if (loading) {
        return <div className="font-bold text-center">Loading the data..... please wait</div>;
    }

    return (
        <div>
            <Calling/>

            <div className="flex items-center">
                <div>
                    <Link to="/Owner">
                        <img
                            src={backarrowlogo}
                            className='h-10 w-10 m-2'
                        />
                    </Link>
                </div>
                <div>
                    <h1 className="text-3xl font-bold ml-12">Order Details</h1>
                </div>
            </div>
            <div className="container mx-auto p-6">
                <div className="mb-4 ml-3">
                    <button
                        onClick={() => setSelectedTab('today')}
                        className={`px-4 py-2 ${selectedTab === 'today' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded mr-2`}
                    >
                        Today
                    </button>
                    <button
                        onClick={() => setSelectedTab('week')}
                        className={`px-4 py-2 ${selectedTab === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded mr-2`}
                    >
                        Week
                    </button>
                    <button
                        onClick={() => setSelectedTab('select')}
                        className={`px-4 py-2 ${selectedTab === 'select' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
                    >
                        Select Date
                    </button>
                    {selectedTab === 'select' && (
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="ml-4 px-4 py-2 rounded border mt-2"
                        />
                    )}
                </div>
                <div>
                    {filterPayments().map(payment => (
                        <div key={payment._id} className=' rounded-3xl  shadow-xl shadow-gray-400   mt-4 mb-3 p-2'>
                            {payment.paymentmode === "online" && (
                                <h1 className="text-xl font-semibold">PaymentId: {payment.paymentId}</h1>
                            )}
                            <h1 className="text-xl font-bold">Name: {payment.name}</h1>
                            <h1 className="text-lg font-bold">Customer Table:  {payment.customerTable}</h1>
                            <h1 className="text-lg font-bold" >Amount: {payment.amount}</h1>
                            <h1 className="text-lg font-bold">Contact No: {payment.customerPhoneNo}</h1>
                            
                            <p className={`text-lg font-semibold ${getStatusColor(payment.status, 'delivered')}`}>Customer Status: {payment.status}</p>
                            <p className={`text-lg font-semibold ${getStatusColor(payment.paymentmode, 'Received')}`}>Payment Status: {payment.paymentmode}</p>
            
                            <h1 className="text-lg font-bold">Date: {formatDate(payment.date)}</h1>
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
                                    onClick={() => handleDelete(payment._id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => handleMove(payment._id)}
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
