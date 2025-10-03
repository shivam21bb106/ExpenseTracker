import React from 'react'
import { Link } from 'react-router-dom'
const Home = () => {

    const userid = localStorage.getItem("userId")


    return (
        <div className='container text-center mt-5'>

            <h1>Welcome to <span className='text-primary'> Daily Expense Tracker</span></h1>
            <p className='lead'>Manage your daily expenses efficiently and effortlessly </p>


            <div className='mt-4'>
                {userid ? (<><Link to="/dashboard" className='btn btn-warning btn-lg mx-2'>
                    <i className='fas fa-tachometer-alt me-2'></i>
                    Go to Dashboard</Link>
                </>) : <>
                    <Link to="/signup" className='btn btn-primary btn-lg mx-2'>
                        <i className='fas fa-user-plus me-2'></i>
                        Sign Up</Link>



                    <Link to="/login" className='btn btn-success btn-lg mx-2'>
                        <i className='fas fa-sign-in-alt me-2'></i>
                        Login</Link>

                </>}





            </div>





        </div>
    )
}

export default Home