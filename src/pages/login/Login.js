import React, {useEffect} from "react";
import {LoginForm} from "./components/LoginForm";
import {Container} from "react-bootstrap";
import "./login.css";



export const Login = () =>{

    useEffect(()=>{
        document.title = "Log in"
    })

    return(
        <Container className="logInContainer">
            <div className="formContainer">
                <LoginForm/>
            </div>
        </Container>
    )
}