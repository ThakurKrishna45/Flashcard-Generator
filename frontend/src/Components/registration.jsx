import { useState, React } from "react";
import './reg.css';
import {useNavigate, Link} from 'react-router-dom';
function Registration(){
const [formData, setFormData]= useState({
    username:"",
    fullName:"",
    email:"",
    password:""
});

  const navigate= useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (event) => {
  event.preventDefault();

  const formData = {
    username: event.target.username.value,
    password: event.target.password.value,
    fullName: event.target.fullName.value,
    email: event.target.email.value,
  };
  if (formData.username.length < 3) {
      alert("Username must be at least 3 characters");
      return;
    }

if (formData.password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

  try {
    const response = await fetch('http://localhost:5000/auth/registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
      alert('Registration successful!');
      setTimeout(()=>{
        navigate('/login')
      },1000)
    } else {
      alert(data.message||'Registration failed!');
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
};
return(
    <>
    <div className="containe">
        <h1 className="head">Registration</h1>
        <br/>
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

             <div className="fn">
                <h3>Full Name:</h3>
            <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}>
            </input>
            </div>

            <div className="gmail">
                <h3>E-mail:</h3>
            <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
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
            <button className="reg_button" type="submit">Submit</button>
            </div>
            <div className="log">
              <span>Already have account?</span>
               <Link to="/login" className="login-link">Login</Link>
            </div>
        </form>
    </div>
    </>
);}
export default Registration;
