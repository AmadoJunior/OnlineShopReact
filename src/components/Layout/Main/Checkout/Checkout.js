import React, {useState} from "react";
//Stripe
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
//CSS
import styles from "./Checkout.module.css";

function Checkout(){
    return (
        <div className={styles.container}>
            <h1>Checkout</h1>
        </div>
    )
}

export default Checkout;