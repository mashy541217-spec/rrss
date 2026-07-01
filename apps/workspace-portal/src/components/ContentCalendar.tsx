import React, { useState } from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import type { DAMAsset } from '../store/useWorkspaceStore';
import { 
  Filter, Plus, ChevronLeft, ChevronRight,
  Image as ImageIcon, Video, Search, Sparkles
} from 'lucide-react';

type ViewMode = 'month' | 'week' | 'day' | 'agenda' | 'timeline';

export const ContentCalendar: React.FC = () => {
  const { 
    activeBusinessId, publications, damAssets, socialAccounts,
    createPublication
  } = useWorkspaceStore();

  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedAsset, setDraggedAsset] = useState<DAMAsset | null>(null);

  const businessPubs = publications.filter(p => p.businessId === activeBusinessId);
  const businessAssets = damAssets.filter(a => a.businessId === activeBusinessId);
  const businessChannels = socialAccounts.filter(s => s.businessId === activeBusinessId && s.status === 'CONNECTED');

  // Simple calendar math for month view
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay, year, month };
  };

  const { days, firstDay, year, month } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleDragStartAsset = (e: React.DragEvent, asset: DAMAsset) => {
    e.dataTransfer.setData('text/plain', asset.id);
    setDraggedAsset(asset);
  };

  const handleDropOnDay = (e: React.DragEvent, dayNumber: number) => {
    e.preventDefault();
    const assetId = e.dataTransfer.getData('text/plain');
    if (assetId && draggedAsset) {
      // Create new publication event
      const scheduledDate = new Date(year, month, dayNumber, 10, 0, 0).toISOString(); // Default 10 AM
      createPublication({
        campaignId: null,
        assetIds: [assetId],
        channels: businessChannels.slice(0, 2).map(c => c.provider), // Auto-select first two channels as mock
        scheduledDate,
        status: 'Draft',
        authorId: 'current-user'
      });
      setDraggedAsset(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return 'var(--color-success)';
      case 'Scheduled': return 'var(--color-primary)';
      case 'Pending': return 'var(--color-warning)';
      case 'Failed': return 'var(--color-danger)';
      default: return 'var(--color-text-muted)';
    }
  };

  return (
    <div style={{ display: 'flex', height: '800px', background: 'var(--bg-secondary)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
      
      {/* DAM Mini Picker Sidebar */}
      <div style={{ width: '280px', background: 'rgba(0,0,0,0.2)', borderRight: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)' }}>
          <h3 style={{ margin: 0, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ImageIcon size={16} color="var(--color-primary)" /> DAM Assets
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--color-text-muted)' }}>Drag to schedule</p>
        </div>
        <div style={{ padding: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search assets..." 
              className="glass-input" 
              style={{ width: '100%', paddingLeft: '32px', height: '32px', fontSize: '12px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {businessAssets.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase())).map(asset => (
            <div 
              key={asset.id} 
              draggable 
              onDragStart={(e) => handleDragStartAsset(e, asset)}
              className="glass-card" 
              style={{ padding: '10px', cursor: 'grab', display: 'flex', gap: '12px', alignItems: 'center' }}
            >
              <div style={{ width: '40px', height: '40px', background: '#000', borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {asset.type === 'image' && asset.url.startsWith('blob') ? (
                  <img src={asset.url} alt={asset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  asset.type === 'video' ? <Video size={16} /> : <ImageIcon size={16} />
                )}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{asset.name}</div>
                <div style={{ fontSize: '10px', color: 'var(--color-primary)', marginTop: '2px' }}>{asset.metadata.primaryColors?.length ? 'AI Tagged' : ''}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Calendar Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Calendar Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button className="btn-secondary" onClick={handlePrevMonth} style={{ padding: '6px' }}><ChevronLeft size={16} /></button>
              <h2 style={{ margin: 0, fontSize: '18px', width: '160px', textAlign: 'center' }}>{monthName} {year}</h2>
              <button className="btn-secondary" onClick={handleNextMonth} style={{ padding: '6px' }}><ChevronRight size={16} /></button>
            </div>
            
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', overflow: 'hidden' }}>
              {(['month', 'week', 'day', 'agenda', 'timeline'] as ViewMode[]).map(mode => (
                <button 
                  key={mode}
                  style={{ 
                    padding: '6px 12px', fontSize: '12px', textTransform: 'capitalize', border: 'none', cursor: 'pointer',
                    background: viewMode === mode ? 'var(--color-primary)' : 'transparent',
                    color: viewMode === mode ? '#fff' : 'var(--color-text-muted)'
                  }}
                  onClick={() => setViewMode(mode)}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-secondary"><Filter size={14} /> Filter</button>
            <button className="btn-primary"><Plus size={14} /> Create Post</button>
          </div>
        </div>

        {/* AI Recommendations Banner Placeholder */}
        <div style={{ padding: '12px 20px', background: 'rgba(139, 92, 246, 0.08)', borderBottom: '1px solid rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Sparkles size={16} color="var(--color-primary)" />
          <span style={{ fontSize: '13px', color: '#fff' }}><strong>AI Insight:</strong> Based on audience activity, the optimal publishing time for {businessChannels[0]?.name || 'your channels'} this week is Thursday at 6:00 PM.</span>
        </div>

        {/* Calendar Grid (Month View Mock) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          {/* Days of week header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.1)' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} style={{ padding: '10px', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textAlign: 'center' }}>{d}</div>
            ))}
          </div>

          {/* Grid Cells */}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: 'repeat(5, 1fr)', overflowY: 'auto' }}>
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} style={{ borderRight: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', opacity: 0.3 }} />
            ))}
            
            {Array.from({ length: days }).map((_, i) => {
              const day = i + 1;
              const pubsForDay = businessPubs.filter(p => {
                const pDate = new Date(p.scheduledDate);
                return pDate.getDate() === day && pDate.getMonth() === month && pDate.getFullYear() === year;
              });

              return (
                <div 
                  key={day} 
                  style={{ borderRight: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnDay(e, day)}
                >
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', textAlign: 'right' }}>{day}</div>
                  
                  {pubsForDay.map(pub => {
                    const pubAsset = businessAssets.find(a => a.id === pub.assetIds[0]);
                    return (
                      <div key={pub.id} className="glass-card" style={{ padding: '6px', cursor: 'grab', background: 'rgba(255,255,255,0.03)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {pub.channels.map(c => (
                              <div key={c} style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--color-primary)' }} title={c} />
                            ))}
                          </div>
                          <span style={{ fontSize: '10px', color: getStatusColor(pub.status) }}>{pub.status}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          {pubAsset && (
                             <div style={{ width: '20px', height: '20px', borderRadius: '4px', overflow: 'hidden', background: '#000' }}>
                                {pubAsset.type === 'image' && pubAsset.url.startsWith('blob') ? (
                                  <img src={pubAsset.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : <ImageIcon size={12} />}
                             </div>
                          )}
                          <div style={{ fontSize: '10px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', flex: 1 }}>
                            {new Date(pub.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};
