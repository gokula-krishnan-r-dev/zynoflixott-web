import React, { useEffect, useState, useRef } from "react";
import { Ivideo } from "../types/video";
import { secondsToMinutes } from "@/lib/time";

function CustomVideoPlayer({ 
  src, 
  title, 
  poster, 
  duration 
}: { 
  src: string, 
  title: string, 
  poster?: string, 
  duration?: number 
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  // Hide controls after inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      
      timeout = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };
    
    document.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, [isPlaying]);
  
  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Update time and progress bar
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      
      if (progressRef.current) {
        const percentage = (videoRef.current.currentTime / videoRef.current.duration) * 100;
        progressRef.current.style.width = `${percentage}%`;
      }
    }
  };
  
  // Handle seeking
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / progressBar.offsetWidth;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };
  
  // Handle forward/backward
  const handleSkipForward = () => {
    if (videoRef.current) {
      const newTime = Math.min(videoRef.current.currentTime + 10, videoRef.current.duration);
      videoRef.current.currentTime = newTime;
    }
  };
  
  const handleSkipBackward = () => {
    if (videoRef.current) {
      const newTime = Math.max(videoRef.current.currentTime - 10, 0);
      videoRef.current.currentTime = newTime;
    }
  };
  
  // Handle keyboard controls for skipping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleSkipForward();
      } else if (e.key === "ArrowLeft") {
        handleSkipBackward();
      } else if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  // Toggle fullscreen
  const toggleFullScreen = () => {
    const videoContainer = videoRef.current?.parentElement;
    
    if (!videoContainer) return;
    
    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };
  
  return (
    <div className="relative w-full h-full group overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        playsInline
      />
      
      {/* Backward/Forward buttons overlaid on video */}
      <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
        <button 
          onClick={handleSkipBackward} 
          className="p-3 bg-black/30 rounded-full hover:bg-black/50 pointer-events-auto transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" />
          </svg>
        </button>
        <button 
          onClick={handleSkipForward} 
          className="p-3 bg-black/30 rounded-full hover:bg-black/50 pointer-events-auto transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M4 18l8.5-6L4 6v12zm9.5-6l8.5 6V6l-8.5 6z" />
          </svg>
        </button>
      </div>
      
      {/* Play/pause overlay icon */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <button
            onClick={togglePlay}
            className="bg-white/20 backdrop-blur-sm rounded-full p-5 transition-transform hover:scale-110"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Video controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 z-20 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress bar */}
        <div 
          className="h-2 bg-white/30 rounded-full mb-4 cursor-pointer relative"
          onClick={handleProgressBarClick}
        >
          <div 
            ref={progressRef} 
            className="h-full bg-blue-600 rounded-full absolute top-0 left-0"
          ></div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Play/pause button */}
            <button onClick={togglePlay} className="text-white">
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              )}
            </button>
            
            {/* Skip backward/forward buttons for bottom controls */}
            <button onClick={handleSkipBackward} className="text-white bg-black/30 rounded-full p-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
              </svg>
            </button>
            
            <button onClick={handleSkipForward} className="text-white bg-black/30 rounded-full p-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/>
              </svg>
            </button>
            
            {/* Volume control */}
            <div className="flex items-center space-x-2">
              <button onClick={toggleMute} className="text-white">
                {isMuted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-white/30 rounded-full appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            
            {/* Time display */}
            <div className="text-white text-sm">
              {secondsToMinutes(Math.floor(currentTime))} / {duration ? secondsToMinutes(duration) : "00:00"}
            </div>
          </div>
          
          {/* Fullscreen button */}
          <button onClick={toggleFullScreen} className="text-white">
            {isFullScreen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

const VideoPlayer = ({
  video,
  mode,
  isMembership,
}: {
  isMembership: any;
  video: Ivideo;
  mode: "orignal" | "preview" | any;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    if (video) {
      setIsLoaded(true);
    }
  }, [video]);
  
  if (!video) return null;
  
  const videoLink = isMembership ? video?.original_video : video?.preview_video;
  const videoDuration = typeof video.duration === 'number' ? video.duration : parseInt(video.duration || '0', 10) || 0;

  return (
    <div className="pt-24">
      <div className="relative rounded-lg overflow-hidden shadow-2xl">
        {isLoaded ? (
          <div className="lg:h-[850px] xl:h-[850px] md:h-[500px] sm:h-[400px] h-[350px] aspect-video w-full">
            <CustomVideoPlayer 
              src={videoLink}
              title={video?.title}
              poster={video?.processedImages?.medium?.path}
              duration={videoDuration}
            />
          </div>
        ) : (
          <div className="flex justify-center items-center bg-black lg:h-[850px] xl:h-[850px] md:h-[500px] sm:h-[400px] h-[350px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
