import React from "react";
import {Route} from "react-router-dom";
//Components
import Products from "./Products/Products";
import Home from "./Home/Home";
import Checkout from "./Checkout/Checkout";
import Account from "./Account/Account";
//Styles
import styles from "./Main.module.css";

function Main(){
    return (
        <div className={styles.container}>
            <Route path="/" component={Home} exact={true}/>
            <Route path="/products" component={Products} exact={true}/>
            <Route path="/checkout" component={Checkout} exact={true}/>
            <Route path="/account" component={Account} exact={true}/>
        </div>
    )
}

export default Main;