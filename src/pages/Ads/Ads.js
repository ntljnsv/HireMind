import React, {useState, useEffect} from "react";
import "./ads.css";
import {NewAdPopup} from "./components/NewAdPopup";
import {Ad} from "../../components/ad/Ad";
import {collection, query, where, onSnapshot} from "firebase/firestore";
import {db} from "../../config/auth/FirebaseConfig";
import {UserAuth} from "../../context/Auth";



export const Ads = () =>{
    const {user} = UserAuth()
    const [visible, setVisible] = useState(false)
    const [ads, setAds] = useState([])

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
                        prevState.filter((ad) => ad.id !== change.doc.data().id)
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


    return(
        <>
            <div className="adsContainer">
                <h1 className="adsTitle">Your Ads</h1>
                <button className="btn addAdButton" onClick={newAdVisibility}>+ Add job ad</button>
                {!ads.length &&
                    <div className="noAds">No ads yet...</div>}
                {ads && ads.map((ads, index)=>{
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