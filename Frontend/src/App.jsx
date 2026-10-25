import React from 'react'
// import Login from './login/Login.jsx'
import { ToastContainer, toast } from 'react-toastify';
import {Routes,Route} from 'react-router-dom'
import Register from './register/Register.jsx';
import Login from './login/login.jsx';
import { VerifyUser } from './utils/verifyUser.jsx';
import Home from './home/Home.jsx';

const App = () => {
  return (
    <>
      <div className='p-2 w-screen h-screen flex item-center justify-center'>
        
        {/* // abhu what happens ki if user login nhi bhi hoga tb it they can access the home page page, jbki its wrong 
        // for this we will first verify ki user login h ya nhi then only home routes accessible bnayeneg  */}

        {/* <Routes>
          <Route path='/' element={<h1>hello</h1>} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes> */}


         <Routes>

          <Route element={<VerifyUser />} >
            <Route path='/' element={<Home />} />
          </Route>

          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>

        <ToastContainer />
      </div>
    </>
  )
}

export default App
