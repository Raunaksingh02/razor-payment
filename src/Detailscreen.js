import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useParams } from "react-router-dom";
import backarrowlogo from './images/backarrowlogo.png';
import { addToCart, removeToCart, selectCartItems } from "./redux/cartSlice";
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function DetailScreen() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [dish, setDish] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedPrice, setSelectedPrice] = useState(0);
    const [selectedCostPrice, setSelectedCostPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);

    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);

    useEffect(() => {
        const fetchDish = async () => {
            try {
                const response = await axios.get(`https://backendcafe-nefw.onrender.com/getdish/${id}`);
                const data = response.data;
                setDish(data);
                setSelectedSize(data.sizes[0]?.size || '');
                setSelectedPrice(data.sizes[0]?.price || 0);
                setSelectedCostPrice(data.sizes[0]?.costPrice || 0);
            } catch (error) {
                console.error('Error fetching dish details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDish();
    }, [id]);

    const handleSizeChange = (size) => {
        const selectedSizeIndex = dish.sizes.findIndex((s) => s.size === size);
        setSelectedSize(size);
        setSelectedPrice(dish.sizes[selectedSizeIndex].price);
        setSelectedCostPrice(dish.sizes[selectedSizeIndex].costPrice);
    };

    const handleAddToCart = () => {
        dispatch(
            addToCart({
                ...dish,
                size: selectedSize,
                price: selectedPrice,
                costPrice: selectedCostPrice,
                quantity: 1,
            })
        );
        setQuantity(quantity + 1);
    };

    const handleRemoveFromCart = () => {
        if (quantity > 0) {
            dispatch(
                removeToCart({
                    ...dish,
                    size: selectedSize,
                    price: selectedPrice,
                })
            );
            setQuantity(quantity - 1);
        }
    };

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
        handleAddToCart();
    };

    const decreaseQuantity = () => {
        if (quantity > 0) {
            setQuantity(quantity - 1);
            handleRemoveFromCart();
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
        );
    }
 
    const queryParams = new URLSearchParams(location.search);
    const table = queryParams.get("table");
    console.log(table);

    return (
        <div className="container bg-white mx-auto p-1 md:p- min-h-screen">
        <div className='flex  bg-white items-center mb-4'>
        <div className='mr-4'>
            <button  onClick={() => navigate(table ? `/${table}` : "/")}
            >
            <img src={backarrowlogo} className='h-10 w-10' alt="Back" />
            </button>
        </div>
        <div className='flex-1 text-center'>
         <h1 className='font-bold text-2xl  mr-8'>Details</h1>
        </div>
        </div>
            <div className=" shadow-lg rounded-lg overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-[1.02]">
            <div className="relative h-80 overflow-hidden">
                    <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover object-center transition-transform duration-300 ease-in-out transform hover:scale-110"
                    />
                </div>
                <div className="p-6">
                    <h1 className="text-3xl font-bold mb-4 text-gray-800">{dish.name}</h1>
                  
                    <p className="text-lg mb-6 text-gray-600">{dish.description}</p>
                    <div className="flex flex-col md:flex-row md:items-center mb-6">
                        <label htmlFor="size-select" className="mr-4 text-lg font-medium text-gray-700 mb-2 md:mb-0">Choose Size:</label>
                        <select
                            id="size-select"
                            value={selectedSize}
                            onChange={(e) => handleSizeChange(e.target.value)}
                            className="p-2 border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                        >
                            {dish.sizes.map((sizeOption) => (
                                <option key={sizeOption.size} value={sizeOption.size}>
                                    {sizeOption.size}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-6">
                        <p className="text-xl font-semibold text-gray-800">
                            Price: <span className="text-green-600">{selectedPrice.toFixed(2)}</span>
                        </p>
                       
                    </div>                    
  <div className="flex items-center justify-center gap-8 p-2">
    {/* Decrease Button */}
    <button
      onClick={decreaseQuantity}
      disabled={quantity === 0}
      className={`px-6 py-3  rounded-2xl text-white font-semibold text-xl shadow-md transition-all duration-300 ${
        quantity === 0
          ? ' bg-black cursor-not-allowed shadow-none'
          : ' bg-black hover:bg-red-600 active:bg-red-700'
      } focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50`}
      aria-label="Decrease quantity"
    >
      -
    </button>
    {/* Quantity Display */}
    <span className="text-3xl font-bold ">
      {quantity}
    </span>
    {/* Increase Button */}
    <button
      onClick={increaseQuantity}
      className="px-6 py-3  bg-black  active:bg-[#f6931e] rounded-2xl text-white font-semibold text-xl shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      aria-label="Increase quantity"
    >
      +
    </button>
  </div>
  </div>
   </div>
  </div>
    );
}

