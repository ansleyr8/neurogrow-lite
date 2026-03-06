"use client"

import { Milestone } from "@/types/milestone";
import { useMemo } from "react";

type Props = {
    milestone: Milestone;
}

export default function MilestoneCard({milestone}: Props) {
    const ttsText = useMemo(() => {
        return `${milestone.title}. Recommended age ${milestone.recommendedAge} years. Category ${milestone.category}`
    }, [milestone])

    const handleSpeak = () => {
        // Guard for older browsers that don't support the Web Speech API
        if (typeof window === "undefined") return
        if (!("speechSynthesis" in window)) {
            alert("Text-to-speech is not supported in this browser.")
            return
        }

        //stop any existing speech to avoid overlap in audio
        window.speechSynthesis.cancel()

        const utterance = new SpeechSynthesisUtterance(ttsText)
        utterance.rate = 1
        utterance.pitch = 1
        window.speechSynthesis.speak(utterance)
    }

    const categoryStyles = {
        Cognitive: "bg-purple-100 text-purple-700",
        Motor: "bg-green-100 text-green-700",
        Social: "bg-blue-100 text-blue-700",
    }

    return (
        <article
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            aria-label={`Milestone: ${milestone.title}`}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-base font-semibold text-gray-900">{milestone.title}</h3>

                    <p className="mt-2 text-sm text-gray-700">
                        <span className="font-medium text-gray-900">Recommended age:</span>{" "}
                        {milestone.recommendedAge} years
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                        <span className="font-medium text-gray-900">Category:</span>{" "}
                        <span className={`inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium ${categoryStyles[milestone.category]}`}>
                            {milestone.category}
                        </span>
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleSpeak}
                    className="shrink-0 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label={`Play audio for milestone: ${milestone.title}`}
                >
                    🔊 Listen
                </button>
            </div>
        </article>
            

    )
}
