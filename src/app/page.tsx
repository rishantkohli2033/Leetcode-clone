"use client"
import ProblemsTable from '@/components/ProblemsTable/ProblemsTable';
import Topbar from '@/components/Topbar/Topbar';
import { firestore } from '@/firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import React, { FC, useState } from 'react';

type HomePageProps = {
    
};

const HomePage:React.FC<HomePageProps> = () => {
    const [inputs, setInputs] = useState({
        pid: "",
        title: "",
        diff: "",
        cat: "",
        order: "", 
        vid: "",
        link: "",
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setInputs((prev)=>({...prev, [e.target.name]: e.target.value}));
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        //convert inputs.order to integer
        const newProblem = {
            ...inputs,
            order: Number(inputs.order),
        }
        await setDoc(doc(firestore, "problems", inputs.pid), newProblem);
        alert("save to db");
    }
    return(
        <>
            <main className='bg-dark-layer-2 min-h-screen'>
                <Topbar />
                <h1 className='text-2xl text-center text-gray-700 dark:text-gray-400 font-medium uppercase mt-10 mb-5'>
                    &ldquo; QUALITY OVER QUANTITY &rdquo; 👇
                </h1>

                <div className='relative overflow-x-auto mx-auto px-6 pb-10'>
                    <table className='text-sm text-left text-gray-500 dark:text-gray-400 sm:w-7/12 w-full max-w-[1200px] mx-auto'>
                        <thead className='text-xs text-gray-700 uppercase dark:text-gray-400 border-b '>
                            <tr>
                                <th scope='col' className='px-1 py-3 w-0 font-medium'>
                                    Status
                                </th>
                                <th scope='col' className='px-6 py-3 w-0 font-medium'>
                                    Title
                                </th>
                                <th scope='col' className='px-6 py-3 w-0 font-medium'>
                                    Difficulty
                                </th>

                                <th scope='col' className='px-6 py-3 w-0 font-medium'>
                                    Category
                                </th>
                                <th scope='col' className='px-6 py-3 w-0 font-medium'>
                                    Solution
                                </th>
                            </tr>
                        </thead>
                        <ProblemsTable/>
                    </table>
                </div>
                <form onSubmit={handleSubmit} className='flex flex-col p-6 max-w-sm gap-3'>
                    <input onChange={handleChange} type="text" placeholder='pid' name='pid' value={inputs.pid} />
                    <input onChange={handleChange} type="text" placeholder='title' name='title' value={inputs.title} />
                    <input onChange={handleChange} type="text" placeholder='diff' name='diff' value={inputs.diff} />
                    <input onChange={handleChange} type="text" placeholder='cat' name='cat' value={inputs.cat} />
                    <input onChange={handleChange} type="text" placeholder='order' name='order' value={inputs.order} />
                    <input onChange={handleChange} type="text" placeholder='vid?' name='vid' value={inputs.vid} />
                    <input onChange={handleChange} type="text" placeholder='link?' name='link' value={inputs.link} />
                    <button className='bg-white'>Save to db</button>
                </form>
            </main>
        </>
    )
}
export default HomePage;