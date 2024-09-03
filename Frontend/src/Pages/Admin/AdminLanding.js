import React from "react";
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom'

export default function AdminLanding(){
    const navigate = useNavigate();
    const handleClick1 = (e) => {
        navigate('/studentData');
    }
    const handleClick2 = (e) => {
        navigate('/resources');
    }
    return (
        <div>
            <Navbar />
            <div className='flex flex-row gap-8 pb-11 justify-center items-center min-h-screen'>
                <button onClick={handleClick1} className={`border-[1px] border-black px-4 py-2 rounded `}>Student Data</button>
                <button onClick={handleClick2} className={`border-[1px] border-black px-4 py-2 rounded `}>Resources</button>
            </div>
        </div>
    )
};