import axios from "axios";
import {returnErrors} from './errorReducer'


export const USER_LOADING = "USER_LOADING";
export const USER_LOADED = "USER_LOADED";
export const AUTH_ERROR = "AUTH_ERROR";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAIL = "REGISTER_FAIL";
export const ADD_TO_CART_USER = "ADD_TO_CART_USER";
export const REMOVE_CART_ITEM_USER = "REMOVE_CART_ITEM_USER";


const initialState={
    token:localStorage.getItem('token'),
    isAuthenticated:null,
    isLoading:false,
    user: null
}

export default function(state = initialState, action) {
    switch (action.type) {
      case USER_LOADING:
        return {
          ...state,
          isLoading: true
        };
      case USER_LOADED:
        return {
          ...state,
          isAuthenticated: true,
          isLoading: false,
          user: action.payload
        };
      case LOGIN_SUCCESS:
      case REGISTER_SUCCESS:
        localStorage.setItem('token', action.payload.token);
        return {
          ...state,
          ...action.payload,
          isAuthenticated: true,
          isLoading: false
        };
      case AUTH_ERROR:
      case LOGIN_FAIL:
      case LOGOUT_SUCCESS:
      case REGISTER_FAIL:
        localStorage.removeItem('token');
        return {
          ...state,
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false
        };
      case ADD_TO_CART_USER:
          return{
              ...state,
              user:{
                  ...state.user,
                  cart:action.payload
              }
          }
      case REMOVE_CART_ITEM_USER:
          return{
              ...state,
              user:{
                  ...state.user,
                  cart:action.payload.cart
              }
          }
      default:
        return state;
    }
  }

  export const loadUser=()=>(dispatch,getState)=>{
      
    // User loading
    dispatch({
        type:USER_LOADING
    })
    
    axios.get('/api/auth/user',tokenConfig(getState)).then(res=>dispatch({
        type:USER_LOADED,
        payload:res.data
    })).catch(err=>{
        dispatch(returnErrors(err.response.data,err.response.status));
        dispatch({
            type:AUTH_ERROR
        })
    })
  }

// Register User
export const register=(dataToSubmit)=>dispatch=>{
   //headers
   const config = {
       headers:{
           'Content-type':"application/json"
       }
   }
   // request body
   const body = JSON.stringify(dataToSubmit);
   axios.post('/api/auth/register',body,config).then(res=>dispatch({
       type:REGISTER_SUCCESS,
       payload:res.data
   })).catch(err=>{
    dispatch(returnErrors(err.response.data,err.response.status,'REGISTER_FAIL'));
       dispatch({
           type:REGISTER_FAIL
       })
   })
}

//Login User
export const login = (dataToSubmit) => (dispatch) => {
    // Headers
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
  
    // Request body
    const body = JSON.stringify(dataToSubmit);
  
    axios
      .post('/api/auth/login', body, config)
      .then(res =>
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data
        })
      )
      .catch(err => {
        dispatch(
          returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL')
        );
        dispatch({
          type: LOGIN_FAIL
        });
      });
  };


//Logout User
export const logout =()=>{
    return {
        type:LOGOUT_SUCCESS
    }
}

// user add a product to his/her cart
export const addToCart = (_id) =>(dispatch,getState)=> {
    let data={
        'id':_id
    }
    axios
      .post(`/api/auth/addToCart?productId=${_id}`,data,tokenConfig(getState))
      .then(res => dispatch({
        type: ADD_TO_CART_USER,
        payload: res.data
      }));
 
  };

  // remove a product from his/her cart
  export const removeCartItem = (id) =>(dispatch,getState)=> {
    axios
      .get(`/api/auth/removeFromCart?_id=${id}`,tokenConfig(getState))
      .then(res => {
        res.data.cart.forEach(item=>{
          res.data.cartDetail.forEach((k,i)=>{
            if(item.id===k._id){
              res.data.cartDetail[i].quantity=item.quantity
            }
          })
        })

        dispatch({
            type: REMOVE_CART_ITEM_USER,
            payload: res.data
        })

      });
  
    
  
  
  };
// Setup config/headers and token
  export const tokenConfig= getState =>{
      // get token from localstorage
    const token = getState().auth.token;
    // Headers
    let config = {
        headers:{
            'Content-Type':'application/json'
        }
    }
    // if token, add to headers
    if(token){
        config.headers['x-auth-token']=token;
    }
    return config;
  }