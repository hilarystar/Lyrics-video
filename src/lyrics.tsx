import {loadFont} from "@remotion/google-fonts/Syne"
const {fontFamily} = loadFont();

import React from "react";
import {
useCurrentFrame,
useVideoConfig,
spring,
interpolate,
} from "remotion";

export interface LyricItem {
startFrame: number;
endFrame: number;
text: string;
}

// Convert raw SRT timestamps to video frames
export const parseSrtToLyrics = (srtText: string, fps = 30): LyricItem[] => {
const blocks = srtText.trim().split(/\n\s*\n/);

return blocks
.map((block) => {
const lines = block.split("\n");
const timingLine = lines[1] || "";
const textLines = lines.slice(2).join(" ");

const [startRaw, endRaw] = timingLine.split(" --> ");

const parseTimeToSeconds = (t: string) => {
if (!t) return 0;
const [hms, ms] = t.trim().split(",");
const [h, m, s] = hms.split(":").map(Number);
return h * 3600 + m * 60 + s + Number(ms) / 1000;
};

return {
startFrame: Math.round(parseTimeToSeconds(startRaw) * fps),
endFrame: Math.round(parseTimeToSeconds(endRaw) * fps),
text: textLines.replace(/<[^>]*>/g, "").trim(),
};
})
.filter((item) => item.text.length > 0);
};

export const Lyrics: React.FC<{ lyrics: LyricItem[] }> = ({ lyrics }) => {
const frame = useCurrentFrame();
const { fps } = useVideoConfig();

// Offset lead frames to align with vocal impact
const TIMING_OFFSET_FRAMES = 20.5;
const effectiveFrame = frame + TIMING_OFFSET_FRAMES;

const currentLine = lyrics.find(
(item) => effectiveFrame >= item.startFrame && effectiveFrame <= item.endFrame
);

// Default state when there are no vocals playing
if (!currentLine) {
return (
<div
style={{
position: "absolute",
inset: 0,
backgroundColor: "#000000",
}}
/>
);
}

const lineElapsed = effectiveFrame - currentLine.startFrame;
const lineTotal = Math.max(1, currentLine.endFrame - currentLine.startFrame);

const words = currentLine.text.trim().split(/\s+/);

// Character weight calculation so small words flip fast
const weights = words.map((w) => Math.max(2, w.length));
const totalWeight = weights.reduce((acc, val) => acc + val, 0);

let accumulatedWeight = 0;
const wordThresholds = weights.map((w) => {
accumulatedWeight += w;
return (accumulatedWeight / totalWeight) * lineTotal;
});

let activeIndex = wordThresholds.findIndex((threshold) => lineElapsed <= threshold);
if (activeIndex === -1) {
activeIndex = words.length - 1;
}

const currentWord = words[activeIndex];
const wordStartFrame = activeIndex === 0 ? 0 : wordThresholds[activeIndex - 1];
const wordAge = lineElapsed - wordStartFrame;

// Flash color toggle based on whether the word index is even or odd
const isEvenWord = activeIndex % 2 === 0;
const bgColor = isEvenWord ? "#000000" : "#FFFFFF";
const textColor = isEvenWord ? "#FFFFFF" : "#000000";

// Punchy spring pop for each word entry
const bounce = spring({
frame: wordAge,
fps,
config: {
damping: 14,
stiffness: 260,
mass: 0.4,
},
});

const scale = interpolate(bounce, [0, 1], [0.85, 1.1]);

return (
<div
style={{
position: "absolute",
inset: 0,
backgroundColor: bgColor,
display: "flex",
alignItems: "center",
justifyContent: "center",
padding: "0 60px",
transition: "background-color 0.05s ease",
}}
>
<span
key={`${currentWord}-${activeIndex}`}
style={{
transform: `scale(${scale})`,
fontFamily ,
fontSize: "96px",
fontWeight: 900,
color: textColor,
letterSpacing: "4px",
textTransform: "uppercase",
textAlign: "center",
userSelect: "none",
}}
>
{currentWord}
</span>
</div>
);
};