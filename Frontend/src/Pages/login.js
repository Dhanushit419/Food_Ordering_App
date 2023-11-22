import React, { useEffect } from "react";
import { Cookies } from 'react-cookie';
import profile from '../images/profile.png';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import Apiurl from '../Components/Apiurl.js'
import LoginIcon from '@mui/icons-material/Login';
import Swal from 'sweetalert2'
import LockIcon from '@mui/icons-material/Lock';
import Loading from "../Components/loading.js";


export default function Login() {
  useEffect(() => {
    document.title = "Login - Food order app"
  }, [])

  // setting cookie for username
  const myCookie = new Cookies();
  const navigate = useNavigate();
  const [userDetails, setuserDetails] = useState({ username: "", pwd: "" });
  const [cart, setCart] = useState([])
  const [fetch, setFetch] = useState(false);

  function UpdateInfo(e) {
    setuserDetails({ ...userDetails, [e.target.id]: e.target.value })
  }


  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      Verify();
    }
  }
  const [loading, setLoading] = useState(false)


  const Verify = () => {

    axios({
      url: Apiurl + "/login",
      method: "POST",
      params: userDetails
    })
      .then(async (res) => {
        if (res.data.correct) {
          setLoading(true)
          document.title = "Logging in"

          myCookie.set("username", res.data.username);

          {
            !loading && Swal.fire({
              icon: 'success',
              title: 'Login sucesful'
            }).then((res) => {
              if (res.isConfirmed) {
                navigate("/menu");
              }
            })
          }

        } else if (res.data.newMail) {

          Swal.fire({
            icon: 'warning',
            title: 'User Not Registered !',
            showDenyButton: true,
            confirmButtonText: 'Try Again',
            denyButtonText: 'Register',
            confirmButtonColor: '#1565c0',
            denyButtonColor: '#1565c0'
          })
            .then((result) => {
              if (result.isDenied) {
                navigate("/register");
              }
            })

        }
        else if (res.data.wrnpwd) {

          Swal.fire({
            icon: 'warning',
            title: 'Wrong Password !',
            confirmButtonText: 'Try Again !'

          })
        }
      })
      .catch((err) => {
        console.log(err.message);
      })
      localStorage.setItem('cart', JSON.stringify([]));

  }

  return (
    <div className="login">
      {loading ? <Loading text="Logging in..." /> :
        <div>
          <div>
            <header className="header-home">
            <a href="\menu" className="button">Menu</a>
            <a href="\profile" className="button">Profile</a>
            <a href="\cart" className="button">Checkout</a>
            </header>
          </div>
          <div className="main">

            <div className="submain">
              <div>
                <div className="imgs">
                  <div className="container-image">
                    <img alt='' src={profile} height={100}></img>
                  </div>

                </div>
                <div>
                  <h1 style={{ padding: " 20px" }}>Login Page</h1>
                </div>
                <br />

                <div style={{ display: "flex", justifyContent: "space-around" }}>
                  <AccountCircleIcon fontSize="large" />

                  <TextField id="username" onChange={UpdateInfo} aria-valuetext={userDetails.username} size="small" type="text" label="Username" variant="outlined" required />
                </div>
                <br></br>
                <br></br>
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                  <LockIcon fontSize="large" />
                  <TextField id="pwd" onChange={UpdateInfo} aria-valuetext={userDetails.pwd} onKeyDown={handleKeyPress} size="small" type="password" label="Password" variant="outlined" required />
                </div>
                <br></br>
                <Button variant="contained" className='submit-button' type="submit" onClick={Verify}><span>Login</span> <LoginIcon fontSize="very-small" /></Button>
                <br></br><br></br><br></br>

                <div className='register'><p>No account? </p><a href='/register'> Register</a></div><br /><br />
                <div className='register'><p>Admin? </p><a href='/adminlogin'>Adminlogin</a></div>


              </div>
            </div>
          </div>
        </div>}
    </div>
  );
}