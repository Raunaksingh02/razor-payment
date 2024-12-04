import React, { useEffect, useState } from "react";
import axios from "axios";
import Barcode from "./Barcode.js"

const InventoryPage = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await axios.get("https://backendcafe-nefw.onrender.com/getdish");
        setDishes(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-5 text-center">
        Inventory
      </h1>
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg">
          {/* Table Head */}
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Size</th>
              <th className="py-2 px-4 text-left">Price</th>
              <th className="py-2 px-4 text-left">Stock</th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {dishes.map((dish) =>
              dish.sizes.map((size) => (
                <tr key={size._id} className="border-b">
                  <td className="py-2 px-4">{dish.name}</td>
                  <td className="py-2 px-4">{size.size}</td>
                  <td className="py-2 px-4">₹{size.price}</td>
                  <td
                    className={`py-2 px-4 font-semibold ${
                      size.stock < size.minquantity
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {size.stock}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryPage;
