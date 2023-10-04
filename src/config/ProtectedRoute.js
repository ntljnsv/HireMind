import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {UserAuth} from '../context/Auth'


export const ProtectedRoute = ({children}) => {
    const {user} = UserAuth()
    const navigate = useNavigate()
    useEffect(()=>{
        if(!user){
            navigate("/login")
        }
    },[])
    return children
}