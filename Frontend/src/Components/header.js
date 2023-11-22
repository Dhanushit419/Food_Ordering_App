import React, { useEffect } from "react";
import { useState, useRef } from "react";
import SearchIcon from '@mui/icons-material/Search';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import axios from "axios";
import Apiurl from "./Apiurl.js"
import Product_card from "./product_card.js";
import { Cookies } from "react-cookie";
import { Link } from "react-router-dom";
import FavoriteIcon from '@mui/icons-material/Favorite';

function Header() {
  const myCookie = new Cookies();
  const queryParameters = new URLSearchParams(window.location.search)
  const name = queryParameters.get("name");

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      SearchedList();
    }
  }

  const [searchCount, setSearchCount] = useState(0);
  const [productsList, setProductsList] = useState([]);
  const [searched, searchedstate] = useState(false);
  const [load, setLoad] = useState(false)

  const SearchedList = () => {
    console.log("Search Request sent to Backend for : "+document.querySelector('#search').value)
    setLoad(true)
    axios({
      url: Apiurl+"/search",
      method: "GET",
      params: { searchTerm: document.querySelector('#search').value.toLowerCase() }
    })
      .then((res) => {
        console.log("Received "+res.data.count+" Results")
        setSearchCount(res.data.count)
        setProductsList(res.data.list)
        setLoad(false)
        searchedstate(true)
      })
      .catch((err) => {
        console.log(err)
      })
  }


  useEffect(() => {
    document.querySelector('#search').value = name;
    name && SearchedList();
    name && searchedstate(true);
  }, [])


  return (
    <div>
      <div>
        <header className="header-home" style={{ display: "flex", justifyContent: 'space-between' }}>
          <div className="header-search-bar-container">
            <div className="header-search-bar">
              {/* <Link to='/products'> */}
              <input type="text" id="search" onKeyDown={handleKeyPress} className="header-search-input" placeholder="  Search here.." autoFocus />

              {/* </Link> */}
            </div>
            <div className="header-search-bar">
              <button className="header-search-button" id="searchButton" onClick={SearchedList}><SearchIcon sx={{ color: "white" }} /></button>
            </div>
          </div>
          <div className="header-buttons">
          <a href="\menu" className="button">Menu</a>
            <a href="\profile" className="button">Profile</a>
            <a href="\cart" className="button">Cart</a>
            <a href="\orders" className="button">Orders</a>

          </div>

        </header>
      </div>

      {searched ?
        <div>
          <h3 style={{ textAlign: "center" }}>{searchCount} Items found </h3>
          <div className="product-card" >

            {
              productsList.map(product =>
                <Product_card
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.imgurl}

                />
              )
            }
          </div>

          <h2 style={{textAlign:"center"}}>Related Products</h2> 
          <div style={{display:"flex", flexDirection:"row", justifyContent:"center"}}>
          </div>

          <hr styles={"height:2px;border-width:0;color:gray;background-color:gray"} />
        </div>
        : <>{load && <div>
          <h3>Getting Your Products...</h3>
          <img src="https://cdn.dribbble.com/users/642104/screenshots/6269396/cart_drbl.gif" style={{ width: '100%', height: '80vh' }} alt="" />
        </div>}
        </>}
    </div>
  );
}

export default Header;

