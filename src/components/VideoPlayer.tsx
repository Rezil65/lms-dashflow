
import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Clock, Maximize, Volume2 } from "lucide-react";

interface VideoPlayerProps {
  thumbnailUrl: string;
  duration?: string;
  currentTime?: string;
  progress?: number;
}

const VideoPlayer = ({ thumbnailUrl, duration = "07:12", currentTime = "03:01", progress = 45 }: VideoPlayerProps) => {
  return (
    <div className="relative aspect-video bg-black max-h-[70vh]">
      <img 
        src={thumbnailUrl} 
        alt="Video thumbnail" 
        className="w-full h-full object-cover"
      />
      
      {/* Video Controls Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Button size="icon" className="h-16 w-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-transform hover:scale-110">
          <Play className="h-8 w-8 text-white" fill="white" />
        </Button>
      </div>
      
      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex flex-col space-y-2">
          <Progress value={progress} className="h-1" />
          
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/10 transition-transform hover:scale-105">
                <Play className="h-4 w-4" />
              </Button>
              
              <span className="text-xs">{currentTime} / {duration}</span>
              
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/10 transition-transform hover:scale-105">
                  <Volume2 className="h-4 w-4" />
                </Button>
                <Progress value={75} className="h-1 w-16" />
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/10 transition-transform hover:scale-105">
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
