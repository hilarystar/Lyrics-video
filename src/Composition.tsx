import { useEffect, useState } from "react";
import { AbsoluteFill, Audio, staticFile, useVideoConfig } from "remotion";
import { Lyrics, parseSrtToLyrics, LyricItem } from "./lyrics";

export const MyComposition = () => {
const { fps } = useVideoConfig();
const [lyrics, setLyrics] = useState<LyricItem[]>([]);

useEffect(() => {
fetch(staticFile("Obsessica.srt"))
.then((res: any) => res.text())
.then((text: string) => {
setLyrics(parseSrtToLyrics(text, fps));
})
.catch((err: any) => {
console.error("Error loading SRT:", err);
});
}, [fps]);

return (
<AbsoluteFill>
<Audio src={staticFile("Obsessica.mp3")} />
{lyrics.length > 0 && <Lyrics lyrics={lyrics} />}
</AbsoluteFill>
);
};
