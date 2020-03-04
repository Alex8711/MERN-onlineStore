import React, { useEffect, useState } from "react";
import {
  Card,
  Grid,
  GridList,
  Typography,
  Button
} from "@material-ui/core";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../../reducers/authReducer";

function ProductDetailPage(props) {
  const dispatch = useDispatch();
  const productId = props.match.params.productId;
  const [product, setProduct] = useState("");
  useEffect(() => {
    axios
      .get(`/api/product/products_by_id?id=${productId}&type=single`)
      .then(res => {
        console.log(res.data)
        setProduct(res.data[0]);
      });
  }, []);

  const addToCartHandler = () => {
    dispatch(addToCart(product._id))
    alert("You have added one product to your cart");
  };

  return (
    <Grid
      container
      spacing={0}
      alignItems="center"
      justify="center"
      style={{ minHeight: "100vh" }}
    >
      <GridList>
        <Card
          style={{
            width: "300px",
            height: "600px",
            marginRight: "10px",
            elevation: 0
          }}
        >
          <img src={product.imagePath} style={{width:"250px"}}/>
        </Card>
        <Card style={{ width: "500px", height: "300px" }}>
          <Typography>{product.title}</Typography>
          <Typography>${product.price}</Typography>
          <Button
            variant="contained"
            color="secondary"
            style={{ marginTop: "10px" }}
            onClick={addToCartHandler}
          >
            Add To Cart
          </Button>
        </Card>
      </GridList>
    </Grid>
  );
}

export default ProductDetailPage;
