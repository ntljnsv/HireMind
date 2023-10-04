import React, {useState, useEffect} from "react";
import {Alert, Card, Form} from "react-bootstrap";
import "../signup.css";
import {auth, db} from "../../../config/auth/FirebaseConfig";
import { updateProfile} from "firebase/auth";
import {UserAuth} from "../../../context/Auth";
import { doc, setDoc } from "firebase/firestore";
import {Link, useParams, useNavigate} from "react-router-dom";







export const SignupForm = () =>{
    const {typeUser} = useParams()
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [userName, setUserName] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const {createUser, user} = UserAuth();


    const signIn = async(e) =>{
        e.preventDefault()
        if(password !== confirmPassword){
            setError("Incorrect confirmation password")
        } else{
            try{
                setError("")
                await createUser(email, password).catch(()=> setError("Unable to create account"))
            }catch(err){
                setError("Unable to create account")
            }
        }
    }

    useEffect(()=>{
        if(user){
            if(typeUser === "user"){
                updateProfile(user, {displayName: firstName+" "+lastName}).catch(()=>setError("Invalid username"))
                setDoc(doc(db, "users", user.uid), {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    photoURL: "https://firebasestorage.googleapis.com/v0/b/jobportal-2c308.appspot.com/o/users%2FnoUserImg.png?alt=media&token=6009351d-8f71-4cca-b41c-f3339741f467"
                }).catch(()=>setError("Unable to create account"))
                navigate('/user-profile/'+auth.currentUser.uid)
            }
            if(typeUser === "company"){
                updateProfile(user, {displayName: userName}).catch(()=>setError("Invalid username"))
                setDoc(doc(db, "companies", user.uid), {
                    companyName: userName,
                    email: email,
                    rating: 0,
                    numRatings: 0,
                    photoURL: "https://firebasestorage.googleapis.com/v0/b/jobportal-2c308.appspot.com/o/users%2FnoBusinessImg.png?alt=media&token=abcd1ee7-3100-4831-b904-d6026c82b2b0"
                }).catch(()=>setError("Unable to crate account"))
                navigate('/company-profile/'+auth.currentUser.uid)
            }
            setDoc(doc(db, "allUsers", user.uid),{
                role: typeUser
            }).catch(()=>setError("Unable to create account"))
        }
    }, [user])


    return(
        <>
            <Card className="formCard">
                <Card.Body className="body">
                    <h1 className="title">Sign up</h1>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={signIn}>
                        {typeUser === "user" && <Form.Group id="firstName" className="formGroup">
                            <Form.Label>First name</Form.Label>
                            <Form.Control type="string"  required className="input" onChange={(e) => setFirstName(e.target.value)}/>
                        </Form.Group>}
                        {typeUser==="user" && <Form.Group id="lastName" className="formGroup">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control type="string"  required className="input" onChange={(e) => setLastName(e.target.value)}/>
                        </Form.Group>}
                        {typeUser==="company" && <Form.Group id="userName" className="formGroup">
                            <Form.Label className="userNameLabel">{typeUser + " Name"}</Form.Label>
                            <Form.Control type="string"  required className="input" onChange={(e) => setUserName(e.target.value)}/>
                        </Form.Group>}
                        <Form.Group id="Email" className="formGroup">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" required className="input" onChange={(e) => setEmail(e.target.value)}/>
                        </Form.Group>
                        <Form.Group id="Password" className="formGroup">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password"  required className="input" onChange={(e) => setPassword(e.target.value)}/>
                        </Form.Group>
                        <Form.Group id="ConfirmPassword" className="formGroup">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password"  required className="input" onChange={(e) => setConfirmPassword(e.target.value)}/>
                        </Form.Group>
                        <div className="submitContainer">
                            <button type="submit"  className="btn btn-dark submitButton">Sign up</button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
            <div className="loginText">
                Already have an account? <Link to={"/login"}>Log in</Link>
            </div>
        </>
    )
}