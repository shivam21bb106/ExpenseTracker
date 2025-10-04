import { toast, ToastContainer } from 'react-toastify'
import React, { useEffect } from 'react'
import { useState } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'
const ExpenseReport = () => {


    const navigate = useNavigate();
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [grandTotal, setGrandTotal] = useState(0);


    const [expenses, setExpenses] = useState([])


    const userid = localStorage.getItem("userId")

    useEffect(() => {
        if (!userid) {
            navigate('/login')
        }
    }, [])



    const handleSubmit = async (e) => {

        e.preventDefault();
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/search_expense/${userid}/?from_date=${fromDate}&to_date=${toDate}`);


            const data = await response.json();
            setExpenses(data.expenses);
            setGrandTotal(data.total);

        }

        catch (error) {


            console.error("", error);
            toast.error("An error occurred  Please try again later.");
        }

    }
    return (
        <div className="container mt-5">
            <div className="text-center mb-4">
                <h2><i className='fas fa-file-invoice-dollar me-2'></i> Datewise Expense Report</h2>
                <p>Search and Analyse your expenses between 2 dates</p>
            </div>

            <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-md-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="fa fa-calendar"></i>
                        </span>
                        <input
                            type="date"
                            name="fromDate"
                            value={fromDate}
                            className="form-control form-control-lg"
                            onChange={(e) => setFromDate(e.target.value)}

                        />
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="fa fa-calendar"></i>
                        </span>
                        <input
                            type="date"
                            name="toDate"
                            value={toDate}
                            className="form-control form-control-lg"
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="col-md-4">
                    <button type="submit" className="btn btn-primary w-100 btn-lg">
                        <i className="fas fa-search me-2"></i> Search
                    </button>
                </div>
            </form>

            <div className='mt-5'>
                <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Item</th>
                            <th>Cost</th>

                        </tr>
                    </thead>
                    <tbody>
                        {expenses.length > 0 ? (
                            expenses.map((expense, index) => (
                                <tr key={expense.id}>
                                    <td>{index + 1}</td>
                                    <td>{expense.ExpenseDate || "-"}</td>
                                    <td>{expense.ExpenseItem}</td>
                                    <td>{expense.ExpenseCost}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    <i className="fas fa-exclamation-circle me-2"></i>
                                    No expenses found.
                                </td>
                            </tr>
                        )}
                    </tbody>

                    <tfoot>
                        <tr>
                            <td colSpan={3} className='text-end fw-bold'>Grand Total :</td>
                            <td>₹ {grandTotal}</td>
                        </tr>
                    </tfoot>

                </table>
            </div>
            <ToastContainer />
        </div>

    )
}

export default ExpenseReport