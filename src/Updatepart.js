import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UpdatePart = () => {
    const { _id } = useParams();
    const [data, setData] = useState({
        name: '',
        amount: '',
        customerTable: 'Table 1',
        customerPhoneNo: '',
        status: 'pending'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://backendcafe-ceaj.onrender.com/api/payments/${_id}`);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching payment details:', error.message);
            }
        };

        fetchData();
    }, [_id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`https://backendcafe-ceaj.onrender.com/api/payments/${_id}`, data);
            console.log('Payment updated:', response.data);
            alert('Payment updated successfully');
        } catch (error) {
            console.error('Error updating payment:', error.message);
            alert('Error updating payment');
        }
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold text-center mt-10 p-3">Update Payment</h1>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={data.name}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                        Amount
                    </label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={data.amount}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerTable">
                        Customer Table
                    </label>
                    <input
                        type="text"
                        id="customerTable"
                        name="customerTable"
                        value={data.customerTable}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerPhoneNo">
                        Customer Phone No
                    </label>
                    <input
                        type="text"
                        id="customerPhoneNo"
                        name="customerPhoneNo"
                        value={data.customerPhoneNo}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                        Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={data.status}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="pending">Pending</option>
                        <option value="delivered">Delivered</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Update Payment
                </button>
            </form>
        </div>
    );
};

export default UpdatePart;
