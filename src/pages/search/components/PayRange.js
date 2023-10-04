import React, {useState} from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import "../search.css";


export const PayRange = ({salaryCallback}) =>{
    const [salary, setSalary] = useState([0, 10000])
    const [visibility, setVisibility] = useState(false)
    const [hideRange, setHideRange] = useState("+")

    const handleVisibility = () =>{
        if(visibility){
            setVisibility(false)
            setHideRange("+")
        } else{
            setVisibility(true)
            setHideRange("-")
        }
    }

    const handleFilter = () =>{
        salaryCallback(salary)
    }


    return(
        <div className={"salaryContainer"}>
                <button className="btn tagButton" onClick={handleVisibility}>{hideRange} Salary range</button>
            {visibility && <div className="rangeContainer">
                <span className="salary">Min: ${salary[0]}</span>
                <RangeSlider onInput={(value) => setSalary(value)} min={0} max={10000} step={50} defaultValue={[0, 10000]}
                             rangeSlideDisabled className="rangeSlider"/>
                <span className="salary">Max: ${salary[1]}</span>
                <button className="btn searchButton" onClick={handleFilter}>Filter</button>
            </div>}
        </div>
    )
}