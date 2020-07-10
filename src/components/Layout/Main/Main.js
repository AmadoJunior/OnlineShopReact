import React from "react";
import {Route} from "react-router-dom";
//Components
import Products from "./Products/Products";
import Home from "./Home/Home";
import Checkout from "./Checkout/Checkout";

function Main(){
    return (
        <div>
            <Route path="/" component={Home} exact={true}/>
            <Route path="/products" component={Products} exact={true}/>
            <Route path="/checkout" component={Checkout} exact={true}/>
        </div>
    )
}

export default Main;