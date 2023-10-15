import React, {useState, useEffect} from "react";
import "../userProfile.css";
import {InfoInputForm} from "./InfoInputForm";
import {UserAuth} from "../../../context/Auth";
import {doc, onSnapshot} from "firebase/firestore";
import {db} from "../../../config/auth/FirebaseConfig";



export const AddInfo = ({data, typeUser, id}) =>{
    const [info, setInfo] = useState("")
    const {user} = UserAuth()
    const [addInfo, setAddInfo] = useState(false)
    let docRef


    useEffect(()=>{
        if(typeUser === "user"){
            docRef = doc(db, "users", id)
        } else if(typeUser === "company"){
            docRef = doc(db, "companies", id)
        }
        if(docRef) {
            const unsubscribe = onSnapshot(docRef, (doc) => {
                switch (data) {
                    case "bio":
                        setInfo(doc.get("bio"))
                        break
                    case "hobbies":
                        setInfo(doc.get("hobby"))
                        break
                    case "goals":
                        setInfo(doc.get("goal"))
                        break
                    case "experience":
                        setInfo(doc.get("experience"))
                        break;
                    case "education":
                        setInfo(doc.get("education"))
                        break;
                    case "history":
                        setInfo(doc.get("history"))
                        break;
                }
            })
            return () =>{
                unsubscribe()
            }
        }
    },[])


    const makeVisible = () =>{
        setAddInfo(true)
    }
    const makeInvisible = () =>{
        setAddInfo(false)
    }


    return(
        <div className="info">
            <h1 className="infoTitle">{data}</h1>
            <div className="infoText">{info}</div>
            {!info &&
                <div className="infoText">No {data} added yet...</div>}
            {user.uid === id && <button className="btn addDataButton addInfoButton" onClick={makeVisible}>Add {data}</button>}
            {addInfo && <InfoInputForm data={data} typeUser={typeUser} changeVisibility={makeInvisible} id={id}/>}
            <hr className="hr"/>
        </div>
    )


}