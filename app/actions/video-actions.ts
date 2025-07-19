'use server'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { SubscriptionService } from '@/lib/subscription'

function createServerSupabaseClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

interface JobStatusResponse {
    status: string;
    video_url?: string;
    raw_video_url?: string;
    captioned_video_url?: string;
}

export async function storeVideoInSupabase(
    videoUrl: string,
    userId: string,
    duration: string,
    title?: string,
    description?: string,
    fontName?: string,
    baseFontColor?: string,
    highlightWordColor?: string
): Promise<void> {
    const supabase = createServerSupabaseClient()
    const subscriptionService = new SubscriptionService(supabase)

    try {
        // Check and deduct credits from subscription before storing video
        await subscriptionService.useCredits(userId, 1, 'Video generation')

        const { data, error } = await supabase
            .from('videos')
            .insert({
                user_id: userId,
                video_url: videoUrl,
                duration,
                title,
                description,
                status: 'completed',
                font_name: fontName,
                base_font_color: baseFontColor,
                highlight_word_color: highlightWordColor
            })
            .select()

        if (error) {
            console.error('Supabase error details:', {
                code: error.code,
                message: error.message,
                details: error.details,
                hint: error.hint
            })
            throw new Error(`Failed to store video in Supabase: ${error.message}`)
        }

        console.log('Successfully stored video:', data)
    } catch (error) {
        console.error('Error in storeVideoInSupabase:', error)
        throw error
    }
}

export async function generateNarration(scriptPrompt: string, timeLimit: string, userId: string): Promise<any> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_RAILWAY_API_KEY}/generate-narration/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "script_prompt": scriptPrompt,
            "time_limit": timeLimit,
            "user_id": userId
        }),
    });

    if (!response.ok) {
        throw new Error(`Narration API request failed with status ${response.status}`);
    }

    return response.json();
}

/**
 * Generates a video based on narration data, voice, and time limit
 */
export async function generateVideo(
    narrationData: any,
    voice: string,
    timeLimit: string,
    userId: string,
    fontName: string,
    baseFontColor: string,
    highlightWordColor: string
): Promise<string> {
    const videoResponse = await fetch(`${process.env.NEXT_PUBLIC_RAILWAY_API_KEY}/generate-short/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "script_prompt": narrationData,
            "voice": voice,
            "time_limit": timeLimit,
            "user_id": userId,
            "font_name": fontName,
            "base_font_color": baseFontColor,
            "highlight_word_color": highlightWordColor
        }),
    });

    if (!videoResponse.ok) {
        throw new Error(`Video generation failed with status ${videoResponse.status}`);
    }

    const videoData = await videoResponse.json();
    return videoData.job_id;
}

/**
 * Checks the status of a job and returns the video URL when completed
 */
export async function RawVideo(jobId: string): Promise<JobStatusResponse> {
    const params = new URLSearchParams({
        job_id: jobId
    });

    const response: any = await fetch(`${process.env.NEXT_PUBLIC_RAILWAY_API_KEY}/raw-video-url-status?${params.toString()}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response?.status == "completed") {
        return response.json();
    }

    if (response?.status == "failed") {
        throw new Error(`Failed to get job status. Status: ${response.status}`);
    }

    if (!response.ok) {
        throw new Error(`Failed to get job status. Status: ${response.status}`);
    }

    return response.json();
}

export async function CaptionVideo(jobId: string): Promise<JobStatusResponse> {
    const params = new URLSearchParams({
        job_id: jobId
    });

    const response: any = await fetch(`${process.env.NEXT_PUBLIC_RAILWAY_API_KEY}/captioned-video-status?${params.toString()}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response?.status == "completed") {
        return response.json();
    }

    if (response?.status == "failed") {
        throw new Error(`Failed to get job status. Status: ${response.status}`);
    }

    if (!response.ok) {
        throw new Error(`Failed to get job status. Status: ${response.status}`);
    }

    return response.json();
}