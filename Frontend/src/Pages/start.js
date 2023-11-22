import React, { useState, useEffect } from "react";
import axios from "axios";
import Apiurl from '../Components/Apiurl.js'
import Loading from "../Components/loading";
import { useNavigate } from "react-router-dom";

export default function Start() {
    const navigate = useNavigate()
    //to get the list of products from the database

    const [menuList, setmenuList] = useState([]);
    const [loading, setLoading] = useState(true)
    const [cart,setCart] = useState([])
    useEffect(() => {
        //to get the list of menu
        console.log("request send")
        axios({
            url: Apiurl + "/getmenu",
            method: "GET"
        })
            .then((res) => {
                setmenuList(res.data.list)
                console.log(res.data.list)
            })
            .catch((err) => {
                console.log(err)
            })

        
    }, [])

    useEffect(() => {
        if (menuList.length > 0) {
            localStorage.setItem('menuList', JSON.stringify(menuList))
            console.log(menuList.length + " items fetched")
            localStorage.setItem('cart', JSON.stringify(cart))

            setLoading(false);
        }
    }, [menuList]);


    useEffect(() => {
        if (!loading) {
            navigate('/login')
        }
    }, [loading])

    return (
        <div className="start">
            {loading && <Loading text="Please Wait a Moment.. ✨" />}
        </div>
    )
}