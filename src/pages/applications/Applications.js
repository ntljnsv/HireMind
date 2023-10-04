import React, {useEffect, useState} from "react";
import {UserAuth} from "../../context/Auth";
import {onSnapshot, doc, getDoc} from "firebase/firestore";
import {db} from "../../config/auth/FirebaseConfig";
import {Ad} from "../../components/ad/Ad";
import "./applications.css";


export const Applications = () =>{
    const {user} = UserAuth()
    const [ads, setAds] = useState([])
    const [adList, setAdList] = useState([])



    useEffect(()=>{
        const getApplications = async () =>{
            if(user){
                const unsubscribe = await onSnapshot(doc(db, "users", user.uid), (doc)=>{
                    setAdList(doc.data().applications)
                })
                return () =>{
                    unsubscribe()
                }
            }
        }
        getApplications()
    }, [user])

    useEffect(()=>{
        const getAds = async () =>{
            if(adList){
                const newAds = []
                await Promise.all(
                    adList.map(async (ad)=> {
                        const snap = await getDoc(doc(db, "ads", ad)).catch((err)=>console.log(err))
                        if (snap.exists()){
                            newAds.push(snap.data())
                        }
                    })
                )
                setAds(newAds)
            }
        }
        getAds()
    },[adList])

    useEffect(()=>{
        document.title = "Your Applications"
    },[])


    return(
        <>
            <div className="applicationsContainer">
                <h1 className="applicationsTitle">Your Applications</h1>
                {!ads.length  &&
                    <div className="noAds">No applications yet...</div>}
                {ads && ads.map((ads, index)=>{
                    return(
                        <div key={index} className="mappedAd">
                            <Ad adData={ads} applicationsPage={true} typeUser={"user"}/>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

