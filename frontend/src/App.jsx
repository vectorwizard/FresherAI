import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import { getCurrentUser } from './apis/user.api'

const App = () => {
  const [user, setuser] = useState(null)
  const [loading, setloading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const data = await getCurrentUser()
      setuser(data?.user)
      setloading(false)
    }
    getUser();
  }, [])
  
  if(loading){
    return(
      <div className='fixed top-0 left-0 w-full z-[9999]'>
        <div className='h-1 bg-black animate-pulse w-full'>

        </div>
      </div>
    )
  }

  return (
    <>
      <Routes>
        <Route path='/' element={<Home setuser={setuser}/>}/>
        <Route path='/dashboard' element={<Dashboard user={user} setuser={setuser} />}/>
      </Routes>
    </>
  )
}

export default App