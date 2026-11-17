
import {
    AbsoluteFill,
    Audio,
    interpolate,
    Sequence,
    useCurrentFrame,
} from "remotion";

export const RemotionVideo = ({
    videoScript,
    imageUrls = [],
    audioCaption,
    audioUrl,
    durationInFrames,
}) => {

    // Parse PostgreSQL array notation into JavaScript objects
    const parseVideoScript = (data) => {
        if (Array.isArray(data)) {
            return data.map((item) => {
                if (typeof item === "object" && item !== null) {
                    return item;
                }

                try {
                    return JSON.parse(item);
                } catch {
                    return {};
                }
            });
        }

        if (typeof data !== "string") return [];

        // First, try normal JSON
        try {
            const parsed = JSON.parse(data);

            if (Array.isArray(parsed)) {
                return parseVideoScript(parsed);
            }

            if (parsed && typeof parsed === "object") {
                return [parsed];
            }
        } catch {
            // Not normal JSON; try PostgreSQL array format
        }

        // Parse PostgreSQL array literal: {"...", "..."}
        if (data.startsWith("{") && data.endsWith("}")) {
            const elements = [];
            let current = "";
            let insideQuotes = false;
            let escaped = false;

            const content = data.slice(1, -1);

            for (const char of content) {
                if (escaped) {
                    current += char;
                    escaped = false;
                    continue;
                }

                if (char === "\\" && insideQuotes) {
                    escaped = true;
                    continue;
                }

                if (char === '"') {
                    insideQuotes = !insideQuotes;
                    continue;
                }

                if (char === "," && !insideQuotes) {
                    if (current.trim()) elements.push(current);
                    current = "";
                    continue;
                }

                current += char;
            }

            if (current.trim()) elements.push(current);

            return elements.map((item) => {
                try {
                    return JSON.parse(item);
                } catch (error) {
                    console.error("Caption parsing error:", error, item);
                    return {};
                }
            });
        }

        return [];
    };

    const scripts = parseVideoScript(videoScript);

    const images = Array.isArray(imageUrls) ? imageUrls : [];
    const totalImages = images.length;

    const totalDuration = Number(durationInFrames);

    if (
        !Number.isFinite(totalDuration) ||
        totalDuration <= 0 ||
        totalImages === 0
    ) {
        return <AbsoluteFill className="bg-black" />;
    }


    return (
        <AbsoluteFill className="bg-black">

            {/* Images and synchronized captions */}
            {images.map((item, index) => {

                const from = Math.floor(
                    (index * totalDuration) / totalImages
                );

                const nextFrom = Math.floor(
                    ((index + 1) * totalDuration) / totalImages
                );

                const duration = nextFrom - from;

                const caption = scripts[index]?.contentext || "";

                return (
                    <Sequence
                        key={`${item}-${index}`}
                        from={from}
                        durationInFrames={duration}
                    >
                        <AbsoluteFill>
                            <ZoomedImage
                                src={item}
                                alt={`Image ${index + 1}`}
                                durationInFrames={duration}
                                zoomIn={index % 2 === 0}
                            />

                            {/* Caption */}
                            <AbsoluteFill
                                style={{
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                    padding: 20,
                                    paddingBottom: 65,
                                    zIndex: 10,
                                }}
                            >
                                <div
                                    style={{
                                        color: "#FFFFFF",
                                        backgroundColor: "rgba(0,0,0,0.50)",
                                        fontSize: "1.2rem",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        padding: "12px 16px",
                                        borderRadius: 10,
                                        width: "100%",
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {caption}
                                </div>
                            </AbsoluteFill>

                        </AbsoluteFill>
                    </Sequence>
                );
            })}

            {/* Audio */}
            {audioUrl && (
                <Audio src={audioUrl} />
            )}

        </AbsoluteFill>
    );
};

const ZoomedImage = ({ src, alt, durationInFrames, zoomIn }) => {
    const frame = useCurrentFrame();
    const endFrame = Math.max(durationInFrames - 1, 1);
    const scale = interpolate(
        frame,
        [0, endFrame],
        zoomIn ? [1, 1.12] : [1.12, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
        <img
            src={src}
            alt={alt}
            style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${scale})`,
                transformOrigin: "center",
            }}
        />
    );
};
