import axios from "axios";



// export const ADD_TO_CART_USER = "ADD_TO_CART_USER";
export const GET_CART_ITEMS_USER = "GET_CART_ITEMS_USER";
export const AUTH_USER = "AUTH_USER";

export default function(state = {}, action) {
  switch (action.type) {


    case AUTH_USER:
      return { ...state, userData: action.payload };

    case GET_CART_ITEMS_USER:
      return {
        ...state,
        cartDetail: action.payload
      };

    default:
      return state;
  }
};





export const auth = () => {
  const request = axios.get("/api/auth/user").then(response => response.data);

  return {
    type: AUTH_USER,
    payload: request
  };
};



export const getCartItems = (cartItems, userCart) => {
  const request = axios
    .get(`/api/product/products_by_id?id=${cartItems}&type=array`)
    .then(res => {
      // make  CartDetail inside redux store
      // we need to add quantity data to product information
      userCart.forEach(cartItem => {
        res.data.forEach((productDetail, i) => {
          if (cartItem.id === productDetail._id) {
            res.data[i].quantity = cartItem.quantity;
          }
        });
      });
      return res.data;
    });

  return {
    type: GET_CART_ITEMS_USER,
    payload: request
  };
};




