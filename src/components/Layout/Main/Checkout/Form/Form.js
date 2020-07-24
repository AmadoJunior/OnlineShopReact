import React, {useState, useContext} from "react";
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
//CSS
import styles from "./Form.module.css";
import UserContext from "../../../../../Context/UserContext";

function Form(props){
    //Render
    let form = null;
    //Context
    const userContext = useContext(UserContext);
    //State
    const stripe = useStripe();
    const elements = useElements();
    const [validAddressStatus, updateAddressStatus] = useState(false);
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
    const validateAddress = async() => {
        return new Promise((resolve, reject) => {
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
                    resolve(true);
                } else if(data.XAVResponse.AmbiguousAddressIndicator === ""){
                    const candidate = data.XAVResponse.Candidate.AddressKeyFormat || data.XAVResponse.Candidate[0].AddressKeyFormat;
                    setError(`Did you mean: "${candidate.AddressLine}, ${candidate.Region}"? `);
                    resolve(false);
                } else if(data.XAVResponse.NoCandidatesIndicator === ""){
                    setError("Ambiguous Address: No Candidates Found");
                    resolve(false);
                }
            })
            .catch(e => {
                console.log(e);
                setError("Failed to Verify: Check Country Code");
                return false;
            })
        })
        
    }

    const storePurchaseData = async(paymentIntent) => {
        fetch("api/order/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                paymentIntent: paymentIntent,
                shippingDetails: details,
                items: props.cart
            })
        })
    }
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
        let addressResult = await validateAddress();
        updateAddressStatus(addressResult);

        //Creating payment method
        let {error, paymentMethod} = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement)
        })
        //If payment method successfully added
        if(!error && validAddressStatus){
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
                    /**
                     * Setting order status to true will display the successful order screen
                     * and display the details passed into order.details and shipping details
                     */
                    setOrder({
                        status: true,
                        details: result.paymentIntent
                    })
                    //Storing Order in Database
                    storePurchaseData(result.paymentIntent);
                    //Emptying the cart
                    userContext.emptyCart();
                    console.log("Successful Order Details: ");
                    console.log(details);
                } else {
                    console.log("Error Signing Payment Intent")
                    setError(result.error.message);
                    setDisabledBtn(false);
                }
            })
        } else if(validAddressStatus) {
            //Set the error coming from stripe.createPaymentMethod
            setError(error.message);
        }
    }

    //Render
    if(!order.status){
        form = (
            <form onSubmit={handleSubmit} className={styles.formContainer}>

                <label htmlFor="FirstName"
                    className="inputLabel">First Name: 
                </label>
                <input 
                    className="input"
                    type="text" 
                    placeholder="First Name" 
                    id="FirstName"
                    onChange={setFirstName}
                ></input>

                <label htmlFor="LastName"
                    className="inputLabel">Last Name: 
                </label>
                <input
                    className="input"
                    placeholder="Last Name"
                    id="LastName"
                    type="text"
                    onChange={setLastName}
                ></input>

                <label htmlFor="Address1"
                    className="inputLabel">Address Line 1: 
                </label>
                <input
                    className="input"
                    placeholder="Address Line 1"
                    id="Address1"
                    type="text"
                    onChange={setAddress1}>
                </input>

                <label htmlFor="Address2"
                    className="inputLabel">Address Line 2: 
                </label>
                <input
                    className="input"
                    placeholder="Address Line 2"
                    id="Address2"
                    type="text"
                    onChange={setAddress2}>
                </input>

                <label htmlFor="City"
                    className="inputLabel">City: 
                </label>
                <input
                    className="input"
                    placeholder="City"
                    id="City"
                    type="text"
                    onChange={setCity}>
                </input>

                <label htmlFor="State"
                    className="inputLabel">State: 
                </label>
                <input
                    className="input"
                    placeholder="State"
                    id="State"
                    type="text"
                    onChange={setState}> 
                </input>

                <label htmlFor="Zip"
                    className="inputLabel">ZIP: 
                </label>
                <input
                    className="input"
                    placeholder="ZIP"
                    id="Zip"
                    type="text"
                    onChange={setZipCode}>
                </input>

                <label htmlFor="CountryCode"
                    className="inputLabel">Country Code: 
                </label>
                <input
                    className="input"
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
                <div className="errorDiv">
                <span className="errorMsg">{error}</span>
                {
                    !disabledBtn && stripe ? <button className="btn" type="submit">Submit</button> : <span className={styles.submiting}>Submiting...</span>
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
        <div className="cardContainer">
            {form}
        </div>
    )
}

export default Form;