import logo from './logo.svg';
import './App.css';
import Registration from './Components/registration'; 
import Login from './Components/login';
import Flashcard from './Components/flashcard';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import RefreshHandler from './Components/RefreshHandler';
import AllFlashcard from './Components/AllFlashcard';
import Viewcard from './Components/viewcard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });
  const PrivateRoute=({element})=>{
    return isAuthenticated? element : <Navigate to='/login'/>
  }
  return (
    <Router>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated}/>
      <Routes>
        <Route path='/' element={<Navigate to="/login"/>}/>
        <Route path="/registration" element={<Registration />}></Route>
         <Route path="/login" element={<Login />}></Route>
         <Route path='/flashcardGen' element={<PrivateRoute element={<Flashcard/>}/>}></Route>
          <Route path='/flashcard'  element={<PrivateRoute element={<AllFlashcard/>}/>}></Route>
          <Route path='/view'  element={<PrivateRoute element={<Viewcard/>}/>}></Route>
      </Routes>
    </Router>
  );
}
export default App;