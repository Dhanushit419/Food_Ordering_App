import React from "react";
import { useState ,useEffect} from "react";
import axios from "axios";
import Apiurl from '../../Components/Apiurl'
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";
import Swal from "sweetalert2";
export default function AddProduct(){
    useEffect(() => {
        document.title = "AddProduct"
      }, [])

    const myCookie=new Cookies
    const navigate=useNavigate()
    const[productDetails,setProductDetails]=useState({name:'',price:0,imgurl:'',keywords:''});

    function  UpdateInfo(e){
    setProductDetails({...productDetails,[e.target.id]:e.target.value})
    }

    const addProduct =() =>{
        const list=JSON.parse(localStorage.getItem('menuList'));
        list.push(productDetails)
        localStorage.setItem('menuList',JSON.stringify(list))

        axios({
            url:Apiurl+"/addmenu",
            method:"POST",
            params:productDetails
        })
        .then((res)=>{
            if(res.data.added){
                Swal.fire({
                    icon:'success',
                    title:'Product Added To Database',
                    text:'ID :'+res.data.id.toString()+', Name: '+res.data.name,
                    confirmButtonText:'Add New',
                })
                .then((res)=>{
                    if(res.isConfirmed){
                        window.location.reload();
                    }
                })
                
            }
            else{
                alert("Error in adding Your Product !")
            }
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    const Logout =()=>{
        myCookie.remove('admin')
        navigate('/adminlogin')
    }

    return(
        <div className="sell">
            <div style={{display:'flex',justifyContent:'flex-end',padding:'20px',columnGap:'30px'}}>
            <Button variant="contained" onClick={Logout} >Logout</Button>
            <Button variant="contained" onClick={()=>navigate('/menu')} >Menu</Button>

            </div>
        <div className="main11">
            <div className="submain">
                <div >
                <h1 >Add Food To App</h1>
                <br/><br/>
                <div className="text-field">
                <TextField id="name"   onChange={UpdateInfo} aria-valuetext={productDetails.name} label='Name of the Product' type="text" fullWidth />
                </div>
                <div className="text-field">
                <TextField id="price" onChange={UpdateInfo} aria-valuetext={productDetails.price} label='Price of the Product' type="number" fullWidth/>
                </div>                
                <div className="text-field">
                <TextField id="imgurl" onChange={UpdateInfo} aria-valuetext={productDetails.imgurl} label='Image Url of the Product' type="text" fullWidth />
                </div>
                <div className="text-field">
                <TextField id="keywords" onChange={UpdateInfo} aria-valuetext={productDetails.keywords} defaultValue="keywords... " label='Keywords' type="text" fullWidth />
                </div>
                <Button variant="contained" onClick={addProduct}>Add Food item</Button>
                </div>
            </div>
        </div>
        </div>
    )
}


