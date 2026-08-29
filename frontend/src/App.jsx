import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
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
        <Route path='/' element={ user? <Navigate to="/dashboard" replace/> : 
          <Home setuser={setuser}/>
          }/>
        <Route path='/dashboard' element={ user ? <Dashboard user={user} setuser={setuser} /> : <Navigate to="/" replace/> }/>
      </Routes>
    </>
  )
}

export default App