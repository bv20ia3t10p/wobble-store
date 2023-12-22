import { useEffect, useState } from "react";
import React from 'react'
import appIcon from './icons/appIcon.png'

const Navbar = () => {
    const [categories, setCategories] = useState([]);
    useEffect(()=>{

    },[])
    return (
        <nav className="navbar">
            <a href="/" className="icon">
                <img src={appIcon} alt="AppIcon" />
            </a>
        </nav>
    )
}

export default Navbar
