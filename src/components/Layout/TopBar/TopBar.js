import React, {useState, useContext} from "react";
import {Link} from "react-router-dom";
import CartContext from "./../../../Context/CartContext";
import Cart from "./Cart/Cart";
import styles from "./TopBar.module.css";
import cart from "./../../../assets/cart.png";

function TopBar(){
    const [cartVisibility, setVisibility] = useState(false);
    const cartContext = useContext(CartContext);

    const handlePopUp = () => {
        let temp = cartVisibility;
        setVisibility(!temp);
    }

    //Render
    let cartBtnClass;
    if(cartVisibility){
        cartBtnClass = styles.cartOn;
    } else {
        cartBtnClass = styles.cartOff;
    }
    let hide;
    if(cartContext.cart.length <= 0){
        hide={
            visibility: `hidden`
        }
    } else {
        hide={
            visibility: `visible`
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.logo}>LOGO</h1>
            <input type="text" className={styles.searchBar} placeholder="Search"></input>
            <nav>
                <Link to="/" className={styles.options}>Home</Link>
                <Link to="/products" className={styles.options}>Products</Link>
                <Link to="/account" className={styles.options}>Account</Link>
                <img src={cart} alt="cartIcon" onClick={handlePopUp} className={cartBtnClass}></img>
                <span style={hide} className={styles.itemsInCart}>{cartContext.cart.length}</span>
                <Cart
                visibility={cartVisibility}
                handlePopUp={handlePopUp}>
                </Cart>
            </nav>
        </div>
    )
}

export default TopBar;