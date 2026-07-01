import React, { useState, useEffect, useRef } from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { 
  Sparkles, Send, Bot, User, Target,
  Workflow, ArrowRight, LayoutTemplate, Clock, BarChart3
} from 'lucide-react';

export const AICopilotHome: React.FC = () => {
  const { activeBusinessId, aiMessages, addAIMessage } = useWorkspaceStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const businessMessages = aiMessages.filter(m => m.businessId === activeBusinessId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [businessMessages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // User message
    addAIMessage({ role: 'user', content: input });
    const userText = input.toLowerCase();
    setInput('');

    // Mock AI Response parsing
    setTimeout(() => {
      let responseContent = "I can help you orchestrate your workspace. How would you like to proceed?";
      let actionCard: any = undefined;

      if (userText.includes('campaign') || userText.includes('mother')) {
        responseContent = "I've analyzed your past performance. I suggest creating a 'Mother's Day 2026' campaign targeting Instagram and Facebook.";
        actionCard = 'create_campaign';
      } else if (userText.includes('schedule') || userText.includes('friday')) {
        responseContent = "I can schedule all your drafted promotions for next Friday between 4 PM and 6 PM.";
        actionCard = 'schedule_post';
      } else if (userText.includes('automation') || userText.includes('product')) {
        responseContent = "I've prepared an automation workflow that triggers when a 'New Product' DAM asset is uploaded.";
        actionCard = 'create_automation';
      } else if (userText.includes('best') || userText.includes('analytics') || userText.includes('perform')) {
        responseContent = "Your best performing campaign was 'Summer Kickoff', reaching 1.2M users with a 4.5% engagement rate.";
        actionCard = 'analytics_summary';
      }

      addAIMessage({ role: 'assistant', content: responseContent, actionCard });
    }, 1000);
  };

  const renderActionCard = (cardType: string) => {
    switch (cardType) {
      case 'create_campaign':
        return (
          <div className="glass-card" style={{ padding: '16px', marginTop: '12px', border: '1px solid var(--color-primary)' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ padding: '8px', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '8px' }}><Target size={16} color="var(--color-primary)" /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '13px' }}>Draft Campaign: Mother's Day</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Objective: Sales • Channels: 2</div>
              </div>
              <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>Open Builder</button>
            </div>
          </div>
        );
      case 'create_automation':
        return (
          <div className="glass-card" style={{ padding: '16px', marginTop: '12px', border: '1px solid var(--color-primary)' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ padding: '8px', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '8px' }}><Workflow size={16} color="var(--color-primary)" /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '13px' }}>Workflow: Auto-Promote New Products</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Trigger: DAM Asset • Actions: 3</div>
              </div>
              <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>Review Flow</button>
            </div>
          </div>
        );
      case 'analytics_summary':
        return (
          <div className="glass-card" style={{ padding: '16px', marginTop: '12px', border: '1px solid var(--color-primary)' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ padding: '8px', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '8px' }}><BarChart3 size={16} color="var(--color-primary)" /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '13px' }}>Analytics: Summer Kickoff</div>
                <div style={{ fontSize: '11px', color: 'var(--color-success)' }}>+14% vs Average</div>
              </div>
              <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>Full Report</button>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', gap: '24px', height: '100%' }}>
      {/* Main Chat Interface */}
      <div className="glass-panel" style={{ flex: 1, borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Chat Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={16} color="#fff" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Workspace Copilot</h3>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Always-on Intelligence</div>
          </div>
        </div>

        {/* Chat History */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {businessMessages.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)' }}>
              <Sparkles size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
              <h2 style={{ fontSize: '20px', color: '#fff', margin: '0 0 8px 0' }}>How can I help you today?</h2>
              <p style={{ margin: 0 }}>I can create campaigns, build automations, and analyze your data.</p>
            </div>
          ) : (
            businessMessages.map((msg) => (
              <div key={msg.id} style={{ display: 'flex', gap: '16px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: msg.role === 'user' ? 'rgba(255,255,255,0.1)' : 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div style={{ maxWidth: '75%' }}>
                  <div style={{ 
                    padding: '16px', 
                    borderRadius: '12px', 
                    background: msg.role === 'user' ? 'rgba(255,255,255,0.05)' : 'rgba(139, 92, 246, 0.1)',
                    border: msg.role === 'user' ? '1px solid var(--glass-border)' : '1px solid rgba(139, 92, 246, 0.2)',
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}>
                    {msg.content}
                  </div>
                  {msg.actionCard && renderActionCard(msg.actionCard)}
                  <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '8px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div style={{ padding: '24px', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ position: 'relative' }}>
            <input 
              className="glass-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask Copilot to create a campaign, analyze data, or schedule posts..."
              style={{ width: '100%', paddingRight: '50px', padding: '16px 50px 16px 20px', fontSize: '14px', borderRadius: '12px' }}
            />
            <button 
              onClick={handleSend}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'var(--color-primary)', border: 'none', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>

      </div>

      {/* Side Panel: Suggestions */}
      <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LayoutTemplate size={16} /> Prompt Suggestions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button className="btn-secondary" onClick={() => setInput("Create a campaign for Mother's Day.")} style={{ justifyContent: 'space-between', padding: '12px', fontSize: '12px', textAlign: 'left', height: 'auto' }}>
              Create a campaign for Mother's Day <ArrowRight size={14} />
            </button>
            <button className="btn-secondary" onClick={() => setInput("Schedule all promotions next Friday.")} style={{ justifyContent: 'space-between', padding: '12px', fontSize: '12px', textAlign: 'left', height: 'auto' }}>
              Schedule all promotions next Friday <ArrowRight size={14} />
            </button>
            <button className="btn-secondary" onClick={() => setInput("Create an automation for new products.")} style={{ justifyContent: 'space-between', padding: '12px', fontSize: '12px', textAlign: 'left', height: 'auto' }}>
              Create an automation for new products <ArrowRight size={14} />
            </button>
            <button className="btn-secondary" onClick={() => setInput("Show my best performing campaign.")} style={{ justifyContent: 'space-between', padding: '12px', fontSize: '12px', textAlign: 'left', height: 'auto' }}>
              Show my best performing campaign <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px', flex: 1 }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} /> Recent Actions
          </h3>
          <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
             <div>
               <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>Campaign Created</strong>
               <span>"Summer Kickoff" created 2 days ago via Copilot.</span>
             </div>
             <div>
               <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>Workflow Generated</strong>
               <span>"Auto-Notify" built via Copilot 4 days ago.</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
