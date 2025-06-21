import logo from './logo.svg';
import './App.css';
import Registration from './Components/registration'; 
import Login from './Components/login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Registration" element={<Registration />}></Route>
         <Route path="/" element={<Login />}></Route>
      </Routes>
    </Router>
  );
}
export default App;