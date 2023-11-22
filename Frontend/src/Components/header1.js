import { useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import { Link } from "react-router-dom";

export default function Header1() { 
  const navigate = useNavigate()

  return (
    <div>
      <div>
        <header className="header-home" style={{ display: "flex", justifyContent: 'space-between' }}>
          <div className="header-search-bar-container">
            <div className="header-search-bar">
              <Link to='/menu'>
                <input type="text" id="search" className="header-search-input-header1" placeholder="  Search your lunch here.." />
              </Link>
            </div>
            <div className="header-search-bar">
              <button className="header-search-button" onClick={() => { navigate("/menu") }}><SearchIcon sx={{ color: "white" }} /></button>
            </div>
          </div>
          <div className="header-buttons">
            <a href="\menu" className="button">Menu</a>
            <a href="\profile" className="button">Profile</a>
          </div>

        </header>
      </div>
    </div>
  );
}