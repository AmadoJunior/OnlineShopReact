import React, {useState} from "react";
import styles from "./../Account.module.css";

function SignUp(props){
    //State
    const [userDetails, updateUserDetails] = useState({
        userName: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState(false);

    //Methods
    const handleUserName = (e) => {
        e.preventDefault();
        let temp = {...userDetails};
        temp.userName = e.target.value;
        updateUserDetails(temp);
    }
    const handleEmail = (e) => {
        e.preventDefault();
        let temp = {...userDetails};
        temp.email = e.target.value;
        updateUserDetails(temp);
    }
    const handlePassword = (e) => {
        e.preventDefault();
        let temp = {...userDetails};
        temp.password = e.target.value;
        updateUserDetails(temp);
    }
    //Error Checking
    const checkEmptyFields = () => {
        for(let key in userDetails){
            if(userDetails[key].length <= 0){
                switch(key){
                    case "userName":
                        setError("Enter a User Name");
                        return false;
                    case "email":
                        setError("Enter an Email");
                        return false;
                    case "password":
                        setError("Enter a Password");
                        return false;
                }
            } else if(key === "password" && userDetails[key].length < 6){
                setError("Password needs to be at least 6 characters long")
                return false;
            }
        }
        setError("");
        return true;
    }
    //REST
    const handleSubmit = async() => {
        //Checking Empty Fields
        if(!checkEmptyFields()){
            return;
        }

        fetch("/api/users/signUp",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userDetails)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if(data.error){
                setError(data.error);
            } else {
                setError("");
                console.log(data.message);
            }
        })
        .catch(err => {
            console.log(err);
        })
    }
    return (
        <div className={styles.formContainer}>
            <label 
                htmlFor="userName" 
                className="inputLabel">User Name: 
            </label>
            <input 
                type="text" 
                id="userName" 
                className="input" 
                placeholder="User Name"
                onChange={handleUserName}
            ></input>
            <label 
                htmlFor="email" 
                className="inputLabel">Email: 
            </label>
            <input 
                type="text" 
                id="email" 
                className="input" 
                placeholder="Email"
                onChange={handleEmail}
            ></input>
            <label 
                htmlFor="password" 
                className="inputLabel">Password: 
            </label>
            <input 
                type="text" 
                id="password" 
                className="input" 
                placeholder="Password"
                onChange={handlePassword}
            ></input>

            <div className="errorDiv">
                <span className="errorMsg">{error}</span>
                <button 
                className="btn"
                onClick={handleSubmit}>Sign Up</button>
                {props.children}
            </div>
        </div>
    )
}

export default SignUp;