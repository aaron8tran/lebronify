import { useState, useEffect, useRef } from "react";

type Props = {
    song: string;
  };

export default function TheatrePlayer({ song, onExit }: { song: string; onExit: () => void }) {
    const [timeStamps, setTimeStamps] = useState<number[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedClips, setSelectedClips] = useState<string[]>([]);
    const [refreshClips, setRefreshClips] = useState(false);
    const videoARef = useRef<HTMLVideoElement | null>(null);
    const videoBRef = useRef<HTMLVideoElement | null>(null);
    const [activeVideo, setActiveVideo] = useState<"A" | "B">("A");



    useEffect(() => {
        const fetchBeatMap = async () => {
            const res = await fetch(`/beatmaps/${song}.json`)
            const data = await res.json();
            setTimeStamps(data);

            const totalClips = 105;
            const clipCount = data.length;

            const availableIndices = Array.from({ length: totalClips }, (_, i) => i + 1);
            const shuffled = availableIndices.sort(() => Math.random() - 0.5);
            const selectedIndices = shuffled.slice(0, clipCount);

            const clips = selectedIndices.map(i => `/clips/clip${i}.mp4`);
            setSelectedClips(clips);

            setCurrentIndex(0); //reset video
            
        };

        if (song) fetchBeatMap();
    }, [song, refreshClips]);

    useEffect(() => {
        if (selectedClips.length === 0 || timeStamps.length === 0) return;
      
        // Only run this when the component is first mounted (currentIndex === 0)
        if (currentIndex !== 0) return;
      
        const firstClip = selectedClips[0];
        const video = videoARef.current;
        if (!video) return;
      
        video.src = firstClip;
        video.load();
      
        const handleCanPlay = () => {
          video.currentTime = 0;
          video.play().catch(err => console.warn("Initial play error", err));
          video.removeEventListener("canplay", handleCanPlay);
        };
      
        video.addEventListener("canplay", handleCanPlay);
      }, [selectedClips, timeStamps]);      


    useEffect(() => {
        if (timeStamps.length === 0 || currentIndex >= timeStamps.length - 1) return;
      
        const timeUntilNext = timeStamps[currentIndex + 1] - timeStamps[currentIndex];
      
        const timeout = setTimeout(() => {
          setCurrentIndex(i => i + 1);
        }, timeUntilNext * 1000); // convert seconds to ms
      
        return () => clearTimeout(timeout);
      }, [currentIndex, timeStamps]);


    // A & B toggle for smoother video
    useEffect(() => {
        if (currentIndex === 0 || selectedClips.length === 0) return;
      
        const nextClip = selectedClips[currentIndex];
        const visible = activeVideo === "A" ? videoARef.current : videoBRef.current;
        const hidden = activeVideo === "A" ? videoBRef.current : videoARef.current;
      
        if (!hidden || !visible) return;
      
        const handleCanPlay = () => {
          visible.pause();
          hidden.currentTime = 0;
          hidden.play().catch(err => console.warn("Hidden play error", err));
          setActiveVideo(prev => (prev === "A" ? "B" : "A"));
          hidden.removeEventListener("canplay", handleCanPlay);
        };
      
        hidden.src = nextClip;
        hidden.load();
        hidden.addEventListener("canplay", handleCanPlay);
      }, [currentIndex, selectedClips]);
      
      
      


      return (
        <div>
            {selectedClips.length > 0 && (
                <div className="relative w-full h-full">
                    <audio
                        key={song}
                        src={`/music/${song}.mp3`}
                        autoPlay
                    />
                    <video
                        ref={videoARef}
                        className={`absolute object-cover pointer-events-none ${
                            activeVideo === "A" ? "visible z-20" : "invisible z-10"
                        }`}
                        muted
                        playsInline
                        preload="auto"
                        />
                        <video
                        ref={videoBRef}
                        className={`absolute object-cover pointer-events-none ${
                            activeVideo === "B" ? "visible z-20" : "invisible z-10"
                        }`}
                        muted
                        playsInline
                        preload="auto"
                        />

                    <button
                        type="button"
                        onClick={onExit}
                        className="absolute top-4 right-4 z-50 text-black bg-white px-4 py-2 rounded text-3xl"
                    >
                        X
                    </button>
                </div>
            )}
        </div>
      );
}