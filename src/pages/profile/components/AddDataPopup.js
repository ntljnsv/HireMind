import React, {useState} from "react";
import {Button, Form, FormGroup, Card, Alert} from "react-bootstrap";
import {UserAuth} from "../../../context/Auth";
import {doc, setDoc} from "firebase/firestore";
import {db} from "../../../config/auth/FirebaseConfig";






export const AddDataPopup = ({changeVisibility, typeUser}) =>{
    const {user} = UserAuth()
    const [number, setNumber] = useState(null)
    const [age, setAge] = useState(null)
    const [city, setCity] = useState(null)
    const [country, setCountry] = useState(null)
    const [error, setError] = useState("")



    const handleSubmit = (e) =>{
        e.preventDefault()
        if(number !== null){
            if(typeUser === "user"){
                setDoc(doc(db, "users", user.uid),{
                    phoneNumber: number
                },{merge: true}).then(changeVisibility()).catch(()=>setError("Unable to update phone number"))
            } else if(typeUser === "company"){
                setDoc(doc(db, "companies", user.uid),{
                    phoneNumber: number
                },{merge: true}).then(changeVisibility()).catch(()=>setError("Unable to update phone number"))
            }

        }
        if(age !== null){
            setDoc(doc(db, "users", user.uid),{
                age: age
            },{merge: true}).then(changeVisibility()).catch(()=>setError("Unable to update age"))
        }
        if(city !== null){
            if(typeUser === "user"){
                setDoc(doc(db, "users", user.uid),{
                    city: city
                },{merge: true}).then(changeVisibility()).catch(()=>setError("Unable to update city"))
            } else if(typeUser === "company"){
                setDoc(doc(db, "companies", user.uid),{
                    city: city
                },{merge: true}).then(changeVisibility()).catch(()=>setError("Unable to update city"))
            }
        }
        if(country !== null){
            if(typeUser === "user"){
                setDoc(doc(db, "users", user.uid),{
                    country: country
                },{merge: true}).then(changeVisibility()).catch(()=>setError("Unable to update country"))
            } else if(typeUser === "company"){
                setDoc(doc(db, "companies", user.uid),{
                    country: country
                },{merge: true}).then(changeVisibility()).catch(()=>setError("Unable to update country"))
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
                    <FormGroup>
                        <Form.Label>Phone Number: </Form.Label>
                        <Form.Control type="text" className="input" onChange={(e) => setNumber(e.target.value)}/>
                    </FormGroup>
                    {typeUser ==="user" && <FormGroup>
                        <Form.Label>Age: </Form.Label>
                        <Form.Control type="number" className="input" onChange={(e) => setAge(e.target.value)} min={14}/>
                    </FormGroup>}
                    <FormGroup>
                        <Form.Label>City: </Form.Label>
                        <Form.Control type="text" className="input" onChange={(e) => setCity(e.target.value)}/>
                    </FormGroup>
                    <FormGroup>
                        <Form.Label>Country: </Form.Label>
                        <Form.Control type="text" className="input" onChange={(e) => setCountry(e.target.value)}/>
                    </FormGroup>
                    <div className="submitData">
                        <Button type="submit" className="btn text-center" variant="dark">Update data</Button>
                    </div>
                    <button className="exit" onClick={changeVisibility}>x</button>
                </Form>
            </Card>
        </div>

    )
}




