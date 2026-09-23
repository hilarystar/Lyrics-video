# Kinetic Lyrics Component for Remotion

A high-contrast, kinetic typography component that flashes and bounces single lyric words on screen in sync with your audio.

---

## Features

- **Word-by-Word Flashing**: Automatically divides subtitle lines into individual words, weighting display time by word length (longer words stay on screen longer).
- **High-Contrast Flash**: Inverts background and text colors (Black/White) on every word switch.
- **Spring Pop Animation**: Scales each new word in with a snappy spring bounce (`Syne` Google Font, uppercase, 96px).
- **SRT Parser Included**: Converts standard SRT timestamp blocks directly into Remotion frame numbers.
- **Built-in Timing Offset**: Includes a `TIMING_OFFSET_FRAMES` constant (default: `20.5`) to shift visuals forward and match the audio's vocal transient.

---

## Installation

Install the required font package alongside Remotion:

```bash
npm install remotion @remotion/google-fonts