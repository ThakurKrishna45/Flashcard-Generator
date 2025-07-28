import React, { useState } from 'react';
import styles from './Navbar.module.css'; 
import { useLocation, useNavigate } from 'react-router-dom';


const Navbar = () => {
  const location = useLocation();
    //  const Navigate= useNavigate();
    const navigate = useNavigate();

    const handleLogOut=() => {
      localStorage.removeItem('token');
      window.alert("Logout! Successfull")
      setTimeout(()=>{
        navigate('/login');
      },1000);
    }
  const [currentPage, setCurrentPage] = useState(location.pathname);
 

  return (
    <div className={styles.container}>
      {currentPage === '/flashcard' ? (
        <button className={styles.homeBtn} onClick={() => navigate('/flashcardGen')}>
          Generate
        </button>
      ) : (
        <button className={styles.profileBtn} onClick={() => navigate('/flashcard')}>
          All Cards
        </button>
      )}
      <div>
        <button className={styles.Navbar_logoutBtn} onClick={handleLogOut}>
          LogOut
        </button>
      </div>
    </div>
  );
};

export default Navbar;



