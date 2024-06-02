import React, { useState } from 'react';

const AddToCartModal = () => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleAddToCart = () => {
    // Add logic to add item to cart
    console.log('Item added to cart');
    closeModal();
  };

  return (
    <div>
      <button style={buttonStyle} onClick={openModal}>Add to Cart</button>

      {showModal && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <span style={closeButtonStyle} onClick={closeModal}>&times;</span>
            <h2>Add to Cart</h2>
            <p>Are you sure you want to add this item to your cart?</p>
            <button style={addToCartButtonStyle} onClick={handleAddToCart}>Add to Cart</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Inline CSS styles
const buttonStyle = {
  padding: '10px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
};

const modalStyle = {
  display: 'block',
  position: 'fixed',
  zIndex: 1,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)',
};

const modalContentStyle = {
  backgroundColor: 'white',
  margin: '20% auto',
  padding: '20px',
  border: '1px solid #888',
  width: '60%',
};

const closeButtonStyle = {
  color: '#aaaaaa',
  float: 'right',
  fontSize: '28px',
  fontWeight: 'bold',
};

const addToCartButtonStyle = {
  padding: '10px',
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
};

export default AddToCartModal;
