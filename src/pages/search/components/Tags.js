import React, {useState} from "react";
import {ButtonGroup, ToggleButton} from "react-bootstrap";


export const Tags = ({searchCallback}) =>{
    const [visibility, setVisibility] = useState(false)
    const [hideTags, setHideTags] = useState("+")
    const [tags, setTags] = useState([])


    const handleVisibility = () =>{
        if(visibility){
            setVisibility(false)
            setHideTags("+")
        } else{
            setVisibility(true)
            setHideTags("-")
        }
    }


    const handleToggle = (value) => {
        if (tags.includes(value)) {
            let tagFilter = tags.filter(item => item !== value)
            setTags(tagFilter);
            searchCallback(tagFilter)
        } else {
           setTags([...tags, value]);
            searchCallback([...tags, value])
        }

    };

    return(
        <div className="tagContainer">
                <button className="btn tagButton" onClick={handleVisibility}>{hideTags} Tags</button>
                {visibility && <div>
                    <ButtonGroup>
                        <ToggleButton
                            id="tech"
                            type="checkbox"
                            variant="outline-secondary"
                            checked={tags.includes("Tech")}
                            value="Tech"
                            onChange={() => handleToggle("Tech")}
                        >
                            Tech
                        </ToggleButton>
                        <ToggleButton
                            id="med"
                            type="checkbox"
                            variant="outline-secondary"
                            checked={tags.includes("Medicine")}
                            value="Medicine"
                            onChange={() => handleToggle("Medicine")}
                        >
                            Medicine
                        </ToggleButton>
                        <ToggleButton
                            id="econ"
                            type="checkbox"
                            variant="outline-secondary"
                            checked={tags.includes("Economy")}
                            value="Economy"
                            onChange={() => handleToggle("Economy")}
                        >
                            Economy
                        </ToggleButton>
                        <ToggleButton
                            id="sales"
                            type="checkbox"
                            variant="outline-secondary"
                            checked={tags.includes("Sales")}
                            value="Sales"
                            onChange={() => handleToggle("Sales")}
                        >
                            Sales
                        </ToggleButton>
                        <ToggleButton
                            id="intern"
                            type="checkbox"
                            variant="outline-secondary"
                            checked={tags.includes("Internship")}
                            value="Internship"
                            onChange={() => handleToggle("Internship")}
                        >
                            Internship
                        </ToggleButton>
                        <ToggleButton
                            id="junior"
                            type="checkbox"
                            variant="outline-secondary"
                            checked={tags.includes("Junior")}
                            value="Junior"
                            onChange={() => handleToggle("Junior")}
                        >
                            Junior
                        </ToggleButton>
                        <ToggleButton
                            id="interm"
                            type="checkbox"
                            variant="outline-secondary"
                            checked={tags.includes("Intermediate")}
                            value="Intermediate"
                            onChange={() => handleToggle("Intermediate")}
                        >
                            Intermediate
                        </ToggleButton>
                        <ToggleButton
                            id="senior"
                            type="checkbox"
                            variant="outline-secondary"
                            checked={tags.includes("Senior")}
                            value="Senior"
                            onChange={() => handleToggle("Senior")}
                        >
                            Senior
                        </ToggleButton>
                    </ButtonGroup>
                </div>}
        </div>

    )
}