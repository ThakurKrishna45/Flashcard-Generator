import {React, useState} from "react";
import './login.css';

function Login() {
  const [formData, setFormData]=useState({
        userName:"",
        password:""
    });

 const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit=async (event)=>{
    event.preventDefault();

      const formData = {
    username: event.target.username.value,
    password: event.target.password.value,
  };

  const response = await fetch('http://localhost:5000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
      if (response.ok) {
      alert('Login successful!');
    } else {
      alert(data.error||'Login failed!');
    }

  }

    return(
        <>
        <div className="container">
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
            <button type="submit">Submit</button>
            </div>

            </form>
        </div>
        </>
    )
}
export default Login;