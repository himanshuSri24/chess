
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import GameWindow from "./pages/GameWindow"
import Navbar from "./components/Navbar"

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/newGame' element={<GameWindow/>}/>
          <Route path='*' element={<div>Error 404</div>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
