import logo from './logo.svg';
import './App.css';
import Registration from './Components/registration'; 
import Login from './Components/login';
import Flashcard from './Components/flashcard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Registration" element={<Registration />}></Route>
         <Route path="/Login" element={<Login />}></Route>
         <Route path='/' element={<Flashcard/>}></Route>
      </Routes>
    </Router>
  );
}
export default App;