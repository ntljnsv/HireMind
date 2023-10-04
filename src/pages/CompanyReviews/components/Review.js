import React, {useEffect, useState} from "react";
import "../companyReviews.css";
import {UserAuth} from "../../../context/Auth";
import {Card} from "react-bootstrap";
import {doc, onSnapshot} from "firebase/firestore";
import {db} from "../../../config/auth/FirebaseConfig";
import {Link} from "react-router-dom";

export const Review = ({reviewData, userPoster}) =>{
    const {user} = UserAuth()
    const [photo, setPhoto] = useState()
    const [name, setName] = useState("")


    useEffect(()=>{
        if(userPoster){
            const getUser = () =>{
                const unsubscribe = onSnapshot(doc(db, "users", userPoster), (doc) =>{
                    setPhoto(doc.get("photoURL"))
                    setName(doc.get("firstName")+" "+doc.get("lastName"))
                })
                return () =>{
                    unsubscribe()
                }
            }
            getUser()
        }
    }, [userPoster, user])

    return(
        <>
            <Card className="addReview">
                <div className="pictureContainer">
                    {user && <img src={photo} className="profilePicture" alt="profile picture"/>}
                </div>
                <div className="reviewData">
                    <Link to={"/user-profile/"+userPoster} className="name">
                        <div>{name}</div>
                    </Link>
                    <div className="review">{reviewData}</div>
                </div>
            </Card>
        </>
    )
}