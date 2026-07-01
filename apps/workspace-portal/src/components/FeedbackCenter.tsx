import React, { useState } from 'react';
import { useBetaStore } from '../store/useBetaStore';
import type { BetaFeedback } from '../store/useBetaStore';
import { MessageSquare, Star, Paperclip, Filter, CheckCircle } from 'lucide-react';

export const FeedbackCenter: React.FC = () => {
  const { feedbacks, submitFeedback } = useBetaStore();
  const [filterType, setFilterType] = useState('All');

  const filtered = filterType === 'All' ? feedbacks : feedbacks.filter(f => f.type === filterType);

  // Mock Form State
  const [newFeedbackType, setNewFeedbackType] = useState<BetaFeedback['type']>('Bug Report');
  const [newCategory, setNewCategory] = useState('General');
  const [newPriority, setNewPriority] = useState<BetaFeedback['priority']>('Medium');
  const [newContent, setNewContent] = useState('');
  const [newRating, setNewRating] = useState(5);

  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newContent) {
      submitFeedback({
        userId: 'currentUser', // Mocked user ID
        type: newFeedbackType,
        category: newCategory,
        priority: newPriority,
        content: newContent,
        rating: newRating
      });
      setNewContent('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--color-success)' }}>
            <MessageSquare size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Feedback Center</h2>
            <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>Review tester bug reports, feature requests, and satisfaction scores.</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Feedback List */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Tester Reports</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={14} color="var(--color-text-muted)" />
              <select className="glass-input" value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ padding: '4px 8px', fontSize: '12px' }}>
                <option value="All">All Types</option>
                <option value="Bug Report">Bug Reports</option>
                <option value="Feature Request">Feature Requests</option>
                <option value="Improvement">Improvements</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto' }}>
            {filtered.map(fb => (
              <div key={fb.id} style={{ 
                padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)', borderRadius: '12px' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                      background: fb.type === 'Bug Report' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                      color: fb.type === 'Bug Report' ? 'var(--color-danger)' : 'var(--color-primary)'
                    }}>
                      {fb.type}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{fb.category}</span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Priority: {fb.priority}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-warning)' }}>
                    {Array.from({ length: fb.rating }).map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                  </div>
                </div>
                
                <p style={{ margin: '0 0 16px 0', fontSize: '14px', lineHeight: '1.6', color: '#e2e8f0' }}>{fb.content}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    <span>Reporter: {fb.userId}</span>
                    <span>•</span>
                    <span>{new Date(fb.createdAt).toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ 
                      fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '6px',
                      background: fb.status === 'Open' ? 'rgba(255,255,255,0.1)' : 'rgba(16, 185, 129, 0.1)',
                      color: fb.status === 'Open' ? '#fff' : 'var(--color-success)'
                    }}>
                      {fb.status}
                    </span>
                    {fb.status === 'Open' && (
                      <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={12} /> Mark Reviewed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px', color: 'var(--color-text-muted)' }}>No feedback found matching the filters.</div>
            )}
          </div>
        </div>

        {/* Mock Submission Form (For Testing) */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 20px 0' }}>Simulate Submission</h3>
          <form onSubmit={handleTestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Type</label>
              <select className="glass-input" value={newFeedbackType} onChange={(e) => setNewFeedbackType(e.target.value as any)}>
                <option value="Bug Report">Bug Report</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Improvement">Improvement</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <label style={{ fontSize: '13px', fontWeight: 600 }}>Category</label>
                <input className="glass-input" type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="e.g. Dashboard" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <label style={{ fontSize: '13px', fontWeight: 600 }}>Priority</label>
                <select className="glass-input" value={newPriority} onChange={(e) => setNewPriority(e.target.value as any)}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600 }}>Feedback Details</label>
              <textarea className="glass-input" value={newContent} onChange={(e) => setNewContent(e.target.value)} rows={4} required placeholder="Describe the issue or request..." />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button type="button" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}><Paperclip size={14} /> Attach Screenshot</button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600 }}>Rating</span>
                <input type="number" min="1" max="5" value={newRating} onChange={(e) => setNewRating(Number(e.target.value))} className="glass-input" style={{ width: '60px', padding: '4px 8px' }} />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>Submit Mock Report</button>
          </form>
        </div>

      </div>
    </div>
  );
};
