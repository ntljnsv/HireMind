import React, {useEffect} from "react";
import "./userProfile.css";
import {UserData} from "./components/UserData";
import {AddInfo} from "./components/AddInfo";
import {useParams} from "react-router-dom";
import {getDoc, doc} from "firebase/firestore";
import {db} from "../../config/auth/FirebaseConfig";



export const UserProfile = () =>{
    const {userId} = useParams()


    useEffect(()=>{
        let name
        const docSnap = getDoc(doc(db, "users", userId)).then((doc)=>{
            name = doc.get("firstName")+" "+doc.get("lastName")
        }).then(()=>{
            document.title = name
        }).catch((err)=>console.log(err))
    },[])



    return(
        <>
            <div className="layout">
                <UserData typeUser="user" id={userId}/>
                <div className="addInfo tabs">
                    <AddInfo data="bio" typeUser="user" id={userId}/>
                    <AddInfo data="experience" typeUser="user" id={userId}/>
                    <AddInfo data="education" typeUser="user" id={userId}/>
                    <AddInfo data="goals" typeUser="user" id={userId}/>
                    <AddInfo data="hobbies" typeUser="user" id={userId}/>
                </div>
            </div>
        </>

    )
}
