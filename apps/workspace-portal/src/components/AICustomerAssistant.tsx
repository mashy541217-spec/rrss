import React, { useState } from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { Bot, Send, Sparkles } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  action?: {
    label: string;
    actionKey: string;
  };
}

export const AICustomerAssistant: React.FC = () => {
  const { connectOAuthAccount, addNotification } = useWorkspaceStore();
  const [prompt, setPrompt] = useState('');
  const [chatLog, setChatLog] = useState<ChatMessage[]>([
    { sender: 'assistant', text: 'Hello! I am your RRSS AUTO Copilot. I can help connect channels, schedule content campaigns, and manage automations without any complex setup. Try asking: "Connect my Instagram account" or "Schedule a campaign post".' }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userPrompt = prompt.trim();
    setChatLog((prev) => [...prev, { sender: 'user', text: userPrompt }]);
    setPrompt('');

    setTimeout(() => {
      let replyText = "I don't understand that command yet. You can ask me to 'Connect my Instagram', 'Create automation', or 'Launch a summer campaign'.";
      let action = undefined;

      const lower = userPrompt.toLowerCase();

      if (lower.includes('instagram') || lower.includes('connect ig')) {
        replyText = "I parsed your connection request. I can dynamically launch the Instagram OAuth link with automatic anti-detection proxy routing. Click below to connect:";
        action = { label: 'Connect Instagram Account', actionKey: 'connect_ig' };
      } else if (lower.includes('automation') || lower.includes('automate')) {
        replyText = "Intent parsed: CREATE_AUTOMATION. I have created a publication flow that auto-triggers whenever new files are uploaded to your media assets folder. Click below to enable:";
        action = { label: 'Enable Auto-Publisher Flow', actionKey: 'enable_auto_pub' };
      } else if (lower.includes('campaign') || lower.includes('schedule')) {
        replyText = "Intent parsed: SCHEDULE_CAMPAIGN. I have initialized the 'Summer Launch Campaign' scheduled to run daily posts for the next 30 days. No manual scheduling needed. Confirm below:";
        action = { label: 'Launch Scheduled Summer Campaign', actionKey: 'launch_camp' };
      }

      setChatLog((prev) => [...prev, { sender: 'assistant', text: replyText, action }]);
    }, 1000);
  };

  const handleAction = async (actionKey: string) => {
    if (actionKey === 'connect_ig') {
      await connectOAuthAccount('instagram', 'Instagram AI Link');
      setChatLog((prev) => [...prev, { sender: 'assistant', text: 'Instagram account connected successfully! Isolation profile has been generated in the background.' }]);
    } else if (actionKey === 'enable_auto_pub') {
      addNotification('Auto-Publisher flow enabled successfully.', 'success');
      setChatLog((prev) => [...prev, { sender: 'assistant', text: 'Auto-Publisher flow is now active. Upload any photo to the media vault to test!' }]);
    } else if (actionKey === 'launch_camp') {
      addNotification('Summer Campaign scheduled successfully.', 'success');
      setChatLog((prev) => [...prev, { sender: 'assistant', text: 'Campaign schedule active. Execution environment has been isolated.' }]);
    }
  };

  return (
    <div className="glass-panel" style={{ borderRadius: '16px', display: 'flex', flexDirection: 'column', height: '550px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
      
      {/* Bot Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px', borderBottom: '1px solid var(--color-border)', background: 'rgba(139,92,246,0.05)' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bot size={18} style={{ color: 'var(--color-primary)' }} />
        </div>
        <div>
          <h3 style={{ fontSize: '15px' }}>AI Operations Assistant</h3>
          <span style={{ fontSize: '10px', color: 'var(--color-success)', fontWeight: 600 }}>Active Online</span>
        </div>
      </div>

      {/* Chat scroll messages log */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {chatLog.map((msg, idx) => {
          const isAssistant = msg.sender === 'assistant';
          return (
            <div key={idx} style={{
              display: 'flex', gap: '12px',
              flexDirection: isAssistant ? 'row' : 'row-reverse',
              maxWidth: '80%',
              alignSelf: isAssistant ? 'flex-start' : 'flex-end'
            }}>
              {isAssistant && (
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Sparkles size={12} style={{ color: 'var(--color-primary)' }} />
                </div>
              )}
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{
                  padding: '12px 16px', borderRadius: '12px', fontSize: '13px', lineHeight: '1.5',
                  background: isAssistant ? 'rgba(255,255,255,0.03)' : 'var(--color-primary)',
                  border: isAssistant ? '1px solid var(--color-border)' : 'none',
                  color: '#fff'
                }}>
                  {msg.text}
                </div>
                {isAssistant && msg.action && (
                  <button
                    onClick={() => handleAction(msg.action!.actionKey)}
                    className="btn-primary"
                    style={{ padding: '6px 12px', fontSize: '12px', width: 'fit-content' }}
                  >
                    {msg.action.label}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Message input form */}
      <form onSubmit={handleSubmit} style={{ padding: '16px', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.1)' }}>
        <input
          type="text"
          className="glass-input"
          placeholder="Ask the AI copilot..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn-primary" style={{ padding: '10px 14px' }}>
          <Send size={14} />
        </button>
      </form>

    </div>
  );
};
