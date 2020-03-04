import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { removeCartItem } from "../../reducers/authReducer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {

  Typography,

  Button
} from "@material-ui/core";
import axios from "axios";
import { useSelector } from "react-redux";

function CartPage() {
  const dispatch = useDispatch();
  const user = useSelector(state=>
    state.auth.user
  )
  const [cartDetail, setCartDetail] = useState([]);

  let idArray = [];
  user.cart.forEach(item => {
    idArray.push(item.id);
  });
  // tempoCart=user.cart;
 
  // useEffect(()=>{
  // })

  useEffect(() => {
    axios.get(
          `/api/product/products_by_id?id=${idArray}&type=array`
        ).then(res => {
        console.log(user.cart.length);
        console.log(res.data);
        user.cart.forEach(cartItem => {
          res.data.forEach((productDetail, i) => {
            if (cartItem.id === productDetail._id) {
              res.data[i].quantity = cartItem.quantity;
              
            }
          });
        });
        setCartDetail(res.data);
        console.log(res.data);
      });
  },[cartDetail.length,user.cart]);
  
  const totalPrice = (cartDetail)=>{
    let total = 0;
    cartDetail.map(item=>{
      total+=item.price*item.quantity
    })
    return total
  }
  


  const removeFromCart=(id)=>{
   
   dispatch(removeCartItem(id))
   
  }


  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
          <TableCell>Product Title</TableCell>
            <TableCell>Product Image</TableCell>
            <TableCell>Product Quantity</TableCell>
            <TableCell>Product Price</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cartDetail.map(item => (
            <TableRow key={item._id}>
            <TableCell>{item.title}</TableCell>
              <TableCell><img src={item.imagePath} style={{height:"50px",width:"25px"}}/></TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>${item.price}</TableCell>
              <TableCell><Button variant="contained" color="secondary" onClick={()=>{removeFromCart(item._id)}}>Remove</Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Typography style={{marginLeft:"20px"}} component="h3">Total : ${totalPrice(cartDetail)}</Typography>    
    </div>
  );
}

export default CartPage;
