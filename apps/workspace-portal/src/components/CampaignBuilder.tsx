import React, { useState } from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import type { Campaign } from '../store/useWorkspaceStore';
import { 
  X, ChevronRight, ChevronLeft, Target, Image as ImageIcon, Share2, Calendar, Sparkles, CheckCircle2,
  FolderOpen
} from 'lucide-react';

interface CampaignBuilderProps {
  onClose: () => void;
}

export const CampaignBuilder: React.FC<CampaignBuilderProps> = ({ onClose }) => {
  const { activeBusinessId, damAssets, socialAccounts, createCampaign } = useWorkspaceStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Campaign>>({
    name: '',
    objective: '',
    description: '',
    color: '#8B5CF6',
    assetIds: [],
    channels: []
  });

  const businessAssets = damAssets.filter(a => a.businessId === activeBusinessId);
  const businessChannels = socialAccounts.filter(s => s.businessId === activeBusinessId && s.status === 'CONNECTED');

  const handleNext = () => setStep(s => Math.min(s + 1, 6));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const [isPublishing, setIsPublishing] = useState(false);
  const [scheduleMode, setScheduleMode] = useState<'now' | 'later'>('now');
  const [publishAt, setPublishAt] = useState('');

  const handleSave = async (action: 'Draft' | 'Publish') => {
    setIsPublishing(true);
    
    // Construct the payload for the backend
    const targetChannels = (formData.channels || []).map(c => {
      const account = socialAccounts.find(a => a.provider === c);
      const pageId = account?.id;
      return { provider: c, pageId };
    });

    const payload = {
      workspaceId: useWorkspaceStore.getState().workspaceId,
      businessId: activeBusinessId,
      caption: formData.description,
      assetIds: formData.assetIds,
      targetChannels: targetChannels,
      publishAt: (action === 'Publish' && scheduleMode === 'later' && publishAt) ? new Date(publishAt).toISOString() : undefined,
    };

    try {
      const endpoint = action === 'Publish' ? '/api/publishing/publish' : '/api/publishing/draft';
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      console.log('Publishing Result:', data);
      
      // Update local store to optimistically show the new campaign
      createCampaign({ ...formData, status: action === 'Publish' ? 'Publishing' : 'Draft' } as any);
      onClose();
    } catch (e) {
      console.error(e);
      alert('Failed to publish campaign.');
    } finally {
      setIsPublishing(false);
    }
  };

  const renderStep1 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Campaign Name</label>
        <input 
          className="glass-input" 
          value={formData.name} 
          onChange={e => setFormData({ ...formData, name: e.target.value })} 
          placeholder="e.g. Summer Sale 2026"
          style={{ width: '100%' }}
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Objective</label>
        <select 
          className="glass-input" 
          value={formData.objective} 
          onChange={e => setFormData({ ...formData, objective: e.target.value })}
          style={{ width: '100%', background: 'rgba(0,0,0,0.2)' }}
        >
          <option value="">Select Objective</option>
          <option value="Brand Awareness">Brand Awareness</option>
          <option value="Lead Generation">Lead Generation</option>
          <option value="Sales">Sales</option>
          <option value="Engagement">Engagement</option>
        </select>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Description</label>
        <textarea 
          className="glass-input" 
          value={formData.description} 
          onChange={e => setFormData({ ...formData, description: e.target.value })} 
          placeholder="Campaign brief..."
          style={{ width: '100%', height: '100px', resize: 'none' }}
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Brand Color</label>
        <input 
          type="color" 
          value={formData.color} 
          onChange={e => setFormData({ ...formData, color: e.target.value })}
          style={{ width: '60px', height: '40px', padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Select Assets</h3>
        <button className="btn-secondary" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}><FolderOpen size={14} /> Open DAM</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px', overflowY: 'auto' }}>
        {businessAssets.map(asset => {
          const isSelected = formData.assetIds?.includes(asset.id);
          return (
            <div 
              key={asset.id} 
              onClick={() => {
                const newIds = isSelected 
                  ? formData.assetIds?.filter(id => id !== asset.id) 
                  : [...(formData.assetIds || []), asset.id];
                setFormData({ ...formData, assetIds: newIds });
              }}
              className="glass-card" 
              style={{ 
                height: '150px', cursor: 'pointer', display: 'flex', flexDirection: 'column', position: 'relative',
                border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--glass-border)'
              }}
            >
              <div style={{ flex: 1, background: '#000', overflow: 'hidden' }}>
                {asset.type === 'image' && asset.url.startsWith('blob') ? (
                  <img src={asset.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : <ImageIcon style={{ margin: 'auto', marginTop: '40px' }} />}
              </div>
              <div style={{ padding: '8px', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{asset.name}</div>
              {isSelected && (
                <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'var(--color-primary)', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={14} color="#fff" />
                </div>
              )}
            </div>
          )
        })}
        {businessAssets.length === 0 && <div style={{ color: 'var(--color-text-muted)' }}>No assets in DAM. Upload assets first.</div>}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      <h3 style={{ margin: 0 }}>Select Channels</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {businessChannels.map(channel => {
          const isSelected = formData.channels?.includes(channel.provider);
          return (
            <div 
              key={channel.id}
              onClick={() => {
                const newChannels = isSelected 
                  ? formData.channels?.filter(c => c !== channel.provider)
                  : [...(formData.channels || []), channel.provider];
                setFormData({ ...formData, channels: newChannels });
              }}
              className="glass-card"
              style={{ 
                padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--glass-border)'
              }}
            >
               <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Share2 size={16} />
               </div>
               <div>
                 <div style={{ fontWeight: 600, fontSize: '14px', textTransform: 'capitalize' }}>{channel.provider}</div>
                 <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{channel.name}</div>
               </div>
            </div>
          )
        })}
        {businessChannels.length === 0 && <div style={{ color: 'var(--color-text-muted)' }}>No social channels connected.</div>}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Schedule Content</h3>
        <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Drag assets to timeline</div>
      </div>
      <div style={{ flex: 1, border: '1px solid var(--glass-border)', borderRadius: '12px', background: 'rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
         <Calendar size={48} style={{ opacity: 0.2 }} />
         <p style={{ color: 'var(--color-text-muted)' }}>Timeline view placeholder.</p>
         <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>In a real environment, the {formData.assetIds?.length || 0} selected assets would be distributed here.</p>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      <h3 style={{ margin: 0 }}>AI Optimization</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(139, 92, 246, 0.05)' }}>
           <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--color-primary)' }}><Sparkles size={16} /> <strong>Best Time to Post</strong></div>
           <p style={{ fontSize: '13px', margin: 0 }}>Based on {formData.channels?.join(', ')}, your audience is most active on <strong>Thursdays at 6 PM</strong>.</p>
        </div>
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(139, 92, 246, 0.05)' }}>
           <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--color-primary)' }}><Sparkles size={16} /> <strong>Suggested Hashtags</strong></div>
           <p style={{ fontSize: '13px', margin: 0, color: 'var(--color-primary)' }}>#Marketing #Campaign #SocialMedia</p>
        </div>
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(139, 92, 246, 0.05)', gridColumn: 'span 2' }}>
           <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--color-primary)' }}><Sparkles size={16} /> <strong>Caption Suggestions</strong></div>
           <p style={{ fontSize: '13px', margin: 0 }}>AI generation is standing by to write copy for your {formData.assetIds?.length || 0} assets.</p>
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      <h3 style={{ margin: 0 }}>Review & Schedule</h3>
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: formData.color }} />
          <div>
            <h2 style={{ margin: 0, fontSize: '20px' }}>{formData.name || 'Untitled Campaign'}</h2>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>{formData.objective || 'No objective selected'}</div>
          </div>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '8px 0' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
          <div><strong>Assets:</strong> {formData.assetIds?.length || 0} selected</div>
          <div><strong>Channels:</strong> {formData.channels?.length || 0} configured</div>
          <div style={{ gridColumn: 'span 2' }}><strong>Caption:</strong> {formData.description || 'None'}</div>
        </div>
      </div>

      {/* Scheduling Toggle */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Calendar size={16} style={{ color: 'var(--color-primary)' }} />
          <strong style={{ fontSize: '14px' }}>Publication Timing</strong>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setScheduleMode('now')}
            style={{
              padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px',
              background: scheduleMode === 'now' ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
              color: scheduleMode === 'now' ? '#fff' : 'var(--color-text-muted)'
            }}
          >
            🚀 Publish Now
          </button>
          <button
            onClick={() => setScheduleMode('later')}
            style={{
              padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px',
              background: scheduleMode === 'later' ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
              color: scheduleMode === 'later' ? '#fff' : 'var(--color-text-muted)'
            }}
          >
            🗓️ Schedule Later
          </button>
        </div>
        {scheduleMode === 'later' && (
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '6px' }}>Publish Date & Time</label>
            <input
              type="datetime-local"
              className="glass-input"
              value={publishAt}
              min={new Date().toISOString().slice(0, 16)}
              onChange={e => setPublishAt(e.target.value)}
              style={{ width: '100%', background: 'rgba(0,0,0,0.2)', colorScheme: 'dark' }}
            />
            {publishAt && (
              <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                Will be published on {new Date(publishAt).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const steps = [
    { id: 1, name: 'Basics', icon: <Target size={16} /> },
    { id: 2, name: 'Assets', icon: <ImageIcon size={16} /> },
    { id: 3, name: 'Channels', icon: <Share2 size={16} /> },
    { id: 4, name: 'Schedule', icon: <Calendar size={16} /> },
    { id: 5, name: 'AI Optimization', icon: <Sparkles size={16} /> },
    { id: 6, name: 'Review', icon: <CheckCircle2 size={16} /> }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: '1000px', margin: '0 auto', padding: '40px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '24px', margin: 0 }}>Campaign Builder</h2>
        <button onClick={onClose} className="btn-secondary" style={{ padding: '8px' }}><X size={18} /></button>
      </div>

      <div style={{ display: 'flex', gap: '40px', flex: 1, minHeight: 0 }}>
        
        {/* Sidebar Steps */}
        <div style={{ width: '220px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {steps.map(s => (
            <div 
              key={s.id} 
              style={{ 
                padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px',
                background: step === s.id ? 'var(--color-primary)' : 'transparent',
                color: step === s.id ? '#fff' : (step > s.id ? 'var(--color-text-primary)' : 'var(--color-text-muted)'),
                fontWeight: step === s.id ? 600 : 400,
                opacity: step < s.id ? 0.5 : 1
              }}
            >
              {s.icon} {s.name}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="glass-panel" style={{ flex: 1, padding: '40px', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '12px' }}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            {step === 5 && renderStep5()}
            {step === 6 && renderStep6()}
          </div>
          
          {/* Footer Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--glass-border)' }}>
            <button className="btn-secondary" onClick={handlePrev} disabled={step === 1} style={{ opacity: step === 1 ? 0.5 : 1 }}>
              <ChevronLeft size={16} /> Back
            </button>
            
            {step < 6 ? (
              <button className="btn-primary" onClick={handleNext}>
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-secondary" onClick={() => handleSave('Draft')} disabled={isPublishing}>
                  Save as Draft
                </button>
                <button
                  className="btn-primary"
                  onClick={() => handleSave('Publish')}
                  disabled={isPublishing || (scheduleMode === 'later' && !publishAt)}
                >
                  {isPublishing
                    ? (scheduleMode === 'later' ? 'Scheduling...' : 'Publishing...')
                    : scheduleMode === 'later'
                      ? <><Calendar size={16} style={{ marginRight: '6px' }} /> Schedule</>
                      : <><Sparkles size={16} style={{ marginRight: '6px' }} /> Publish Now</>
                  }
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
