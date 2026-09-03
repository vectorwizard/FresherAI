import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import { getCurrentUser } from './apis/user.api'
import Scorer from './pages/Scorer'
import { getResume } from './apis/resume.api'
import { useDispatch } from 'react-redux'
import { setResume } from './redux/resumeSlice'
import ResumeBuilder from './pages/ResumeBuilder'
import InterviewStart from './pages/InterviewStart'
import InterviewPage from './pages/InterviewPage'
import InterviewReport from './pages/InterviewReport'

const App = () => {
  const [user, setuser] = useState(null)
  const [loading, setloading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    const getUser = async () => {
      const data = await getCurrentUser()
      setuser(data?.user)
      setloading(false)
    }
    getUser();
  }, [])

  useEffect(() => {
    const getResumeData = async () => {
      const result = await getResume()
      dispatch(setResume(result.data))
      setloading(false)
    }
    getResumeData();
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
        <Route path='/scorer' element={ user ? <Scorer user={user} setuser={setuser} /> : <Navigate to="/" replace/> }/>
        <Route path='/resume' element={ user ? <ResumeBuilder user={user} setuser={setuser} /> : <Navigate to="/" replace/> }/>
        <Route path='/interview' element={ user ? <InterviewStart user={user} setuser={setuser} /> : <Navigate to="/" replace/> }/>
        <Route path='/interview/:id' element={ user ? <InterviewPage user={user} setuser={setuser} /> : <Navigate to="/" replace/> }/>
        <Route path='/interview/:id/report' element={ user ? <InterviewReport user={user} setuser={setuser} /> : <Navigate to="/" replace/> }/>
      </Routes>
    </>
  )
}

export default App