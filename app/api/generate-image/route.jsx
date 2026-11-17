import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { getAdminBucket } from "@/configs/firebaseAdmin";

export const runtime = "nodejs";

export async function POST(req) {
    try {
        const { prompt } = await req.json();
        if (typeof prompt !== "string" || prompt.trim() === "") {
            return NextResponse.json(
                { error: "A non-empty prompt is required." },
                { status: 400 }
            );
        }

        // const apiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;
        if (!process.env.IMAGEN_API_KEY) {
            return NextResponse.json(
                { error: "GOOGLE_API_KEY or GEMINI_API_KEY is not configured." },
                { status: 500 }
            );
        }

        const ai = new GoogleGenAI({ apiKey: process.env.IMAGEN_API_KEY});

        const response = await ai.models.generateContent({
            model: "gemini-3.1-flash-image",
            contents: prompt.trim(),
            config: {
                responseModalities: ["IMAGE"],
                imageConfig: { aspectRatio: "3:4" },
            },
        });

        const parts = response.candidates?.[0]?.content?.parts ?? [];
        const imagePart = parts.find((p) => p.inlineData?.data);
        if (!imagePart) {
            throw new Error("Image generation returned no image.");
        }

        const { data, mimeType } = imagePart.inlineData;
        if (!data) {
            throw new Error("Image generation returned empty image data.");
        }

        const imageType = mimeType || "image/png";
        const extension = imageType.split("/")[1] || "png";
        const storageRef = getAdminBucket().file(
            `ai-short-video-files/${Date.now()}.${extension}`
        );

        await storageRef.save(Buffer.from(data, "base64"), {
            metadata: { contentType: imageType },
        });

        const [downloadURL] = await storageRef.getSignedUrl({
            action: "read",
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        });

        return NextResponse.json({
            result: downloadURL,
        });
    } catch (e) {
        console.error("Error generating image:", e);

        const status = typeof e?.status === "number" ? e.status : 500;
        return NextResponse.json(
            { error: e instanceof Error ? e.message : "Unable to generate image." },
            { status }
        );
    }
}