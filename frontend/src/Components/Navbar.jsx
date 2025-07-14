import React from 'react';
import styles from './Navbar.module.css'; // Assuming you renamed Navbar.css to Navbar.module.css
import { Navigate, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const Navigate= useNavigate();
    const handleLogOut=() => {
      localStorage.removeItem('token');
      window.alert("Logout! Successfull")
      setTimeout(()=>{
        Navigate('/login');
      },1000);
    }
    
  return (
    <div className={styles.container}>
        <div className={styles.flash}>View All</div>
        <div className={styles.logout}>
            <button onClick={handleLogOut}>LogOut</button>
        </div>
    </div>
  );
}

export default Navbar;
