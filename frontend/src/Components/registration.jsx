import { useState, React } from "react";
import './reg.css';

function Registration(){
const [formData, setFormData]= useState({
    username:"",
    fullName:"",
    gmail:"",
    password:""
});
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (event) => {
  event.preventDefault();

  const formData = {
    username: event.target.username.value,
    password: event.target.password.value,
    fullName: event.target.fullName.value,
    gmail: event.target.gmail.value,
  };

  try {
    const response = await fetch('http://localhost:5000/registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
      alert('Registration successful!');
    } else {
      alert(data.error||'Registration failed!');
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
};
return(
    <>
    <div className="container">
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
            id="gmail"
            name="gmail"
            value={formData.gmail}
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
);}
export default Registration;
