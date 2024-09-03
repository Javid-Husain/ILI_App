import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();

    const goHome = ()=>{
        navigate('/');
    }

    return (
        <div className=" backdrop-blur-sm bg-gray-400 py-4 px-4">
            <div className="">
                <div className="flex gap-5">
                    <img className = "h-[30px]" src={require('./logo.png')} alt = "logo"/>
                    <div className="cursor-pointer text-black text-2xl font-bold" onClick={()=>goHome()}>
                        ILI
                    </div>
                </div>
            </div>
        </div>
    );
}
