
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate ,Link} from 'react-router-dom';
import Calling from "./Calling";
import backarrowlogo from "./images/backarrowlogo.png";
import OrderPopup from "./OrderPopup.js";


const DishManagement = () => {

  const work =  useNavigate();
  const [dishes, setDishes] = useState([]);
  const [newDish, setNewDish] = useState({
    name: '',
    category: '',
    rating: '',
    sizes: [],
    image: '',
    description: '',
  });
  const [editDish, setEditDish] = useState(null);

  useEffect(() => {
    fetchDishes();
  }, [dishes]);

  const fetchDishes = async () => {
    try{
      const response = await axios.get('https://backendcafe-ceaj.onrender.com/getdish')
      setDishes(response.data);
    } catch (error) {
      console.error('Error fetching dishes', error);
    }
    }
  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://backendcafe-ceaj.onrender.com/deletedish/${id}`);
   {/*   setDishes(dishes.filter((dish) => dish.id !== id)); */}
    } catch (error) {
      console.error('Error deleting dish', error);
    }
  };

  const validateSizes = (sizes) => {
    return sizes.filter(size => size.size && size.price);
  };
  
  const handleAdd = async () => {
    try {
      const validSizes = validateSizes(newDish.sizes);
      const dishToAdd = { ...newDish, sizes: validSizes };
  
      const response = await axios.post('https://backendcafe-ceaj.onrender.com/postdish', dishToAdd, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
   {/*   setDishes([...dishes, response.data]);  */}
      setNewDish({
        name: '',
        category: '',
        rating: '',
        sizes: [],
        image: '',
        description: '',
      });
       
      work('/Owner');

    } catch (error) {
      if (error.response) {
        console.error('Error adding dish:', error.response.data);
        console.error('Status code:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
        work('/Owner');
      }
    }
  };
  
  const handleUpdate = async () => {
    try {
      const response = await axios.put(`https://backendcafe-ceaj.onrender.com/dishes/${editDish.id}`, editDish);
      setDishes(dishes.map((dish) => (dish.id === editDish.id ? response.data : dish)));
      setEditDish(null);
    } catch (error) {
      console.error('Error updating dish', error);
    }
  };

  const handleSizeChange = (index, field, value, dishSetter, dishState) => {
    const updatedSizes = dishState.sizes.map((size, i) =>
      i === index ? { ...size, [field]: value } : size
    );
    dishSetter({ ...dishState, sizes: updatedSizes });
  };

  const addSizeField = (dishSetter, dishState) => {
    dishSetter({ ...dishState, sizes: [...dishState.sizes, { size: '', price: '' }] });
  };

  const removeSizeField = (index, dishSetter, dishState) => {
    dishSetter({ ...dishState, sizes: dishState.sizes.filter((_, i) => i !== index) });
  };

  return (
      <div> 
     <div className="flex flex-row sm:flex-row items-center justify-between p-4">
     <div className="mb-4 sm:mb-0 sm:mr-4">
     <Link to="/Owner">
    <img
    src={backarrowlogo}
    className="h-10 w-10"
    alt="Back Arrow"
      />
      </Link>
     </div>
     <div className="flex-1">  
     <h1 className="text-3xl font-bold text-center mb-2">Management</h1>
    </div>
    </div>
    <div className="container mx-auto p-6">
      <Calling/>
     <OrderPopup />

      
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Add New Dish</h2>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={newDish.name}
            onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Category"
            value={newDish.category}
            onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Rating"
            value={newDish.rating}
            onChange={(e) => setNewDish({ ...newDish, rating: e.target.value })}
            className="border p-2 rounded"
          />
          {newDish.sizes.map((size, index) => (
            <div key={index} className="flex space-x-4 items-center">
              <input
                type="text"
                placeholder="Size"
                value={size.size}
                onChange={(e) =>
                  handleSizeChange(index, 'size', e.target.value, setNewDish, newDish)
                }
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Price"
                value={size.price}
                onChange={(e) =>
                  handleSizeChange(index, 'price', e.target.value, setNewDish, newDish)
                }
                className="border p-2 rounded"
              />
              <button
                onClick={() => removeSizeField(index, setNewDish, newDish)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() => addSizeField(setNewDish, newDish)}
            className="bg-green-500 text-white p-2 rounded"
          >
            Add Size
          </button>
          <input
            type="text"
            placeholder="Image URL"
            value={newDish.image}
            onChange={(e) => setNewDish({ ...newDish, image: e.target.value })}
            className="border p-2 rounded"
          />
          <textarea
            placeholder="Description"
            value={newDish.description}
            onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
            className="border p-2 rounded"
          />
          <button onClick={handleAdd} className="bg-blue-500 text-white p-2 rounded">
            Add Dish
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">Dishes</h2>
        {Array.isArray(dishes) && dishes.length > 0 ? (
          dishes.map((dish) => (
            <div key={dish._id} className="border p-4 rounded mb-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{dish.name}</h3>
                <p>Category: {dish.category}</p>
                <p>Rating: {dish.rating}</p>
                <div>
                  {dish.sizes.map((size) => (
                    <p key={size.size}>
                      {size.size}: {size.price}
                    </p>
                  ))}
                </div>
                <img src={dish.image} alt={dish.name} className="w-32 h-32 object-cover" />
                <p>{dish.description}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setEditDish(dish)}
                  className="bg-yellow-500 text-white p-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(dish._id)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No dishes available</p>
        )}
      </div>

      {editDish && (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center px-4 sm:px-0">
        <div className="bg-white p-6 rounded shadow-lg w-full max-w-md sm:max-w-lg md:max-w-2xl">
            <h2 className="text-2xl font-semibold mb-4">Edit Dish</h2>
            <div className="flex flex-col space-y-4">
                <input
                    type="text"
                    placeholder="Name"
                    value={editDish.name}
                    onChange={(e) => setEditDish({ ...editDish, name: e.target.value })}
                    className="border p-2 rounded"
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={editDish.category}
                    onChange={(e) => setEditDish({ ...editDish, category: e.target.value })}
                    className="border p-2 rounded"
                />
                <input
                    type="number"
                    placeholder="Rating"
                    value={editDish.rating}
                    onChange={(e) => setEditDish({ ...editDish, rating: e.target.value })}
                    className="border p-2 rounded"
                />
                {editDish.sizes.map((size, index) => (
                    <div key={index} className="flex space-x-4 items-center">
                        <input
                            type="text"
                            placeholder="Size"
                            value={size.size}
                            onChange={(e) =>
                                handleSizeChange(index, 'size', e.target.value, setEditDish, editDish)
                            }
                            className="border p-2 rounded w-full"
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={size.price}
                            onChange={(e) =>
                                handleSizeChange(index, 'price', e.target.value, setEditDish, editDish)
                            }
                            className="border p-2 rounded w-full"
                        />
                        <button
                            onClick={() => removeSizeField(index, setEditDish, editDish)}
                            className="bg-red-500 text-white p-2 rounded"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    onClick={() => addSizeField(setEditDish, editDish)}
                    className="bg-green-500 text-white p-2 rounded"
                >
                    Add Size
                </button>
                <input
                    type="text"
                    placeholder="Image URL"
                    value={editDish.image}
                    onChange={(e) => setEditDish({ ...editDish, image: e.target.value })}
                    className="border p-2 rounded"
                />
                <textarea
                    placeholder="Description"
                    value={editDish.description}
                    onChange={(e) => setEditDish({ ...editDish, description: e.target.value })}
                    className="border p-2 rounded"
                />
                <div className="flex space-x-4">
                    <button onClick={handleUpdate} className="bg-green-500 text-white p-2 rounded">
                        Update Dish
                    </button>
                    <button onClick={() => setEditDish(null)} className="bg-gray-500 text-white p-2 rounded">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
)}

    </div>
    </div>
  );
};

export default DishManagement;
