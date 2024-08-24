import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BuyerContext } from './Buyercontext'; // Adjust the import path as needed

function Customerprofile() {
  const { buyer } = useContext(BuyerContext);
  const [buyerDetails, setBuyerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const buyeremail = buyer.email;
    console.log(buyeremail);
    console.log(buyer.email);
  useEffect(() => {
    const fetchBuyerDetails = async () => {
     
        try {
          const response = await axios.get(`http://localhost:1000/buyerdata?email=${buyeremail}`);
          setBuyerDetails(response.data);
        } catch (error) {
          setError('Error fetching buyer details.');
          console.error('Error fetching buyer details:', error);
        } finally {
          setLoading(false);
        }
      
    };

    fetchBuyerDetails();
  }, [buyer]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!buyerDetails) return <p>No details found.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customer Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-4">
        <p><strong>Name:</strong> {buyerDetails.name}</p>
        <p><strong>Email:</strong> {buyerDetails.email}</p>
        
      
      </div>
    </div>
  );
}

export default Customerprofile;

































