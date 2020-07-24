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
    isLoggedIn: false,
    setLoggedIn: () => {

    },
    logOut: () => {

    },
    empty: true
})

export default UserContext;