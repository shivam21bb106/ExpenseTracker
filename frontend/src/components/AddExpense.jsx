import { toast, ToastContainer } from 'react-toastify'
import React, { useEffect } from 'react'
import { useState } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'
const AddExpense = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        ExpenseDate: "",
        ExpenseItem: "",
        ExpenseCost: ""
    })

    const userid = localStorage.getItem("userId")

    useEffect(() => {
        if (!userid) {
            navigate('/login')
        }
    }, [])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {

        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:8000/api/add_expense/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ...formData, UserId: userid })
            });


            const data = await response.json();
            if (response.status === 201) {
                toast.success(data.message || "Expense added successfully!");

                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000)
            }
            else {
                const data = await response.json();
                toast.error(data.message || "Something went wrong. Please try again.");
            }
        }

        catch (error) {


            console.error("Error during signup:", error);
            toast.error("An error occurred during signup. Please try again later.");
        }

    }
    return (
        <div className="container mt-5">
            <div className="text-center mb-4">
                <h2> <i className='fas fa-plus-circle me-2'></i>Add Expense </h2>
                <p> Track your new spending here</p>
            </div>

            <form className='p-4 rounded shadow mx-auto' style={{ maxWidth: "500px" }} onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label className='form-label'>Expense Date</label>
                    <div className='input-group'>
                        <span className='input-group-text'>
                            <i className='fa fa-calendar'></i>
                        </span>
                        <input type="date" name="ExpenseDate" className='form-control' placeholder='Enter your Expense Date' onChange={handleChange} value={formData.ExpenseDate} />
                    </div>

                </div>

                <div className='mb-3'>
                    <label className='form-label'>Expense Item</label>
                    <div className='input-group'>
                        <span className='input-group-text'>
                            <i className='fas fa-shopping-cart'></i>
                        </span>
                        <input type="text" name="ExpenseItem" className='form-control' placeholder='Enter expense item (e.g. Groceries, Petrol )' onChange={handleChange} value={formData.ExpenseItem} />
                    </div>

                </div>

                <div className='mb-3'>
                    <label className='form-label'>Expense Cost (₹) </label>
                    <div className='input-group'>
                        <span className='input-group-text'>
                            <i className='fas fa-rupee-sign'></i>
                        </span>
                        <input type="number" name="ExpenseCost" className='form-control' placeholder='Enter your Amount' onChange={handleChange} value={formData.ExpenseCost} />
                    </div>

                </div>


                <button type="submit" className='btn btn-primary w-100 mt-3'> <i className='fas fa-plus me-2'></i> Add Expense </button>
            </form>
            <ToastContainer />

        </div>
    )
}

export default AddExpense