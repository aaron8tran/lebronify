'use client'

import songs from "@/data/tracks.json";
import { useEffect } from "react";
import News from "./News";

type Props = {
  setTrackId: (id: string) => void;
};

export default function MusicPlayer({ setTrackId }: Props) {
  const tracks = Object.entries(songs);

  useEffect(() => {
    const handleResize = () => {
      // optional if you still want windowWidth
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-screen-2xl flex flex-col gap-8 pt-10">
       <div className="mx-auto w-full max-w-screen-xl">
         <News/>
       </div>

      <div className="mx-auto w-full max-w-screen-xl">
        <h1 className="text-4xl font-bold text-left mb-4">
          Lebronify
        </h1>
      </div>

      <div className="flex justify-center">
        <div
          className="grid mx-auto w-full max-w-screen-xl [grid-template-columns:repeat(auto-fit,minmax(12rem,1fr))] gap-4"
        >
          {tracks.map(([id, track], i) => (
            <button
              key={i}
              className="w-full rounded-lg bg-var(--foreground) hover:bg-zinc-900 overflow-hidden flex flex-col justify-end p-2 text-left"
              onClick={() => setTrackId(id)}
            >
              <div className="w-full aspect-square">
                <img src={`/imgs/${track.cover_image}`} alt={track.title} className="rounded-md"/>
              </div>
              <div className="mb-auto mt-3 p-1">
                <p className="block text-base text-white">{track.title}</p>
                <p className="block text-sm text-zinc-600">{track.artist}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
