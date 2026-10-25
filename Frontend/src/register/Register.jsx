import React, { useState } from 'react'
import { useNavigate,Link} from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const Register = () => {
    const [loading,setLoading] = useState(false)
    const [inputData,setInputData] = useState({})
    const navigate = useNavigate()

    const {setAuthUser} = useAuth()

    const handelInput=(e)=>{
        setInputData({...inputData,[e.target.id]:e.target.value})
    }
    console.log(inputData)

    const selectGender = (givengender)=>{
        setInputData((prev)=>({
            ...prev,gender:(givengender===inputData.gender)?"":givengender
        }))
    }

    const handelSubmit=async(e)=>{
        e.preventDefault()
        setLoading(true)
        if(inputData.password !== inputData.confpassword){
            setLoading(false)
            return toast.error("Password doesn't match")
        }
        try {
            const register = await axios.post('/api/auth/register',inputData)
            const data = register.data
            if(data.success === false){
                setLoading(false)
                toast.error(data.message)
                console.log(data.message)
                return
            }
            toast.success(data?.message)
            localStorage.setItem("chatapp",JSON.stringify(data))
            console.log("Saved Data:", localStorage.getItem("chatapp"))
            setAuthUser(data)
            setLoading(false)
            navigate('/login')

        } catch (error) {
            setLoading(false)
            console.log(error)
            toast.error(error?.response?.data?.message)
        }
    }
  return (
    <div className='flex flex-col items-center justify-center max-w-full mx-auto'>
            <div className='w-full p-6 rounded-lg shadow-lg
          bg-gray-400/50 bg-clip-padding
           backdrop-filter backdrop-blur-lg '>
                <h1 className='text-3xl font-bold text-center text-gray-300'>Register
                    <span className='text-gray-950'> Chatters </span>
                    </h1>
                    <form onSubmit={handelSubmit} className='flex flex-col text-black'>
                        <div>
                            <label className='label p-2' >
                                <span className='font-bold text-gray-950 text-xl label-text'>FullName :</span>
                            </label>
                            <input
                                id='fullname'
                                type='text'
                                onChange={handelInput}
                                placeholder='Enter your fullname'
                                required
                                className='w-full input input-bordered h-10 px-2' />
                        </div>
                        <div>
                            <label className='label p-2' >
                                <span className='font-bold text-gray-950 text-xl label-text'>UserName :</span>
                            </label>
                            <input
                                id='username'
                                type='text'
                                onChange={handelInput}
                                placeholder='Enter your usernane'
                                required
                                className='w-full input input-bordered h-10 px-2' />
                        </div>
                        {/* <div>
                            <label className='label p-2' >
                                <span className='font-bold text-gray-950 text-xl label-text'>Password :</span>
                            </label>
                            <input
                                id='password'
                                type='password'
                                onChange={handelInput}
                                placeholder='Enter your password'
                                required
                                className='w-full input input-bordered h-10 px-2' />
                        </div> */}
                        <div>
                            <label className='label p-2' >
                                <span className='font-bold text-gray-950 text-xl label-text'>Email :</span>
                            </label>
                            <input
                                id='email'
                                type='email'
                                onChange={handelInput}
                                placeholder='Enter your email'
                                required
                                className='w-full input input-bordered h-10 px-2' />
                        </div>
                        <div>
                            <label className='label p-2' >
                                <span className='font-bold text-gray-950 text-xl label-text'>Password :</span>
                            </label>
                            <input
                                id='password'
                                type='password'
                                onChange={handelInput}
                                placeholder='Enter your password'
                                required
                                className='w-full input input-bordered h-10 px-2' />
                        </div>
                        <div>
                            <label className='label p-2' >
                                <span className='font-bold text-gray-950 text-xl label-text'>Confirm Password :</span>
                            </label>
                            <input
                                id='confpassword'
                                type='text'
                                onChange={handelInput}
                                placeholder='Enter confirm password'
                                required
                                className='w-full input input-bordered h-10 px-2' />
                        </div>
                        <div id='gender' className='flex gap-2'>
                            <label className='cursor-pointer label flex gap-2'>
                                <span className='label-text font-semibold text-gray-950'>male</span>
                                <input 
                                    onChange={()=>{selectGender("male")}}
                                    checked={inputData.gender==='male'}
                                    type="checkbox" 
                                    className='chexkbox checkbox-info' />
                            </label>
                            <label className='cursor-pointer label flex gap-2'>
                                <span className='label-text font-semibold text-gray-950'>female</span>
                                <input 
                                    onChange={()=>{selectGender("female")}} 
                                    checked={inputData.gender==='female'}
                                    type="checkbox" 
                                    className='chexkbox checkbox-info' />
                            </label>
                        </div>
                        <button type='submit'
                            className='mt-4 self-center 
                            w-auto px-2 py-1 bg-gray-950 
                            text-lg hover:bg-gray-900 
                            text-white rounded-lg hover:scale-105'>
                           {loading ? "loading..":"Register"}
                            </button>
                    </form>
                    <div className='pt-2'>
                        <p className='text-sm font-semibold
                         text-gray-800'>
                            Already have an Acount ? <Link to={'/login'}>
                                <span
                                    className='text-gray-950 
                            font-bold underline cursor-pointer
                             hover:text-green-950'>
                                    Login!!
                                </span>
                            </Link>
                        </p>
                    </div>
            </div>
        </div> 
  )
}

export default Register
