import React, {createContext, useContext, useEffect, useState} from 'react';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged} from 'firebase/auth'
import {auth} from '../config/auth/FirebaseConfig';
import {Loading} from '../components/Loading/Loading';


export const AuthContext = createContext()

export const AuthProvider = ({children}) =>{
    const [user, setUser] = useState(null)
    const createUser = (email, password) =>{
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const loginUser = (email, password) =>{
        return signInWithEmailAndPassword(auth, email, password)
    }


    const logoutUser = () =>{
        return signOut(auth)
    }

    const [pending, setPending] = useState(true)
    useEffect(()=> {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) =>{
            setUser(currentUser)
            setPending(false)
        })
        return () => {
            unsubscribe()
        }
    },[])
    if(pending){
        return <Loading/>
    }

    return(
        <AuthContext.Provider value={{createUser, user, loginUser, logoutUser}}>
            {children}
        </AuthContext.Provider>
    )
}


export const UserAuth = () =>{
    return useContext(AuthContext)
}