import React from "react";
import { Outlet,Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

export const VerifyUser = ()=>{
    const {authUser} = useAuth()
    return authUser ? <Outlet /> : <Navigate to={'/login'} />
}

// concept of protected route:    


// What is <Outlet />?

// <Outlet /> is provided by React Router.

// Suppose your routes are:

// <Route element={<ProtectedRoute />}>
//     <Route path="/home" element={<Home />} />
//     <Route path="/profile" element={<Profile />} />
// </Route>

// If the user visits:

// /home

// and authUser exists:

// ProtectedRoute
//       ↓
//    <Outlet />
//       ↓
//     <Home />

// If authUser doesn't exist:

// ProtectedRoute
//       ↓
// authUser = false
//       ↓
// <Navigate to="/login" />
//       ↓
//     /login




// COSE STEP BY STEP ME PROTECTED ROUTE:-

// import { Navigate } from "react-router-dom"

// export function ProtectedRoute({children}){
    
//     if(!localStorage.getItem('login')){
//         return <Navigate to='/signin' replace />
//     }
    
//     return children
// }

// const App = () => {
//   return (
//     <div>
//       <NavBar />
//       <Routes>
//         <Route path='/' element={ <ProtectedRoute><List /></ProtectedRoute>} />
//         <Route path='/add' element={<ProtectedRoute><AddTask /></ProtectedRoute>} />
//         <Route path='/update/:id' element={<ProtectedRoute><UpdateTask /></ProtectedRoute>} />
//         <Route path='/signin' element={<SignIn />} />
//         <Route path='/signup' element={<SignUp />} />



//       </Routes>
     
//     </div>
//   )
// }
