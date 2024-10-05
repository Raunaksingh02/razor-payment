import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdDelete } from "react-icons/md";

const Pos = () => {
    const [cafes, setCafes] = useState([]);
    const [quantities, setQuantities] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedPrices, setSelectedPrices] = useState([]);
    const [selectedCostPrices, setSelectedCostPrices] = useState([]);
    const [cart, setCart] = useState([]);
    const [discount, setDiscount] = useState(0);
    const [paymentMode, setPaymentMode] = useState('');
    const [cash, setCash] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Number of items per page
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [selectedTable, setSelectedTable] = useState('Takeaway');
    const [customerDetailsOpen,setCustomerDetailsOpen] = useState('');

    useEffect(() => {
        axios.get('https://backendcafe-zqt8.onrender.com/getdish')
            .then(response => {
                setCafes(response.data);
                setQuantities(Array(response.data.length).fill(0));
                setSelectedSizes(response.data.map(dish => dish.sizes[0]?.size || ''));
                setSelectedPrices(response.data.map(dish => dish.sizes[0]?.price || 0));
                setSelectedCostPrices(response.data.map(dish => dish.sizes[0]?.costPrice || 0));
                setLoading(false);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const filteredCafes = selectedCategory === 'All' ? cafes : cafes.filter(dish => dish.category === selectedCategory);

    const addToCart = (dish, index) => {
        const existingCartItem = cart.find(item => item.id === dish._id && item.size === selectedSizes[index]);

        if (existingCartItem) {
            const updatedCart = cart.map(item => 
                item.id === dish._id && item.size === selectedSizes[index]
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
            setCart(updatedCart);
        } else {
            const newCartItem = {
                id: dish._id,
                name: dish.name,
                category: dish.category,
                price: selectedPrices[index],
                costPrice: selectedCostPrices[index],
                size: selectedSizes[index],
                quantity: 1,
                image: dish.image,
            };
            setCart([...cart, newCartItem]);
        }
    };

    const handleSizeChange = (e, index) => {
        const size = e.target.value;
        const selectedDish = cafes[index];
        const sizeDetails = selectedDish.sizes.find(s => s.size === size);
        const newPrices = [...selectedPrices];
        const newCostPrices = [...selectedCostPrices];

        newPrices[index] = sizeDetails.price;
        newCostPrices[index] = sizeDetails.costPrice;

        setSelectedPrices(newPrices);
        setSelectedCostPrices(newCostPrices);
        const newSelectedSizes = [...selectedSizes];
        newSelectedSizes[index] = size;
        setSelectedSizes(newSelectedSizes);
    };

    const handleQuantityChange = (index, change) => {
        const selectedDish = cafes[index];
        const newQuantities = [...quantities];
        newQuantities[index] = Math.max(0, newQuantities[index] + change); // Prevent negative quantity
        setQuantities(newQuantities);

        if (change > 0) {
            if (selectedSizes[index] === '') {
                setSelectedSizes(prev => {
                    const newSelectedSizes = [...prev];
                    newSelectedSizes[index] = selectedDish.sizes[0]?.size || '';
                    return newSelectedSizes;
                });

                setSelectedPrices(prev => {
                    const newSelectedPrices = [...prev];
                    newSelectedPrices[index] = selectedDish.sizes[0]?.price || 0;
                    return newSelectedPrices;
                });
            }
            addToCart(selectedDish, index);
        } else {
            removeFromCart(selectedDish, index);
        }
    };

      const removeFromCart = (id, size) => {
        const existingCartItem = cart.find(item => item.id === id && item.size === size);
        if (existingCartItem) {
            if (existingCartItem.quantity > 1) {
                const updatedCart = cart.map(item => 
                    item.id === id && item.size === size
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
                setCart(updatedCart);
            } else {
                const updatedCart = cart.filter(item => !(item.id === id && item.size === size));
                setCart(updatedCart);
            }
        }
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0) - discount;
    };

    const handlePayment = () => {
        console.log('Payment processed', {
            cart,
            totalAmount: calculateTotal(),
            paymentMode,
            discount,
            cash,
            customerName,
            customerPhone,
            table: selectedTable
        });
        alert('Bill generated successfully!');
        setCart([]);
        setDiscount(0);
        setPaymentMode('');
        setCash(0);
        setCustomerName('');
        setCustomerPhone('');
    };

    // Pagination logic
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCafes = filteredCafes.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredCafes.length / itemsPerPage);

    return (
        <div className=' flex' >
            {/* Category Filter */}
          <div>
            <div className="mb-4 w-full">
                <div className="flex overflow-x-auto space-x-4">
                    <button
                        onClick={() => setSelectedCategory('All')}
                        className={`p-2 rounded-md border ${selectedCategory === 'All' ? 'bg-[#f6931e] text-white' : 'bg-gray-100 text-black'}`}
                    >
                        All
                    </button>
                    {[...new Set(cafes.map(dish => dish.category))].map((category, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedCategory(category)}
                            className={`p-2 font-bold rounded-md border ${selectedCategory === category ? 'bg-[#f6931e] text-white' : 'bg-gray-100 text-black'}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Items Section */}
            <div className="bg-white shadow-lg rounded-lg p-4 flex-1 ">
                {loading ? (
                    <p>Loading items...</p>
                ) : (
                    <div className="grid grid-cols-4 gap-4">
                        {paginatedCafes.map((dish, index) => (
                            <div key={dish._id} className="border rounded-lg p-4 bg-white shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
                                <img src={dish.image} className='h-20 w-20 ml-4' alt={dish.name} />
                                <h3 className="text-lg text-center font-bold mb-2">{dish.name}</h3>
                                <select
                                    value={selectedSizes[startIndex + index]}
                                    onChange={(e) => handleSizeChange(e, startIndex + index)}
                                    className="w-full mb-2 border p-2 rounded-lg"
                                >
                                    {dish.sizes.map((sizeOption, idx) => (
                                        <option key={idx} value={sizeOption.size}>
                                            {sizeOption.size}
                                        </option>
                                    ))}
                                </select>

                                <div className="flex items-center justify-center mt-4">
                                    <button
                                        onClick={() => handleQuantityChange(startIndex + index, -1)}
                                        className="bg-gray-300 p-1 rounded-l-md"
                                    >
                                        -
                                    </button>
                                    <span className="px-2">{quantities[startIndex + index]}</span>
                                    <button
                                        onClick={() => handleQuantityChange(startIndex + index, 1)}
                                        className="bg-gray-300 p-1 rounded-r-md"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination Controls */}
                <div className="flex justify-center mt-4">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            className={`mx-2 px-4 py-2 rounded-md ${currentPage === i + 1 ? 'bg-[#f6931e] text-white' : 'bg-gray-200'}`}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-4 w-full lg:w-1/3 ml-2">
            <div className='flex justify-between' >
                <div>
                <h3 className="text-2xl font-bold text-[#f6931e] mb-4">Bill</h3>
                </div>
                <div>
                <button
                    className="bg-gray-300 text-black font-bold p-2 rounded-md ml-1 md:ml-2 mb-4 w-full"
                    onClick={() => setCustomerDetailsOpen(!customerDetailsOpen)}
                >
                    {customerDetailsOpen ? 'Hide Details' :  '+ Customer'}
                </button>
                </div>
                </div>

                {customerDetailsOpen && (
                    <div className="mb-4">
                        <label className="block mb-2 text-black font-bold">Customer Name:</label>
                        <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full border p-2 rounded-lg mb-4"
                        />
                        <label className="block mb-2 text-black font-bold">Customer Phone:</label>
                        <input
                            type="tel"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="w-full border p-2 rounded-lg"
                        />
                    </div>
                )}

    

                {cart.length === 0 ? (
                    <p className="text-center">Cart is empty</p>
                ) : (
                    <div>
                        {cart.map((item, index) => (
                            <div key={index} className="flex justify-between items-center mb-4">
                                <div>
                                    <h4 className="text-lg font-bold">{item.name}</h4>
                                    <p>Size: {item.size}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Price: ₹{item.price}</p>
                                </div>
                                <div>
                                <button
                                    onClick={() => removeFromCart(item.id, item.size)}
                                    className="text-red-500"
                                >
                                    <MdDelete size={24} />
                                </button>
                                </div>
                            </div>
                        ))}

                        <div className="mb-4">
                        <label className="block mb-2 text-black font-bold">Place:</label>
                        <select
                            value={selectedTable}
                            onChange={(e) => setSelectedTable(e.target.value)}
                            className="w-full border p-2 rounded-lg"
                        >
                            <option value="Takeaway">Takeaway</option>
                            <option value="Table 1">Table 1</option>
                            <option value="Table 2">Table 2</option>
                            <option value="Table 3">Table 3</option>
                            <option value="Table 3">Table 4</option>
                            <option value="Table 3">Table 5</option>
                            <option value="Table 3">Table 6</option>
                            <option value="Table 3">Table 7</option>
                            <option value="Table 3">Table 8</option>
                            <option value="Table 3">Table 9</option>
                            <option value="Table 3">Table 10</option>
                        </select>
                    </div>

                        <div className="mt-4">
                            <label className="block mb-2 text-black font-bold">Discount:</label>
                            <input
                                type="number"
                                value={discount}
                                onChange={(e) => setDiscount(parseFloat(e.target.value))}
                                className="w-full border p-2 rounded-lg"
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block mb-2 text-black font-bold">Payment Mode:</label>
                            <select
                                value={paymentMode}
                                onChange={(e) => setPaymentMode(e.target.value)}
                                className="w-full border p-2 rounded-lg"
                            >
                                <option value="cash">Cash</option>
                                <option value="upi">UPI</option>
                                <option value="card">Card</option>
                            </select>
                        </div>
                       
                            <p className='font-bold text-lg mt-2 ' >Total: ₹{calculateTotal()}</p>

                          <div className='flex  justify-between'>
                            <div>
                            <button
                                onClick={handlePayment}
                                className="bg-[#f6931e] text-white  font-bold p-2 rounded-md mt-4 w-full"
                            >
                                Create Bill
                            </button>
                            </div>
                        
                        <div>
                        <button className="bg-green-500 text-white p-2 font-bold  rounded-md mt-4 w-full ml-2 ">
                        Create KOT
                        </button>
                        </div>

                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default Pos;
