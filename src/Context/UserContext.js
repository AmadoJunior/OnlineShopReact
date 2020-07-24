import React from "react";

const UserContext = React.createContext({
    userData: {},
    cart:[],
    addToCart: (item) => {

    },
    rmFromCart: (id) => {

    },
    emptyCart: () => {

    },
    setUserData: () => {

    },
    empty: true
})

export default UserContext;