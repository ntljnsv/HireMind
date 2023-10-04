import React, {useEffect} from "react";
import {Container, Card, Image} from "react-bootstrap";
import "../signup.css";
import userIcon from "../../../assets/images/userIcon.png";
import businessIcon from "../../../assets/images/businessIcon.png";
import {useNavigate} from "react-router-dom";


export const SignupChoice = () =>{
    let navigate = useNavigate()

    useEffect(()=>{
        document.title = "Sign up"
    })

    return(
        <>
            <Container className={"signUpContainer"}>
                <div className="choiceContainer">
                    <Card className="choiceCard">
                        <h1>Choose type of user</h1>
                        <hr/>
                        <div className="cardsContainer">
                            <Card className="userCard" onClick={() => {navigate("/signup/user")}}>
                                <Image src={userIcon}/>
                                <div className="cardText">User</div>
                            </Card>
                            <Card className="userCard" onClick={() => {navigate("/signup/company")} }>
                                <Image src={businessIcon}/>
                                <div className="cardText">Business</div>
                            </Card>
                        </div>
                    </Card>
                </div>
            </Container>
        </>
    )
}

