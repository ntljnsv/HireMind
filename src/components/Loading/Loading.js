import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import "./loading.css";

export const Loading = () =>{

    return(
        <div className="loadingContainer">
            <FontAwesomeIcon icon={faSpinner} spinPulse style={{color: "#096947",}} />
        </div>
    )
}