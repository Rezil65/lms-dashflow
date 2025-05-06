
import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward, SkipBack } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface StylizedVideoPlayerProps {
  src: string;
  title?: string;
  autoPlay?: boolean;
  controls?: boolean;
  className?: string;
}

const StylizedVideoPlayer = ({
  src,
  title,
  autoPlay = false,
  controls = true,
  className,
}: StylizedVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    videoElement.addEventListener("ended", handleEnded);

    return () => {
      videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      videoElement.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const handleSeek = (value: number[]) => {
    const seekTime = value[0];
    setCurrentTime(seekTime);
    
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };

  const handleSkip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const toggleFullScreen = () => {
    if (!playerRef.current) return;
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      playerRef.current.requestFullscreen();
    }
  };

  const handleMouseMovement = () => {
    setShowControls(true);
    
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  return (
    <div 
      ref={playerRef}
      className={cn(
        "relative group overflow-hidden rounded-xl shadow-lg bg-black aspect-video",
        className
      )}
      onMouseMove={handleMouseMovement}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        autoPlay={autoPlay}
        controls={false}
        onClick={togglePlay}
      />
      
      {title && (
        <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/70 to-transparent text-white font-medium">
          {title}
        </div>
      )}
      
      {/* Play/pause overlay */}
      <div 
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity",
          isPlaying ? "opacity-0" : "opacity-100"
        )}
        onClick={togglePlay}
      >
        <button 
          className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center hover:bg-opacity-100 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
        >
          <Play className="w-8 h-8 text-black fill-black ml-1" />
        </button>
      </div>
      
      {/* Controls */}
      {controls && (
        <div 
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 transition-all",
            (showControls || !isPlaying) ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Progress bar */}
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.01}
            onValueChange={handleSeek}
            className="h-1.5 mb-2"
          />
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <button 
                onClick={togglePlay}
                className="text-white hover:text-primary transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              
              <div className="flex items-center">
                <button 
                  onClick={() => handleSkip(-10)}
                  className="text-white hover:text-primary transition-colors"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleSkip(10)}
                  className="text-white hover:text-primary transition-colors ml-2"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
              
              <div className="relative ml-2">
                <button 
                  onClick={toggleMute}
                  className="text-white hover:text-primary transition-colors"
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                
                <div 
                  className={cn(
                    "absolute bottom-full mb-2 bg-black/80 p-2 rounded-md transition-all",
                    showVolumeSlider ? "opacity-100" : "opacity-0 pointer-events-none"
                  )}
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <Slider
                    value={[volume]}
                    min={0}
                    max={1}
                    step={0.01}
                    orientation="vertical"
                    onValueChange={handleVolumeChange}
                    className="h-20 mx-2"
                  />
                </div>
              </div>
              
              <span className="text-white text-xs ml-2">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            
            <button 
              onClick={toggleFullScreen}
              className="text-white hover:text-primary transition-colors"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StylizedVideoPlayer;
