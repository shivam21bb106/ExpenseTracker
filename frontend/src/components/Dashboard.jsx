import React from 'react'

const Dashboard = () => {
    const userName = localStorage.getItem("userName")
    return (
        <div children='container mt-4'>
            <div className='text-center'>
                <h2 className='mt-5'>Welcome {userName}</h2>
            </div>

        </div>
    )
}

export default Dashboard