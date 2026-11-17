"use client"
import { useState, useEffect } from 'react';
import Header from './_components/Header';
import SideNav from './_components/SideNav';
import { videoDataContext } from '../_context/videoDataContext';
import { userDetailContext } from '../_context/userDetailContext';
import { useUser } from '@clerk/nextjs';
import { db } from '@/configs/db';
import { Users } from '@/configs/schema';
import { eq } from 'drizzle-orm';

function DashboardLayout({ children }) {
  const [videoData, setVideoData] = useState({});
  const [userDetail, setUserDetail] = useState({});
  const { user } = useUser();

  useEffect(() => {
    user && getUserDetail();
  }, [user]);

  const getUserDetail = async () => {
    try {
      const response = await db.select().from(Users)
      .where(eq(Users.email, user?.primaryEmailAddress?.emailAddress));
      
      setUserDetail(response[0]);
    } catch (error) {
      console.error('Error fetching user detail:', error);
    }
  };

  return (
    <userDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <videoDataContext.Provider value={{ videoData, setVideoData }}>
        <div>
          <div className='hidden md:block h-screen bg-white fixed mt-[65px] w-64'>
            <SideNav />
          </div>
          <div>
            <Header />
            <div className='md:ml-64 mt-5 p-5'>
              {children}
            </div>
          </div>
        </div>
      </videoDataContext.Provider>
    </userDetailContext.Provider>
  );
}

export default DashboardLayout;