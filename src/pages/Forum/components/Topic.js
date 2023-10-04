import React, {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";
import {doc, onSnapshot, collection, getDoc} from "firebase/firestore"
import {db} from "../../../config/auth/FirebaseConfig";
import {Comment} from "./Comment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import {AddComment} from "./AddComment";
import {UserAuth} from "../../../context/Auth";



export const Topic = () =>{
    const {user} = UserAuth()
    const {topicId} = useParams()
    const [title, setTitle] = useState("")
    const [numComments, setNumComments] = useState(0)
    const [comments, setComments] = useState([])
    const [poster, setPoster] = useState()
    const [posterName, setPosterName] = useState("")
    const [posterURL, setPosterURL] = useState("")
    const [posterRole, setPosterRole] = useState("")
    const [role, setRole] = useState("")
    const [date, setDate] = useState("")



    useEffect(()=>{
        const getRole = async () =>{
            const docSnap = await getDoc(doc(db, "allUsers", user.uid)).catch((err)=>console.log(err))
            const role = docSnap.get("role")
            setRole(role)
        }
        getRole()

        const getData = async() =>{
            try{
                const getTopicData = await getDoc(doc(db, "forumTopics", topicId))
                const posterId = getTopicData.get("poster")
                setTitle(getTopicData.get("topicTitle"))
                setDate(getTopicData.get("date"))
                setPoster(posterId)


                const getPosterRole = await getDoc(doc(db, "allUsers", posterId)).catch((err)=>console.log(err))
                const posterRole = getPosterRole.get("role")
                setPosterRole(posterRole)

                let posterRef
                if(posterRole === "user"){
                    posterRef = doc(db, "users", posterId)
                } else {
                    posterRef = doc(db, "companies", posterId)
                }


                const getPosterData = await getDoc(posterRef).catch((err)=>console.log(err))
                if(posterRole === "user"){
                    setPosterName(getPosterData.get("firstName")+" "+getPosterData.get("lastName"))
                } else{
                    setPosterName(getPosterData.get("companyName"))
                }
                setPosterURL(getPosterData.get("photoURL"))
                const getNumComments = onSnapshot(doc(db, "forumTopics", topicId), (snap)=>{
                    setNumComments(snap.get("numComments"))
                })
                const unsubscribe = onSnapshot(collection(db, "forumTopics", topicId, "comments"), ((snap)=>{
                    const newComments = [];
                    snap.forEach((doc)=>{
                        newComments.push(doc.data());
                    })
                    setComments(newComments);
                }))
                return () => {
                    unsubscribe()
                    getNumComments()
                }
            } catch (err){
                console.log(err)
            }
        }
        getData()
    },[])

    return(
        <div className="topicContainer">
            <h1 className="topicTitle">{title}</h1>
            {posterRole==="user" && <Link to={"/user-profile/"+poster} className="posterContainer">
                <div className="posterPictureContainer">
                    <img src={posterURL} alt="Poster Profile"/>
                </div>
                <h4> {posterName}</h4>
                </Link>}
            {posterRole==="company" && <Link to={"/company-profile/"+poster} className="posterContainer">
                <div className="posterPictureContainer">
                    <img src={posterURL} alt="Poster Profile"/>
                </div>
                <h4> {posterName}</h4>
            </Link>}
            <div className="topicData">
                <div className="numComments"><FontAwesomeIcon icon={faComments} style={{color: "#212529"}} /> {numComments}</div>
                <div><FontAwesomeIcon icon={faCalendarDays} style={{color: "#212529"}}/> {date}</div>
            </div>
            <hr/>
            {!numComments &&
                <div className="noComments">No discussion yet...</div>}
            {comments && comments.map((comment, index)=>{
                return(
                    <div key={index}>
                        <Comment commentData={comment.comment} date={comment.date} poster={comment.poster}/>
                    </div>
                )
            })}
            <AddComment topic={topicId} numComments={numComments} typeUser={role}/>
        </div>
    )
}