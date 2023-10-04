import React,{useState} from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import {Alert, Button} from "react-bootstrap";
import "./navbar.css";
import {Link, useNavigate} from "react-router-dom";
import {UserAuth} from "../../context/Auth";
import Logo from "../../assets/images/logo.png";


export const NavBar = ({typeUser}) =>{
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const {user, logoutUser} = UserAuth()


    const logOut = async () =>{
        await logoutUser()
            .then(()=>{
                navigate("/login")
            })
            .catch(()=>{
                setError("Unable to log out")
            })
    }



    return(
        <>
            <Navbar data-bs-theme="dark" className="navbar">
                <Container>
                    <Link className="siteLink" to="/search">
                        <div className="logoContainer"><img src={Logo} alt="logo" className="logo"/></div>
                        <Navbar.Brand className="brandName">HireMind</Navbar.Brand>
                    </Link>
                    <Nav className="me-auto links">
                        {typeUser==="user" && <Link className="nav-link link" to="/search">Find jobs</Link>}
                        {typeUser==="company" && <Link className="nav-link link" to="/search">View jobs</Link>}
                        {typeUser==="company" &&  <Link className="nav-link link" to={"/company-profile/"+user.uid} >Profile</Link>}
                        {typeUser==="user" &&  <Link className="nav-link link" to={"/user-profile/"+user.uid} >Profile</Link>}
                        {typeUser==="user" && <Link className="nav-link link" to="/applications">Applications</Link>}
                        {typeUser === "company" && <Link className="nav-link link" to="/ads">Ads</Link>}
                        <Link className="nav-link link" to="/forum">Forum</Link>
                    </Nav>
                    <Button variant="outline-light" onClick={logOut}>Log Out</Button>
                </Container>
            </Navbar>
            {error && <div className="errorAlert">
                <Alert variant="danger">{error}</Alert>
            </div>}
        </>
    )
}