import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Navbar = () => {

    const navigate = useNavigate();
    const userid = localStorage.getItem('userId');

    const handlelogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        navigate('/login');
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                {/* Brand */}
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <i className="fas fa-wallet fa-fw me-2"></i>
                    <span>Expense Tracker</span>
                </Link>

                {/* Toggler (for mobile view) */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navbar links */}
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto align-items-center">
                        <li className="nav-item">
                            <Link className="nav-link d-flex align-items-center" to="/">
                                <i className="fas fa-home fa-fw me-1"></i>
                                <span>Home</span>
                            </Link>
                        </li>


                        {userid ? (<> <li className="nav-item">
                            <Link className="nav-link d-flex align-items-center" to="/dashboard">
                                <i className="fas fa-tachometer-alt fa-fw me-1"></i>
                                <span>Dashboard</span>
                            </Link>
                        </li>

                            <li className="nav-item">
                                <Link className="nav-link d-flex align-items-center" to="/add-expense">
                                    <i className="fas fa-plus fa-fw me-1"></i>
                                    <span>Add Expense</span>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link d-flex align-items-center" to="/manage-expense">
                                    <i className="fas fa-tasks fa-fw me-1"></i>
                                    <span>Manage Expense</span>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link d-flex align-items-center" to="/expense-report">
                                    <i className="fas fa-chart-bar fa-fw me-1"></i>
                                    <span>Expense Report</span>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link d-flex align-items-center" to="/change-password">
                                    <i className="fas fa-key fa-fw me-1"></i>
                                    <span>Change Password</span>
                                </Link>
                            </li>


                            <button className="nav-link d-flex align-items-center btn btn-danger" to="/logout" onClick={handlelogout}>
                                <i className="fas fa-sign-out-alt fa-fw me-1"></i>
                                <span>Log Out</span>
                            </button>

                        </>) : (<><li className="nav-item">
                            <Link className="nav-link d-flex align-items-center" to="/signup">
                                <i className="fas fa-user-plus fa-fw me-1"></i>
                                <span>Sign Up</span>
                            </Link>
                        </li>

                            <li className="nav-item">
                                <Link className="nav-link d-flex align-items-center" to="/login">
                                    <i className="fas fa-sign-in-alt fa-fw me-1"></i>
                                    <span>Login</span>
                                </Link>
                            </li></>)}




                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
