import { useTelemetryStore } from '../store/useTelemetryStore';
import { SocketClient } from './socket';

export class TelemetryService {
  static start() {
    SocketClient.connect();

    // Listen to real SystemTick events emitted by the backend Operations module
    SocketClient.on('SystemTick', (data: any) => {
      const store = useTelemetryStore.getState();
      store.updateTelemetry({
        workers: data.workers || [],
        queues: data.queues || { execution: 0, retry: 0, deadLetter: 0 },
        systemHealth: data.health || { redis: 'healthy', database: 'healthy', storage: 'healthy' }
      });

      if (data.throughput) {
        store.addThroughputDataPoint(data.throughput);
      }
    });
  }

  static stop() {
    // We do not disconnect the whole socket if other services are using it, 
    // but in a real app, we would remove the listener or unsubscribe from the topic.
  }
}
