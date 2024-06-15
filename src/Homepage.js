import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import cartlogo from "./images/cartlogo.png";
import user from "./images/user.png";
import { addToCart, removeToCart } from './redux/cartSlice.js';

function Homepage() {
    const [cafes, setCafes] = useState([]);
    const [quantities, setQuantities] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedPrices, setSelectedPrices] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');

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
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const additemtocart = (item, size, price) => {
        dispatch(addToCart({ ...item, size, price }));
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
        newSelectedSizes[index] = size;
        newSelectedPrices[index] = cafes[index].sizes.find(s => s.size === size).price;
        setSelectedSizes(newSelectedSizes);
        setSelectedPrices(newSelectedPrices);
    };

    const categories = ['All', ...new Set(cafes.map(cafe => cafe.category))];

    const filteredCafes = selectedCategory === 'All'
        ? cafes
        : cafes.filter(cafe => cafe.category === selectedCategory);

    return (
        <div className="container mx-auto p-4">
            <div className='flex items-center justify-between'>
                <h1 className="text-3xl font-extrabold text-center m-2">Cafe Coffee</h1>
                <div className='flex items-center'>
                    <Link to="/bill">
                        <img src={cartlogo} className='h-12 w-12' alt="cart logo" />
                    </Link>
                    <h1 className="font-bold text-red-500 text-2xl ml-2">{totalquantityforhome}</h1>
                    <Link to="/Owner">
                        <img src={user} className='h-10 w-10 ml-8 mt-1' alt="user icon" />
                    </Link>
                </div>
            </div>

            <div className="flex  justify-end font-bold  text-xl items-center p-2 ">
                <label htmlFor="category-select" className="block   mr-7"> Select  Category :</label>
                <select
                    id="category-select"
                    className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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

            <div className="grid grid-cols-1 mt-3">
                {filteredCafes.map((item, index) => (
                    <div className="flex flex-row bg-gray-100 rounded-2xl shadow-lg shadow-gray-400 p-4 mb-4" key={index}>
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
                                <label htmlFor={`size-select-${index}`} className="block text-sm font-medium font-bold text-gray-700">Size:</label>
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
                                            {`${size.size} - $${size.price}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <p className="mt-2">{item.description}</p>
                            <div className='flex items-center mt-4'>
                                <button onClick={() => { increase(cafes.indexOf(item)); additemtocart(item, selectedSizes[cafes.indexOf(item)], selectedPrices[cafes.indexOf(item)]); }} className="h-10 w-10 bg-black text-white rounded-l-lg">+</button>
                                <h1 className='font-bold text-2xl mx-4'>{quantities[cafes.indexOf(item)]}</h1>
                                <button onClick={() => { decrease(cafes.indexOf(item)); removeitemtocart(item, selectedSizes[cafes.indexOf(item)], selectedPrices[cafes.indexOf(item)]); }} className="h-10 w-10 bg-black text-white rounded-r-lg">-</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Homepage;
