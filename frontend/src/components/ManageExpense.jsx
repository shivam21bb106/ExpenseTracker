import { toast, ToastContainer } from 'react-toastify'
import React, { useEffect } from 'react'
import { useState } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'
const ManageExpense = () => {

    const navigate = useNavigate();

    const userid = localStorage.getItem("userId")

    useEffect(() => {
        if (!userid) {
            navigate('/login')
        }
    }, [])
    return (
        <div className="container mt-5">
            <div className="text-center mb-4">
                <h2> <i className='fas fa-tasks me-2'></i>Manage Expense </h2>
                <p className='text-muted '> View Edit or Delete </p>
            </div>

            <div>
                <table>

                    <thead>

                        <tr>

                            <th>#</th>
                            <th>Date</th>
                            <th>Item </th>
                            <th>Cost </th>
                            <th>Actions</th>
                        </tr>
                    </thead>



                    <tbody>

                        <tr>

                            <td>#</td>
                            <td>Date</td>
                            <td>Item </td>
                            <td>Cost </td>
                            <td>Actions</td>
                        </tr>
                    </tbody>





                </table>
            </div>


        </div>
    )
}

export default ManageExpense