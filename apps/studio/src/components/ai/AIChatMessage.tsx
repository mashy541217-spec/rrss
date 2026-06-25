import React from 'react';
import type { ChatMessage } from '../../store/useAIAssistantStore';
import { useBuilderStore } from '../../store/useBuilderStore';
import { Bot, User, CheckCircle2 } from 'lucide-react';

const AIChatMessage: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const { applyWorkflowTemplate } = useBuilderStore();
  const isAssistant = message.role === 'assistant';

  const handleApply = () => {
    if (message.workflowTemplate) {
      applyWorkflowTemplate(message.workflowTemplate.nodes, message.workflowTemplate.edges);
    }
  };

  return (
    <div className={`chat-message ${isAssistant ? 'assistant' : 'user'}`}>
      <div className="msg-avatar">
        {isAssistant ? <Bot size={16} color="var(--accent-primary)" /> : <User size={16} />}
      </div>
      <div className="msg-content">
        <div className="msg-text" dangerouslySetInnerHTML={{ __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
        
        {message.workflowTemplate && (
          <div className="msg-attachment glass-card">
            <div className="attachment-header">
              <span className="text-info text-small fw-600">Workflow Definition Generated</span>
            </div>
            <button className="btn-primary w-full mt-2" onClick={handleApply}>
              <CheckCircle2 size={14} /> Apply to Canvas
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIChatMessage;
