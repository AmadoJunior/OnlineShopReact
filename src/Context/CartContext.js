import React from "react";

const CartContext = React.createContext({
    cart:[],
    addToCart: (item) => {

    },
    rmFromCart: (id) => {

    },
    emptyCart: () => {

    },
    empty: true
})

export default CartContext;