import { NextResponse } from 'next/server';
import { chatSession } from '@/configs/aiModel';

function parseJsonResponse(text) {
    const cleanedText = text
        .trim()
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

    try {
        return JSON.parse(cleanedText);
    } catch {
        const start = Math.min(
            ...[cleanedText.indexOf('['), cleanedText.indexOf('{')].filter((index) => index >= 0)
        );
        const end = Math.max(cleanedText.lastIndexOf(']'), cleanedText.lastIndexOf('}'));

        if (start < 0 || end < start) {
            throw new Error('The AI model returned invalid JSON.');
        }

        try {
            return JSON.parse(cleanedText.slice(start, end + 1));
        } catch {
            throw new Error('The AI model returned invalid JSON.');
        }
    }
}

export async function POST(req) {
    try {
        const { prompt } = await req.json();
        if (typeof prompt !== 'string' || prompt.trim() === '') {
            return NextResponse.json(
                { error: 'A non-empty prompt is required.' },
                { status: 400 }
            );
        }

        console.log("Prompt received:", prompt);

        const result = await chatSession.sendMessage({
            message: prompt,
        });
        const responseText = result.text;
        console.log("Result received:", responseText);

        if (!responseText) {
            throw new Error('The AI model returned an empty response.');
        }

        return NextResponse.json({ result: parseJsonResponse(responseText) });
    } catch (e) {
        console.error("API route error:", e);

        return NextResponse.json(
            { error: e instanceof Error ? e.message : 'Unable to generate video script.' },
            { status: 500 }
        );
    }
}