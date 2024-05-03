"use client"
import { auth } from '@/firebase/firebase';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BsList } from 'react-icons/bs';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Logout from '../Buttons/Logout';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '@/atoms/authModalAtom';
import Timer from '../Timer/Timer';
import { problems } from '@/utils/problems';
import { useParams, useRouter } from 'next/navigation';
import { Problem } from '@/utils/types/problem';
import { PiSignInFill } from "react-icons/pi";
import { MdOutlineWorkspacePremium } from 'react-icons/md';


type TopbarProps = {
    problemPage?: boolean; //type for incoming props
    
};

const Topbar:React.FC<TopbarProps> = ({problemPage}) => {
    const [user] = useAuthState(auth);
    const setAuthModalState = useSetRecoilState(authModalState);
    const params = useParams(); //will give the id of current page
    const router = useRouter();

    const handleProblemChange = (isForward: Boolean)=>{
        const {order} = problems[params.pid as string] as Problem; //current order
        const direction = isForward ? 1 : -1; //are we goind to the left or right
        const nextProblemOrder = order + direction; //order for next problem
        const nextProblemKey = Object.keys(problems).find((key) => problems[key].order === nextProblemOrder); //mapping on our problems to find a key whose order matches the next order
        
        //if it's the last problem, and we are trying to move forward then, we will be pushed to first problem
        if (isForward && !nextProblemKey) {
			const firstProblemKey = Object.keys(problems).find((key) => problems[key].order === 1);
			router.push(`/problems/${firstProblemKey}`); //push to first problem
		}
        //if we are at our first problem and are trying to go backwards, we will be pushed to the last problem
        else if (!isForward && !nextProblemKey) {
			const lastProblemKey = Object.keys(problems).find(
				(key) => problems[key].order === Object.keys(problems).length
			);
			router.push(`/problems/${lastProblemKey}`); //push to last problem
		} else {
			router.push(`/problems/${nextProblemKey}`);
		}
    }
    return (
        <nav className='relative flex h-[50px] w-full shrink-0 items-center px-5 bg-dark-layer-1 text-dark-gray-7'>
            <div className={`flex w-full items-center justify-between ${!problemPage ? "max-w-[1200px] mx-auto" : ""}`}>
                <Link href='/' >
                    <Image src='/logo-full.png' alt='Logo' height={100} width={100} style={{ width: "auto", height: "auto" }} />
                </Link>
               

                {problemPage && (
					<div className='flex items-center sm:gap-4 flex-1 justify-center'>
						<div
							className='flex items-center justify-center rounded  hover:bg-dark-fill-2 h-8 w-8 cursor-pointer'
							onClick={() => handleProblemChange(false)}
						>
							<FaChevronLeft />
						</div>
						<Link
							href='/'
							className='flex items-center gap-2 font-medium max-w-[170px] text-dark-gray-8 cursor-pointer'
						>
							<div>
								<BsList />
							</div>
							<p className='hidden sm:block'>Problem List</p>
						</Link>
						<div
							className='flex items-center justify-center rounded  hover:bg-dark-fill-2 h-8 w-8 cursor-pointer'
							onClick={() => handleProblemChange(true)}
						>
							<FaChevronRight />
						</div>
					</div>
				)}

                <div className='flex items-center space-x-4 justify-end'>
                
                    {!user ? (
                        <>
                            <div>
                                <Link
                                    href='#'
                                    target='_blank'
                                    rel='noreferrer'
                                    className='bg-dark-fill-3 py-1.5 px-3 cursor-pointer rounded text-brand-orange hover:bg-dark-fill-2 transition hidden sm:block'
                                >
                                    Premium
                                </Link>
                                <Link
                                    href='#'
                                    target='_blank'
                                    rel='noreferrer'
                                    className='bg-dark-fill-3 py-1.5 px-3 cursor-pointer rounded text-brand-orange hover:bg-dark-fill-2 transition block sm:hidden'
                                >
                                    <MdOutlineWorkspacePremium />
                                </Link>
                            </div>
                            <div>
                            <Link href='/auth' onClick={()=>{setAuthModalState((prev)=>({...prev, isOpen: true, type: "login"}))}}>
                                <button className='bg-dark-fill-3 py-1 px-2 
                                cursor-pointer rounded hover:bg-dark-fill-2 transition hidden sm:block'>Sign In</button>
                                <button className='bg-dark-fill-3 py-1 px-2 
                                cursor-pointer rounded hover:bg-dark-fill-2 transition block sm:hidden'><PiSignInFill/></button>
                            </Link>  
                            </div>
                                                    
                        </>
                    ) : (
                        <>
                        {problemPage && <Timer/>}
                            <div className='cursor-pointer group relative'>
                                <img src="/avatar.png" alt="user profile img" className='h-8 w-8 round-full' />
                                <div className='absolute top-10 left-2/4 -translate-x-2/4  mx-auto bg-dark-layer-1 text-brand-orange p-2 rounded shadow-lg z-40 group-hover:scale-100 scale-0 
                                    transition-all duration-300 ease-in-out'
                                >
                                    <p className='text-sm'>{user.email}</p>
                                </div>
                            </div>
                        <Logout/>  
                       </>
                    )}
                    
                </div>
            </div>
        </nav>
    )
}
export default Topbar;