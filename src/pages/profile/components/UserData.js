import React, {useState, useEffect} from "react";
import {UserAuth} from "../../../context/Auth";
import {DisplayPhoto} from "./DisplayPhoto";
import "../userProfile.css";
import {AddDataPopup} from "./AddDataPopup";
import {StarRating} from "./StarRating";
import {doc, onSnapshot} from "firebase/firestore";
import {db} from "../../../config/auth/FirebaseConfig";
import {Link} from "react-router-dom";





export const UserData = ({typeUser, id, role}) =>{
    const {user} = UserAuth()
    const [number, setNumber] = useState()
    const [age, setAge] = useState()
    const [city, setCity] = useState("")
    const [country, setCountry] = useState("")
    const [addData, setAddData] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")


    useEffect(()=>{
        if(typeUser === "user"){
            const unsubscribe = onSnapshot(doc(db, "users", id), (doc)=>{
                setName(doc.get("firstName")+" "+doc.get("lastName"))
                setEmail(doc.get("email"))
                setAge(doc.get("age"))
                setNumber(doc.get("phoneNumber"))
                setCity(doc.get("city"))
                setCountry(doc.get("country"))
            })
            return () =>{
                unsubscribe()
            }
        }
        if(typeUser === "company"){
            const unsubscribe = onSnapshot(doc(db, "companies", id), (doc)=>{
                setName(doc.get("companyName"))
                setEmail(doc.get("email"))
                setNumber(doc.get("phoneNumber"))
                setCity(doc.get("city"))
                setCountry(doc.get("country"))
            })
            return () =>{
                unsubscribe()
            }
        }
    },[])




    const makeVisible = () =>{
        setAddData(true)
    }
    const makeInvisible = () =>{
        setAddData(false)
    }




    return(
        <div className="userData">
            <DisplayPhoto typeUser={typeUser} id={id}/>
            {typeUser === "company" && <Link to={"/company-profile/"+id} className="displayName">
                <div >{name}</div>
            </Link>}
            {typeUser === "user" && <Link to={"/user-profile/"+id} className="displayName">
                <div >{name}</div>
            </Link>}
            <div className="email">{email}</div>
            {typeUser ==="company" && <StarRating id={id} typeUser={typeUser} role={role}/>}
            <hr className="hr"/>
            {typeUser==="user" && <div className="additionalData"><span>Age: </span>{age}</div>}
            <div className="additionalData"><span>City: </span>{city}</div>
            <div className="additionalData"><span>Country: </span>{country}</div>
            <div className="additionalData"><span>Phone number: </span>{number}</div>
            {user.uid === id && <button className="btn addDataButton" onClick={makeVisible}>Update data</button>}
            {addData && <AddDataPopup changeVisibility={makeInvisible} typeUser={typeUser} id={id}/>}
        </div>
    )
}
