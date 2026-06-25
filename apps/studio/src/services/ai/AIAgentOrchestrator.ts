import type { IAIAgent, AIResponse } from './IAIAgent';
import { useAIAssistantStore } from '../../store/useAIAssistantStore';
import { GatewayAIAgent } from './GatewayAIAgent';

export class AIAgentOrchestrator {
  private static agent: IAIAgent = new GatewayAIAgent();

  static async handlePrompt(prompt: string) {
    const store = useAIAssistantStore.getState();
    const activeMode = store.activeAgent;
    
    store.addMessage({ role: 'user', content: prompt });
    store.setTyping(true);

    let response: AIResponse;

    try {
      if (activeMode === 'architect') {
        response = await this.agent.generate(prompt, {});
      } else if (activeMode === 'reviewer') {
        response = await this.agent.review({});
      } else {
        response = await this.agent.optimize({});
      }

      store.addMessage({
        role: 'assistant',
        content: response.message,
        workflowTemplate: response.workflowTemplate
      });

    } catch (e) {
      store.addMessage({
        role: 'assistant',
        content: 'I encountered an error processing your request. Please try again.'
      });
    } finally {
      store.setTyping(false);
    }
  }
}
