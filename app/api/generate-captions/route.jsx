import { AssemblyAI } from "assemblyai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req) {
    try {
        const { audioFile } = await req.json();
        if (typeof audioFile !== "string" || audioFile.trim() === "") {
            return NextResponse.json(
                { error: "A non-empty audioFile URL is required." },
                { status: 400 }
            );
        }

        if (!process.env.ASSEMBLYAI_API_KEY) {
            throw new Error("ASSEMBLYAI_API_KEY is not configured.");
        }

        const baseUrl = "https://api.assemblyai.com";

        const client = new AssemblyAI({
            apiKey: process.env.ASSEMBLYAI_API_KEY,
            baseUrl: baseUrl,
        });

        // Use a publicly-accessible URL
        // const audioFile = "https://assembly.ai/wildfires.mp3";

        // Or use a local file:
        // const audioFile = "./example.mp3";

        const params = {
            audio: audioFile.trim(),
            language_detection: true,
            speaker_labels: true,
        };


        const transcript = await client.transcripts.transcribe(params);

        if (transcript.status === "error") {
            throw new Error(`Transcription failed: ${transcript.error}`);
        }

        // Log transcript.id for every request (not just errors), with a timestamp and API region.
        // It's required to fetch results, retry, or delete the transcript later, and it's the first
        // thing support@assemblyai.com asks for. Delete: /pre-recorded-audio/delete-transcripts
        // Troubleshooting: /pre-recorded-audio/guides/common_errors_and_solutions

        console.log(`\nFull Transcript:\n\n${transcript.text ?? ""}`);

        // Optionally print speaker diarization results
        // for (const utterance of transcript.utterances) {
        //   console.log(`Speaker ${utterance.speaker}: ${utterance.text}`);
        // }


        return NextResponse.json({ result: transcript });
    } catch (e) {
        console.error("Caption generation error:", e);
        return NextResponse.json(
            { error: e instanceof Error ? e.message : "Unable to generate captions." },
            { status: 500 }
        );
    }
}