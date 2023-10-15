import React, {useEffect, useState} from "react";
import {UserData} from "./components/UserData";
import "./userProfile.css";
import {UserAuth} from "../../context/Auth";
import {AddInfo} from "./components/AddInfo";
import {useParams} from "react-router-dom";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../../config/auth/FirebaseConfig";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import {CompanyReviews} from "../CompanyReviews/CompanyReviews";
import {CompanyAds} from "./components/CompanyAds";



export const CompanyProfile = () =>{
    const {user} = UserAuth()
    const {userId} = useParams()
    const [role, setRole] = useState("")



    useEffect(()=>{
        if(user){
            const docSnap = getDoc(doc(db, "allUsers", user.uid)).then(docSnap=> {
                setRole(docSnap.get("role"))
            }).catch((err)=>console.log(err))
        }

    },[])

    useEffect(()=>{
        let name
        const docSnap = getDoc(doc(db, "companies", userId)).then((doc)=>{
            name = doc.get("companyName")
        }).then(()=>{
            document.title = name
        }).catch((err)=>console.log(err))
    },[])


    return(
        <>
            <div className="layout">
                <UserData typeUser="company" id={userId} role={role}/>
                <div className="tabs">
                    <Tabs defaultActiveKey="about"
                          transition={false}>
                        <Tab eventKey="about" title="About" className="addInfo tab">
                                <AddInfo data="history" typeUser="company" id={userId}/>
                                <AddInfo data="goals" typeUser="company" id={userId}/>
                        </Tab>
                        {userId !== user.uid &&
                            <Tab eventKey="ads" title="Ads" className="addInfo tab">
                                <CompanyAds id={userId} typeUser={role}/>
                            </Tab>
                        }
                        <Tab eventKey="Reviews" title="Reviews" className="tab">
                            <CompanyReviews typeUser={role}/>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </>
    )
}