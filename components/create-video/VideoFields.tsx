// src/components/create-video/VideoForm.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wand2, Loader2, Music, Play, Speech, Timer, ChevronUp, ChevronDown } from "lucide-react"
import { VideoFormProps, DurationOption, VoiceOption } from "@/types/video"
import { JSX, useState } from "react"

export default function VideoFields({
    textareaLabel,
    textareaPlaceholder,
    textareaValue,
    onTextareaChange,
    duration,
    setDuration,
    voice,
    setVoice,
    error,
    onSubmit,
    isSubmitDisabled,
    loading,
    title,
    description
}: VideoFormProps): JSX.Element {
    const voices: VoiceOption[] = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]
    const durations: DurationOption[] = ["30-45", "45-60", "60-90"]
    const musics = [
        {
            'music': "BladeRunner",
        },
        {
            'music': "Snowfall",
        },
        {
            'music': "Another Love",
        },
        {
            'music': "Else-Paris",
        },
    ]

    const [showAllVoices, setShowAllVoices] = useState(false);

    // Display only first 3 voices or all voices based on state
    const displayedVoices = showAllVoices ? voices : voices.slice(0, 3);


    return (
        <Card className="md:col-span-1 bg-neutral-950 text-white border-neutral-800 rounded-3xl">
            <CardContent className="space-y-4 my-6">
                {/* <Label htmlFor="voice" className="text-lg flex items-center gap-2">
                    <Music className="bg-indigo-600 p-2 rounded-lg w-8 h-8" />
                    Music Selection</Label>
                <div className="grid grid-cols-2 gap-4">
                    {musics.map((item, index) => {
                        return (
                            <div key={index} className="flex gap-2 items-center border border-neutral-800 hover:border-2 hover:border-indigo-500 w-full p-2 mx-auto text-center rounded-lg text-sm">
                                <Play className="bg-neutral-800 p-2 rounded-lg w-8 h-8" />
                                {item.music}
                            </div>
                        )
                    })}
                </div> */}
                <div className="space-y-2">
                    <Label htmlFor="voice" className="text-lg flex items-center gap-2">
                        <Speech className="bg-indigo-600 p-2 rounded-lg w-8 h-8" />
                        Voice</Label>
                    <div className="flex flex-col gap-4 w-full">
                        {displayedVoices.map((voiceOption) => (
                            <Button
                                key={voiceOption}
                                type="button"
                                variant="outline"
                                className={`flex items-center justify-between w-full py-2 px-3 border bg-neutral-900 ${voice === voiceOption
                                        ? "border-indigo-500 bg-gradient-to-tr from-black to-indigo-900/20"
                                        : "border-neutral-800"
                                    }`}
                                onClick={() => setVoice(voiceOption as VoiceOption)}
                            >
                                <div className="flex items-center space-x-2 w-full">
                                    <Play className="bg-neutral- rounded-full w-20 h-20" />
                                    <div className="text-left">
                                        <div className="capitalize">{voiceOption}</div>
                                        <div className="text-xs text-neutral-500">OpenAI Voice</div>
                                    </div>
                                </div>
                                {voice === voiceOption && (
                                    <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                                )}
                            </Button>
                        ))}
                    </div>
                    {voices.length > 3 && (
                        <Button
                            variant="ghost"
                            className="w-full flex items-center justify-center text-neutral-100 hover:text-neutral-100 mt-2 bg-neutral-800 hover:bg-neutral-900 rounded-3xl"
                            onClick={() => setShowAllVoices(!showAllVoices)}
                        >
                            {showAllVoices ? (
                                <>
                                    Show Less <ChevronUp className="ml-1 h-4 w-4" />
                                </>
                            ) : (
                                <>
                                    View More <ChevronDown className="ml-1 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    )}
                </div>
                <div className="space-y-2">
                    <Label className="text-lg flex items-center gap-2">
                        <Timer className="bg-indigo-600 p-2 rounded-lg w-8 h-8" />
                        Duration
                    </Label>
                    <RadioGroup
                        value={duration}
                        onValueChange={(value) => setDuration(value as DurationOption)}
                        className="flex flex-wrap gap-4"
                    >
                        {durations.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={`duration-${option}`} className="text-indigo-300 bg-neutral-800" />
                                <Label htmlFor={`duration-${option}`}>{option} seconds</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}
            </CardContent>
        </Card>
    )
}