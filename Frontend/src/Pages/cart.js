import React, { useState } from "react";
import Header from "../Components/header1";
import { Cookies } from "react-cookie";
import { useEffect } from "react";
import IconButton from '@mui/material/IconButton';
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import Swal from 'sweetalert2'
import Apiurl from '../Components/Apiurl.js'
import Loading from "../Components/loading";


export default function Cart() {
    useEffect(() => {
        document.title = "Cart - Food order app"
    }, [])

    const menuList = JSON.parse(localStorage.getItem('menuList'))

    const myCookie = new Cookies;
    const navigate = useNavigate();
    const username = myCookie.get("username");
    const [loading, setLoading] = useState(false)

    const cartItems = JSON.parse(localStorage.getItem('cart'));
    console.log("Items in cart : " + cartItems.length)
    const [cart, setCart] = useState(cartItems);
    const count = cart.length;

    useEffect(() => {
        calculateTotal();
    }, [cart])

    const [Quantity, setQuantity] = useState(1);
    const [Total, setTotal] = useState(0);

    const calculateTotal = () => {
        const totalPrice = cart.reduce((accumulator, item) => accumulator + (item.quantity * item.price), 0);
        setTotal(totalPrice);
    };

    const AddQuantity = (index, id, quantity) => {
            cart[index].quantity += 1;
            localStorage.setItem('cart', JSON.stringify(cart))
            setCart([...cart]);
            calculateTotal()
        
    }

    const ReduceQuantity = (index, quantity) => {
        if (quantity > 1) {
            cart[index].quantity -= 1;
            localStorage.setItem('cart', JSON.stringify(cart))
            setCart([...cart]);
            calculateTotal()
        }
    }

    const DeleteItem = (id, index) => {
        //changing in local storage
        const temp = cart.splice(index, 1);
        setCart([...cart]);
        localStorage.setItem('cart', JSON.stringify(cart))
        calculateTotal()
    }


    const date = new Date().toLocaleDateString("en-IN")
    console.log(date)

    const OrderDetails = { username: username, items: cart, date: date }

    const Order = () => {
        {
            myCookie.get("username") ?
            Swal.fire({
                imageUrl: 'https://i.ibb.co/fvdZ0vg/favpng-payment-gateway-e-commerce-payment-system.png',
                title: 'Payment Options',
                text: 'Total Bill Amount To Pay : ' + Total.toString(),
                confirmButtonText: 'Cash On Delivery',
                showDenyButton: true,
                denyButtonText: 'Online Payment',
                confirmButtonColor: '#1565c0',
                denyButtonColor: '#1565c0'
            }).then((res) => {
                if (res.isConfirmed) {
                    setLoading(true)
                    axios({
                        url: Apiurl + '/orderitem',
                        method: 'POST',
                        params: OrderDetails
                    })
                        .then(async (res) => {
                            if (res.data.ordered) {
                                setCart([])
                                localStorage.setItem('cart', JSON.stringify([]))
                                setLoading(false)
                                navigate('/ordersuccess')
                            }
                        })
                }
                else if (res.isDenied) {
                    //setPayment(true)
                    var options = {
                        key: "rzp_test_tF9FisDGViqYKW",
                        key_secret: "MhPk8JsNgU4GZ5upfYLtlse7",
                        amount: Total * 100,
                        currency: "INR",
                        name: "Foody - Food order app",
                        description: "for testing purpose",
                        handler: function (res) {
                            setLoading(true)
                            axios({
                                url: Apiurl + '/orderitem',
                                method: 'POST',
                                params: OrderDetails
                            })
                                .then((res) => {
                                    if (res.data.ordered) {
                                        setCart([])
                                        localStorage.setItem('cart', JSON.stringify([]))
                                        setLoading(false)
                                        setLoading(false);
                                        navigate('/ordersuccess')
                                    }
                                })
                        },
                        prefill: {
                            name: "Dhanushkumar Sankar",
                            email: "dhanushit419@gmail.com",
                            contact: "9025635359"
                        },
                        theme: {
                            color: "#3399cc"
                        }
                    }
                    var pay = new window.Razorpay(options)
                    pay.open();
                }
            })
            :
            Swal.fire({
                icon: 'error',
                title: "It seems you are Not Logged in !",
                text: "Please login to order.... ",
                confirmButtonText: "Login",
                confirmButtonColor: "#1565c0",

            })
                .then((res) => {
                    if (res.isConfirmed) {
                        navigate("/login");
                    }
                })

        }

    }

    return (
        <div className="cart">
            {loading ? <Loading text="Processing Your Order Request" />
                : <div>
                    <Header /><div className="card-container" >
                        <div className='cartcard'>

                            {count > 0 ? <table style={{ alignContent: "flex-start" }}>
                                <thead>
                                    <tr>
                                        <th>Product Id</th>
                                        <th> Product Name</th>
                                        <th style={{ paddingLeft: '80px' }}>Image</th>
                                        <th>Quantity</th>
                                        <th>Product Price</th>
                                        <th>Remove from Cart</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {cart.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>{item.name}</td>
                                            <td style={{ width: '200px' }}>
                                                <img src={item.imgurl} className='sample'></img>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <IconButton id='dec' onClick={() => { ReduceQuantity(index, item.quantity) }}><IndeterminateCheckBoxOutlinedIcon /></IconButton>
                                                    {item.quantity}
                                                    <IconButton id='increase' onClick={() => { AddQuantity(index, item.id, item.quantity) }}><AddBoxOutlinedIcon /></IconButton>
                                                </div>
                                            </td>

                                            <td>{item.price}</td>
                                            <td><IconButton onClick={() => { DeleteItem(item.id, index) }}><DeleteIcon /></IconButton></td>

                                        </tr>
                                    )
                                    )}

                                </tbody>
                            </table> :
                                <div style={{ display: 'block', alignContent: 'center', justifyContent: 'center' }}><h1>No Products In Cart ! Cart Is Empty</h1><br />
                                    <img src="https://cdn.dribbble.com/users/2058104/screenshots/4198771/media/6a0fa7f46ba72d002786d0579f8de1d0.jpg" style={{ height: '200px', borderRadius: '100px', mixBlendMode: 'multiply' }} alt="" />
                                    <Button variant="contained" startIcon={<ShoppingCartIcon />} onClick={() => { navigate("/menu") }}>Shop Now</Button>
                                </div>}
                        </div>


                        <div className='cartcard2'>
                            <table style={{ alignContent: "flex-start" }}>
                                <thead>
                                    <th>Order Summary</th>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>Total.No of Items in Cart  : </td> {count > 0 ? <td>{count}</td> : <td>Cart Is Empty</td>}
                                    </tr>
                                    <tr>
                                        <th>Name</th><th>Quantity</th><th>Price</th>
                                    </tr>
                                    {
                                        cart.map((item) => (
                                            <tr>
                                                <td>{item.name}</td><td>{item.quantity}</td><td>{item.price}</td>
                                            </tr>
                                        ))
                                    }

                                </tbody>
                                <tfoot>
                                    <td><em>Total Price </em></td>
                                    <td>₹ {Total}</td>
                                    <td>{count > 0 ? <Button variant="contained" onClick={Order}>Order</Button> :
                                        <Button variant="contained" startIcon={<SentimentVeryDissatisfiedIcon />} disabled>Order</Button>}</td>
                                </tfoot>
                            </table>

                        </div>
                    </div>
                </div>}
        </div>

    )
}


