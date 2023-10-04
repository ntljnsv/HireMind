import React, {useState, useEffect} from "react";
import "../userProfile.css";
import {db} from "../../../config/auth/FirebaseConfig";
import {doc, onSnapshot, setDoc} from "firebase/firestore";



export const StarRating = ({role, id}) =>{
    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(0)
    const [ratings, setRatings] = useState(0.0)
    const [numRatings, setNumRatings] = useState(0.0)

    useEffect(() =>{
        const unsubscribe = onSnapshot(doc(db, "companies", id), (docSnap)=>{
            setRatings(parseFloat(docSnap.get("rating")))
            setNumRatings(parseFloat(docSnap.get("numRatings")))
        })
        return () =>{
            unsubscribe()
        }
    },[])

    const changeRating = async (index) =>{
        setRating(index)
        let newRating = ratings*(numRatings/(numRatings+1)) + index*(1/(numRatings+1))
        newRating = newRating.toFixed(2)
        let newNum = (numRatings+1)
        await setDoc(doc(db, "companies", id),{
            rating: newRating,
            numRatings: newNum
        }, {merge: true}).catch((err)=>console.log(err))
    }


    return (
        <div className="ratingContainer">
            {role==="user" && <div className="starRating">
                {[...Array(5)].map((star, index) => {
                    index += 1;
                    return (
                        <button
                            type="button"
                            key={index}
                            className={index <= (hover || rating) ? "on" : "off"}
                            onClick={() => changeRating(index)}
                            onMouseEnter={() => setHover(index)}
                            onMouseLeave={() => setHover(rating)}
                        >
                            <span className="star">&#9733;</span>
                        </button>
                    );
                })}
            </div>}
            <div>{ratings} / {numRatings} total ratings</div>
        </div>

    );
}