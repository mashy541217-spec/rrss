import type { IAIAgent, AIResponse } from './IAIAgent';
import { api } from '../api';

export class GatewayAIAgent implements IAIAgent {
  async generate(prompt: string, context: any): Promise<AIResponse> {
    try {
      // Connect to the real backend AI Gateway endpoint
      const response = await api.post('/ai/architect/generate', { prompt, context });
      return response;
    } catch (e) {
      console.error('AI Generation Error', e);
      return { message: "Error contacting the AI Gateway service." };
    }
  }

  async review(workflowJson: any): Promise<AIResponse> {
    try {
      const response = await api.post('/ai/reviewer/analyze', { workflow: workflowJson });
      return response;
    } catch (e) {
      return { message: "Error contacting the AI Reviewer service." };
    }
  }

  async optimize(executionData: any): Promise<AIResponse> {
    try {
      const response = await api.post('/ai/optimizer/analyze', { telemetry: executionData });
      return response;
    } catch (e) {
      return { message: "Error contacting the AI Optimizer service." };
    }
  }
}
