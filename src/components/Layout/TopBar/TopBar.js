import React, {useState} from "react";
import {Link} from "react-router-dom";
import Cart from "./Cart/Cart";
import styles from "./TopBar.module.css";
import cart from "./../../../assets/cart.png";

function TopBar(){
    const [cartVisibility, setVisibility] = useState(false);

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

    return (
        <div className={styles.container}>
            <h1 className={styles.logo}>LOGO</h1>
            <input type="text" className={styles.searchBar} placeholder="Search"></input>
            <nav>
                <Link to="/" className={styles.options}>Home</Link>
                <Link to="/products" className={styles.options}>Products</Link>
                <img src={cart} onClick={handlePopUp} className={cartBtnClass}></img>
                <Cart
                visibility={cartVisibility}
                handlePopUp={handlePopUp}>
                </Cart>
            </nav>
        </div>
    )
}

export default TopBar;