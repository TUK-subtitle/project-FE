declare module 'socket.io-client' {
  function io(url: string, opts?: Record<string, unknown>): SocketIOClient.Socket;
  export default io;
}

declare namespace SocketIOClient {
  interface Socket {
    id: string;
    connected: boolean;
    on(event: string, fn: (...args: unknown[]) => void): Socket;
    emit(event: string, ...args: unknown[]): Socket;
    disconnect(): Socket;
  }
}
