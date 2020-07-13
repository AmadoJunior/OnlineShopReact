import React, {useContext} from "react";
import CartContext from "./../../../../Context/CartContext";
import {Link} from "react-router-dom";
import styles from "./Cart.module.css";

function Cart(props){
    const cartContext = useContext(CartContext);

    if(!props.visibility){
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.triangle}></div>
            <h1>Cart</h1>
            <ul>
            {
                cartContext.cart.map((item) => {
                    return(
                        <li
                        key={item._id}>{item.name}</li>
                    )
                })
            }
            </ul>
            {
                !cartContext.empty ? <Link to="/checkout" className={styles.btn} onClick={props.handlePopUp}>Checkout</Link> : null
            }
        </div>
    )
}

export default Cart;