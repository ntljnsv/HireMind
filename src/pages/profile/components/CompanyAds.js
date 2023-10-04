import React, {useEffect, useState} from "react";
import "../userProfile.css";
import {Ad} from "../../../components/ad/Ad";
import {collection, onSnapshot, query, where} from "firebase/firestore";
import {db} from "../../../config/auth/FirebaseConfig";


export const CompanyAds = ({id, typeUser}) =>{
    const [ads, setAds] = useState([])


    useEffect( ()=>{
        const adsRef = collection(db, "ads")
        const q = query(adsRef, where("company", "==", id));
        const unsubscribe = onSnapshot(q, (snapshot) =>{
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    setAds(prevState => [...prevState,change.doc.data()])
                }
            });
        })
        return () =>{
            unsubscribe()
        }
    },[])




    return(
        <div className="ratingsContainer">
            {ads && ads.map((ads, index)=>{
                return(
                    <div key={index}>
                        <Ad adData={ads} applicationsPage={false} typeUser={typeUser}/>
                    </div>

                )
            })}
        </div>
    )

}