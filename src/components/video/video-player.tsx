import React from "react";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/audio.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import "./video-player.css";

import { 
  MediaPlayer, 
  MediaProvider, 
  Poster,
} from "@vidstack/react";
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
import { Ivideo } from "../types/video";

export const textTracks = [
  // Subtitles
  {
    src: "https://files.vidstack.io/sprite-fight/subs/english.vtt",
    label: "English",
    language: "en-US",
    kind: "subtitles",
    default: true,
  },
  {
    src: "https://files.vidstack.io/sprite-fight/subs/spanish.vtt",
    label: "Spanish",
    language: "es-ES",
    kind: "subtitles",
  },
  // Chapters
  {
    src: "https://files.vidstack.io/sprite-fight/chapters.vtt",
    kind: "chapters",
    language: "en-US",
    default: true,
  },
] as const;

const VideoPlayer = ({
  video,

  isMembership,
}: {
  isMembership: any;
  video: Ivideo;
  mode: "orignal" | "preview" | any;
}) => {
  if (!video) return null;
  const videoLink = isMembership ? video?.original_video : video?.preview_video;
  console.log(videoLink, "videoLink");

  return (
    <div className="media-player-container">
      <MediaPlayer
        className="lg:h-[850px] xl:h-[650px] md:h-[300px] sm:h-[300px] h-[250px] aspect-video w-full"
        autoPlay
        muted
        src={videoLink}
        viewType="video"
        logLevel="warn"
        playsInline
        title={video?.title}
        poster={video?.thumbnail}
      >
        <MediaProvider />
        <Poster className="vds-poster" src={video?.thumbnail} />
        <DefaultVideoLayout icons={defaultLayoutIcons} />
      </MediaPlayer>
    </div>
  );
};

export default VideoPlayer;
