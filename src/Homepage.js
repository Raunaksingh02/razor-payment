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

    const cartfortotal = useSelector((state) => state.cart.cart);
    const totalquantityforhome = cartfortotal.map((item) => item.quantity).reduce((prev, curr) => prev + curr, 0);
    const dispatch = useDispatch();

    useEffect(() => {
        axios.get('https://backendcafe-ceaj.onrender.com/getdish')
            .then(response => {
                setCafes(response.data);
                setQuantities(Array(response.data.length).fill(0));
                setSelectedSizes(Array(response.data.length).fill(response.data[0]?.sizes[0]?.size || ''));
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

    const handleSizeChange = (index, size, price) => {
        const newSelectedSizes = [...selectedSizes];
        newSelectedSizes[index] = size;
        setSelectedSizes(newSelectedSizes);
    };

    return (
        <div>
            <div className='flex item-center justify-center'>
                <h1 className="text-3xl font-bold text-center m-2">Cafe Coffee</h1>
                <Link to="/bill">
                    <img src={cartlogo} className='h-12 w-12' />
                </Link>
                <h1 className="font-bold text-red text-2xl">{totalquantityforhome}</h1>
                <Link to="/Owner">
                    <img src={user} className='h-10 w-10 ml-8 mt-1' />
                </Link>
            </div>
            <div>
                {cafes.map((item, index) => (
                    <div className='flex flex-row m-3 p-3' key={index}>  {/* flex flex-row */}
                        <div>
                            <img className='m-2' src={item.image} alt={item.name} />
                        </div>
                        <div className='ml-4'>
                            <h2 className="font-bold">{item.name}</h2>
                            <p>Category: {item.category}</p>
                            <p>Rating: {item.rating} stars</p>
                            <div>
                                <label htmlFor={`size-select-${index}`}>Size:</label>
                                <select
                                    id={`size-select-${index}`}
                                    value={selectedSizes[index]}
                                    onChange={(e) => {
                                        const size = e.target.value;
                                        const price = item.sizes.find(s => s.size === size).price;
                                        handleSizeChange(index, size, price);
                                    }}
                                >
                                    {item.sizes.map(size => (
                                        <option key={size.size} value={size.size}>
                                            {size.size} - ${size.price}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <p>{item.description}</p>
                            <div className='flex m-2'>
                                <button onClick={() => { increase(index); additemtocart(item, selectedSizes[index], item.sizes.find(s => s.size === selectedSizes[index]).price); }} className="h-10 w-10 bg-black text-white">+</button>
                                <h1 className='font-bold text-2xl m-2'>{quantities[index]}</h1>
                                <button onClick={() => { decrease(index); removeitemtocart(item, selectedSizes[index], item.sizes.find(s => s.size === selectedSizes[index]).price); }} className="h-10 w-10 bg-black text-white">-</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Homepage;
