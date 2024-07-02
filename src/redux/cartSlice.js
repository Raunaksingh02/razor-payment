import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const { _id, size } = action.payload;
      const itemPresent = state.cart.find(item => item._id === _id && item.size === size);
      if (itemPresent) {
        itemPresent.quantity++;
      } else {
        state.cart.push({ ...action.payload, quantity: 1 });
      }
    },
    removeToCart: (state, action) => {
      const { _id, size } = action.payload;
      const itemPresent = state.cart.find(item => item._id === _id && item.size === size);
      if (itemPresent) {
        itemPresent.quantity--;
        if (itemPresent.quantity === 0) {
          state.cart = state.cart.filter(item => !(item._id === _id && item.size === size));
        }
      }
    },
    emptyCart: (state) => {
      state.cart = [];
    },
  },
});

export const { addToCart, removeToCart, emptyCart } = cartSlice.actions;
export const selectCartItems = state => state.cart.cart;

export default cartSlice.reducer;
