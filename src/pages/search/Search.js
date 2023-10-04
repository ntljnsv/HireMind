import React, {useState, useEffect} from "react";
import {Tags} from "./components/Tags";
import "./search.css";
import {UserAuth} from "../../context/Auth";
import {doc, getDoc, getDocs, collection} from "firebase/firestore";
import {db} from "../../config/auth/FirebaseConfig";
import {Ad} from "../../components/ad/Ad";
import {PayRange} from "./components/PayRange"



export const Search = () =>{
    const {user} = UserAuth()
    const [role, setRole] = useState(null)
    const [ads, setAds] = useState([])
    const [searchValue, setSearchValue] = useState("")
    const [searchedAds, setSearchedAds] = useState([])
    const [taggedAds, setTaggedAds] = useState([])
    const [displayAllAds, setDisplayAllAds] = useState(true)
    const [displaySearchedAds, setDisplaySearchedAds] = useState(false)
    const [displayTaggedAds, setDisplayTaggedAds] = useState(false)
    const [displaySalaryAds, setDisplaySalaryAds] = useState(false)
    const [salaryAds, setSalaryAds] = useState([])
    let adsRef = collection(db, "ads")



    useEffect(()=>{
        if(user){
            const getRole =  async () =>{
                const docSnap = getDoc(doc(db, "allUsers", user.uid)).then(docSnap=> {
                    setRole(docSnap.get("role"))
                }).catch((err)=>console.log(err))
            }
            getRole()
        }
        const getAds = async () =>{
            const querySnapshot = await getDocs(adsRef).catch((err)=>console.log(err));
            const newAds = [];
            querySnapshot.forEach((doc) => {
                newAds.push(doc.data());
            });
            setAds(newAds)
        }
        getAds()

    },[])


    useEffect(()=>{
        document.title = "Search jobs"
    }, [])





    const handleSearch = (e) =>{
        e.preventDefault()
        setDisplaySearchedAds(true)
        setDisplayAllAds(false)
        setDisplayTaggedAds(false)
        setDisplaySalaryAds(false)
        setSearchedAds([])
        const adFilter = ads.filter((ads) => {
            const title = ads.title.toLowerCase()
            const location = ads.location.toLowerCase()
            const description = ads.description.toLowerCase()
            const search = searchValue.toLowerCase()
            return (
                title.includes(search) || location.includes(search) || description.includes(search)
            )
        })
        setSearchedAds(adFilter)
    }


    const filterByTags = (ads, tagData) =>{
        return ads.filter((ad)=>{
            if(tagData.every((tag)=>{
                return ad.tags.indexOf(tag) !== -1
            }))
                return ad
        })
    }


    const handleTagCallback = (tagData) =>{
        if(!tagData.length){
            setTaggedAds([])
            setDisplayTaggedAds(false)
            if(searchedAds.length){
                setDisplaySearchedAds(true)
            } else if(salaryAds.length){
                setDisplaySalaryAds(true)
            } else {
                setDisplayAllAds(true)
            }
        } else{
            let adFilter
            setDisplayTaggedAds(true)
            if(searchedAds.length){
                setDisplaySearchedAds(false)
                adFilter = filterByTags(searchedAds, tagData)
            } else if(salaryAds.length){
                setDisplaySalaryAds(false)
                adFilter = filterByTags(salaryAds, tagData)
            } else{
                setDisplayAllAds(false)
                adFilter = filterByTags(ads, tagData)
            }
            setTaggedAds(adFilter)
        }
    }


    const filterBySalary = (ads, salaryValue) =>{
        return ads.filter((ad)=>{
            if(ad.salary >= salaryValue[0] && ad.salary <= salaryValue[1]){
                return ads
            }
        })
    }

    const handleSalaryCallback = (salaryValue) =>{
        let adFilter
        setDisplaySalaryAds(true)
        if(searchedAds.length){
            setDisplaySearchedAds(false)
            adFilter = filterBySalary(searchedAds, salaryValue)
        } else if(taggedAds.length){
            setDisplayTaggedAds(false)
            adFilter = filterBySalary(taggedAds, salaryValue)
        } else{
            setDisplayAllAds(false)
            adFilter = filterBySalary(ads, salaryValue)
        }
        setSalaryAds(adFilter)
    }




    return(
        <>
            <div className="searchTags">
                <div className="searchContainer">
                    <input type="text" placeholder="Search jobs..." className="searchBar form-control" onChange={(e)=>setSearchValue(e.target.value)}/>
                    <button type="submit" className="btn searchButton" onClick={handleSearch}>Search</button>
                </div>
                <Tags searchCallback={handleTagCallback}/>
                <PayRange salaryCallback={handleSalaryCallback}/>
            </div>


            <div className="searchedAds">
                {displayAllAds && ads && ads.map((ads, index)=>{
                    return(
                        <div key={index} className="mappedAd">
                            <Ad adData={ads} typeUser={role} applicationsPage={false}  className = "ad"/>
                        </div>

                    )
                })}
                {displaySearchedAds && searchedAds.map((searchedAds, index) => {
                    return(
                        <div key={index} className="mappedAd">
                            <Ad adData={searchedAds} applicationsPage={false} typeUser={role} className="ad"/>
                        </div>

                    )
                })}
                {displayTaggedAds && taggedAds.map((taggedAds, index) => {
                    return(
                        <div key={index} className="mappedAd">
                            <Ad adData={taggedAds} applicationsPage={false} typeUser={role} className="ad"/>
                        </div>

                    )
                })}
                {displaySalaryAds && salaryAds.map((salaryAds, index) => {
                    return(
                        <div key={index} className="mappedAd">
                            <Ad adData={salaryAds} applicationsPage={false} typeUser={role} className="ad"/>
                        </div>
                    )
                })}
            </div>
        </>

    )
}
