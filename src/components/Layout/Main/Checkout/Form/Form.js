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
    const [details, setDetails] = useState({
        firstName: null,
        lastName: null,
        address1: null,
        address2: null,
        city: null,
        state: null,
        zipCode: null,
        countryCode: null
    });
    const [disabledBtn, setDisabledBtn] = useState(false);
    const [error, setError] = useState(null);
    const [order, setOrder] = useState({
        status: false,
        details: {}
    });

    //Details
    const setFirstName = (e) => {
        let tempDetails = {...details};
        tempDetails.firstName = e.target.value;
        setDetails(tempDetails);
    }
    const setLastName = (e) => {
        let tempDetails = {...details};
        tempDetails.lastName = e.target.value;
        setDetails(tempDetails);
    }
    const setAddress1 = (e) => {
        let tempDetails = {...details};
        tempDetails.address1 = e.target.value;
        setDetails(tempDetails);
    }
    const setAddress2 = (e) => {
        let tempDetails = {...details};
        tempDetails.address2 = e.target.value;
        setDetails(tempDetails);
    }
    const setCity = (e) => {
        let tempDetails = {...details};
        tempDetails.city = e.target.value;
        setDetails(tempDetails);
    }
    const setState = (e) => {
        let tempDetails = {...details};
        tempDetails.state = e.target.value;
        setDetails(tempDetails);
    }
    const setZipCode = (e) => {
        let tempDetails = {...details};
        tempDetails.zipCode = e.target.value;
        setDetails(tempDetails);
    }
    const setCountryCode = (e) => {
        let tempDetails = {...details};
        tempDetails.countryCode = e.target.value;
        setDetails(tempDetails);
    }

    //Methods
    const handleSubmit = async(event) => {
        event.preventDefault();
        //Error prevention
        if(props.cart <= 1){
            setError("Cart is Empty");
            return;
        }
        for(let key in details){
            if(details[key] === null || details[key].length <= 0){
                setError("Missing Required Fields");
                return;
            }
        }
        //Validating Address
        fetch("/api/validateAddress", {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(details)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if(data.XAVResponse.ValidAddressIndicator === ""){
                console.log("Valid Address");
            } else if(data.XAVResponse.AmbiguousAddressIndicator === ""){
                const candidate = data.XAVResponse.Candidate.AddressKeyFormat || data.XAVResponse.Candidate[0].AddressKeyFormat;
                setError(`Did you mean: "${candidate.AddressLine}, ${candidate.Region}"? `);
            } else if(data.XAVResponse.NoCandidatesIndicator === ""){
                setError("Ambiguous Address: No Candidates Found");
            }
        })
        .catch(e => {
            console.log(e);
            setError("Failed to Verify: Check Country Code");
            return;
        })

        //Creating payment method
        let {error, paymentMethod} = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement)
        })
        //If payment method successfully added
        if(!error){
            //Retrieving items to order and the payment method ID 
            let cardProductsIDArray = [];
            const {id} = paymentMethod;
            for(let items of props.cart){
                cardProductsIDArray.push(items._id);
            }
            //Object to be sent to the back end
            let orderRequest = {
                productIDArray: cardProductsIDArray,
                id: id,
                details: details
            }
            console.log("Payment Method ID: " + id);

            setDisabledBtn(true);
            setError(null);

            fetch("/api/order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(orderRequest)
            })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log("Client Secret: " + data.client_secret);
                return stripe.confirmCardPayment(data.client_secret, {
                    payment_method: {
                        card: elements.getElement(CardElement),
                        billing_details: {
                            name: `${details.firstName} ${details.lastName}`
                        }
                    }
                });

            })
            .then((result) => {
                console.log("Client Secret Response Object: ");
                console.log(result);
                if(result.paymentIntent && result.paymentIntent.status === "succeeded"){
                    console.log("Payment Intent Success");
                    setOrder({
                        status: true,
                        details: result.paymentIntent
                    })
                    /**
                     * Send successful order for storing
                     * 
                     * 
                     * 
                     * 
                     */

                    fetch("api/order/add", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            paymentIntent: result.paymentIntent,
                            shippingDetails: details,
                            items: props.cart
                        })
                    })
                    cartContext.emptyCart();
                    console.log("Successful Order Details: ");
                    console.log(details);
                } else {
                    console.log("Error Signing Payment Intent")
                    setError(result.error.message);
                    setDisabledBtn(false);
                }
            })
        } else {
            //Set the error coming from stripe.createPaymentMethod
            setError(error.message);
        }
    }

    //Render
    if(!order.status){
        form = (
            <form onSubmit={handleSubmit} className={styles.formContainer}>

                <label htmlFor="FirstName"
                    className={styles.detailLabel}>First Name: 
                </label>
                <input 
                    className={styles.details}
                    type="text" 
                    placeholder="First Name" 
                    id="FirstName"
                    onChange={setFirstName}
                ></input>

                <label htmlFor="LastName"
                    className={styles.detailLabel}>Last Name: 
                </label>
                <input
                    className={styles.details}
                    placeholder="Last Name"
                    id="LastName"
                    type="text"
                    onChange={setLastName}
                ></input>

                <label htmlFor="Address1"
                    className={styles.detailLabel}>Address Line 1: 
                </label>
                <input
                    className={styles.details}
                    placeholder="Address Line 1"
                    id="Address1"
                    type="text"
                    onChange={setAddress1}>
                </input>

                <label htmlFor="Address2"
                    className={styles.detailLabel}>Address Line 2: 
                </label>
                <input
                    className={styles.details}
                    placeholder="Address Line 2"
                    id="Address2"
                    type="text"
                    onChange={setAddress2}>
                </input>

                <label htmlFor="City"
                    className={styles.detailLabel}>City: 
                </label>
                <input
                    className={styles.details}
                    placeholder="City"
                    id="City"
                    type="text"
                    onChange={setCity}>
                </input>

                <label htmlFor="State"
                    className={styles.detailLabel}>State: 
                </label>
                <input
                    className={styles.details}
                    placeholder="State"
                    id="State"
                    type="text"
                    onChange={setState}> 
                </input>

                <label htmlFor="Zip"
                    className={styles.detailLabel}>ZIP: 
                </label>
                <input
                    className={styles.details}
                    placeholder="ZIP"
                    id="Zip"
                    type="text"
                    onChange={setZipCode}>
                </input>

                <label htmlFor="CountryCode"
                    className={styles.detailLabel}>Country Code: 
                </label>
                <input
                    className={styles.details}
                    placeholder="Country Code"
                    id="CountryCode"
                    type="text"
                    onChange={setCountryCode}>
                </input>

                <CardElement className={styles.cardElement}/>
                <ul>
                    <h4>Your Order: </h4>
                    {
                        props.cart.map((item) => {
                            return(
                                <li key={item._id}>{item.name}: ${item.price}</li>
                            )
                        })
                    }
                </ul>
                <div className={styles.errorDiv}>
                <span className={styles.errorMsg}>{error}</span>
                {
                    !disabledBtn && stripe ? <button className={styles.pay} type="submit">Pay</button> : <span className={styles.submiting}>Submiting...</span>
                }
                </div>
            </form>
        )
    } else {
        form = (
            <div>
                <h3>Thank you, {details.firstName} {details.lastName}!</h3>
                <p>Amount Charged: ${order.details.amount/100}</p>
                <p>Order ID: {order.details.id}</p>
                <p>Shipping Address: {details.address1}, {details.address2}</p>
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