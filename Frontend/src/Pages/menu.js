import React, { useEffect, useState } from "react";
import Header from "../Components/header";
import Menu_card from "../Components/product_card";


export default function(){
    const [menuList,setMenuList]=useState([]);

    useEffect(() => {
        document.title = "Menu"
        const menuList1 = JSON.parse(localStorage.getItem('menuList'));
        setMenuList(menuList1);
      }, [])

    return(
        <div>
            
        <div className="product-card" >
                <Header/>
                {
                    menuList.map(item =>
                        <Menu_card
                        id={item.id}
                        name={item.name} 
                        price={item.price}
                        image={item.imgurl}
                        />
                    )
                }
                
            </div>
        </div>
    );
}