import React, {useEffect, useState} from "react";
import "./forum.css";
import {TopicForm} from "./components/TopicForm";
import {db} from "../../config/auth/FirebaseConfig";
import {collection, getDocs} from "firebase/firestore";
import {Ad} from "../../components/ad/Ad";
import {TopicCard} from "./components/TopicCard";


export const ForumSearch = () =>{
    const [formVisibility, setFormVisibility] = useState(false)
    const [search, setSearch] = useState("")
    const [topics, setTopics] = useState([])
    const [searchedTopics, setSearchedTopics] = useState([])
    const [viewAllTopic, setViewAllTopics] = useState(true)
    const [viewSearchedTopics, setViewSearchedTopics] = useState(false)


    const changeVisibility = () =>{
        if (formVisibility){
            setFormVisibility(false)
        }  else {
            setFormVisibility(true)
        }
    }

    useEffect(()=>{
        document.title = "Forum Topics"
    }, [])

    useEffect(()=>{
       const getTopics = async () =>{
           const querySnapshot = await getDocs(collection(db, "forumTopics")).catch((err)=>console.log(err));
           const newTopics = [];
           querySnapshot.forEach((doc) => {
               newTopics.push(doc.data());
           });
           setTopics(newTopics)
       }
       getTopics()
    },[])

    const handleSearch = (e) =>{
        e.preventDefault()
        setViewAllTopics(false)
        setViewSearchedTopics(true)
        const topicFilter = topics.filter((topic) => {
            const title = topic.topicTitle.toLowerCase()
            return (
                title.includes(search)
            )
        })
        setSearchedTopics(topicFilter)
    }



    return(

        <div className="forumSearch">
            <button onClick={changeVisibility} className="btn addTopicButton">+  Add Topic</button>
            {formVisibility && <TopicForm changeVisibility={changeVisibility}/>}
            <div className="searchContainer">
                <input type="text" placeholder="Search topics..." className="searchBar form-control" onChange={(e)=>setSearch(e.target.value)}/>
                <button type="submit" className="btn searchButton" onClick={handleSearch}>Search</button>
            </div>


            <div className="searchedTopics">
                {viewAllTopic && topics.map((topic, index)=>{
                    return(
                        <div key={index}>
                            <TopicCard topicData={topic}/>
                        </div>
                    )
                })}
                {viewSearchedTopics && searchedTopics.map((topic, index)=>{
                    return(
                        <div key={index}>
                            <TopicCard topicData={topic}/>
                        </div>
                    )
                })}
            </div>





        </div>
    )


}