import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { GrCafeteria } from "react-icons/gr";
import cartlogo from "./images/cartlogo.png";
import dialicon from './images/dialicon.png';
import { CiSearch } from "react-icons/ci";
import { addToCart, removeToCart } from './redux/cartSlice.js';

function Homepage() {
    const { table } = useParams(); 
    console.log(table);
    // Get the table parameter from the URL
    const [cafes, setCafes] = useState([]);
    const [quantities, setQuantities] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedPrices, setSelectedPrices] = useState([]);
    const [selectedCostPrices, setSelectedCostPrices] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 5;

    const dispatch = useDispatch();
    const cartfortotal = useSelector((state) => state.cart.cart);
    const totalquantityforhome = cartfortotal.map((item) => item.quantity).reduce((prev, curr) => prev + curr, 0);

    useEffect(() => {
        axios.get('https://backendcafe-ceaj.onrender.com/getdish')
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

    const additemtocart = (item, size, price, costPrice) => {
        dispatch(addToCart({ ...item, size, price, costPrice }));
    };

    const removeitemtocart = (item, size, price) => {
        dispatch(removeToCart({ ...item, size, price }));
    };

    const increase = (index) => {
        const newQuantities = [...quantities];
        newQuantities[index] += 1;
        setQuantities(newQuantities);
    };

    const decrease = (index) => {
        if (quantities[index] > 0) {
            const newQuantities = [...quantities];
            newQuantities[index] -= 1;
            setQuantities(newQuantities);
        }
    };

    const handleSizeChange = (index, size) => {
        const newSelectedSizes = [...selectedSizes];
        const newSelectedPrices = [...selectedPrices];
        const newSelectedCostPrices = [...selectedCostPrices];
        newSelectedSizes[index] = size;
        const selectedSizeIndex = cafes[index].sizes.findIndex(s => s.size === size);
        newSelectedPrices[index] = cafes[index].sizes[selectedSizeIndex].price;
        newSelectedCostPrices[index] = cafes[index].sizes[selectedSizeIndex].costPrice;
        setSelectedSizes(newSelectedSizes);
        setSelectedPrices(newSelectedPrices);
        setSelectedCostPrices(newSelectedCostPrices);
    };

    const categories = ['All', ...new Set(cafes.map(cafe => cafe.category))];

    const filteredCafes = selectedCategory === 'All'
        ? cafes
        : cafes.filter(cafe => cafe.category === selectedCategory);

    const searchedCafes = searchTerm === ''
        ? filteredCafes
        : filteredCafes.filter(cafe => cafe.name.toLowerCase().includes(searchTerm.toLowerCase()) || cafe.category.toLowerCase().includes(searchTerm.toLowerCase()));

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCafes = searchedCafes.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return <div className="flex justify-center items-center text-center mt-20">
            <h1 className="font-bold ml-3">Loading the menu...</h1>
            <GrCafeteria fill='white' className='h-10 w-10' />
        </div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className='flex items-center justify-between'>
                <h1 className="text-3xl font-extrabold text-center m-2">Cafe Coffee </h1>
                <div className='flex items-center'>
                    {table && (
                        <Link to="/Call">
                            <div className='flex items-center p-2 bg-gray-100 shadow-lg shadow-gray-400 hover:bg-gray-400 rounded-2xl mr-2'>
                                <img
                                    src={dialicon}
                                    className='h-6 w-6 animate-ring'
                                />
                                <p className='font-bold m-1'>Waiter</p>
                            </div>
                        </Link>
                    )}
                    <Link to={`/bill?table=${table}`}>
                        <img src={cartlogo} className='h-12 w-12' alt="cart logo" />
                    </Link>
                    <h1 className="font-bold text-red-500 text-2xl ml-2">{totalquantityforhome}</h1>
                </div>
            </div>
            <div className="flex justify-between font-bold text-xl items-center p-2 ">
                <label htmlFor="category-select" className="block mr-7"> Select Category :</label>
                <select
                    id="category-select"
                    className="mt-1 block pl-3 pr-10 py-2 bg-gray-100 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    {categories.map((category, index) => (
                        <option key={index} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex justify-center p-4">
                <div className="flex w-full max-w-md border-2 border-gray-300 rounded-full shadow-lg">
                    <input
                        type="text"
                        placeholder="Enter dish name..."
                        className="w-full h-12 px-4 text-gray-700 placeholder-gray-400 rounded-l-full focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={() => setCurrentPage(1)} className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-r-full hover:bg-gray-700 focus:outline-none">
                        <CiSearch fill="white" className="w-8 h-8" />
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 mt-3">
                {currentCafes.map((item, index) => (
                    <div className="flex flex-row bg-gray-100 ease-in duration-300 rounded-2xl shadow-lg shadow-gray-400 p-4 mb-4 hover:bg-gray-400" key={index}>
                        <img
                            className='w-full mt-4 p-2 h-48 object-cover rounded-3xl'
                            src={item.image}
                            alt={item.name}
                        />
                        <div className='p-2'>
                            <h2 className="font-bold text-xl">{item.name}</h2>
                            <p>Category: {item.category}</p>
                            <p>Rating: {item.rating} stars</p>
                            <p className="font-bold">Price: {selectedPrices[cafes.indexOf(item)]}</p>
                            <div className="mt-2">
                                <label htmlFor={`size-select-${index}`} className="block text-sm font-bold text-gray-700">Size:</label>
                                <select
                                    id={`size-select-${index}`}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    value={selectedSizes[cafes.indexOf(item)]}
                                    onChange={(e) => {
                                        const size = e.target.value;
                                        handleSizeChange(cafes.indexOf(item), size);
                                    }}
                                >
                                    {item.sizes.map(size => (
                                        <option key={size.size} value={size.size} className="w-full">
                                            {`${size.size}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <p className="mt-2">{item.description}</p>
                            <div className='flex items-center mt-4'>
                                <button onClick={() => { increase(cafes.indexOf(item)); additemtocart(item, selectedSizes[cafes.indexOf(item)], selectedPrices[cafes.indexOf(item)], selectedCostPrices[cafes.indexOf(item)]); }} className="h-10 w-10 bg-black text-white rounded-l-lg">+</button>
                                <h1 className='font-bold text-2xl mx-4'>{quantities[cafes.indexOf(item)]}</h1>
                                <button onClick={() => { decrease(cafes.indexOf(item)); removeitemtocart(item, selectedSizes[cafes.indexOf(item)], selectedPrices[cafes.indexOf(item)]); }} className="h-10 w-10 bg-black text-white rounded-r-lg">-</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 mx-1 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
                >
                    Previous
                </button>
                {[...Array(Math.ceil(searchedCafes.length / itemsPerPage)).keys()].map((number) => (
                    <button
                        key={number + 1}
                        onClick={() => paginate(number + 1)}
                        className={`px-4 py-2 mx-1 ${currentPage === number + 1 ? 'bg-gray-600 text-white' : 'bg-gray-300'} rounded-md hover:bg-gray-400`}
                    >
                        {number + 1}
                    </button>
                ))}
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(searchedCafes.length / itemsPerPage)}
                    className="px-4 py-2 mx-1 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default Homepage;
