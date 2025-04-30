# 🏀 LeBronify

**LeBronify** is a dynamic, AI-assisted web app that syncs iconic LeBron James audio moments with a shuffled sequence of curated highlight clips — creating fresh, mini-edits with every play.

Whether you're a basketball fan, a creative coder, or just love watching the GOAT, LeBronify gives you theatre-mode edits at the press of a button.

---

## Features

- 🎧 **Audio-synced highlight generation** – Automatically aligns LeBron songs, speeches, or parody audio with video clip transitions using beat/onset detection.
- 🔁 **Shuffled edits** – Generates unique combinations of clips every time, avoiding repetition.
- 📱 **Theatre Mode** – An immersive viewing mode with synced visuals and audio.
- 📂 **Local media-based editing** – Works off your own curated `.mp4` and `.mp3` libraries.
- 🧠 **Librosa-based beat mapping** – Uses advanced onset detection to identify high-impact moments in audio.

---

## 🛠 Tech Stack

- **Next.js + React** – FE and routing
- **Tailwind CSS** – Styling the FE
- **librosa (Python)** – Audio analysis and beatmap generation
- **Node.js API Routes** – BE audio syncing logic

---

## 🚀 How It Works

1. Select a song from the home page.
2. LeBronify analyzes the audio and builds a fine-tuned beatmap using librosa.
3. Shuffled video clips are selected and auto-synced to the beat.
4. In Theatre Mode, users get a full-screen LeBron edit that feels like a trailer, Brainrot video, or meme — powered by real-time generation.
