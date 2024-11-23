 const addToCart = (item, size = '', price = '') => {
    if (!size) {
      size = item.sizes[0].size;
      price = item.sizes[0].price;
    }

    const existingItem = cart.find(cartItem => cartItem.id === item._id && cartItem.size === size);
    if (existingItem) {
      const updatedCart = cart.map(cartItem => {
        if (cartItem.id === item._id && cartItem.size === size) {
          return { ...cartItem, quantity: cartItem.quantity + 1 };
        }
        return cartItem;
      });
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...item, id: item._id, size, price, quantity: 1 }]);
    }
  };

  const removeFromCart = (id, size) => {
    const updatedCart = cart.filter(item => !(item.id === id && item.size === size));
    setCart(updatedCart);
  };

  const incrementQuantity = (id, size) => {
    const updatedCart = cart.map(item => {
      if (item.id === id && item.size === size) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const decrementQuantity = (id, size) => {
    const updatedCart = cart.map(item => {
      if (item.id === id && item.size === size && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setCart(updatedCart);
  };



