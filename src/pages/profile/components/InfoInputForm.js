import React, {useState} from "react";
import "../userProfile.css";
import {Button, Card, Form, Alert} from "react-bootstrap";
import {db} from "../../../config/auth/FirebaseConfig";
import {setDoc, doc} from "firebase/firestore";
import {UserAuth} from "../../../context/Auth";



export const InfoInputForm = ({data, typeUser, changeVisibility}) =>{
    const {user} = UserAuth()
    const [info, setInfo] = useState(null)
    const [error, setError] = useState("")
    let docRef



    const handleSubmit = async (e) =>{
        e.preventDefault()
        if(user){
            if(typeUser === "user"){
                docRef = doc(db, "users", user.uid)
            } else if(typeUser === "company"){
                docRef = doc(db, "companies", user.uid)
            }
            if(info !== null){
                if(data === "bio"){
                    await setDoc(docRef,{
                        bio: info
                    }, {merge: true}).then(changeVisibility()).catch(()=>setError("Unable to update bio"))
                } else if(data === "hobbies"){
                    await setDoc(docRef,{
                        hobby: info
                    }, {merge: true}).then(changeVisibility()).catch(()=>setError("Unable to update hobbies"))
                } else if(data === "goals"){
                    await setDoc(docRef,{
                        goal: info
                    }, {merge: true}).then(changeVisibility()).catch(()=>setError("Unable to update goals"))
                } else if(data === "experience"){
                    await setDoc(docRef, {
                        experience: info
                    },{merge: true}).then(changeVisibility()).catch(()=>setError("Unable to update experience"))
                } else if(data === "education"){
                    await setDoc(docRef, {
                        education: info
                    }, {merge: true}).then(changeVisibility()).catch(()=>setError("Unable to update education"))
                }
            }
        }
    }

    return(
        <div className="overlay">
            <Card className="addDataCard">
                {error && <div className="alertContainer">
                    <Alert variant="danger">{error}</Alert>
                    <button className="btn" onClick={()=>setError("")}>x</button>
                </div>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label className="infoInputTitle">{data}</Form.Label>
                        <Form.Control as="textarea" rows={4} className="input" onChange={(e)=> setInfo(e.target.value)}/>
                    </Form.Group>
                    <div className="submitData">
                        <Button type="submit" className="btn text-center" variant="dark">Update data</Button>
                    </div>
                    <button onClick={changeVisibility} className="exit">x</button>
                </Form>
            </Card>
        </div>
    )


}