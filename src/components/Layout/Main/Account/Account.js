import React, {useState, useContext, useEffect} from "react";
import UserContext from "./../../../../Context/UserContext";
import SignIn from "./signIn/signIn";
import SignUp from "./signUp/signUp";
import styles from "./Account.module.css";

function Account() {
    //State
    const [recurring, setRecurring] = useState(true);

    //Context
    const userContext = useContext(UserContext);

    //Methods
    const switchView = () => {
        setRecurring(!recurring);
    }

    //Render
    let auth = null;
    let account = (
        <div>
            <h4>Welcome, You are a signed in</h4>
            <button 
            onClick={userContext.logOut}
            className="btn">Log Out</button>
        </div>
    )
    if(recurring){
        auth = (
            <SignIn>
                <span 
                className={styles.switchBtn}
                onClick={switchView}
                >Sign Up</span>
            </SignIn>
        )
    } else {
        auth = (
            <SignUp
            setRecurring={setRecurring}>
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
            {userContext.isLoggedIn ? account : auth}
        </div>
        
    )
}

export default Account;