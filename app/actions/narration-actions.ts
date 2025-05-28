'use server'

export async function generateVideoFromNarration(
  script: string,
  voice: string,
  timeLimit: string
): Promise<any> {
  const response: any = await fetch(`${process.env.NEXT_PUBLIC_RaILWAY_API_KEY}/generate-short/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "script_prompt": {
        "script": script,
        "title": "",
        "title_image_prompt": "",
      },
      "voice": voice,
      "time_limit": timeLimit,
      "user_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    }),
  });

  if (response?.status == "failed") {
    throw new Error(`Video generation failed with status ${response.status}`);
  }

  if (!response.ok) {
    throw new Error(`Video generation failed with status ${response.status}`);
  }

  return response.json();
}