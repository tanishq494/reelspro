
import { useState, useEffect } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Player } from "@remotion/player";
import { RemotionVideo } from "./RemotionVideo";
import { Button } from "@/components/ui/button";

import db from "@/configs/db";
import { VideoData } from "@/configs/schema";
import { eq } from "drizzle-orm";

export const PlayerDialog = ({ playVideo, videoId, onClose }) => {

    const [openDialog, setOpenDialog] = useState(false);
    const [videoData, setVideoData] = useState(null);

    // Actual audio duration in Remotion frames
    const [durationInFrame, setDurationInFrame] = useState(null);
    const [durationError, setDurationError] = useState(false);

    const fps = 30;

    // Fetch video data
    useEffect(() => {
        setOpenDialog(playVideo);

        if (!playVideo || !videoId) {
            return;
        }

        let isActive = true;

        const getVideoData = async () => {
            try {
                const result = await db
                    .select()
                    .from(VideoData)
                    .where(eq(VideoData.id, videoId));

                if (isActive) {
                    setVideoData(result[0] || null);
                }

            } catch (error) {
                console.error("Error fetching video data:", error);
            }
        };

        getVideoData();

        return () => {
            isActive = false;
        };

    }, [playVideo, videoId]);


    // Get actual duration from audioUrl
    useEffect(() => {

        const audioUrl = videoData?.audioUrl;

        setDurationInFrame(null);
        setDurationError(false);

        if (!audioUrl) {
            setDurationError(true);
            return;
        }

        let isActive = true;

        const audio = new window.Audio();

        audio.preload = "metadata";

        const handleLoadedMetadata = () => {

            if (!isActive) return;

            const audioDuration = audio.duration;

            if (Number.isFinite(audioDuration) && audioDuration > 0) {

                const frames = Math.ceil(audioDuration * fps);

                console.log("Audio duration:", audioDuration, "seconds");
                console.log("Video duration:", frames, "frames");

                setDurationInFrame(frames);

            } else {
                setDurationError(true);
            }
        };

        const handleError = () => {
            if (isActive) {
                setDurationError(true);
                console.error("Unable to read audio duration");
            }
        };

        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("error", handleError);

        audio.src = audioUrl;
        audio.load();

        return () => {
            isActive = false;

            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("error", handleError);

            audio.pause();
            audio.src = "";
        };

    }, [videoData?.audioUrl]);


    return (
        <Dialog
            open={openDialog}
            onOpenChange={(open) => {
                setOpenDialog(open);
                if (!open) {
                    onClose?.();
                }
            }}
        >
            <DialogContent className="bg-white flex flex-col items-center">

                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold my-5">
                        Your Video
                    </DialogTitle>

                    <DialogDescription>
                        Preview your generated video
                    </DialogDescription>

                    <div>

                        {videoData && durationInFrame !== null && !durationError && (
                            <Player
                                component={RemotionVideo}
                                durationInFrames={durationInFrame}
                                compositionWidth={300}
                                compositionHeight={450}
                                fps={fps}
                                controls={true}
                                inputProps={{
                                    ...videoData,
                                    durationInFrames: durationInFrame,
                                }}
                            />
                        )}

                        {videoData && durationInFrame === null && !durationError && (
                            <p>Loading audio duration...</p>
                        )}

                        {durationError && (
                            <p className="text-red-500">
                                Unable to load audio duration. Please check your audio URL.
                            </p>
                        )}

                        <div className="flex gap-5 mt-5">

                            <Button
                                variant="ghost"
                                onClick={() => setOpenDialog(false)}
                            >
                                Cancel
                            </Button>

                            <Button>
                                Export
                            </Button>

                        </div>

                    </div>

                </DialogHeader>

            </DialogContent>
        </Dialog>
    );
};