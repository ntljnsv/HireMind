import React, {useEffect, useState} from "react";
import "../forum.css"
import {Button, Card, Form} from "react-bootstrap";
import {UserAuth} from "../../../context/Auth";
import {doc, setDoc, updateDoc, getDoc} from "firebase/firestore";
import {db} from "../../../config/auth/FirebaseConfig";



export const AddComment = ({topic, typeUser, numComments}) =>{
    const {user} = UserAuth()
    const [photo, setPhoto] = useState("")
    const [name, setName] = useState("")
    const [comment, setComment] = useState("")
    const commentRef = doc(db, "forumTopics", topic, "comments", numComments+"-"+user.uid)


    useEffect(()=>{
        const getData = async () =>{
            try{
                let posterRef
                if(typeUser === "user"){
                    posterRef = doc(db,"users", user.uid)
                }else{
                    posterRef = doc(db, "companies", user.uid)
                }
                const docSnap = await getDoc(posterRef)
                if(docSnap.exists()) {
                    const userPhoto = docSnap.get("photoURL")
                    let userName
                    if (typeUser === "user") {
                        userName = docSnap.get("firstName") + " " + docSnap.get("lastName")
                    } else {
                        userName = docSnap.get("companyName")
                    }
                    setPhoto(userPhoto)
                    setName(userName)
                }
            } catch (err){
                console.log(err)
            }
        }
        getData()
    }, [typeUser])

    const getDate = () => {
        const today = new Date();
        const day = today.getDate()
        const month = today.getMonth()+1
        const year = today.getFullYear()
        return day+"."+month+"."+year
    }

    const handlePost = async (e) =>{
        e.preventDefault()
        e.target.reset()
        const date = getDate()
        if(user){
            await setDoc(commentRef, {
                poster: user.uid,
                comment: comment,
                date: date
            }).catch(()=>console.log("Unable to post comment"))
            await updateDoc(doc(db, "forumTopics", topic), {
                numComments: numComments+1
            }).catch((err)=>console.log(err))
        }
    }


    return(
        <>
            <Card className="addReview">
                <div className="pictureContainer addReviewPicture">
                    {user && <img src={photo} className="profilePicture" alt="profile picture"/>}
                </div>
                <div className="reviewData">
                    <div className="name">{name}</div>
                    <Form className="reviewForm" onSubmit={handlePost}>
                        <Form.Control as="textarea" placeholder="Add comment..." className="reviewInput" onChange={(e)=>setComment(e.target.value)}/>
                        <div className="buttonContainer addComment">
                            <Button type="submit" value="userComment" className="btn text-center postButton" variant="dark">Post comment</Button>
                        </div>
                    </Form>
                </div>
            </Card>
        </>
    )
}