
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import GameWindow from "./pages/GameWindow"
import Navbar from "./components/Navbar"
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <div> He he he. I can edit your code!</div>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/newGame' element={<GameWindow/>}/>
          <Route path='*' element={<div>Error 404</div>}/>
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
