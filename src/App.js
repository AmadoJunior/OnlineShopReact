//React
import React, {useState, useEffect} from 'react';
import io from "socket.io-client";
//Css
import './App.css';
//Components
import Layout from "./components/Layout/Layout";
import UserContext from "./Context/UserContext";

let socket;

function App() {
  //State
  const [userData, setUserData] = useState({});
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [cart, setCart] = useState([]);
  const [empty, setEmpty] = useState(true);

  //Effect
  useEffect(() => {
    //Initiating IO
    socket = io();
    //Fetching User/Cart Data 
    let data = JSON.parse(localStorage.getItem("userData"));
    if(data !== null){
      setUserData(data);
      fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": "Bearer " + data.token
        },
        body: JSON.stringify({
          userName: data.userData.userName,
          email: data.userData.email
        })
      })
      .then(res => res.json())
      .then(data => {
        setLoggedIn(true);
        let cartArr = data.cart;
        setCart(cartArr)
        if(cartArr.length <= 0){
          setEmpty(true);
        } else {
          setEmpty(false);
        }
      })
      .catch(error => {
        console.log(error);
      })
    } else {
      setLoggedIn(false);
    }

  }, [])

  useEffect(() => {
    socket.on("loggedIn", () => {
      setLoggedIn(true);
    })
    return () => {
      socket.off("loggedIn")
    }
  })

  //Methods
  const addToCart = async(item) => {
    console.log("Adding to Cart")
    let tempArr = [...cart];
    setEmpty(false);

    tempArr.push(item);
    fetch("/api/users/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": "Bearer " + userData.token
      },
      body: JSON.stringify(tempArr)
    })
    .then(res => res.json())
    .then(data => {
      setCart(tempArr);
      console.log(data);
    })
    .catch(e => {
      console.log(e);
    })
    
  }

  const rmFromCart = (id) => {
    let tempArr = [...cart];
    for(let i = 0; i < tempArr.length; i++){
      if(tempArr[i]._id === id){
        tempArr.splice(i, 1);
        break;
      }
    }

    fetch("/api/users/cart/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "authorization": "Bearer " + userData.token
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      setCart(tempArr);
    })
    .catch(e => {
      console.log(e);
    })

    if(cart.length <= 1){
      setEmpty(true);
    }
  }

  const emptyCart = () => {
    setCart([]);
    setEmpty(true);
  }

  const logOut = () => {
    emptyCart();
    setUserData({});
    setLoggedIn(false);
    localStorage.removeItem("userData");
  }

  return (
    
      <UserContext.Provider
        value={{
          userData: userData,
          cart:cart,
          addToCart: addToCart,
          rmFromCart: rmFromCart,
          emptyCart: emptyCart,
          setUserData: setUserData,
          isLoggedIn: isLoggedIn,
          setLoggedIn: setLoggedIn,
          logOut: logOut,
          empty: empty
        }}>
        <div className="App">
          <Layout/>
        </div>
      </UserContext.Provider>
    
  );
}

export default App;
