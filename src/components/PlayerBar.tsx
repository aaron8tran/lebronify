'use client';
import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import songs from '@/data/tracks.json';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import './css/playerStyles.css'

type Props = {
  trackId: string | null;
  setTrackId: (id: string) => void;
  onStartTheatre: (songName: string, onComplete?: () => void) => void;
};

export type PlayerBarHandle = {
  pause: () => void;
};

const PlayerBar = forwardRef<PlayerBarHandle, Props>(({ trackId, setTrackId, onStartTheatre }, ref) => {
  const playButtonRef = useRef<AudioPlayer | null>(null);
  const currentSong = trackId ?? "on-my-body-nojo";
  const trackList = Object.entries(songs);
  const [isBuffering, setIsBuffering] = useState(false);

  useEffect(() => {
    if (!trackId) return;
    const audio = playButtonRef.current?.audio?.current;
    if (!audio) return;
  
    // Try to play after a short delay to allow re-render
    setTimeout(() => {
      audio.play().catch((err) => {
        console.warn("Auto-play failed (possibly browser policy):", err);
      });
    }, 50);
  }, [trackId]);

  const track = trackId ? songs[trackId] : null;
  
  useImperativeHandle(ref, () => ({
    pause: () => {
      const audio = playButtonRef.current?.audio?.current;
      if (audio) {
        audio.pause();
      }
    }
  }));

  const handleNext = () => {
    const trackIds = trackList.map(([id]) => id);
    const currentIndex = trackIds.indexOf(currentSong);
    const nextIndex = (currentIndex + 1) % trackIds.length;
    setTrackId(trackIds[nextIndex]);
  }

  const handlePrev = () => {
    const trackIds = trackList.map(([id]) => id);
    const currentIndex = trackIds.indexOf(currentSong);
    const prevIndex = (currentIndex - 1 + trackIds.length) % trackIds.length;
    setTrackId(trackIds[prevIndex]);
  }

  return (
    <div className="fixed h-20 bottom-0 left-0 right-0 bg-black text-white p-4 flex items-center justify-between z-50">
      {track ? (
        <>
          <div className="flex items-center gap-4">
            <div>
              <img src={`/imgs/${track.cover_image.replace('.webp','64x64.webp')}`} alt={track.title} className="rounded-sm"/>
            </div>
            <div>
              <p className="text-sm font-semibold">{track.title}</p>
              <p className="text-xs text-gray-400">{track.artist}</p>
            </div>
          </div>
          <AudioPlayer
            key={trackId}
            ref={playButtonRef}
            src={`/music/${trackId}.mp3`}
            showSkipControls
            showJumpControls={false}
            onClickNext={handleNext}
            onClickPrevious={handlePrev}
            autoPlay
            style={{ backgroundColor: "#000", color: "#fff" }}
          />
          <div>
          {currentSong && (
           <button
              type="button"
              onClick={() => {
                setIsBuffering(true);
                onStartTheatre(currentSong, () => setIsBuffering(false));
              }}
              disabled={isBuffering}
              className={`bg-purple-600 ${
                isBuffering ? 'opacity-70' : 'hover:bg-purple-700'
              } transition px-4 py-2 rounded text-white text-sm flex items-center justify-center gap-2 min-w-[150px]`}
            >
              <span className="flex items-center gap-2">
                🎬 Theatre Mode
                {isBuffering && (
                  <img
                    src="/icons/spinner.gif"
                    alt="Loading..."
                    className="inline-block object-contain"
                    style={{ height: "1rem", width: "1rem", marginLeft: '0.5rem' }} // Force 16px
                  />
                )}
              </span>
            </button>
          )}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-4">
            <div>
              <img src="/imgs/no-track-cover64x64.webp" alt="No Track Selected" className="rounded-sm"/>
            </div>
            <div>
              <p className="text-sm font-semibold">No Track Selected</p>
            </div>
          </div>
          <AudioPlayer
            src={undefined}
            style={{ backgroundColor: "#000", color: "#fff" }}
          />
        </>
      )}
    </div>
  );
});

export default PlayerBar;