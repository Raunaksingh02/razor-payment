import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backarrowlogo from "./images/backarrowlogo.png"
import './App.css';
import { Link } from 'react-router-dom';

function Waiterpage() {
  const [dishes, setDishes] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  const [costPrices, setCostPrices] = useState([]);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await axios.get('http://localhost:1000/getdish');
        setDishes(response.data);
      } catch (error) {
        console.error('Error fetching dishes:', error);
      }
    };

    fetchDishes();
  }, []);

  const handleDishSelect = dishId => {
    const dish = dishes.find(d => d._id === dishId);
    setSelectedDish(dish);
    setCostPrices(dish.sizes.map(size => ({ size: size.size, costPrice: size.costPrice })));
  };

  const handleCostPriceChange = (size, newCostPrice) => {
    setCostPrices(prev =>
      prev.map(cp => (cp.size === size ? { ...cp, costPrice: newCostPrice } : cp))
    );
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:1000/getdish/${selectedDish._id}/size`, {
        sizes: costPrices
      });
      alert('Cost prices updated successfully');
    } catch (error) {
      console.error('Error updating cost prices:', error);
    }
  };

  return (
    <div className="App bg-gray-100 min-h-screen flex flex-col">
    <header className= " flex items-center bg-blue-600 text-white p-4">
     <Link to="/Owner">
      <img
      src={backarrowlogo}
      className='h-10 w-10'
      />
      </Link>
      <h1 className="text-2xl font-bold ml-10">Update Cost Prices</h1>
    </header>
    <main className="flex-grow p-4">
      <label className="block mb-4">
        <span className="block text-gray-700 text-lg font-extrabold mb-2">Select Dish:</span>
        <select
          onChange={e => handleDishSelect(e.target.value)}
          className="mt-1 block w-full h-14 font-bold bg-white border p-3 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        >
          <option value="" >Select a dish</option>
          {dishes.map(dish => (
            <option key={dish._id} value={dish._id}>
              {dish.name}
            </option>
          ))}
        </select>
      </label>
      {selectedDish && (
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800  ">{selectedDish.name}</h2>
          {selectedDish.sizes.map(size => (
            <div key={size.size} className="size-entry mb-4">
              <label className="block">
                <span className="block text-gray-700 text-lg font-bold">{size.size}:</span>
                <input
                  type="number"
                  value={costPrices.find(cp => cp.size === size.size).costPrice}
                  onChange={e => handleCostPriceChange(size.size, e.target.value)}
                  className="mt-1 block w-full h-10 text-center font-bold bg-white border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </label>
            </div>
          ))}
          <button
            onClick={handleSubmit}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Update Cost Prices
          </button>
        </div>
      )}
    </main>
    <footer className="bg-gray-800 text-white p-4 text-center">
      <p>© 2024 Cafehouse Pvt ltd. All rights reserved.</p>
    </footer>
  </div>

  );
}

export default Waiterpage;
