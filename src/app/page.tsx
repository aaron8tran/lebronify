'use client'

import MusicPlayer from "@/components/MusicPlayer";
import PlayerBar from "@/components/PlayerBar";
import type { PlayerBarHandle } from "@/components/PlayerBar";
import TheatrePlayer from "@/components/TheatrePlayer";
import { useState, useRef } from "react";

export default function Home() {
  const [theatreMode, setTheatreMode] = useState(false);
  const [theatreSong, setTheatreSong] = useState<string | null>(null);
  const [trackId, setTrackId] = useState<string | null>(null);

  const playerRef = useRef<PlayerBarHandle>(null);

  const handleStartTheatre = async (songName: string, onComplete?: () => void) => {
    playerRef.current?.pause();
  
    try {
      await fetch(`/api/generate-beatmap?song=${songName}`);
    } catch (e) {
      console.error("Beatmap generation failed", e);
      onComplete?.(); // stop buffer even on error
      return;
    }
  
    onComplete?.();
    setTheatreSong(songName);
    setTheatreMode(true);
  };

  const handleExitTheatre = () => {
    setTheatreMode(false);
    setTheatreSong(null);
  }

  return (
    <div className="flex-grow pb-32">
      <main className="">
        <MusicPlayer setTrackId={setTrackId} />
      </main>
      <PlayerBar 
        ref={playerRef}
        trackId={trackId}
        setTrackId={setTrackId}
        onStartTheatre={handleStartTheatre}
      />

      {theatreMode && theatreSong && (
        <div className="fixed inset-0 bg-black z-50">
          <TheatrePlayer song={theatreSong} onExit={handleExitTheatre} />
        </div>
      )}
    </div>
  );
}
