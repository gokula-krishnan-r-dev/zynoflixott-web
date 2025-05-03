import React, { useState, useRef, useEffect } from "react";
import { Ivideo } from "../types/video";
import "./video-player.css";

// Icons for player controls
import { 
  FaPlay, FaPause, FaVolumeUp, FaVolumeMute, 
  FaExpand, FaCompress, FaForward, FaBackward, 
  FaCog,
  FaClosedCaptioning, 
} from "react-icons/fa";

interface VideoPlayerProps {
  video: Ivideo;
  isMembership: boolean;
  mode?: "orignal" | "preview";
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  video, 
  isMembership,
  mode = "preview"
}) => {
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isBuffering, setIsBuffering] = useState(false);
  const [loadedData, setLoadedData] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isVideoUrlIssue, setIsVideoUrlIssue] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  // Handle if video is null
  if (!video) return null;
  
  // Video source based on membership
  const videoLink = isMembership ? video?.original_video : video?.preview_video;
  
  // Handle video source issues
  const retryVideoLoad = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prevCount => prevCount + 1);
      setVideoError(null);
      setIsVideoUrlIssue(false);
      
      // Force video element to reload
      if (videoRef.current) {
        const video = videoRef.current;
        video.load();
      }
    } else {
      setVideoError("Maximum retry attempts reached. Please try again later.");
    }
  };

  // Generate proxied video URL to avoid CORS issues
  const getProxiedVideoUrl = (url: string) => {
    if (!url) {
      setIsVideoUrlIssue(true);
      return '';
    }
    
    try {
      // Check if the URL is external
      if (url.startsWith('http')) {
        // Add retry parameter to bust cache if retrying
        return `/api/video-proxy?url=${encodeURIComponent(url)}${retryCount > 0 ? `&retry=${retryCount}` : ''}`;
      }
      
      // If it's a local URL, return it as is
      return url;
    } catch (error) {
      console.error('Error processing video URL:', error);
      setIsVideoUrlIssue(true);
      return '';
    }
  };
  
  const proxiedVideoUrl = getProxiedVideoUrl(videoLink);

  // Format time (convert seconds to MM:SS format)
  const formatTime = (timeInSeconds: number): string => {
    if (!timeInSeconds) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Initialize video
  useEffect(() => {
    const initializeVideo = async () => {
      try {
        if (videoRef.current) {
          const video = videoRef.current;
          
          // Manually load metadata if needed
          if (video.readyState === 0) {
            console.log("Manually loading video metadata...");
            video.load();
            
            // Wait for metadata to load
            if (!video.duration) {
              await new Promise<void>((resolve) => {
                const metadataHandler = () => {
                  console.log("Metadata loaded via Promise:", {
                    duration: video.duration,
                    readyState: video.readyState
                  });
                  video.removeEventListener('loadedmetadata', metadataHandler);
                  resolve();
                };
                video.addEventListener('loadedmetadata', metadataHandler);
              });
            }
          }
          
          // Set duration once available
          if (video.duration) {
            setDuration(video.duration);
            setVideoReady(true);
            console.log("Video initialized with duration:", video.duration);
          }
        }
      } catch (error) {
        console.error("Error initializing video:", error);
        setVideoError("Failed to initialize video player");
      }
    };
    
    initializeVideo();
  }, [videoLink]);

  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(error => {
          console.error("Error playing video:", error);
          setVideoError("Failed to play video");
        });
      }
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
  const toggleFullscreen = () => {
    if (playerRef.current) {
      if (!isFullscreen) {
        if (playerRef.current.requestFullscreen) {
          playerRef.current.requestFullscreen();
        } else if ((playerRef.current as any).webkitRequestFullscreen) {
          (playerRef.current as any).webkitRequestFullscreen();
        } else if ((playerRef.current as any).msRequestFullscreen) {
          (playerRef.current as any).msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }
      }
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  // Handle seeking
  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current && !isNaN(newTime)) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Handle playback rate change
  const changePlaybackRate = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
      setShowSettings(false);
    }
  };

  // Ensure video is actually loaded and has a valid source
  const isVideoInitialized = () => {
    const video = videoRef.current;
    return video && video.readyState > 0 && video.duration > 0;
  };

  // Handle video events
  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (!videoElement) return;

    const handleLoadedMetadata = () => {
      console.log("Video metadata loaded:", {
        duration: videoElement.duration,
        videoWidth: videoElement.videoWidth,
        videoHeight: videoElement.videoHeight,
        readyState: videoElement.readyState,
        paused: videoElement.paused
      });
      
      setDuration(videoElement.duration);
      setLoadedData(true);
      setVideoReady(true);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handleCanPlay = () => {
      console.log("Video can play:", {
        currentTime: videoElement.currentTime,
        duration: videoElement.duration,
        readyState: videoElement.readyState
      });
      
      setIsBuffering(false);
      setVideoReady(true);
    };

    const handleLoadedData = () => {
      console.log("Video data loaded:", {
        duration: videoElement.duration,
        readyState: videoElement.readyState
      });
      setVideoReady(true);
    };

    const handleSeeked = () => {
      console.log("Video seeked to:", videoElement.currentTime);
    };

    const handleError = (e: Event) => {
      console.error("Video error:", (e.target as HTMLVideoElement).error);
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    // Add event listeners
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('loadeddata', handleLoadedData);
    videoElement.addEventListener('seeked', handleSeeked);
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('waiting', handleWaiting);
    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('error', handleError);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Controls visibility timer
    let controlsTimer: NodeJS.Timeout;
    
    const hideControls = () => {
      if (isPlaying) {
        setShowControls(false);
      }
    };

    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(controlsTimer);
      controlsTimer = setTimeout(hideControls, 3000);
    };

    playerRef.current?.addEventListener('mousemove', handleMouseMove);
    playerRef.current?.addEventListener('mouseleave', hideControls);
    playerRef.current?.addEventListener('mouseenter', handleMouseMove);

    // Clean up
    return () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('loadeddata', handleLoadedData);
      videoElement.removeEventListener('seeked', handleSeeked);
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('waiting', handleWaiting);
      videoElement.removeEventListener('canplay', handleCanPlay);
      videoElement.removeEventListener('error', handleError);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      playerRef.current?.removeEventListener('mousemove', handleMouseMove);
      playerRef.current?.removeEventListener('mouseleave', hideControls);
      playerRef.current?.removeEventListener('mouseenter', handleMouseMove);
      clearTimeout(controlsTimer);
    };
  }, [isPlaying]);

  // Skip forward/backward with fallback methods
  const skipForward = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      try {
        // Get current time and calculate new time
        const newTime = Math.min(video.currentTime + 10, video.duration || 0);
        console.log('Attempting to skip forward:', {
          from: video.currentTime,
          to: newTime,
          duration: video.duration
        });
        
        // Try direct property setting
        try {
          video.currentTime = newTime;
        } catch (err) {
          console.warn("Primary seek method failed", err);
          
          // Since we can't reliably type fastSeek, we'll try a more vanilla approach
          try {
            // @ts-ignore - Some browsers implement fastSeek
            if (typeof video.fastSeek === 'function') {
              // @ts-ignore
              video.fastSeek(newTime);
            }
          } catch (err2) {
            console.warn("Alternative seek method failed too", err2);
          }
        }
        
        // Force the React state to update
        setCurrentTime(newTime);
        
        // Add a notification to show the user something happened
        const forwardNotification = document.createElement('div');
        forwardNotification.className = 'seek-notification forward';
        forwardNotification.textContent = '+10s';
        playerRef.current?.appendChild(forwardNotification);
        
        // Remove notification after animation
        setTimeout(() => {
          if (forwardNotification.parentNode) {
            forwardNotification.parentNode.removeChild(forwardNotification);
          }
        }, 1000);
        
      } catch (error) {
        console.error('Error skipping forward:', error);
      }
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      try {
        // Get current time and calculate new time
        const newTime = Math.max(video.currentTime - 10, 0);
        console.log('Attempting to skip backward:', {
          from: video.currentTime,
          to: newTime
        });
        
        // Try direct property setting
        try {
          video.currentTime = newTime;
        } catch (err) {
          console.warn("Primary seek method failed", err);
          
          // Since we can't reliably type fastSeek, we'll try a more vanilla approach
          try {
            // @ts-ignore - Some browsers implement fastSeek
            if (typeof video.fastSeek === 'function') {
              // @ts-ignore
              video.fastSeek(newTime);
            }
          } catch (err2) {
            console.warn("Alternative seek method failed too", err2);
          }
        }
        
        // Force the React state to update
        setCurrentTime(newTime);
        
        // Add a notification to show the user something happened
        const backwardNotification = document.createElement('div');
        backwardNotification.className = 'seek-notification backward';
        backwardNotification.textContent = '-10s';
        playerRef.current?.appendChild(backwardNotification);
        
        // Remove notification after animation
        setTimeout(() => {
          if (backwardNotification.parentNode) {
            backwardNotification.parentNode.removeChild(backwardNotification);
          }
        }, 1000);
        
      } catch (error) {
        console.error('Error skipping backward:', error);
      }
    }
  };

  return (
    <div 
      className="video-player-container" 
      ref={playerRef}
      onClick={togglePlay}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={proxiedVideoUrl}
        poster={video?.thumbnail}
        playsInline
        preload="auto"
        className="video-element"
        autoPlay={false}
        muted={isMuted}
        onLoadedMetadata={() => setVideoReady(true)}
        onSeeked={(e) => console.log("Seeked event fired:", (e.target as HTMLVideoElement).currentTime)}
        onLoadStart={() => console.log("Video load started")}
        onError={(e) => {
          console.error("Video error event:", e);
          const videoElement = e.target as HTMLVideoElement;
          
          let errorMessage = "Error loading video";
          if (videoElement.error) {
            // Log detailed error info
            console.error("Video error details:", {
              code: videoElement.error.code,
              message: videoElement.error.message
            });
            
            // Create more specific error message based on error code
            switch (videoElement.error.code) {
              case 1: // MEDIA_ERR_ABORTED
                errorMessage = "Video playback was aborted";
                break;
              case 2: // MEDIA_ERR_NETWORK
                errorMessage = "Network error occurred while loading the video";
                break;
              case 3: // MEDIA_ERR_DECODE
                errorMessage = "Video decoding error - the format might be unsupported";
                break;
              case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
                errorMessage = "Video format not supported or CORS issue with the video source";
                setIsVideoUrlIssue(true);
                break;
              default:
                errorMessage = `Video playback error (${videoElement.error.code})`;
            }
            
            if (videoElement.error.message) {
              errorMessage += `: ${videoElement.error.message}`;
            }
          }
          
          setVideoError(errorMessage);
        }}
      >
        {/* Add text tracks for subtitles if available */}
        <track 
          kind="subtitles" 
          src="path-to-subtitles.vtt" 
          srcLang="en" 
          label="English" 
        />
      </video>

      {/* Loading Spinner */}
      {isBuffering && (
        <div className="buffering-overlay">
          <div className="spinner"></div>
        </div>
      )}

      {/* Error Message */}
      {(videoError || isVideoUrlIssue) && (
        <div className="error-overlay">
          <div className="error-message">
            <p>{videoError || "Video source unavailable. The video might be restricted or the format is not supported."}</p>
            {isVideoUrlIssue && (
              <p className="error-details">
                URL: {videoLink ? (videoLink.length > 50 ? videoLink.substring(0, 50) + '...' : videoLink) : 'Missing video URL'}
              </p>
            )}
            <div className="error-actions">
              {retryCount < maxRetries ? (
                <button onClick={retryVideoLoad}>
                  Retry Video {retryCount > 0 ? `(${retryCount}/${maxRetries})` : ''}
                </button>
              ) : (
                <button onClick={() => window.location.reload()}>Reload Player</button>
              )}
              <button onClick={() => setVideoError(null)}>Dismiss</button>
            </div>
          </div>
        </div>
      )}

      {/* Centered Play Button (shows when paused) */}
      {!isPlaying && showControls && (
        <div className="big-play-button" onClick={togglePlay}>
          <FaPlay />
        </div>
      )}

      {/* Video Title */}
      {showControls && (
        <div className="video-title">
          <h3>{video?.title}</h3>
        </div>
      )}

      {/* Controls */}
      {showControls && (
        <div className="controls-container" onClick={(e) => e.stopPropagation()}>
          {/* Timeline */}
          <div className="timeline-container" ref={timelineRef}>
            <input
              type="range"
              className="timeline"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleTimelineChange}
              step="0.01"
            />
            <div 
              className="timeline-progress" 
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            ></div>
          </div>

          {/* Control Buttons */}
          <div className="controls-row">
            <div className="left-controls">
              <button className="control-button" onClick={togglePlay}>
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              
              <button 
                className="control-button" 
                onClick={skipBackward}
                style={{ transform: 'scale(1.1)' }}
              >
                <FaBackward />
              </button>
              
              <button 
                className="control-button" 
                onClick={skipForward}
                style={{ transform: 'scale(1.1)' }}
              >
                <FaForward />
              </button>
              
              <div className="volume-container">
                <button className="control-button" onClick={toggleMute}>
                  {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
                <input
                  type="range"
                  className="volume-slider"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                />
              </div>
              
              <div className="time-display">
                <span>{formatTime(currentTime)}</span>
                <span> / </span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="right-controls">
              <div className="settings-container">
                <button 
                  className="control-button" 
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <FaCog />
                </button>
                
                {showSettings && (
                  <div className="settings-menu">
                    <div className="settings-section">
                      <h4>Playback Speed</h4>
                      <div className="speed-options">
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                          <button 
                            key={rate} 
                            className={`speed-option ${playbackRate === rate ? 'active' : ''}`}
                            onClick={() => changePlaybackRate(rate)}
                          >
                            {rate === 1 ? 'Normal' : `${rate}x`}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                className="control-button" 
                onClick={() => setShowSubtitles(!showSubtitles)}
              >
                <FaClosedCaptioning />
              </button>
              
              <button className="control-button" onClick={toggleFullscreen}>
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
