// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: [],
  },
  reducers: {
    addToCart: (state, action) =>{
      
        const itempresent =state.cart.find((item)=>item.id===action.payload.id );
        if(itempresent){
            itempresent.quantity++;

        }
        else{
           state.cart.push({...action.payload,quantity:1})
        }
    },
    removeToCart: (state, action) =>{
      const itempresent =state.cart.find((item)=>item.id===action.payload.id);
      if(itempresent){
          itempresent.quantity--;
      }
      else{
         state.cart.push({...action.payload,quantity:0})
      }
  },
  
    emptyCart: (state) => {
      state.cart= [];
    },
   
  },
});

export const { addToCart, emptyCart,removeToCart } = cartSlice.actions;
export const selectCartItems = state => state.cart.cart;


export default cartSlice.reducer;








