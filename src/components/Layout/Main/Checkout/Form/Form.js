import React, {useState, useContext} from "react";
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
//CSS
import styles from "./Form.module.css";
import CartContext from "../../../../../Context/CartContext";

function Form(props){
    //Render
    let form = null;
    //Context
    const cartContext = useContext(CartContext);
    //State
    const stripe = useStripe();
    const elements = useElements();
    const [name, setName] = useState("");
    const [disabledBtn, setDisabledBtn] = useState(false);
    const [error, setError] = useState(null);
    const [order, setOrder] = useState({
        status: false,
        details: {}
    });

    const handleSubmit = async(event) => {
        event.preventDefault();
        let {error, paymentMethod} = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement)
        })

        if(!error){
            //Retrieving items to order and the payment method ID 
            let cardProductsIDArray = [];
            const {id} = paymentMethod;
            for(let items of props.cart){
                cardProductsIDArray.push(items._id);
            }
            //Object to be sent to the back end
            let order = {
                productIDArray: cardProductsIDArray,
                id: id
            }

            setDisabledBtn(true);
            setError(null);

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
                if(data.client_secret){
                    return stripe.confirmCardPayment(data.client_secret, {
                        payment_method: {
                            card: elements.getElement(CardElement),
                            billing_details: {
                                name: name
                            }
                        }
                    });
                } else {
                    return {error: data.error}
                }
            })
            .then((result) => {
                console.log(result);
                if(result.paymentIntent && result.paymentIntent.status === "succeeded"){
                    setOrder({
                        status: true,
                        details: result.paymentIntent
                    })
                    cartContext.emptyCart();
                } else {
                    setError(result.error.code);
                }
            })
        } else {
            console.log(error);
            setError(error.message);
        }
    }

    //Render
    if(!order.status){
        form = (
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
                <div className={styles.errorDiv}>
                {error}
                {
                    !disabledBtn ? <button type="submit" disabled={!stripe}>Pay</button> : null
                }
                </div>
            </form>
        )
    } else {
        form = (
            <div>
                <h3>Thank you</h3>
                <p>Amount Charged: ${order.details.amount/100}</p>
                <p>Order ID: {order.details.id}</p>
            </div>
        )
    }
    

    return (
        <div className={styles.container}>
            {form}
        </div>
    )
}

export default Form;