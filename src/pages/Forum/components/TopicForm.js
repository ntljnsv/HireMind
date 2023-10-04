import React, {useState} from "react";
import "../forum.css";
import {Card, Form} from "react-bootstrap";
import {db} from "../../../config/auth/FirebaseConfig";
import {doc, setDoc} from "firebase/firestore";
import {UserAuth} from "../../../context/Auth";


export const TopicForm = ({changeVisibility}) =>{
    const {user} = UserAuth()
    const [topic, setTopic] = useState("")

    const removeSpace = (str) =>{
        return(
            str.replace(" ","-")
        )
    }

    const getDate = () => {
        const today = new Date();
        const day = today.getDate()
        const month = today.getMonth()+1
        const year = today.getFullYear()
        return day+"."+month+"."+year
    }

    const handlePost = (e) =>{
        e.preventDefault()
        const topicId = removeSpace(topic)
        const date = getDate()
        setDoc(doc(db, "forumTopics", topicId), {
            poster: user.uid,
            topicTitle: topic,
            numComments: 0,
            topicId: topicId,
            date: date
        }, {merge: true}).then(changeVisibility()).catch((err)=>console.log(err))
    }




    return(
        <div className="overlay">
            <Card className="topicFormCard">
                <button className="btn exit" onClick={changeVisibility}>x</button>
                <Form className="topicForm" onSubmit={handlePost}>
                    <Form.Label>Topic: </Form.Label>
                    <Form.Control placeholder={"Enter topic title..."} onChange={(e)=>setTopic(e.target.value)}/>
                    <button className="topicFormButton btn-dark btn" type="submit">Post topic</button>
                </Form>
            </Card>
        </div>

    )
}