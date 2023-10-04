import React, {useEffect} from "react";
import Logo from "../../assets/images/logo.png";
import "./invalidURL.css";



export const InvalidURL = () =>{

    useEffect(()=>{
        document.title = "Invalid URL"
    })

    return(
        <div className="invalidURL">
            <div className="brandContainer">
                <div className="logoInvalidContainer"><img className="logoInvalid" src={Logo}/></div>
                <h1 className="brand">HireMind</h1>
            </div>
            <div className="invalidText">It seems you've entered an invalid URL</div>
        </div>
    )


}