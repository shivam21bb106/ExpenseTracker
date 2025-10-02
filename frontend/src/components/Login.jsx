import { toast, ToastContainer } from 'react-toastify'
import React from 'react'
import { useState } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'
const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        Email: "",
        Password: ""
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {

        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:8000/api/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.status === 200) {
                toast.success("Login successful! Redirecting to login...");
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('userName', data.userName);

                setTimeout(() => {
                    navigate('/login');
                }, 2000)
            }
            else {
                const data = await response.json();
                toast.error(data.message || "Signup failed. Please try again.");
            }
        }

        catch (error) {


            console.error("Error during signup:", error);
            toast.error("An error occurred during login. Please try again later.");
        }

    }
    return (
        <div className="container mt-5">
            <div className="text-center mb-4">
                <h2> <i className='fas fa-user-plus me-2'></i> Log In </h2>
                <p>Login to Access your dashboard</p>
            </div>

            <form className='p-4 rounded shadow mx-auto' style={{ maxWidth: "500px" }} onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label className='form-label'>Email</label>
                    <div className='input-group'>
                        <span className='input-group-text'>
                            <i className='fas fa-envelope'></i>
                        </span>
                        <input type="email" name="Email" className='form-control' placeholder='Enter your Email' onChange={handleChange} value={formData.Email} />
                    </div>

                </div>

                <div className='mb-3'>
                    <label className='form-label'>Password</label>
                    <div className='input-group'>
                        <span className='input-group-text'>
                            <i className='fas fa-lock'></i>
                        </span>
                        <input type="password" name="Password" className='form-control' placeholder='Enter your Password' onChange={handleChange} value={formData.Password} />
                    </div>

                </div>


                <button type="submit" className='btn btn-primary w-100 mt-3'> <i className='fas fa-user-plus me-2'></i>Log In</button>
            </form>
            <ToastContainer />

        </div>
    )
}
export default Login