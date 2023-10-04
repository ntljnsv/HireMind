import React, {useState, useRef, useEffect} from "react";
import "../userProfile.css";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {UserAuth} from "../../../context/Auth";
import {updateProfile} from "firebase/auth";
import {db, storage} from "../../../config/auth/FirebaseConfig";
import {doc, onSnapshot, setDoc} from "firebase/firestore";




export const DisplayPhoto = ({typeUser, id}) =>{
    const {user} = UserAuth()
    const hiddenInput = useRef(null);
    const [photo, setPhoto] = useState()
    const onClick = () => {
        hiddenInput.current.click();
    };

    const handleChange = async(e) => {
        const photoUploaded = e.target.files[0]
        if( photoUploaded === null) return;
        const photoRef = ref(storage, `/users/avatar_${user.uid}`)
        uploadBytes(photoRef, photoUploaded).then(()=>{
            getDownloadURL(photoRef).then((url)=>{
                if(user){
                    if(typeUser === "user"){
                        setDoc(doc(db, "users", user.uid), {
                            photoURL: url
                        },{ merge:true}).catch(()=>console.log("Unable to add firestore"))
                    }
                    if(typeUser === "company"){
                        setDoc(doc(db, "companies", user.uid), {
                            photoURL: url
                        },{ merge:true}).catch(()=>console.log("Unable to add firestore"))
                    }
                    updateProfile(user, {photoURL: url}).catch(()=>console.log("Unable to set photo"))
                }

            })
        })

    };

    useEffect(()=>{
        if(typeUser === "company"){
            const unsubscribe = onSnapshot(doc(db, "companies", id), (doc) =>{
                setPhoto(doc.get("photoURL"))
            })
            return () =>{
                unsubscribe()
            }
        } else if(typeUser === "user"){
            const unsubscribe = onSnapshot(doc(db, "users", id), (doc) =>{
                setPhoto(doc.get("photoURL"))
            })
            return () =>{
                unsubscribe()
            }
        }
    },[])




    return(
        <div className="displayPhoto">
            <div className="profilePictureContainer">
                {user && <img src={photo} className="profilePicture" alt="profile picture"/>}
            </div>
            <input type="file" ref={hiddenInput} onChange={handleChange} className="d-none"/>
            {user.uid === id && <button onClick={onClick} className="btn displayImgButton">Update picture</button>}
        </div>


    )
}