import React, {useEffect, useState} from "react";
import {Alert, Card, Form} from "react-bootstrap";
import "../login.css";
import {Link, useNavigate} from "react-router-dom";
import {UserAuth} from "../../../context/Auth";
import {db} from "../../../config/auth/FirebaseConfig";
import {doc, getDoc} from "firebase/firestore";



export const LoginForm = () =>{
    const navigate = useNavigate()
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [error, setError] = useState("")
    const {user, loginUser} = UserAuth()




    const logIn = async(e) =>{
        e.preventDefault()
        try{
            setError("")
            await loginUser(email, password)
        }catch{
            setError("Unsuccessful log in")
        }
    }

    useEffect(()=>{
        if(user){
            const docSnap = getDoc(doc(db,"allUsers", user.uid)).then(docSnap =>{
                if(docSnap.get("role") === "user"){
                    navigate('/user-profile/'+user.uid)
                }
                if(docSnap.get("role") === "company"){
                    navigate('/company-profile/'+user.uid)
                }
            }).catch(()=>setError("Unable to log in"))
        }


    },[user])


    return(
        <>
            <Card className="formCard">
                <Card.Body className="body">
                    <h1 className="title">Log in</h1>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={logIn}>
                        <Form.Group id="Email" className="formGroup">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" required className="input" onChange={(e) => setEmail(e.target.value)}/>
                        </Form.Group>
                        <Form.Group id="Password" className="formGroup">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password"  required className="input" onChange={(e) => setPassword(e.target.value)}/>
                        </Form.Group>
                        <div className="submitContainer">
                            <button type="submit"  className="btn btn-dark submitButton">Log in</button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
            <div className="loginText">
                Don't have an account? <Link to={"/pickUser"}>Sign up</Link>
            </div>
        </>
    )
}