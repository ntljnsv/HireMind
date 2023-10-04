import React, {useEffect} from "react";
import {SignupForm} from "./components/SignupForm";
import {Container} from "react-bootstrap";
import "./signup.css";


export const Signup = () =>{

    useEffect(()=>{
        document.title = "Sign up"
    })

    return(
        <Container className="signUpContainer">
            <div className="formContainer">
                <SignupForm/>
            </div>
        </Container>


    )
}