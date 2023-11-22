import React, { useState, useEffect } from "react";
import ShoppingCartCheckoutRoundedIcon from '@mui/icons-material/ShoppingCartCheckoutRounded';
import CurrencyRupeeRoundedIcon from '@mui/icons-material/CurrencyRupeeRounded';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { Button } from "@mui/material";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import IconButton from '@mui/material/IconButton';
import { Cookies } from "react-cookie";



export default function Card(props) {
    const myCookie = new Cookies();
   // console.log(props.stock)
    const [add, setAdd] = useState(false);
    

    const CurrentItem = { id: props.id, name: props.name, price: props.price, imgurl: props.image, quantity: 1 }
    //console.log(CurrentItem)
    function handleChange() {
        //addting to localstorage
        const cart = JSON.parse(localStorage.getItem('cart'));

        cart.push(CurrentItem)

        localStorage.setItem('cart', JSON.stringify(cart))

        setAdd(true);
    }

    return (
        <div className="card-data">
            <div style={{ display: 'block' }}>
                <div style={{ display: 'inline-block' }}>
                        <img src={props.image} alt="" />
                </div>
                <h3 style={{ marginLeft: '10px', width: "160px", overflow: "hidden" }}>{props.name}</h3>
                <div style={{ display: "inline-flex", alignItems: 'center' }}>
                    <CurrencyRupeeRoundedIcon fontSize="small" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '10px' }} />
                    <span style={{ fontSize: '19px' }}>{props.price}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-around" }}>

                
                            {add ?
                            <IconButton className='buttonn' variant='contained'>
                                <CheckCircleRoundedIcon sx={{ color: 'green' }} />
                            </IconButton>
                            :
                            <IconButton className='buttonn' variant='contained' onClick={handleChange}>
                                <AddShoppingCartIcon />
                            </IconButton>
                            }
                    

                    <Button href="\cart"><ShoppingCartCheckoutRoundedIcon sx={{ color: '#6c6c6c' }} /></Button>

                </div>
            </div>
        </div>

    );
}