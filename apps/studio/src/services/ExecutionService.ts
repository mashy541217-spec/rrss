import { useBuilderStore } from '../store/useBuilderStore';
import { SocketClient } from './socket';
import { api } from './api';

export class ExecutionService {
  static init() {
    SocketClient.connect();

    SocketClient.on('ExecutionStarted', (_data: any) => {
      useBuilderStore.getState().startExecution();
    });

    SocketClient.on('NodeStarted', (data: { nodeId: string }) => {
      useBuilderStore.getState().updateNodeExecution(data.nodeId, { status: 'running' }, {
        id: Date.now().toString(),
        nodeId: data.nodeId,
        timestamp: Date.now(),
        type: 'started',
        message: 'Node execution started'
      });
    });

    SocketClient.on('NodeCompleted', (data: { nodeId: string, result: any }) => {
      useBuilderStore.getState().updateNodeExecution(data.nodeId, { status: 'success', outputs: data.result }, {
        id: Date.now().toString(),
        nodeId: data.nodeId,
        timestamp: Date.now(),
        type: 'completed',
        message: `Result: ${JSON.stringify(data.result)}`
      });
    });

    SocketClient.on('NodeFailed', (data: { nodeId: string, error: string }) => {
      useBuilderStore.getState().updateNodeExecution(data.nodeId, { status: 'failed', logs: [data.error] }, {
        id: Date.now().toString(),
        nodeId: data.nodeId,
        timestamp: Date.now(),
        type: 'failed',
        message: `Error: ${data.error}`
      });
    });

    SocketClient.on('ExecutionCompleted', () => {
      useBuilderStore.getState().stopExecution();
    });
  }

  static async triggerExecution(automationId: string) {
    try {
      await api.post(`/automations/${automationId}/publish`, {});
      // In a real scenario, there would be a /execute endpoint, but we mock it triggering through WS
      SocketClient.emit('TriggerExecution', { automationId });
    } catch (e) {
      console.error('Failed to trigger execution', e);
    }
  }

  static stop() {
    SocketClient.disconnect();
  }
}
