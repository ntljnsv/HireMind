import React, {useState, useEffect} from "react";
import "./ad.css";
import {Card, Image} from "react-bootstrap";
import {UserAuth} from "../../context/Auth";
import {db} from "../../config/auth/FirebaseConfig";
import {doc, onSnapshot, deleteDoc, updateDoc, arrayUnion, arrayRemove, getDoc} from "firebase/firestore";
import {Link} from "react-router-dom";
import applyIcon from "../../assets/images/apply.png";
import {AppliedUsers} from "./components/AppliedUsers";

export const Ad = ({adData, typeUser, applicationsPage}) =>{
    const {user} = UserAuth()
    const [name, setName] = useState()
    const [photo, setPhoto] = useState()
    const users = adData.appliedUsers
    const ad = {
        company: adData.company,
        title: adData.title,
        salary: adData.salary,
        yrsExp: adData.yrsExperience,
        location: adData.location,
        tags: adData.tags,
        date: adData.date
    }

    const [userVisibility, setUserVisibility] = useState(false)
    let appliedUsers = []


    useEffect(()=>{
        const unsubscribe = onSnapshot(doc(db, "companies", ad.company), (doc) =>{
            setName(doc.get("companyName"))
            setPhoto(doc.get("photoURL"))
        })
        return () =>{
            unsubscribe()
        }
    },[])

    const deleteAd = async() =>{
        const docSnap = getDoc(doc(db, "ads", user.uid+"-"+ad.title)).then((doc)=>{
            appliedUsers = doc.get("appliedUsers")
        }).then(()=>{
                if(appliedUsers){
                    appliedUsers.forEach((appliedUser)=>{
                        updateDoc(doc(db, "users", appliedUser), {
                            applications: arrayRemove(ad.company + "-"+ad.title)
                        })
                    })
                }
            }
        ).catch((err)=>console.log(err))
        await deleteDoc(doc(db, "ads", user.uid+"-"+ad.title))
    }

    const applicationAd = async() =>{
        await updateDoc(doc(db, "users", user.uid), {
            applications: arrayUnion(ad.company + "-"+ad.title)
        })
        await updateDoc(doc(db, "ads", ad.company+"-"+ad.title),{
            appliedUsers: arrayUnion(user.uid)
        })
    }

    const deleteApplication = async() =>{
        await updateDoc(doc(db, "users", user.uid), {
            applications: arrayRemove(ad.company + "-"+ad.title)
        })
        await updateDoc(doc(db, "ads", ad.company+"-"+ad.title),{
            appliedUsers: arrayRemove(user.uid)
        })
    }


    const viewAppliedUsers = () =>{
        if(userVisibility)
            setUserVisibility(false)
        else
            setUserVisibility(true)
    }




    return(

            <Card className="adCard">
                <Link to={"/ad/"+ad.company+"-"+ad.title} className="adLink">
                    <div className="companyInfo">
                        <div className="companyPhotoContainer">
                            <img src={photo} alt="Profile picture" className="companyPhoto"/>
                        </div>
                        <h5 className="adData">{name}</h5>
                    </div>
                    <div className="adInfo">
                        <h1 className="adData"><span>{ad.title}</span></h1>
                        <h5>Salary: <span className="adData">${ad.salary}/mth</span></h5>
                        <h5>Experience: <span className="adData">{ad.yrsExp} years</span></h5>
                        <h5>Location: <span className="location adData">{ad.location}</span></h5>
                        <div className="adDate">{ad.date}</div>
                        <hr/>
                        <div className="adTags">
                            {ad.tags && ad.tags.map((tags, index) =>{
                                return(
                                    <div key={index}>
                                        <span className="tags">{tags}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </Link>
                {typeUser === "company" && applicationsPage === true && <button className="deleteButton" onClick={deleteAd}>x</button>}
                {typeUser === "user" && applicationsPage === false && <button className="applicationButton" onClick={applicationAd}>
                    <Image src={applyIcon} className="applyIcon"/>
                </button>}
                {typeUser === "user" && applicationsPage === true && <button className="deleteButton" onClick={deleteApplication}>x</button>}
                {typeUser === "company" && applicationsPage === true && <button className="appliedUsers btn btn-dark" onClick={viewAppliedUsers}>Applied Users</button>}
                {userVisibility && <AppliedUsers users={users} changeVisibility={viewAppliedUsers}/>}
            </Card>
    )
}