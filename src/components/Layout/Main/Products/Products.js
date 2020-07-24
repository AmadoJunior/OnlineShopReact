import React, {useState, useEffect, useContext} from "react";
import CartContext from "./../../../../Context/CartContext";
import styles from "./Products.module.css";

function Products(){
    const [products, setProducts] = useState([]);
    const cartContext = useContext(CartContext);

    useEffect(() => {
        fetch("/api/products")
        .then(res => res.json())
        .then(data => {
            setProducts(data);
        })
        .catch(e => console.log(e))
    },[]);


    return (
        <div className={styles.container}>
            <div className={styles.list}>
            {
                products.map((item, i) => {
                    let backgroundStyle = {
                        background: ``
                    }
                    if(i%2 === 0){
                        backgroundStyle.background = `linear-gradient(105.4deg,  #DDDDDD 0%, rgba(226, 226, 226, 0) 99.13%)`;
                    } else {
                        backgroundStyle.background = `linear-gradient(285.44deg, #DDDDDD 0%, rgba(226, 226, 226, 0) 99.13%)`;
                    }

                    return(
                        <div 
                        className={styles.itemContainer}
                        style={backgroundStyle}
                        key={item._id}
                        >
                            <img 
                            alt="thumbNail"
                            className={styles.thumbNail}
                            src={item.imgUrl}></img>
                            <div className={styles.details}>
                                <h3 className={styles.title}>{item.name}</h3>
                                <span className={styles.price}>Price: ${item.price}</span>
                                <button 
                                className="btn"
                                onClick={() => cartContext.addToCart(item)}
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