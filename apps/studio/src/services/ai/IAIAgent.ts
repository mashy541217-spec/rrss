export interface AIResponse {
  message: string;
  workflowTemplate?: {
    nodes: any[];
    edges: any[];
  };
  recommendedPlugins?: string[];
}

export interface IAIAgent {
  generate(prompt: string, context: any): Promise<AIResponse>;
  review(workflowJson: any): Promise<AIResponse>;
  optimize(executionData: any): Promise<AIResponse>;
}
