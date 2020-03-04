import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  GridList,
  CardHeader,
  CardContent,
  CardActionArea,
  Typography
} from "@material-ui/core";

function HomePage(props) {
  const [products, setProducts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(8);

  const getProducts = variables => {
    axios.post("/api/product/getProducts", variables).then(res => {
      if (res.data.success) {
        setProducts(res.data.products);
        console.log(res.data.products);
      } else {
        alert("Failed to fetch product data");
      }
    });
  };

  useEffect(() => {
    const variables = {
      skip: skip,
      limit: limit
    };
    getProducts(variables);
  }, []);

  return (
    <div>
      {products.length === 0 ? (
        <div>
          <h2>No post yet....</h2>
        </div>
      ) : (
        <div>
          <GridList>
            {products.map(product => (
              <Card
                key={product._id}
                style={{ width: "300px", height: "450px" }}
                onClick={() => {
                  props.history.push(`/product/${product._id}`);
                }}
              >
                <CardActionArea>
                  <img
                    style={{
                      height: "300px",
                      marginLeft:"80px"
                    }}
                    
                    src={product.imagePath}
                    alt=""
                  />
                  <CardHeader title={product.title} style={{textAlign:"center"}} />
                </CardActionArea>
                <CardContent><Typography style={{fontSize:"40px",textAlign:"center"}}>$ {product.price}</Typography></CardContent>
              </Card>
            ))}
          </GridList>
        </div>
      )}
    </div>
  );
}

export default HomePage;
