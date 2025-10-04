import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem("userName")



    const userid = localStorage.getItem("userId")
    const [expenses, setExpenses] = useState([])
    const [todayTotal, setTodayTotal] = useState(0)
    const [yesterdayTotal, setYesterdayTotal] = useState(0)
    const [last_7_daysTotal, setLast_7_daysTotal] = useState(0)
    const [last_30_daysTotal, setLast_30_daysTotal] = useState(0)
    const [current_yearTotal, setCurrent_yearTotal] = useState(0)
    const [grandTotal, setGrandTotal] = useState(0)
    useEffect(() => {
        if (!userid) {
            navigate('/login')
        }
        fetchExpenses(userid)
    }, [])

    const fetchExpenses = async (userId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/manage_expense/${userId}/`);
            const data = await response.json();
            setExpenses(data.expenses);
            calculateTotals(data);
        } catch (error) {
            console.error("Error fetching expenses:", error);

        }
    }
    const calculateTotals = (data) => {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        const last7Days = new Date();
        last7Days.setDate(today.getDate() - 7);
        const last30Days = new Date();
        last30Days.setDate(today.getDate() - 30);
        const currentYear = new Date(today.getFullYear(), 0, 1);

        let todaySum = 0;
        let yesterdaySum = 0;
        let last7DaysSum = 0;
        let last30DaysSum = 0;
        let currentYearSum = 0;
        let grandSum = 0;

        data.forEach(item => {
            const expenseDate = new Date(item.ExpenseDate);
            const amount = parseFloat(item.ExpenseCost) || 0;

            if (expenseDate.toDateString() === today.toDateString()) {
                todaySum += amount;
            }
            if (expenseDate.toDateString() === yesterday.toDateString()) {
                yesterdaySum += amount;
            }
            if (expenseDate >= last7Days) {
                last7DaysSum += amount;
            }
            if (expenseDate >= last30Days) {
                last30DaysSum += amount;
            }
            if (expenseDate >= currentYear) {
                currentYearSum += amount;
            }
            grandSum += amount;


        })
        setTodayTotal(todaySum);
        setYesterdayTotal(yesterdaySum);
        setLast_7_daysTotal(last7DaysSum);
        setLast_30_daysTotal(last30DaysSum);
        setCurrent_yearTotal(currentYearSum);
        setGrandTotal(grandSum);
    }

    return (
        <div className="container mt-4">
            <div className="text-center">
                <h2 className="mt-5">Welcome {userName}</h2>
                <p>Here's your expense overview</p>
            </div>

            <div className="row g-4 mt-3">

                <div className="col-md-4">
                    <div className="card text-white text-center bg-primary shadow-sm" style={{ height: "150px" }}>
                        <div className="card-body d-flex flex-column justify-content-center">
                            <h5 className="card-title">
                                <i className="fas fa-calendar-day me-2"></i>Today's Expenses
                            </h5>
                            <p className="card-text">₹ {todayTotal}</p>
                        </div>
                    </div>
                </div>


                <div className="col-md-4">
                    <div className="card text-white text-center bg-success shadow-sm" style={{ height: "150px" }}>
                        <div className="card-body d-flex flex-column justify-content-center">
                            <h5 className="card-title">
                                <i className="fas fa-wallet me-2"></i>Yesterday
                            </h5>
                            <p className="card-text">₹ {yesterdayTotal}</p>
                        </div>
                    </div>
                </div>


                <div className="col-md-4">
                    <div className="card text-dark text-center bg-warning shadow-sm" style={{ height: "150px" }}>
                        <div className="card-body d-flex flex-column justify-content-center">
                            <h5 className="card-title">
                                <i className="fas fa-calendar-alt me-2"></i>last 7 Days
                            </h5>
                            <p className="card-text">₹ {last_7_daysTotal}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card text-white text-center bg-info shadow-sm" style={{ height: "150px" }}>
                        <div className="card-body d-flex flex-column justify-content-center">
                            <h5 className="card-title">
                                <i className="fas fa-history me-2"></i>Last Month
                            </h5>
                            <p className="card-text">₹ {last_30_daysTotal}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card text-white text-center bg-danger shadow-sm" style={{ height: "150px" }}>
                        <div className="card-body d-flex flex-column justify-content-center">
                            <h5 className="card-title">
                                <i className="fas fa-piggy-bank me-2"></i>Current year
                            </h5>
                            <p className="card-text">₹ {current_yearTotal}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card text-white text-center bg-secondary shadow-sm" style={{ height: "150px" }}>
                        <div className="card-body d-flex flex-column justify-content-center">
                            <h5 className="card-title">
                                <i className="fas fa-coins me-2"></i>Total
                            </h5>
                            <p className="card-text">₹ {grandTotal}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard