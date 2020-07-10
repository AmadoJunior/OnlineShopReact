import React, {useState} from "react";
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
//CSS
import styles from "./Checkout.module.css";

function Form(props){
    const stripe = useStripe();
    const elements = useElements();
    const [name, setName] = useState("");


    const handleSubmit = async(event) => {
        event.preventDefault();
        let {error, paymentMethod} = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement)
        })
        if(!error){
            let cartProductsIDArray = [];
            const {id} = paymentMethod;
            for(let items of props.cart){
                cartProductsIDArray.push(items._id);
            }
            let order = {
                productIDArray: cartProductsIDArray,
                id: id
            }
            fetch("/order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(order)
            })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data);
                return stripe.confirmCardPayment(data.client_secret, {
                    payment_method: {
                        card: elements.getElement(CardElement),
                        billing_details: {
                            name: name
                        }
                    }
                });
            })
            .then((result) => {
                console.log(result);
            })
        }
    }

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit}>
                <label htmlFor="Name">Name: </label>
                <input 
                type="text" 
                placeholder="Name" 
                id="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                ></input>
                <ul>
                    {
                        props.cart.map((item) => {
                            return(
                                <li key={item._id}>{item.name}: ${item.price}</li>
                            )
                        })
                    }
                </ul>
                <CardElement />
                <button type="submit" disabled={!stripe}>Pay</button>
            </form>
        </div>
    )
}

export default Form;