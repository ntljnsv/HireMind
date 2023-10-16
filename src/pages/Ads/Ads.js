import React, {useState, useEffect} from "react";
import "./ads.css";
import {NewAdPopup} from "./components/NewAdPopup";
import {Ad} from "../../components/ad/Ad";
import {collection, query, where, onSnapshot} from "firebase/firestore";
import {db} from "../../config/auth/FirebaseConfig";
import {UserAuth} from "../../context/Auth";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDownWideShort} from "@fortawesome/free-solid-svg-icons";




export const Ads = () =>{
    const {user} = UserAuth()
    const [visible, setVisible] = useState(false)
    const [ads, setAds] = useState([])
    const [sortedAds, setSortedAds] = useState([])
    const [viewAllAds, setViewAllAds] = useState(true)
    const [viewSortedAds, setViewSortedAds] = useState(false)

    const newAdVisibility = () =>{
        if(visible){
            setVisible(false)
        }else{
            setVisible(true)
        }
    }


    useEffect( ()=>{
        const adsRef =  collection(db, "ads")
        const q = query(adsRef, where("company", "==", user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) =>{
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    setAds(prevState => [...prevState,change.doc.data()])
                }
                if(change.type === "removed"){
                    setAds((prevState) =>
                        prevState.filter((ad) => (ad.company+"-"+ad.title) !== (change.doc.data().company+"-"+change.doc.data().title))
                    );
                }
            });
        })
        return () =>{
            unsubscribe();
        }
    },[])


    useEffect(()=>{
        document.title = "Your Ads"
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
            <div className="adsContainer">
                <h1 className="adsTitle">Your Ads</h1>
                <button className="btn addAdButton" onClick={newAdVisibility}>+ Add job ad</button>
                <div className="sortButtonContainer">
                    <button onClick={sortByDate} className="btn sortButton"><FontAwesomeIcon icon={faArrowDownWideShort} style={{color: "#096947"}} className="sort" /> Sort by date</button>
                </div>
                {!ads.length &&
                    <div className="noAds">No ads yet...</div>}
                {viewAllAds && ads && ads.map((ads, index)=>{
                    return(
                        <div key={index} className="mappedAd">
                            <Ad adData={ads} applicationsPage={true} typeUser={"company"}/>
                        </div>
                    )
                })}
                {viewSortedAds && sortedAds && sortedAds.map((ads, index)=>{
                    return(
                        <div key={index} className="mappedAd">
                            <Ad adData={ads} applicationsPage={true} typeUser={"company"}/>
                        </div>
                    )
                })}
                {visible && <NewAdPopup changeVisibility={newAdVisibility}/>}
            </div>
        </>
    )
}