import React, {useContext} from "react";
import UserContext from "./../../../../Context/UserContext";
import {Link} from "react-router-dom";
import styles from "./Cart.module.css";
import rm from "./../../../../assets/rm.png";

function Cart(props){
    const userContext = useContext(UserContext);

    if(!props.visibility){
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.triangle}></div>
            <h3>Cart</h3>
            <ul>
            {
                userContext.cart.map((item) => {
                    return(
                        <li
                        key={item._id}>
                        <img 
                        alt={item.name}
                        src={rm} 
                        className={styles.rm}
                        onClick={() => userContext.rmFromCart(item._id)}>
                        </img>
                        {item.name}
                        </li>
                    )
                })
            }
            </ul>
            {
                !userContext.empty ? <Link to="/checkout" className="btn" onClick={props.handlePopUp}>Checkout</Link> : null
            }
        </div>
    )
}

export default Cart;