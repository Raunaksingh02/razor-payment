import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BuyerContext } from './components/Buyercontext';
import backarrowlogo from './images/backarrowlogo.png';
import { Link } from 'react-router-dom';

const Address = () => {
    const { buyer } = useContext(BuyerContext);
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState({
        houseNo: '',
        streetNo: '',
        city: '',
        state: '',
        pincode: '',
        landmark: ''
    });

    useEffect(() => {
        if (buyer?.email) {
            axios.get(`https://backendcafe-ceaj.onrender.com/addresses?email=${buyer.email}`)
                .then(response => setAddresses(response.data))
                .catch(error => console.error(error));
        }
    }, [buyer]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAddress(prevState => ({ ...prevState, [name]: value }));
    };

    const handleAddAddress = (e) => {
        e.preventDefault();
        axios.post('https://backendcafe-ceaj.onrender.com/addresses', {
            email: buyer.email,
            address: newAddress
        })
        .then(response => {
            setAddresses(response.data);
            setNewAddress({
                houseNo: '',
                streetNo: '',
                city: '',
                state: '',
                pincode: '',
                landmark: ''
            });
        })
        .catch(error => console.error(error));
    };

    const handleDeleteAddress = (addressId) => {
        axios.delete('https://backendcafe-ceaj.onrender.com/addresses', {
            params: {
                email: buyer.email,
                addressId: addressId
            }
        })
        .then(response => setAddresses(response.data))
        .catch(error => console.error(error));
    };

    return (
        <div className="max-w-lg mx-auto p-4 sm:p-6 bg-white shadow-md rounded-lg">
             <div className="flex items-center">
                <div>
                    <Link to="/">
                        <img
                            src={backarrowlogo}
                            className='h-10 w-10 m-2'
                        />
                    </Link>
                </div>
                <div>
                    <h1 className="text-3xl font-bold ml-12 ">Manage Address</h1>
                </div>
            </div>
            <form onSubmit={handleAddAddress} className="space-y-4 mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <input
                        type="text"
                        name="houseNo"
                        value={newAddress.houseNo}
                        onChange={handleInputChange}
                        placeholder="House Number"
                        className="input-field w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f6931e]"
                    />
                    <input
                        type="text"
                        name="streetNo"
                        value={newAddress.streetNo}
                        onChange={handleInputChange}
                        placeholder="Street Number"
                        className="input-field w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f6931e]"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="city"
                        value={newAddress.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="input-field w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f6931e]"
                    />
                    <input
                        type="text"
                        name="state"
                        value={newAddress.state}
                        onChange={handleInputChange}
                        placeholder="State"
                        className="input-field w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f6931e]"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="pincode"
                        value={newAddress.pincode}
                        onChange={handleInputChange}
                        placeholder="Pincode"
                        className="input-field w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f6931e]"
                    />
                    <input
                        type="text"
                        name="landmark"
                        value={newAddress.landmark}
                        onChange={handleInputChange}
                        placeholder="Landmark"
                        className="input-field w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f6931e]"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-[#f6931e] text-white font-semibold rounded-md shadow hover:bg-[#d48d35] transition-colors duration-300"
                >
                    Add Address
                </button>
            </form>

            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center">Your Addresses</h3>
            <ul className="space-y-4">
                {addresses.map((address) => (
                    <li key={address._id} className="flex justify-between items-center p-4 bg-gray-200 rounded-2xl shadow-sm">
                        <span className="text-sm sm:text-base">{`${address.houseNo}, ${address.streetNo}, ${address.city}, ${address.state} - ${address.pincode}`}</span>
                        <button
                            onClick={() => handleDeleteAddress(address._id)}
                            className="ml-4 text-red-600 hover:text-red-800 transition-colors duration-300"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Address;
