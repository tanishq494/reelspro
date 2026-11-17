"use client"
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import EmptyState from './_components/EmptyState';
import Link from 'next/link';
import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import db from '@/configs/db';
import { VideoData } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import VideoList from './_components/VideoList';

 function Page() {
  const [ videoList, setVideoList ] = useState([]);
  const {user} = useUser();

  useEffect(() => {
    user&& GetVideoList();
  }, [user]);

  const GetVideoList = async () => {
    try {
      const result = await db.select().from(VideoData)
      .where(eq(VideoData?.createdBy, user?.primaryEmailAddress?.emailAddress));
      
      setVideoList(result);
      console.log(result);
    } catch (error) {
      console.error('Error fetching video list:', error);
    }
  };

  return (
    <div>
      <div className='flex justify-between items-center '>
        <h2 className='font-bold text-2xl text-primary'>Dashboard</h2>
        <Link href='/dashboard/create-new'>
          <Button>+ Create New</Button>
        </Link>
      </div>
      
      {/* Empty state */}
      {videoList?.length == 0 && <div>
        <EmptyState />
      </div>}

      {/* Video list */}
      <VideoList videoList={videoList} />
      
    </div>
  )
}

export default Page;