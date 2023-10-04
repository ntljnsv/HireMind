import React, {useState} from "react";
import "../ads.css";
import {Button, Card, Form, FormGroup, Alert} from "react-bootstrap";
import {UserAuth} from "../../../context/Auth";
import {db} from "../../../config/auth/FirebaseConfig";
import {doc, setDoc} from "firebase/firestore";
import Select from "react-select";



export const NewAdPopup = ({changeVisibility}) =>{
    const {user} = UserAuth()
    const [title, setTitle] = useState("")
    const [salary, setSalary] = useState("")
    const [yrsExperience, setYrsExperience] = useState("")
    const [location, setLocation] = useState("")
    const [description, setDescription] = useState("")
    const [tags, setTags] = useState([])
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const options = [
        { value: "Tech", label: "Tech" },
        { value: "Medicine", label: "Medicine"},
        { value: "Economy", label: "Economy"},
        { value: "Sales", label: "Sales"},
        { value: "Internship", label: "Internship"},
        { value: "Junior", label: "Junior"},
        { value: "Intermediate", label: "Intermediate"},
        { value: "Senior", label: "Senior"}
    ]
    const style = {
        control: base => ({
            ...base,
            border: 0,
            boxShadow: 'none'
        })
    }
    const handleSelect = (e) =>{
        setTags(Array.isArray(e) ? e.map(x => x.value) : [])
    }



    const getDate = () => {
        const today = new Date();
        const day = today.getDate()
        const month = today.getMonth()+1
        const year = today.getFullYear()
        return day+"."+month+"."+year

    }

    const handleSubmit = (e) =>{
        e.preventDefault()
        if(user){
            const date = getDate()
            setDoc(doc(db,"ads", user.uid+"-"+title),{
                company: user.uid,
                title: title,
                salary: salary,
                yrsExperience: yrsExperience,
                location: location,
                description: description,
                tags: tags,
                date: date
            }, {merge: true}).then(()=>setSuccess("You've successfully created an ad"))
                .then(changeVisibility()).catch(()=>setError("Unable to create ad"))
        }
    }



    return(
        <div className="overlay">
            <Card className="addAd">
                {error && <div className="alertContainer">
                    <Alert variant="danger">{error}</Alert>
                    <button className="btn" onClick={()=>setError("")}>x</button>
                </div>}
                {success && <div className="alertContainer">
                     <Alert variant="success">{success}</Alert>
                     <button className="btn" onClick={()=>setSuccess("")} >x</button>
                </div>}
                <Form className="form" onSubmit={handleSubmit}>
                    <FormGroup>
                        <Form.Label>Title: </Form.Label>
                        <Form.Control type="text" required className="inputAd" onChange={(e)=>setTitle(e.target.value)}/>
                    </FormGroup>
                    <FormGroup>
                        <Form.Label>Salary (monthly): </Form.Label>
                        <Form.Control type="number" required className="inputAd" onChange={(e)=>setSalary(e.target.value)} min={0} max={10000}/>
                    </FormGroup>
                    <FormGroup>
                        <Form.Label>Location: </Form.Label>
                        <Form.Control type="text" requred className="inputAd" onChange={(e)=>setLocation(e.target.value)}/>
                    </FormGroup>
                    <FormGroup>
                        <Form.Label>Experience (years): </Form.Label>
                        <Form.Control type="number" required className="inputAd" onChange={(e)=>setYrsExperience(e.target.value)} min={0}/>
                    </FormGroup>
                    <FormGroup>
                        <Form.Label>Tags (multiple allowed): </Form.Label>
                        <Select  options={options} styles={style} isMulti className="inputAd" onChange={handleSelect}></Select>
                    </FormGroup>
                    <FormGroup>
                        <Form.Label>Description: </Form.Label>
                        <Form.Control as="textarea" rows={4} className="inputAd" onChange={(e)=>setDescription(e.target.value)}/>
                    </FormGroup>
                    <div className="submitAd">
                        <Button type="submit" className="btn text-center" variant="dark">Upload ad</Button>
                    </div>
                    <button className="exit" onClick={changeVisibility}>x</button>
                </Form>
            </Card>
        </div>
    )
}