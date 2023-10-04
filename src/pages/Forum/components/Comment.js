import React, {useEffect, useState} from "react";
import "../forum.css";
import {UserAuth} from "../../../context/Auth";
import {Card} from "react-bootstrap";
import {doc, getDoc, onSnapshot} from "firebase/firestore";
import {db} from "../../../config/auth/FirebaseConfig";
import {Link} from "react-router-dom";

export const Comment = ({commentData, poster, date}) =>{
    const {user} = UserAuth()
    const [photo, setPhoto] = useState()
    const [name, setName] = useState("")
    const [posterRole, setPosterRole] = useState()


    useEffect(()=>{
        const getData = async () => {
            try {
                const docSnap = await getDoc(doc(db, "allUsers", poster))
                const role = docSnap.get("role")
                setPosterRole(role)
                let posterRef

                if (role === "user") {
                    posterRef = doc(db, "users", poster)
                } else {
                    posterRef = doc(db, "companies", poster)
                }

                const posterData = await getDoc(posterRef)
                if(posterData.exists()){
                    setPhoto(posterData.get("photoURL"))
                    let userName
                    if (role === "user") {
                        userName = posterData.get("firstName") + " " + posterData.get("lastName")
                    } else {
                        userName =posterData.get("companyName")
                    }
                    setName(userName)
                }


            } catch (err) {
                console.log(err)
            }
        }
        getData()

    }, [])

    return(
        <>
            <Card className="addReview">
                <div className="pictureContainer">
                    {user && <img src={photo} className="profilePicture" alt="profile picture"/>}
                </div>
                {posterRole==="user" && <div className="reviewData">
                    <Link to={"/user-profile/"+poster} className="name">
                        <div>{name}</div>
                    </Link>
                    <div className="review">{commentData}</div>
                    <div className="commentDate">{date}</div>
                </div>}
                {posterRole==="company" && <div className="reviewData">
                    <Link to={"/company-profile/"+poster} className="name">
                        <div>{name}</div>
                    </Link>
                    <div className="review">{commentData}</div>
                    <div className="commentDate">{date}</div>
                </div>}
            </Card>
        </>
    )
}