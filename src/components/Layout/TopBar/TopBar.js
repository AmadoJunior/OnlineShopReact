import React, {useState} from "react";
import {Link} from "react-router-dom";
import Cart from "./Cart/Cart";
import styles from "./TopBar.module.css";

function TopBar(){
    const [cartVisibility, setVisibility] = useState(false);

    const handlePopUp = () => {
        let temp = cartVisibility;
        setVisibility(!temp);
    }

    return (
        <div className={styles.container}>
            <h1>LOGO</h1>
            <nav>
                <Link to="/" className={styles.options}>Home</Link>
                <Link to="/products" className={styles.options}>Products</Link>
                <button onClick={handlePopUp} className={styles.options}>Cart</button>
                <Cart
                visibility={cartVisibility}>
                </Cart>
            </nav>
        </div>
    )
}

export default TopBar;