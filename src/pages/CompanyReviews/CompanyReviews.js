import React, {useState, useEffect} from "react";
import "./companyReviews.css";
import {AddReview} from "./components/AddReview";
import {Review} from "./components/Review";
import {useParams} from "react-router-dom";
import {onSnapshot, collection} from "firebase/firestore";
import {db} from "../../config/auth/FirebaseConfig";

export const CompanyReviews = ({typeUser}) =>{
    const {userId} = useParams()
    const [reviews, setReviews] = useState([])
    const reviewRef = collection(db, "reviews", userId, "userReviews")


    useEffect(()=>{
        const unsubscribe = onSnapshot(reviewRef, (snap)=>{
            const newReviews = [];
            snap.forEach((doc)=>{
                newReviews.push(doc.data());
            })
            setReviews(newReviews);
        })
        return () =>{
            unsubscribe();
        }
    },[])



    return(
        <div className="ratingsContainer">
            <div>
                {!reviews.length &&
                    <div className="noAds">No reviews yet...</div>}
                {reviews && reviews.map((review, index)=>{
                    return(
                        <div key={index}>
                            <Review reviewData={review.review} userPoster={review.poster}/>
                        </div>
                    )
                })}
                <AddReview id={userId} typeUser={typeUser}/>
            </div>

        </div>
    )
}