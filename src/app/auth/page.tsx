"use client"
import { authModalState } from '@/atoms/authModalAtom';
import Navbar from '@/components/Navbar/Navbar';
import AuthModal from '@/components/modals/AuthModal';
import { auth } from '@/firebase/firebase';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilValue } from 'recoil';


type AuthPageProps = {
  
};

const AuthPage:React.FC<AuthPageProps> = () => {
	const authModal = useRecoilValue(authModalState);
	const [user, loading, error] = useAuthState(auth);
	const [pageLoading, setPageLoading] = useState(true); //to handle the error where auth page was showing for a split second
	const router = useRouter();
	
	useEffect(()=>{
		if(user) router.push("/");
		if(!loading && !user) setPageLoading(false);
	},[user, router, loading]);
	if(pageLoading) return null;
  return(
		<div className='bg-gradient-to-b from-gray-600 to-black h-screen relative'>
			<div className='max-w-7xl mx-auto'>
				<Navbar />
				<div className='flex items-center justify-center h-[calc(100vh-5rem)] pointer-events-none select-none'>
					<Image src='/hero.png' alt='Hero img' width={700} height={700} priority={true}  />
				</div>
				
				 {authModal.isOpen && <AuthModal />}
			</div>
		</div>
  )
}
export default AuthPage;
  