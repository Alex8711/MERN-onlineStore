import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./components/LoginPage";
import SignUp from "./components/SignUpPage";
import Navbar from "./components/layout/Navbar";
import UploadProductPage from "./components/UploadProductPage";
import HomePage from "./components/homePage/HomePage";
import ProductDetailPage from "./components/productDetailPage/ProductDetailPage";
import CartPage from "./components/cartPage/CartPage";



class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Navbar />
          <div style={{marginTop:"20px"}}>
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={SignUp} />
              <Route
                exact
                path="/product/upload"
                component={UploadProductPage}
              />
              <Route
                exact
                path="/product/:productId"
                component={ProductDetailPage}
              />
              <Route exact path="/cart" component={CartPage} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}
export default App;
