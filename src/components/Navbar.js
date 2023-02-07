import {Link} from "react-router-dom"

export default function Navbar() {
  return (
    <div className="navbar">
      <div>
        <Link to="/">   Home   </Link>
        <Link to="/newGame">   Game Window   </Link>
      </div>
    </div>
  )
}
