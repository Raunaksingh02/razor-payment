import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function Waiterpage() {
  const [dishes, setDishes] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  const [costPrices, setCostPrices] = useState([]);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await axios.get('https://backendcafe-ceaj.onrender.com/getdish');
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
      await axios.put(`https://backendcafe-ceaj.onrender.com/${selectedDish._id}/size`, {
        sizes: costPrices
      });
      alert('Cost prices updated successfully');
    } catch (error) {
      console.error('Error updating cost prices:', error);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Update Cost Prices</h1>
      </header>
      <main>
        <label>
          Select Dish:
          <select onChange={e => handleDishSelect(e.target.value)}>
            <option value="">Select a dish</option>
            {dishes.map(dish => (
              <option key={dish._id} value={dish._id}>
                {dish.name}
              </option>
            ))}
          </select>
        </label>
        {selectedDish && (
          <div>
            <h2>{selectedDish.name}</h2>
            {selectedDish.sizes.map(size => (
              <div key={size.size} className="size-entry">
                <label>
                  {size.size}:
                  <input
                    type="number"
                    value={costPrices.find(cp => cp.size === size.size).costPrice}
                    onChange={e => handleCostPriceChange(size.size, e.target.value)}
                  />
                </label>
              </div>
            ))}
            <button onClick={handleSubmit}>Update Cost Prices</button>
          </div>
        )}
      </main>
      <footer>
        <p>© 2024 Professional Billing Page. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Waiterpage;
