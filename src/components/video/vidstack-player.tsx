'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  MediaPlayer,
  MediaProvider,
  MediaControls,
  TimeSlider,
  Time,
  FullscreenButton,
  MuteButton,
  PlayButton,
  SeekButton,
  VolumeSlider,
  Poster,
  type MediaPlayerInstance,
  useMediaState,
  useMediaRemote,
  isHLSProvider
} from '@vidstack/react';

import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import { Ivideo } from '@/components/types/video';

// Import the default layout CSS
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

interface VidstackPlayerProps {
  video: Ivideo;
  isMembership: boolean;
}

// Custom hook for keyboard shortcuts
function useKeyboardShortcuts(player: MediaPlayerInstance | null) {
  useEffect(() => {
    if (!player) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only react to keyboard shortcuts if the player element contains the active element or document active element is the body
      const playerElement = player.el as HTMLElement | null;
      if (!playerElement?.contains(document.activeElement) && document.activeElement !== document.body) {
        return;
      }
      
      switch (event.key) {
        case ' ':
          event.preventDefault();
          if (player.paused) player.play();
          else player.pause();
          break;
        case 'ArrowRight':
          event.preventDefault();
          player.currentTime = Math.min(player.currentTime + 10, player.duration || 0);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          player.currentTime = Math.max(0, player.currentTime - 10);
          break;
        case 'm':
          event.preventDefault();
          player.muted = !player.muted;
          break;
        case 'f':
          event.preventDefault();
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            playerElement?.requestFullscreen();
          }
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [player]);
}

// Custom time loading component to show while the video and player are loading
function LoadingIndicator() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-30">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
      <div className="text-white text-sm">Loading video...</div>
    </div>
  );
}

export default function VidstackPlayer({ video, isMembership }: VidstackPlayerProps) {
  const playerRef = useRef<MediaPlayerInstance>(null);
  const [isInView, setIsInView] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const videoSource = isMembership ? video?.original_video : video?.preview_video;
  const posterImage = video?.processedImages?.medium?.path || video?.processedImages?.small?.path || '';
  const videoTitle = video?.title || 'Video';
  // Register keyboard shortcuts
  useKeyboardShortcuts(playerRef.current);

  // Set up Intersection Observer with improved margins for better preloading
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsInView(entry.isIntersecting);
        
        // If player is loaded and goes out of view, pause it
        if (!entry.isIntersecting && playerRef.current && !playerRef.current.paused) {
          playerRef.current.pause();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '200px 0px' 
      }
    );
    
    observer.observe(containerRef.current);
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Handle player events
  const onLoadedMetadata = () => {
    setIsPlayerReady(true);
  };

  return (
    <div ref={containerRef} className="pt-24">
      <div className="relative rounded-lg overflow-hidden shadow-2xl">
        {isInView ? (
          <MediaPlayer
            ref={playerRef}
            title={videoTitle}
            className="lg:h-[850px] xl:h-[850px] md:h-[500px] sm:h-[400px] h-[350px] aspect-video w-full"
            playsInline
            autoPlay={false}
            load={isInView ? "eager" : "idle"}
            aspectRatio="16/9"
            crossorigin=""
            onLoadedMetadata={onLoadedMetadata}
            keyTarget="document"
            keyShortcuts={{
              togglePaused: ' ',
              seekForward: 'ArrowRight',
              seekBackward: 'ArrowLeft',
              toggleMuted: 'm',
              toggleFullscreen: 'f',
            }}
          >
            <MediaProvider>
              <source src={videoSource} type="video/mp4" />
            </MediaProvider>
            
            <Poster className="absolute inset-0 z-0" src={posterImage} alt={videoTitle} />
            
            {!isPlayerReady && <LoadingIndicator />}
            
            {/* Use the default video layout with customizations */}
            <DefaultVideoLayout 
              icons={defaultLayoutIcons} 
              thumbnails=""
              slots={{
                beforePlayButton: (
                  <>
                    <SeekButton seconds={-10} />
                    <SeekButton seconds={10} />
                  </>
                ),
              }}
            />
          </MediaPlayer>
        ) : (
          // Show just the poster image when not in view for better performance
          <div className="flex justify-center items-center bg-black lg:h-[850px] xl:h-[850px] md:h-[500px] sm:h-[400px] h-[350px]">
            {posterImage ? (
              <img 
                src={posterImage} 
                alt={videoTitle} 
                className="w-full h-full object-contain"
                loading="lazy"
              />
            ) : (
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 