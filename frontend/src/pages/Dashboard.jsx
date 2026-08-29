import React from 'react'

const Dashboard = ({user, setuser}) => {
  return (
    <div className='text-blue-700 text-3xl'>
      {user.name}
    </div>
  )
}

export default Dashboard
