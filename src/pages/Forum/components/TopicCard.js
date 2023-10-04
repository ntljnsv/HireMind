import React from "react";
import {Card} from "react-bootstrap";
import {Link} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCalendarDays, faComments} from "@fortawesome/free-solid-svg-icons";


export const TopicCard = ({topicData}) =>{
    const title = topicData.topicTitle
    const numComments = topicData.numComments
    const topicId = topicData.topicId
    const date = topicData.date



    return(
        <Link to={"/forum/"+topicId} className="topicLink">
            <Card className="topicCard">
                <h2 className="topicCardTitle">{title}</h2>
                <div className="topicData">
                    <div className="numComments"><FontAwesomeIcon icon={faComments} style={{color: "#212529"}} />  {numComments}</div>
                    <div className="numComments"><FontAwesomeIcon icon={faCalendarDays} style={{color: "#212529"}}/> {date}</div>
                </div>

            </Card>
        </Link>

    )
}

