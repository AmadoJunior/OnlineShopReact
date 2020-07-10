import React from "react";
import {Link} from "react-router-dom";
import styles from "./Cart.module.css";

function Cart(props){
    if(!props.visibility){
        return null;
    }
    return (
        <div className={styles.container}>
            <h1>Cart</h1>
            <Link to="/checkout" className={styles.btn}>Checkout</Link>
        </div>
    )
}

export default Cart;