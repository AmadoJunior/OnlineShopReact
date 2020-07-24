import React from "react";
import styles from "./Account.module.css";

function Account() {
    return (
        <div className={styles.container}>
            <h3>Account</h3>
            <label htmlFor="userName" className={styles.detailLabel}>User Name: </label>
            <input type="text" id="userName" className={styles.input} placeHolder="User Name"></input>
            <label htmlFor="email" className={styles.detailLabel}>Email: </label>
            <input type="text" id="email" className={styles.input} placeHolder="Email"></input>
            <label htmlFor="password" className={styles.detailLabel}>Password: </label>
            <input type="text" id="password" className={styles.input} placeHolder="Password"></input>

            <div className={styles.errorDiv}>
                <span className={styles.errorMsg}>Error</span>
                <button className={styles.btn}>Sign in</button>
                <span className={styles.switch}>Sign Up</span>
            </div>
            
        </div>
    )
}

export default Account;