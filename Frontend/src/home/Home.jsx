import React,{useState} from 'react'
import Sidebar from './components/Sidebar.jsx'
import MessageContainer from './components/MessageContainer.jsx'

import { useAuth } from '../context/AuthContext.jsx'

const Home = () => {
    const {authUser} = useAuth()
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleUserSelect =(user)=>{
      setSelectedUser(user);
      setIsSidebarVisible(false);
    }
    const handleShowSidebar = () => {
      setIsSidebarVisible(true);
      setSelectedUser(null);
    }
    return (
    <div
      className='flex min-w-full
      md:min-w-[550px] md:max-w-[85%]
      px-2 h-[95%] md:h-full
      rounded-xl shadow-lg
      bg-gray-400/30 bg-clip-padding
      backdrop-filter backdrop-blur-lg bg-opacity-0'
    >
      {/* Sidebar */}
      <div className={`w-full py-2 md:flex ${isSidebarVisible ? '':'hidden'}`}>
        <Sidebar onSelectUser={handleUserSelect}/>
      </div>

      <div className={`divider divider-horizontal px-1 md:flex
          ${isSidebarVisible ? '' : 'hidden'} ${selectedUser ? 'block':'hidden'}`}></div>

      {/* Message Container */}
      <div className={`flex-auto  bg-gray-400/50 ${selectedUser ? '': 'hidden md:flex'}`}>
        <MessageContainer onBackButtonClick={handleShowSidebar} />
      </div>
    </div>
  );
  //  return (

  //   <div className='flex justify-between min-w-full
  //    md:min-w-[550px] md:max-w-[65%]
  //     px-2 h-[95%] md:h-full  
  //     rounded-xl shadow-lg
  //      bg-gray-400 bg-clip-padding
  //       backdrop-filter backdrop-blur-lg 
  //       bg-opacity-0'
  //       >
  //     <div className={`w-full py-2 md:flex ${isSidebarVisible ? '' : 'hidden'}`}>
  //     <Sidebar onSelectUser={handelUserSelect}/>
  //     </div>
  //     <div className={`divider divider-horizontal px-3 md:flex
  //        ${isSidebarVisible ? '' : 'hidden'} ${selectedUser ? 'block' : 'hidden'}`}></div>
  //     <div className={`flex-auto ${selectedUser ? '' : 'hidden md:flex'} bg-gray-200}`}>
  //     <MessageContainer onBackUser={handelShowSidebar}/>
  //     </div>
  //   </div>
  // );
}

export default Home
