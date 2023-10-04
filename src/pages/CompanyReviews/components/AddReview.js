import React, {useEffect, useState} from "react";
import "../companyReviews.css";
import {Button, Card, Form} from "react-bootstrap";
import {UserAuth} from "../../../context/Auth";
import {doc, onSnapshot, setDoc} from "firebase/firestore";
import {db} from "../../../config/auth/FirebaseConfig";


export const AddReview = ({id, typeUser}) =>{
    const {user} = UserAuth()
    const [photo, setPhoto] = useState()
    const [name, setName] = useState("")
    const [review, setReview] = useState("")
    const reviewRef = doc(db, "reviews", id, "userReviews", user.uid)


    useEffect(()=>{
        const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) =>{
            setPhoto(doc.get("photoURL"))
            setName(doc.get("firstName")+" "+doc.get("lastName"))
        })
        return () => {
            unsubscribe()
        }
    }, [user])

    const handlePost = async (e) =>{
        e.preventDefault()
        e.target.reset()
        if(user){
            await setDoc(reviewRef, {
                poster: user.uid,
                review: review
            }).catch(()=>console.log("Unable to post review"))
        }
    }


    return(
        <>
            {typeUser==="user" &&
                <Card className="addReview">
                    <div className="pictureContainer addReviewPicture">
                        {user && <img src={photo} className="profilePicture" alt="profile picture"/>}
                    </div>
                    <div className="reviewData">
                        <div className="name">{name}</div>
                        <Form className="reviewForm" onSubmit={handlePost}>
                            <Form.Control as="textarea" placeholder="Add review..." className="reviewInput" onChange={(e)=>setReview(e.target.value)}/>
                            <span className="note">*Note: you can post only one review, which can be changed</span>
                            <div className="buttonContainer">
                                <Button type="submit" value="userReview" className="btn text-center postButton" variant="dark">Post review</Button>
                            </div>
                        </Form>
                    </div>
                </Card>
            }
        </>
    )
}