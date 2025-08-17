import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface AgoraConfig {
  appId: string;
  token: string;
  channelName: string;
  uid: number;
}

export const useAgora = (channelName: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] = useState<any>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<any>(null);
  const [remoteUsers, setRemoteUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const clientRef = useRef<any>(null);

  const getAgoraToken = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-agora-token', {
        body: { 
          channelName, 
          uid: Math.floor(Math.random() * 10000),
          role: 'host'
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting Agora token:', error);
      throw error;
    }
  };

  const startCamera = async () => {
    setIsLoading(true);
    try {
      // For now, use browser's getUserMedia as fallback
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setLocalVideoTrack(stream);
      setIsConnected(true);
      return stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = async () => {
    try {
      if (localVideoTrack) {
        const tracks = localVideoTrack.getTracks();
        tracks.forEach((track: any) => {
          track.stop();
          console.log('Stopping track:', track.kind, track.readyState);
        });
        setLocalVideoTrack(null);
      }
      setIsConnected(false);
      console.log('Camera stopped successfully');
    } catch (error) {
      console.error('Error stopping camera:', error);
    }
  };

  return {
    isConnected,
    localVideoTrack,
    localAudioTrack,
    remoteUsers,
    isLoading,
    startCamera,
    stopCamera,
    getAgoraToken
  };
};