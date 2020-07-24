//React
import React, {useState, useEffect} from 'react';
//Css
import './App.css';
//Components
import Layout from "./components/Layout/Layout";
import UserContext from "./Context/UserContext";

function App() {
  //State
  const [userData, setUserData] = useState({
  })
  const [cart, setCart] = useState([]);
  const [empty, setEmpty] = useState(true);

  //Effect
  useEffect(() => {
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
        setCart(data.cart)
        setEmpty(false);
      })
    }

  }, [])

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
      console.log(data);
    })
    .catch(e => {
      console.log(e);
    })
    
  }

  const updateUser = (userDataFromToken) => {
    setUserData({...userDataFromToken});
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

  return (
    
      <UserContext.Provider
        value={{
          userData: userData,
          cart:cart,
          addToCart: addToCart,
          rmFromCart: rmFromCart,
          emptyCart: emptyCart,
          updateUser: updateUser,
          empty: empty
        }}>
        <div className="App">
          <Layout/>
        </div>
      </UserContext.Provider>
    
  );
}

export default App;
