import { useEffect, useRef, useCallback, useState } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL as string;

interface UseSocketReturn {
  isConnected: boolean;
  sendAudio: (pcmData: ArrayBuffer) => void;
  connect: () => void;
  disconnect: () => void;
}

export function useSocket(
  onSubtitleLive: (text: string) => void,
  onSubtitleFinal: (text: string) => void,
): UseSocketReturn {
  const socketRef = useRef<SocketIOClient.Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const onSubtitleLiveRef = useRef(onSubtitleLive);
  const onSubtitleFinalRef = useRef(onSubtitleFinal);

  useEffect(() => {
    onSubtitleLiveRef.current = onSubtitleLive;
    onSubtitleFinalRef.current = onSubtitleFinal;
  }, [onSubtitleLive, onSubtitleFinal]);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('[Socket] 연결 성공, id:', socket.id);
      setIsConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket] 연결 해제:', reason);
      setIsConnected(false);
    });

    socket.on('stt:subtitle_live', (...args: unknown[]) => {
      const text = args[0] as string;
      console.log('[Socket] subtitle_live:', text);
      onSubtitleLiveRef.current(text);
    });

    socket.on('stt:subtitle_final', (...args: unknown[]) => {
      const text = args[0] as string;
      console.log('[Socket] subtitle_final:', text);
      onSubtitleFinalRef.current(text);
    });

    socketRef.current = socket;
  }, []);

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
    socketRef.current = null;
    setIsConnected(false);
  }, []);

  const sendCountRef = useRef(0);

  const sendAudio = useCallback((pcmData: ArrayBuffer) => {
    sendCountRef.current += 1;
    if (sendCountRef.current % 10 === 1) {
      console.log(
        '[Socket] 오디오 전송 #' + sendCountRef.current + ', 크기:',
        pcmData.byteLength,
      );
    }
    // Base64 문자열로 전송 (netty-socketio 2.0.9 바이너리 미지원)
    const bytes = new Uint8Array(pcmData);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    socketRef.current?.emit('stt:audio', btoa(binary));
  }, []);

  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return { isConnected, sendAudio, connect, disconnect };
}
