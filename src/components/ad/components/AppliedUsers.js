import React, {useState, useEffect} from "react";
import {Card} from "react-bootstrap";
import {getDoc, doc} from "firebase/firestore";
import {db} from "../../../config/auth/FirebaseConfig";
import {Link} from "react-router-dom";



export const AppliedUsers = ({users, changeVisibility}) =>{
    const [appliedUsers, setAppliedUsers] = useState([])

    useEffect(()=>{
        if(users){
            const getUsers = async () =>{
                const newUsers = []
                await Promise.all(
                    users.map(async (user)=> {
                        const snap = await getDoc(doc(db, "users", user)).catch((err)=>console.log(err))
                        if (snap.exists()){
                            const user = {
                                uid: snap.id,
                                firstName: snap.get("firstName"),
                                lastName: snap.get("lastName"),
                                email: snap.get("email"),
                                photoURL: snap.get("photoURL")
                            }
                            newUsers.push(user)
                        }
                    })
                )
                setAppliedUsers(newUsers)
            }
            getUsers()
       }
    },[users])



    return(
        <div className="overlay">
            <Card className="appliedUsersContainer">
                <button className="btn exitButton" onClick={changeVisibility}>x</button>
                {!appliedUsers.length && <div className="noApplicants">No applicants yet...</div>}
                {appliedUsers && appliedUsers.map((user, index) =>{
                    console.log(appliedUsers)
                    return(
                        <div className="applicantContainer" key={index}>
                            <div className="applicantPictureContainer">
                                <img src={user.photoURL} className="applicantPicture" alt="Profile picture"/>
                            </div>
                            <Link to={"/user-profile/"+user.uid} className="name">
                                <div className="applicantData">{user.firstName} {user.lastName}</div>
                            </Link>
                            <div>|</div>
                            <div className="applicantData">{user.email}</div>
                        </div>
                    )
                })}
            </Card>
        </div>
    )
}