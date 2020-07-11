import React, {useState, useEffect} from "react";
import styles from "./Products.module.css";

function Products(){

    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("/products")
        .then(res => res.json())
        .then(data => {
            setProducts(data);
        })
        .catch(e => console.log(e))
    },[]);


    return (
        <div className={styles.container}>
            <h1>Products</h1>
            <div className={styles.list}>
            {
                products.map((item) => {
                    return(
                        <div 
                        className={styles.itemContainer}
                        key={item._id}
                        >
                            <h3>{item.name}</h3>
                            <img 
                            alt="thumbNail"
                            className={styles.thumbNail}
                            src={item.imgUrl}></img>
                            <div>
                                <span className={styles.price}>${item.price}</span>
                                <button 
                                className={styles.addToCart}
                                >Add to Cart</button>
                            </div>
                            
                        </div>
                    )
                })
            }
            </div>
        </div>
    )
}

export default Products;