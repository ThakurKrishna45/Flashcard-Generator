import {React, useState} from "react";
import './login.css';
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData]=useState({
        userName:"",
        password:""
    });

    const navigate= useNavigate();

 const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit=async (event)=>{
    event.preventDefault();

     const formDataToSubmit = {
      username: formData.username,
      password: formData.password.trim(),
    };

  try {
    const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSubmit),
      });
  
      const data = await response.json();
      console.log(data)
      if (response.ok) {
        localStorage.setItem('token', data.token);
      alert('Login successful!');
       setTimeout(()=>{
        navigate('/flashcardGen')
      },1000)
    } else {
      console.error('Login failed:', data);
      alert(data.error||'Login failed!');
    }
        
  } catch (error) {
    console.log(error) 
  }

  }

    return(
        <>
        <div className="login_container">
            <div className="head">
            <h1>Login</h1>
            </div>
            <form onSubmit={handleSubmit}>
            <div className="user">
                <h3>UserName:</h3>
                <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}>
                </input>
            </div>

            <div className="pass">
                <h3>Password:</h3>
                <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}>
                </input>
            </div>

            <div className="sub">
            <button className="login_button" type="submit">Submit</button>
            </div>

            </form>
        </div>
        </>
    )
}
export default Login;