'use client'
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Ivideo } from "../types/video";
import "./video-player.css";
import SubscriptionModal from "../subscription/SubscriptionModal";
import axios from "@/lib/axios";
import { userId, isStudentAmbassador } from "@/lib/user";

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
  miniPlayer?: boolean;
  onSubscriptionSuccess?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  isMembership,
  mode = "preview",
  miniPlayer = false,
  onSubscriptionSuccess
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
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  
  // Check localStorage flag for recently activated subscription (only on client side)
  // Declare this FIRST before any useEffects that use it
  const [subscriptionJustActivated, setSubscriptionJustActivated] = useState(false);
  
  // Initialize subscription flag from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const active = localStorage.getItem('subscriptionActive') === 'true';
      setSubscriptionJustActivated(active);
    }
  }, []);

  // Check if subscription was just activated (prevent modal from showing immediately after payment)
  useEffect(() => {
    const subscriptionActive = localStorage.getItem('subscriptionActive');
    const subscriptionActivatedAt = localStorage.getItem('subscriptionActivatedAt');
    
    if (subscriptionActive === 'true' && subscriptionActivatedAt) {
      const activatedTime = new Date(subscriptionActivatedAt).getTime();
      const now = new Date().getTime();
      // Clear the flag after 5 minutes or if subscription is confirmed active
      if (now - activatedTime > 5 * 60 * 1000) {
        localStorage.removeItem('subscriptionActive');
        localStorage.removeItem('subscriptionActivatedAt');
        setSubscriptionJustActivated(false);
      }
      
      // If subscription was just activated, close any open modals
      if (showSubscriptionModal) {
        setShowSubscriptionModal(false);
      }
    }
  }, [showSubscriptionModal]);
  
  // Single source of truth: user has full video access (subscription OR Student Ambassador)
  const hasFullAccess = useMemo(
    () => isMembership || isStudentAmbassador || subscriptionJustActivated,
    [isMembership, subscriptionJustActivated]
  );

  // Determine video source: original only when user has full access (subscriber or Student Ambassador)
  const videoLink = useMemo(() => {
    if (!video) return '';
    if (hasFullAccess) {
      if (video?.original_video) return video.original_video;
      return video?.preview_video || '';
    }
    if (video?.preview_video) return video.preview_video;
    return '';
  }, [video, hasFullAccess]);

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

  const proxiedVideoUrl = videoLink ? getProxiedVideoUrl(videoLink) : '';

  // Format time (convert seconds to MM:SS format)
  const formatTime = (timeInSeconds: number): string => {
    if (!timeInSeconds) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Real-time subscription check function - calls Next.js API route
  const checkSubscriptionStatus = async (): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      // Use fetch for Next.js API routes (not the backend API)
      const response = await fetch('https://zynoflixott.com/api/subscription/check', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'userId': userId
        }
      });
      
      if (!response.ok) {
        throw new Error(`Subscription check failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data?.hasSubscription || false;
    } catch (error) {
      console.error('Error checking subscription:', error);
      return isMembership; // Fallback to prop value
    }
  };

  // Toggle play/pause: block only when original video and user has no full access (not subscriber, not Student Ambassador)
  const togglePlay = async () => {
    if (video?.original_video && !hasFullAccess) {
      const hasActiveSubscription = await checkSubscriptionStatus();
      if (!hasActiveSubscription) {
        setShowSubscriptionModal(true);
        return;
      }
    }

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

        // Try to switch to landscape orientation on mobile devices
        if (window.screen && 'orientation' in window.screen) {
          try {
            // Cast to any to handle browser differences in the Screen Orientation API
            (window.screen.orientation as any).lock('landscape').catch((err: Error) => {
              // It's ok if this fails, as not all devices/browsers support it
              console.log("Could not lock screen orientation: ", err);
            });
          } catch (error) {
            console.log("Screen orientation API not supported");
          }
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
        }

        // Release the orientation lock when exiting fullscreen
        if (window.screen && 'orientation' in window.screen && (window.screen.orientation as any).unlock) {
          try {
            (window.screen.orientation as any).unlock();
          } catch (error) {
            console.log("Could not unlock screen orientation");
          }
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

  // Initialize video
  useEffect(() => {
    if (!video) return;

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
  }, [videoLink, video]);

  // Block playback only when original video is loaded but user has no full access
  useEffect(() => {
    if (!videoRef.current || !video?.original_video || hasFullAccess) return;
    const videoElement = videoRef.current;
    const isOriginalSource = videoElement.src && (
      videoElement.src.includes(video.original_video) || videoLink === video.original_video
    );
    if (isOriginalSource) {
      videoElement.pause();
      videoElement.currentTime = 0;
      setShowSubscriptionModal(true);
    }
  }, [videoLink, video?.original_video, hasFullAccess]);

  // Handle video events
  useEffect(() => {
    if (!video) return;

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

    const handlePlay = async () => {
      if (video?.original_video && !hasFullAccess) {
        const hasActiveSubscription = await checkSubscriptionStatus();
        if (!hasActiveSubscription) {
          const videoElement = videoRef.current;
          if (videoElement && (videoElement.src?.includes(video.original_video) || videoLink === video.original_video)) {
            videoElement.pause();
            videoElement.currentTime = 0;
            setShowSubscriptionModal(true);
            return;
          }
        }
      }
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

    // Store a reference to the current player element for cleanup
    const currentPlayerRef = playerRef.current;

    if (currentPlayerRef) {
      currentPlayerRef.addEventListener('mousemove', handleMouseMove);
      currentPlayerRef.addEventListener('mouseleave', hideControls);
      currentPlayerRef.addEventListener('mouseenter', handleMouseMove);
    }

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

      if (currentPlayerRef) {
        currentPlayerRef.removeEventListener('mousemove', handleMouseMove);
        currentPlayerRef.removeEventListener('mouseleave', hideControls);
        currentPlayerRef.removeEventListener('mouseenter', handleMouseMove);
      }

      clearTimeout(controlsTimer);
    };
  }, [isPlaying, video, hasFullAccess, videoLink]);

  // Handle if video is null
  if (!video) return null;

  // For mini player mode, return simplified player
  if (miniPlayer) {
    return (
      <div
        className="relative w-full h-full overflow-hidden"
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          src={proxiedVideoUrl || videoLink}
          poster={video?.thumbnail}
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          autoPlay={false}
          muted={true}
          controls={false}
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          {isPlaying ? (
            <FaPause className="text-white text-xl" />
          ) : (
            <FaPlay className="text-white text-xl" />
          )}
        </div>
      </div>
    );
  }

  // Return normal player for regular mode
  return (
    <div
      className="video-player-container"
      ref={playerRef}
      onClick={(e) => {
        if (!hasFullAccess && video?.original_video) {
          e.stopPropagation();
          setShowSubscriptionModal(true);
          return;
        }
        togglePlay();
      }}
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

      {/* Color gradient overlay — improves perceived contrast and depth (non-blocking) */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] rounded-lg overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            background: [
              'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 18%, transparent 82%, rgba(0,0,0,0.4) 100%)',
              'linear-gradient(to right, rgba(0,0,0,0.12) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.12) 100%)',
            ].join(', '),
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(20,10,40,0.4) 100%)',
          }}
        />
      </div>

      {/* Loading Spinner with Enhanced Animation */}
      {isBuffering && (
        <div className="buffering-overlay">
          <div className="spinner" style={{
            animation: "buffering-spin 1.2s linear infinite, buffering-pulse 2s ease-in-out infinite"
          }}>
            <style jsx>{`
              @keyframes buffering-spin {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(360deg);
                }
              }
              @keyframes buffering-pulse {
                0% {
                  opacity: 0.6;
                  box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
                }
                50% {
                  opacity: 1;
                  box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
                }
                100% {
                  opacity: 0.6;
                  box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
                }
              }
            `}</style>
          </div>
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
        <div 
          className="big-play-button" 
          onClick={(e) => {
            e.stopPropagation();
            if (!hasFullAccess && video?.original_video) {
              setShowSubscriptionModal(true);
              return;
            }
            togglePlay();
          }}
        >
          <FaPlay />
        </div>
      )}

      {/* Subscription Lock Overlay - only for non-subscribers who are not Student Ambassadors */}
      {!hasFullAccess && video?.original_video && (
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-30 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            console.log('🔓 Overlay clicked - opening subscription modal');
            setShowSubscriptionModal(true);
          }}
        >
          <div className="text-center p-8 max-w-md">
            <div className="mb-4 animate-pulse">
              <svg 
                className="w-14 h-14 mx-auto text-purple-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                />
              </svg>
            </div>
            <h3 className="text-base font-bold text-white mb-2">Unlock Full Award-Winning Short Film</h3>
            <p className="text-gray-300 mb-6">Subscribe to unlock full video access</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log('🔓 Button clicked - opening subscription modal');
                setShowSubscriptionModal(true);
              }}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl text-sm transform hover:scale-105"
            >
              Subscribe Now - ₹49 for 1 month
            </button>
          </div>
        </div>
      )}

      {/* Premium Badge - when preview exists but full video requires subscription (hidden for Student Ambassadors) */}
      {!hasFullAccess && video?.original_video && video?.preview_video && showControls && (
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSubscriptionModal(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg transition-all shadow-lg flex items-center gap-2 animate-pulse"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
            Unlock Full Video
          </button>
        </div>
      )}

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => {
          console.log('Closing subscription modal');
          setShowSubscriptionModal(false);
        }}
        onSuccess={() => {
          console.log('Subscription success callback');
          setShowSubscriptionModal(false);
          // Call parent callback to refresh user data
          onSubscriptionSuccess?.();
          // Reload will happen automatically after subscription
        }}
        videoTitle={video?.title}
      />
      
      {/* Debug: Log access status (dev only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 rounded text-xs z-50">
          <div>Full Access: {hasFullAccess ? 'Yes' : 'No'}</div>
          <div>Student Ambassador: {isStudentAmbassador ? 'Yes' : 'No'}</div>
          <div>Has Original: {video?.original_video ? 'Yes' : 'No'}</div>
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
