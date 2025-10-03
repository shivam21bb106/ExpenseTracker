import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const userName = localStorage.getItem("userName")



    const userid = localStorage.getItem("userId")

    useEffect(() => {
        if (!userid) {
            navigate('/login')
        }
    }, [])
    return (
        <div children='container mt-4'>
            <div className='text-center'>
                <h2 className='mt-5'>Welcome {userName}</h2>
            </div>

        </div>
    )
}

export default Dashboard