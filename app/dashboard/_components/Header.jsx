import Image from 'next/image';
import { UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { userDetailContext } from '@/app/_context/userDetailContext';
import { useContext } from 'react';

function Header () {
    const { userDetail, setUserDetail } = useContext(userDetailContext);
    return (
        <div className='p-3 px-5 flex justify-between items-center shadow-md'>
            <div className='flex items-center gap-3'>
                <Image src={'/gemini-svg.svg'} alt='Logo' width={30} height={30} />
                <h2 className='text-xl font-bold'>AI Reels Pro</h2>
            </div>
            <div className='flex items-center gap-3'>
                <div className='flex gap-1 items-center'>
                    <Image src={'/dollar.png'} width={20} height={20} alt='Dollar Icon' />
                    <h2>{userDetail?.credits}</h2>
                </div>
                <Button src='/dashboard'>Dashboard</Button>
                <UserButton />
            </div>
        </div>   
)}

export default Header;