import React from "react";
import styles from "./Account.module.css";

function Account() {
    return (
        <div className="cardContainer">
            <div className={styles.formContainer}>
                <h3>Account</h3>
                <label htmlFor="userName" className="inputLabel">User Name: </label>
                <input type="text" id="userName" className="input" placeHolder="User Name"></input>
                <label htmlFor="email" className="inputLabel">Email: </label>
                <input type="text" id="email" className="input" placeHolder="Email"></input>
                <label htmlFor="password" className="inputLabel">Password: </label>
                <input type="text" id="password" className="input" placeHolder="Password"></input>

                <div className="errorDiv">
                    <span className="errorMsg">Error</span>
                    <button className="btn">Sign in</button>
                    <span className={styles.switchBtn}>Sign Up</span>
                </div>
            
            </div>
        </div>
        
    )
}

export default Account;