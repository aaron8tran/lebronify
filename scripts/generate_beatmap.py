import librosa
import json
import numpy as np
import sys
import os

if len(sys.argv) < 2:
    print("Usage: python generate_beatmap.py <song_name_without_extension>")
    sys.exit(1)

song_id = sys.argv[1]
song_name = f"{song_id}.mp3"
base_dir = os.path.dirname(os.path.abspath(__file__))  # /scripts
project_root = os.path.abspath(os.path.join(base_dir, ".."))  # /lebronify

audio_path = os.path.join(project_root, "public", "music", f"{song_id}.mp3")
json_path = os.path.join(project_root, "public", "beatmaps", f"{song_id}.json")

print(f"🔍 Resolved audio path: {audio_path}")
print(f"🔍 Resolved beatmap path: {json_path}")

# y = array of audio samples
# sr = sample rate auto: 22050 hz
y, sr = librosa.load(audio_path)

duration = librosa.get_duration(y=y, sr=sr)
    
    # debug
    # print(sr)
    # print(len(y))
    # print(duration)
    # for x in range(5):
    #     print(y)

# Create a mel spectrogram (up to 8000 Hz max)
S = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=128, fmax=8000)

# Focus only on low-frequency bands (e.g., kicks: 0–200 Hz)
# Mel bin indices 0–15 typically cover up to ~200-300 Hz
low_band = S[:25]    # Mel bins 0–15 ≈ ~0–300 Hz
high_band = S[90:]   # Mel bins 90–127 ≈ high frequencies, ~5kHz–22kHz

combined_band = np.vstack([low_band, high_band])

# Use only low-frequency content to generate the onset envelope
onset_env = librosa.onset.onset_strength(S=combined_band, sr=sr)

    # debug
    # print(onset_env.shape)    
    # print(onset_env[:10])

# collects the frames where an onset is
onset_frames = librosa.onset.onset_detect(onset_envelope=onset_env, y=y, sr=sr, backtrack=True, pre_max=20, post_max=20, delta=0.05)
    # debug

    # print(len(onset_frames))
    # print(onset_frames[:10])

# gets timestamps for onset
onset_times = librosa.frames_to_time(onset_frames, sr=sr)
onset_times = np.insert(onset_times, 0, 0.0)

    # debug
print(len(onset_times))
    # print(onset_times[:10])
    # print(onset_times[-1])

# rounds onset timestamps
rounded_onset_times = [round(t, 3) for t in onset_times.tolist()]

# creates/dumps beatmap
with open(json_path, 'w') as f:
    json.dump(rounded_onset_times, f)