import React, {useState} from "react";
import SignIn from "./signIn/signIn";
import SignUp from "./signUp/signUp";
import styles from "./Account.module.css";

function Account() {
    //State
    const [recurring, setRecurring] = useState(true);

    //Methods
    const switchView = () => {
        setRecurring(!recurring);
    }

    //Render
    let view = null;
    if(recurring){
        view = (
            <SignIn>
                <span 
                className={styles.switchBtn}
                onClick={switchView}
                >Sign Up</span>
            </SignIn>
        )
    } else {
        view = (
            <SignUp>
                <span 
                className={styles.switchBtn}
                onClick={switchView}
                >Sign In</span>
            </SignUp>
        )
    }

    return (
        <div className="cardContainer">
            <h3>Account</h3>
            {view}
        </div>
        
    )
}

export default Account;