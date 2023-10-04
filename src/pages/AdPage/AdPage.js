import React, {useState, useEffect} from "react";
import "./adPage.css";
import {db} from "../../config/auth/FirebaseConfig";
import {useParams} from "react-router-dom";
import {UserData} from "../profile/components/UserData";
import {arrayUnion, doc, getDoc, updateDoc} from "firebase/firestore";
import {UserAuth} from "../../context/Auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyCheckDollar, faLocationDot, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import applyIcon from '../../assets/images/apply.png';
import {Alert, Image} from "react-bootstrap";

export const AdPage = () =>{
    const {user} = UserAuth()
    const {adId} = useParams()
    const companyId = adId.slice(0, adId.indexOf('-'))
    const [role,setRole] = useState("")
    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")
    const [salary, setSalary] = useState()
    const [yrsExp, setYearsExp] = useState()
    const [location, setLocation] = useState("")
    const [tags, setTags] = useState([])
    const [date, setDate] = useState("")
    const [success, setSuccess] = useState("")
    const [error, setError] = useState("")


    useEffect(()=> {
        if (user) {
            const getData = async () =>{
                const userDoc = getDoc(doc(db, "allUsers", user.uid)).then(userDoc => {
                    setRole(userDoc.get("role"))
                }).catch((err)=>console.log(err))
                const adDoc = getDoc(doc(db, "ads", adId)).then(adDoc =>{
                    setTitle(adDoc.get("title"))
                    setDesc(adDoc.get("description"))
                    setSalary(adDoc.get("salary"))
                    setYearsExp(adDoc.get("yrsExperience"))
                    setLocation(adDoc.get("location"))
                    setTags(adDoc.get("tags"))
                    setDate(adDoc.get("date"))
                }).catch((err)=>console.log(err))
            }
            getData()
        }
    },[user])

    useEffect(()=>{
       document.title = title
    },[title])

    const applicationAd = async() =>{
        await updateDoc(doc(db, "users", user.uid), {
            applications: arrayUnion(companyId + "-" + title)
        }).then(()=>setSuccess("You've successfully applied for this job")).catch(()=>setError("Unsuccessful application"))
        await updateDoc(doc(db, "ads", companyId + "-" + title),{
            appliedUsers: arrayUnion(user.uid)
        }).then(()=>setSuccess("You've successfully applied for this job")).catch(()=>setError("Unsuccessful application"))
    }

    const handleClose = () =>{
        if(success){
            setSuccess("")
        } else{
            setError("")
        }
    }

    return(
        <>
            <div className="layout">
                <UserData typeUser={"company"} id={companyId}/>
                <div className="addInfo tabs adPageContainer">
                    {success && <div className="alertContainer">
                        <Alert variant="success">{success}</Alert>
                        <button onClick={handleClose} className="btn alertExit">x</button>
                    </div>}

                    {error && <div className="alertContainer">
                        <Alert variant="danger" >{error}</Alert>
                        <button onClick={handleClose} className="btn alertExit">x</button>
                    </div>}

                    {role === "user" && <button className="btn applyButton" onClick={applicationAd}>
                        <Image src={applyIcon} className="applyButtonImg"/>
                    </button>}
                    <div className="adPageDate">{date}</div>
                    <h1 className="adPageTitle">{title}</h1>
                    <div className="adPageTagsContainer">
                        {tags && tags.map((tags, index) =>{
                            return(
                                <div key={index}>
                                    <span className="adPageTags">{tags}</span>
                                </div>
                            )
                        })}
                    </div>
                    <h5 className="adPageSalary adPageData"> <FontAwesomeIcon icon={faMoneyCheckDollar} style={{color: "#212529"}} className="icon" />
                         Salary: ${salary}/month</h5>
                    <h5 className="adPageLocation adPageData"> <FontAwesomeIcon icon={faLocationDot} style={{color: "#212529"}} className="icon" />
                        Location: {location}</h5>
                    <h5 className="adPageYrsExp adPageData"> <FontAwesomeIcon icon={faCalendarDays} style={{color: "#212529"}} className="icon" />
                         Experience: {yrsExp} years</h5>
                    <h5 className="adPageDescription adPageData">Description:</h5>
                    <div className="adPageDescription">{desc}</div>
                </div>
            </div>

        </>
    )

}