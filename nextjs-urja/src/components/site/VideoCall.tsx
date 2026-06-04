'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Monitor,
  MessageSquare,
  Settings,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface VideoCallProps {
  appointmentId: string;
  roomId: string;
  userName: string;
  userRole: 'patient' | 'doctor';
  onEndCall: () => void;
}

export default function VideoCall({
  appointmentId,
  roomId,
  userName,
  userRole,
  onEndCall,
}: VideoCallProps) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Simulate connection status
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnected(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Update call duration
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected]);

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get local video stream
  useEffect(() => {
    const getMediaStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing media devices:', err);
        setIsVideoEnabled(false);
        setIsAudioEnabled(false);
      }
    };

    getMediaStream();
  }, []);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  }, [isVideoEnabled]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  }, [isAudioEnabled]);

  // Toggle screen sharing
  const toggleScreenShare = useCallback(async () => {
    try {
      if (!isScreenSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
        setIsScreenSharing(true);
      } else {
        setIsScreenSharing(false);
      }
    } catch (err) {
      console.error('Error sharing screen:', err);
    }
  }, [isScreenSharing]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // End call
  const endCall = useCallback(() => {
    // Stop all tracks
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    onEndCall();
  }, [onEndCall]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span className="text-white font-medium">{roomId}</span>
          </div>
          <span className="text-gray-400">|</span>
          <span className="text-gray-400">{userName} ({userRole})</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 font-mono">{formatDuration(callDuration)}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="text-gray-400 hover:text-white"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative">
        {/* Remote Video (Main) */}
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          {isConnected ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-12 h-12 text-gray-500" />
              </div>
              <p className="text-gray-400">Connecting...</p>
            </div>
          )}
        </div>

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden border-2 border-gray-600">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!isVideoEnabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
              <VideoOff className="w-8 h-8 text-gray-500" />
            </div>
          )}
        </div>

        {/* Connection Status */}
        {!isConnected && (
          <div className="absolute top-4 left-4 bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
            Waiting for doctor to join...
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-800 px-4 py-4">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleVideo}
            className={`w-12 h-12 rounded-full ${
              isVideoEnabled 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleAudio}
            className={`w-12 h-12 rounded-full ${
              isAudioEnabled 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleScreenShare}
            className={`w-12 h-12 rounded-full ${
              isScreenSharing 
                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            <Monitor className="w-6 h-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={endCall}
            className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white"
          >
            <PhoneOff className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}