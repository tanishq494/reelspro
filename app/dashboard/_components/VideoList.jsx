import { Thumbnail } from '@remotion/player';
import { RemotionVideo } from './RemotionVideo';
import { PlayerDialog } from './PlayerDialog';
import { useState } from 'react';

const THUMBNAIL_DURATION_IN_FRAMES = 120;

const VideoList = ({ videoList = [] }) => {
    const [selectedVideoId, setSelectedVideoId] = useState(null);

    return (
        <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-7">
            {videoList.map((video) => (
                <button
                    type="button"
                    key={video.id}
                    className="block w-full cursor-pointer overflow-hidden rounded-xl text-left"
                    style={{ borderRadius: "16px", overflow: "hidden" }}
                    onClick={() => setSelectedVideoId(video.id)}
                    aria-label={`Play video ${video.id}`}
                >
                    <div
                        className="w-full overflow-hidden rounded-xl"
                        style={{ borderRadius: "16px", overflow: "hidden" }}
                    >
                        <Thumbnail
                            component={RemotionVideo}
                            compositionWidth={250}
                            compositionHeight={390}
                            frameToDisplay={30}
                            durationInFrames={THUMBNAIL_DURATION_IN_FRAMES}
                            fps={30}
                            style={{
                                width: "100%",
                                display: "block",
                                borderRadius: "16px",
                            }}
                            inputProps={{
                                ...video,
                                durationInFrames: THUMBNAIL_DURATION_IN_FRAMES,
                            }}
                        />
                    </div>
                </button>
            ))}
            </div>
            <PlayerDialog
                playVideo={selectedVideoId !== null}
                videoId={selectedVideoId}
                onClose={() => setSelectedVideoId(null)}
            />
        </>
    )
}

export default VideoList;