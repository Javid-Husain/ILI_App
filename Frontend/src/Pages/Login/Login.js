import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setStudentName } from '../../redux/actions'; 

export default function Login() {
    const [selected, setSelected] = useState('Student');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = (e) => {
        e.preventDefault();

        if (selected === 'Admin' && password === 'admin') {
            navigate('/adminLanding');
        } else if (selected === 'Student' && name !== '') {
            dispatch(setStudentName(name));
            navigate('/test');
        } else {
        }
    };

    return (
        <div className=" bg-[url('../src/Pages/Login/iiitd.jpeg')] bg-cover">
            <div className=" flex flex-col justify-center items-center min-h-screen">
            <div className='border-[1px] border-black backdrop-blur-sm w-96 bg-white/60 shadow-lg rounded-lg py-4 px-6'>
                <h2 className='text-2xl font-semibold text-gray-800 '>Login to ILI</h2>
                <div className='w-5/6 flex gap-4 my-6'>
                    <button
                        onClick={() => setSelected('Student')}
                        className={`border-[1px] border-black px-4 py-2 rounded ${selected === 'Student' ? 'bg-gray-400 text-black' : 'bg-white hover:bg-gray-300'}`}
                    >
                        Student
                    </button>
                    <button
                        onClick={() => setSelected('Admin')}
                        className={`border-[1px] border-black px-4 py-2 rounded ${selected === 'Admin' ? 'bg-gray-400 text-black' : 'bg-white hover:bg-gray-300'}`}
                    >
                        Admin
                    </button>
                </div>
                <form onSubmit={handleLogin} className='flex flex-col'>
                    {selected === 'Student' && (
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mb-4 px-4 py-2 rounded border-[1px] border-black  focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                    )}
                    {selected === 'Admin' && (
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mb-4 px-4 py-2 rounded border-[1px] border-black  focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                    )}
                    <button type="submit" className="text-lg border-[1px] border-black mb-1 w-full px-4 py-2 bg-white text-black rounded hover:bg-gray-400 transition duration-300">
                        Log In
                    </button>
                    {selected === 'Student' && (
                        <p onClick={() => navigate('/create')} className="text-sm pt-1 font-normal text-black text-center cursor-pointer hover:font-semibold hover:text-blue-600">
                            Sign In
                        </p>
                    )}
                </form>
            </div>
        </div>
        </div>
    );
}
