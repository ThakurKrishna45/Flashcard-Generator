import logo from './logo.svg';
import './App.css';
import Registration from './Components/registration'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Registration" element={<Registration />}></Route>
      </Routes>
    </Router>
  );
}
export default App;