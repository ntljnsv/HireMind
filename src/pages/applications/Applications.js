import React, {useEffect, useState} from "react";
import {UserAuth} from "../../context/Auth";
import {onSnapshot, doc, getDoc} from "firebase/firestore";
import {db} from "../../config/auth/FirebaseConfig";
import {Ad} from "../../components/ad/Ad";
import "./applications.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownWideShort } from "@fortawesome/free-solid-svg-icons";


export const Applications = () =>{
    const {user} = UserAuth()
    const [ads, setAds] = useState([])
    const [adList, setAdList] = useState([])
    const [sortedAds, setSortedAds] = useState([])
    const [viewAllAds, setViewAllAds] = useState(true)
    const [viewSortedAds, setViewSortedAds] = useState(false)

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
        setViewSortedAds(false)
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

    const sortByDate = () =>{
        if(viewSortedAds){
            setViewAllAds(true)
            setViewSortedAds(false)
        } else{
            setViewAllAds(false)
            setViewSortedAds(true)
            const sorted = [...ads].sort((a, b) => {
                let dateA = a.date.split(".")
                let dateB = b.date.split(".")
                const dateSumA = parseInt(dateA[0]) + parseInt(dateA[1])*30 + parseInt(dateA[2])*365
                const dateSumB = parseInt(dateB[0]) + parseInt(dateB[1])*30 + parseInt(dateB[2])*365
                if(dateSumB >= dateSumA){
                    return 1
                } else{
                    return -1
                }
            })
            setSortedAds(sorted)
        }
    }


    return(
        <>
            <div className="applicationsContainer">
                <h1 className="applicationsTitle">Your Applications</h1>
                <div className="sortButtonContainer">
                    <button onClick={sortByDate} className="btn sortButton"><FontAwesomeIcon icon={faArrowDownWideShort} style={{color: "#096947"}} className="sort" /> Sort by date</button>
                </div>
                {!ads.length  &&
                    <div className="noAds">No applications yet...</div>}
                {viewAllAds && ads && ads.map((ads, index)=>{
                    return(
                        <div key={index} className="mappedAd">
                            <Ad adData={ads} applicationsPage={true} typeUser={"user"}/>
                        </div>
                    )
                })}
                {viewSortedAds && sortedAds && sortedAds.map((ads, index)=>{
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

