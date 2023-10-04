import React, {useEffect, useState} from 'react'
import './App.css';
import {ProtectedRoute} from './config/ProtectedRoute'
import {Signup} from "./pages/signup/Signup";
import {Login} from "./pages/login/Login";
import {SignupChoice} from "./pages/signup/components/SignupChoice"
import {BrowserRouter as Router, Outlet, Route, Routes} from 'react-router-dom';
import {NavBar} from "./components/navbar/NavBar";
import {Search} from "./pages/search/Search";
import {UserProfile} from "./pages/profile/UserProfile";
import {CompanyProfile} from "./pages/profile/CompanyProfile"
import {Applications} from "./pages/applications/Applications";
import {InvalidURL} from "./components/invalidURL/InvalidURL";
import {AuthProvider, UserAuth} from "./context/Auth";
import {Ads} from "./pages/Ads/Ads"
import {AdPage} from "./pages/AdPage/AdPage";
import {doc, getDoc} from "firebase/firestore";
import {ForumSearch} from "./pages/Forum/ForumSearch";
import {Topic} from "./pages/Forum/components/Topic";
import {db} from "./config/auth/FirebaseConfig";


function App() {
    const {user} = UserAuth()
    const [role, setRole] = useState()

   useEffect(()=>{
       if(user){
           const docSnap = getDoc(doc(db, "allUsers", user.uid)).then(docSnap=> {
               setRole(docSnap.get("role"))
           }).catch((err)=>console.log(err))
       }
   }, [user])

  return (
    <div className="App">
        <AuthProvider>
            <Router>
                {user && <NavBar typeUser={role}/>}
                <Outlet/>
                <Routes>
                    <Route path="*" element={<InvalidURL/>}/>
                    <Route path="/pickUser" element={<SignupChoice/>}/>
                    <Route path="/signup/:typeUser" element={<Signup/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/search" element={<ProtectedRoute><Search/></ProtectedRoute>}/>
                    <Route path="/forum" element={<ProtectedRoute><ForumSearch/></ProtectedRoute>}/>
                    <Route path="/forum/:topicId" element={<ProtectedRoute><Topic/></ProtectedRoute>}/>
                    <Route path="/user-profile/:userId" element={<ProtectedRoute><UserProfile/></ProtectedRoute>}></Route>
                    <Route path="/company-profile/:userId" element={<ProtectedRoute><CompanyProfile/></ProtectedRoute>}></Route>
                    <Route path="/ad/:adId" element={<ProtectedRoute><AdPage/></ProtectedRoute>}></Route>
                    <Route path="/applications" element={<ProtectedRoute><Applications/></ProtectedRoute>}></Route>
                    <Route path="/ads" element={<ProtectedRoute><Ads/></ProtectedRoute>}></Route>
                </Routes>
            </Router>
        </AuthProvider>
    </div>
  );
}

export default App;

