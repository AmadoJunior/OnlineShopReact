//React
import React, {useState} from 'react';
//Css
import './App.css';
//Components
import Layout from "./components/Layout/Layout";
import CartContext from "./Context/CartContext";

function App() {
  const [cart, setCart] = useState([]);
  const [empty, setEmpty] = useState(true);

  const addToCart = (item) => {
    let tempArr = [...cart];
    setEmpty(false);
    for(let product of tempArr){
      if(product._id === item._id){
        return null;
      }
    }
    tempArr.push(item);
    setCart(tempArr);
  }

  const rmFromCart = (id) => {
    let tempArr = [...cart];
    for(let i = 0; i < tempArr.length; i++){
      if(tempArr[i]._id === id){
        tempArr.splice(i, 1);
        break;
      }
    }
    setCart(tempArr);
    if(cart.length <= 0){
      setEmpty(true);
    }
  }

  const emptyCart = () => {
    setCart([]);
    setEmpty(true);
  }

  return (
    
      <CartContext.Provider
        value={{
          cart:cart,
          addToCart: addToCart,
          rmFromCart: rmFromCart,
          emptyCart: emptyCart,
          empty: empty
        }}>
        <div className="App">
          <Layout/>
        </div>
      </CartContext.Provider>
    
  );
}

export default App;
