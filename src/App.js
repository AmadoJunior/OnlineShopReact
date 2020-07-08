import React, {useState, useEffect} from 'react';
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
//Css
import './App.css';
//Components
import Form from "./components/Form/Form";

const stripePromise = loadStripe("pk_test_51H21ztCry59PymPscIQPY4uHdvRTvr76BbhS0NZABgmNyVgkWuIBdAkjhuw6pMuOsDcGjK6KJlH8DtEkClawCe0L00lDZXAr2b");

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  
  useEffect(() => {
    fetch("/products", {
      method: "GET"
    })
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((data) => {
      console.log(data)
      setProducts(data);
    })
    .catch((err) => {
      console.log(err);
    })
  }, [])

  const addItem = (item) => {
    let tempArr = [...cart];
    let exists = false;
    for(let curItem of tempArr){
      if(curItem._id === item._id){
        exists = true;
      }
    }
    if(!exists){
      tempArr.push(item);
    }
    
    setCart(tempArr);
  }

  return (
    <div className="App">
      {
        products.map((item) => {
          return (
            <div 
            key={item._id}
            className="productContainer" 
            onClick={() => addItem(item)}
            style={{
              backgroundImage: `url("${item.imgUrl}")`,
              backgroundSize: "cover"
              }}>
              <h1>{item.name}</h1>
              <div className="inner">
                <p>${item.price}</p>
                <p>{item.description}</p>
              </div>
            </div>
          )
        })
      }

      <Elements stripe={stripePromise}>
        <Form cart={cart}></Form>
      </Elements>
      
    </div>
  );
}

export default App;
