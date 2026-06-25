// Real WebSocket Client
const WS_URL = 'ws://localhost:3000/ws';

export class SocketClient {
  private static socket: WebSocket | null = null;
  private static listeners: Record<string, Function[]> = {};

  static connect() {
    if (this.socket) return;
    
    try {
      this.socket = new WebSocket(WS_URL);
      
      this.socket.onmessage = (event) => {
        const payload = JSON.parse(event.data);
        const { type, data } = payload;
        if (this.listeners[type]) {
          this.listeners[type].forEach(cb => cb(data));
        }
      };

      this.socket.onerror = (error) => {
        console.warn('WebSocket connection error. Is backend running?', error);
      };
    } catch (e) {
      console.warn('Failed to connect to WS:', e);
    }
  }

  static on(event: string, callback: Function) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  static emit(event: string, data: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: event, data }));
    }
  }

  static disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
