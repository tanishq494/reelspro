"use client"
import SelectStyle from './_components/SelectStyle';
import SelectTopic from './_components/SelectTopic'
import SelectDuration from './_components/SelectDuration'
import CustomLoading from './_components/CustomLoading';
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useContext, useEffect } from 'react';
import { videoDataContext } from '../../_context/videoDataContext';
import db from '@/configs/db';
import { VideoData } from '@/configs/schema';
import { useUser } from '@clerk/nextjs';
import { PlayerDialog } from '../_components/PlayerDialog';
import { userDetailContext } from '../../_context/userDetailContext';
import { toast } from "@/components/ui/toast";
import { Users } from '@/configs/schema';
import { eq } from 'drizzle-orm';

const VIDEO_COST = 10;

function CreateNew () {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [videoScript, setVideoScript] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [captionText, setCaptionText] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);
    const [error, setError] = useState(null);
    const {user} = useUser();
    const {videoData, setVideoData} = useContext(videoDataContext);
    const {userDetail, setUserDetail} = useContext(userDetailContext);
    const [playVideo, setPlayVideo] = useState(false);
    const [videoId, setVideoId] = useState(null);

    const onHandleUserDate = (fieldName, fieldValue) => {
        console.log('fieldName:', fieldName, 'fieldValue:', fieldValue);
        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: fieldValue
        }));
    }

    const onCreateClickHandler = async () => {
        if ((userDetail?.credits ?? 0) < VIDEO_COST) {
            toast({
                title: "Insufficient Credits",
                description: "You don't have enough credits to create a new video.",
                variant: "destructive",
            });
            return;
        }
        await GetVideoScript();
    }

    // get videoScripts 
    const GetVideoScript = async () => {
        setLoading(true);
        const prompt=`write a script to generate '${formData.duration}' seconds video on topic: '${formData.topic}' along with the image prompt in '${formData['image-style']}' format for each scene and give me result in json format with imageprompt and contentext as field`
        console.log("Prompt sent:", prompt);

        try {
            const res = await axios.post('/api/get-video-script', { prompt });
            setVideoData(prev => ({
                ...prev,
                'videoScript': res.data.result,
            }));
            setVideoScript(res.data.result);
            await GenerateAudioFile(res.data.result);
        } catch (error) {
            console.error("Unable to generate video script:", error);
        } finally {
            setLoading(false);
        }
    }

    // generate audio file
    const GenerateAudioFile = async (videoScriptData) => {
        let script = '';
        const id = uuidv4();

        videoScriptData.forEach((item) => {
            script += `${item.contentext ?? item.contextText ?? item.ContextText ?? ''} `;
        })

        const resp = await axios.post('/api/generate-audio', {
            text: script.trim(),
            id,
        });
        setAudioUrl(resp.data.downloadURL);
        await GenerateAudioCaption(resp.data.downloadURL, videoScriptData);
        setVideoData(prev => ({
                ...prev,
                'audioUrl': resp.data.downloadURL,
        })); 
    }

    // generate audio caption
    const GenerateAudioCaption = async (fileUrl, videoScriptData) => {
        setLoading(true);
        const resp = await axios.post('/api/generate-captions', {
            audioFile: fileUrl,
        });

        setVideoData(prev => ({
                ...prev,
                'audioCaption': resp.data.result.text,
        }));
        setCaptionText(resp.data.result.text);
        await GenerateImage(videoScriptData);
        setLoading(false);
    }

    // generate image
    const GenerateImage = async (videoScriptData) => {
        setLoading(true);
        setError(null);

        try {
            const images = [];
            for (const item of videoScriptData) {
                const response = await axios.post('/api/generate-image', {
                    prompt: item.imageprompt
                });
                images.push(response.data.result);
            }

            setVideoData(prev => ({
                ...prev,
                'imageUrls': images,
            }));
            setImageUrls(images);
        } catch (requestError) {
            const message = requestError.response?.data?.error
                ?? "Unable to generate images. Please try again.";
            console.error("Unable to generate images:", requestError);
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        console.log(videoData);
        if (videoData && Object.keys(videoData).length === 4) {
            saveVideoData(); 
        }
    }, [videoData]);

    const saveVideoData = async () => {
        setLoading(true);
        try {
            const result = await db.insert(VideoData).values({
                createdBy: user?.primaryEmailAddress?.emailAddress,
                videoScript: videoData?.videoScript,
                audioUrl: videoData?.audioUrl,
                audioCaption: videoData?.audioCaption,
                imageUrls: videoData?.imageUrls,
            }).returning({id: VideoData.id});

            await updateUserCredits();
            console.log(result);
            setVideoId(result[0].id);
            setPlayVideo(true);
        } catch (error) {
            console.error("Error saving video data:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateUserCredits = async () => {
        try {
            const result = await db.update(Users).set({
                credits: userDetail.credits - VIDEO_COST
            }).where(eq(Users.email, user?.primaryEmailAddress?.emailAddress)).returning();

            setUserDetail(prev => ({
                ...prev,
                "credits": userDetail.credits - VIDEO_COST
            }))

            setVideoData({});
        } catch (error) {
            console.error("Error updating user credits:", error);
        }
    }

    return(
        <div className='md:px-20'>
            <h2 className='font-bold text-4xl text-primary text-center'>Create New Video</h2>
            <div className='mt-10 shadow-md p-10'>
             <SelectTopic onUserSelect={onHandleUserDate}/>
             <SelectStyle onUserSelect={onHandleUserDate}/>
             <SelectDuration onUserSelect={onHandleUserDate}/>

             <Button className='mt-10 w-full' onClick={() => onCreateClickHandler()}>Create Video</Button>

             {error && <p className='mt-4 text-sm text-red-600'>{error}</p>}
             <CustomLoading loading={loading} />
            </div>
            <PlayerDialog playVideo={playVideo} videoId={videoId} />
        </div>
    )
}

export default CreateNew;