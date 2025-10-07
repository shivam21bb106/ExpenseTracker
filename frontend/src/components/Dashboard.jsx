import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem("userName") || "User";
    const userid = localStorage.getItem("userId");

    const [expenses, setExpenses] = useState([]);
    const [todayTotal, setTodayTotal] = useState(0);
    const [yesterdayTotal, setYesterdayTotal] = useState(0);
    const [last_7_daysTotal, setLast_7_daysTotal] = useState(0);
    const [last_30_daysTotal, setLast_30_daysTotal] = useState(0);
    const [current_yearTotal, setCurrent_yearTotal] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);

    useEffect(() => {
        if (!userid) {
            navigate('/login');
            return;
        }
        fetchExpenses(userid);
    }, [userid]);

    const fetchExpenses = async (userId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/manage_expense/${userId}/`);
            const data = await response.json();

            const expensesArray = Array.isArray(data) ? data : (data.expenses || []);
            setExpenses(expensesArray);
            calculateTotals(expensesArray);
        } catch (error) {
            console.error("Error fetching expenses:", error);
            setExpenses([]);
            calculateTotals([]);
        }
    };

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
            const dateStr = item?.ExpenseDate;
            const costStr = item?.ExpenseCost;

            const expenseDate = dateStr ? new Date(dateStr) : null;
            const amount = parseFloat(costStr) || 0;

            if (expenseDate) {
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
            }
            grandSum += amount;
        });

        setTodayTotal(todaySum);
        setYesterdayTotal(yesterdaySum);
        setLast_7_daysTotal(last7DaysSum);
        setLast_30_daysTotal(last30DaysSum);
        setCurrent_yearTotal(currentYearSum);
        setGrandTotal(grandSum);
    };

    const pieData = {
        labels: expenses.map(item => item.ExpenseItem || "Unknown"),
        datasets: [
            {
                label: 'Expenses',
                data: expenses.map(item => parseFloat(item.ExpenseCost) || 0),
                backgroundColor: [
                    '#ff6384', '#36a2eb', '#ffcd56',
                    '#4bc0c0', '#9966ff', '#ff9f40',
                    '#c9c9ff', '#b2f7ef', '#ffd6a5'
                ].slice(0, Math.max(1, expenses.length)),
                borderWidth: 1,
            },
        ],
    };

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
                            <h5 className="card-title"><i className="fas fa-calendar-day me-2"></i>Today's Expenses</h5>
                            <p className="card-text">₹ {todayTotal.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card text-white text-center bg-success shadow-sm" style={{ height: "150px" }}>
                        <div className="card-body d-flex flex-column justify-content-center">
                            <h5 className="card-title"><i className="fas fa-wallet me-2"></i>Yesterday</h5>
                            <p className="card-text">₹ {yesterdayTotal.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card text-dark text-center bg-warning shadow-sm" style={{ height: "150px" }}>
                        <div className="card-body d-flex flex-column justify-content-center">
                            <h5 className="card-title"><i className="fas fa-calendar-alt me-2"></i>Last 7 Days</h5>
                            <p className="card-text">₹ {last_7_daysTotal.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card text-white text-center bg-info shadow-sm" style={{ height: "150px" }}>
                        <div className="card-body d-flex flex-column justify-content-center">
                            <h5 className="card-title"><i className="fas fa-history me-2"></i>Last 30 Days</h5>
                            <p className="card-text">₹ {last_30_daysTotal.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card text-white text-center bg-danger shadow-sm" style={{ height: "150px" }}>
                        <div className="card-body d-flex flex-column justify-content-center">
                            <h5 className="card-title"><i className="fas fa-piggy-bank me-2"></i>Current Year</h5>
                            <p className="card-text">₹ {current_yearTotal.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card text-white text-center bg-secondary shadow-sm" style={{ height: "150px" }}>
                        <div className="card-body d-flex flex-column justify-content-center">
                            <h5 className="card-title"><i className="fas fa-coins me-2"></i>Total</h5>
                            <p className="card-text">₹ {grandTotal.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4" style={{ width: '400px', height: '400px', margin: 'auto', textAlign: 'center' }}>
                <h4>Expense Distribution</h4>

                {expenses.length > 0 ? (
                    <div style={{ maxWidth: 600 }}>
                        <Pie data={pieData} />
                    </div>
                ) : (
                    <p className="text-muted">No expenses to display yet.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
