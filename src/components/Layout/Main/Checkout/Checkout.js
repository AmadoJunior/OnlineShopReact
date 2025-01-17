import React, {useContext} from "react";
import UserContext from "./../../../../Context/UserContext";
//Stripe
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
//Componenets
import Form from "./Form/Form";
//CSS
import styles from "./Checkout.module.css";

const stripePromise = loadStripe("pk_test_51H21ztCry59PymPscIQPY4uHdvRTvr76BbhS0NZABgmNyVgkWuIBdAkjhuw6pMuOsDcGjK6KJlH8DtEkClawCe0L00lDZXAr2b");

function Checkout(){
    const userContext = useContext(UserContext);

    return (
        <div className={styles.container}>
            <Elements stripe={stripePromise}>
                <Form cart={userContext.cart}></Form>
            </Elements>
        </div>
    )
}

export default Checkout;