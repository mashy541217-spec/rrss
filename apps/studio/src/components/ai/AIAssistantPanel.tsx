import React, { useState } from 'react';
import { useAIAssistantStore } from '../../store/useAIAssistantStore';
import { AIAgentOrchestrator } from '../../services/ai/AIAgentOrchestrator';
import AIChatMessage from './AIChatMessage';
import { Bot, Send, BrainCircuit, X } from 'lucide-react';
import './ai-assistant.css';

const AIAssistantPanel: React.FC = () => {
  const { isOpen, togglePanel, isTyping, messages, activeAgent, setActiveAgent } = useAIAssistantStore();
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    const prompt = input;
    setInput('');
    AIAgentOrchestrator.handlePrompt(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <aside className="ai-assistant-panel glass-panel">
      <div className="ai-header">
        <div className="ai-title">
          <BrainCircuit size={20} color="var(--accent-primary)" />
          <h3>AI Studio</h3>
        </div>
        <button className="icon-btn" onClick={togglePanel}><X size={16}/></button>
      </div>

      <div className="ai-agent-selector">
        <button className={`agent-btn ${activeAgent === 'architect' ? 'active' : ''}`} onClick={() => setActiveAgent('architect')}>Architect</button>
        <button className={`agent-btn ${activeAgent === 'reviewer' ? 'active' : ''}`} onClick={() => setActiveAgent('reviewer')}>Reviewer</button>
        <button className={`agent-btn ${activeAgent === 'optimizer' ? 'active' : ''}`} onClick={() => setActiveAgent('optimizer')}>Optimizer</button>
      </div>

      <div className="ai-chat-area">
        {messages.map(msg => (
          <AIChatMessage key={msg.id} message={msg} />
        ))}
        {isTyping && (
          <div className="ai-typing-indicator">
            <Bot size={16} /> <span className="typing-dots">...</span>
          </div>
        )}
      </div>

      <div className="ai-input-area">
        <textarea 
          placeholder={`Ask the ${activeAgent}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
        />
        <button className="send-btn" onClick={handleSend} disabled={!input.trim() || isTyping}>
          <Send size={16} />
        </button>
      </div>
    </aside>
  );
};

export default AIAssistantPanel;
