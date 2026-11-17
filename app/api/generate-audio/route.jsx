import textToSpeech from '@google-cloud/text-to-speech';
import { NextResponse } from 'next/server';
import { getAdminBucket } from '@/configs/firebaseAdmin';
const client = new textToSpeech.TextToSpeechClient({
    apiKey: process.env.GOOGLE_API_KEY,
});

export const runtime = 'nodejs';

export async function POST(req) {
    try {
        const { text, id } = await req.json();
        if (typeof text !== 'string' || text.trim() === '' || typeof id !== 'string' || id.trim() === '') {
            return NextResponse.json(
                { error: 'Text and id are required.' },
                { status: 400 }
            );
        }

        if (!/^[a-zA-Z0-9-]+$/.test(id)) {
            return NextResponse.json(
                { error: 'Invalid audio id.' },
                { status: 400 }
            );
        }

        const storageRef = getAdminBucket().file(`ai-short-video-files/${id}.mp3`);

        const request = {
            input: { text },
            voice: { languageCode: 'en-US', ssmlGender: 'FEMALE' },
            audioConfig: { audioEncoding: 'MP3' },
        };

        const [response] = await client.synthesizeSpeech(request);
        if (!response.audioContent) {
            throw new Error('Text-to-speech returned no audio content.');
        }

        const audioBuffer = typeof response.audioContent === 'string'
            ? Buffer.from(response.audioContent, 'base64')
            : Buffer.from(response.audioContent);
        await storageRef.save(audioBuffer, {
            metadata: { contentType: 'audio/mpeg' },
        });
        const [downloadURL] = await storageRef.getSignedUrl({
            action: 'read',
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        });
        console.log('Audio content written to Firebase Storage: ' + downloadURL);

        return NextResponse.json({
            result: 'Audio generated and uploaded successfully.',
            downloadURL: downloadURL,
        });
    } catch (e) {
        console.error('Audio generation error:', e);
        return NextResponse.json(
            { error: e instanceof Error ? e.message : 'Unable to generate audio.' },
            { status: 500 }
        );
    }
}