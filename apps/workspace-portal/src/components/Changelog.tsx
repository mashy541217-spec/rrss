import React from 'react';
import { useBetaStore } from '../store/useBetaStore';
import { FileText, Rocket, PenTool, CheckCircle, Clock } from 'lucide-react';

export const Changelog: React.FC = () => {
  const { releaseNotes } = useBetaStore();

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'Development': return 'var(--color-warning)';
      case 'Internal': return '#3b82f6';
      case 'Private Beta': return 'var(--color-primary)';
      case 'Release Candidate': return '#ec4899';
      case 'General Availability': return 'var(--color-success)';
      default: return 'var(--color-text-muted)';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ padding: '12px', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '12px', color: '#ec4899' }}>
              <FileText size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Changelog & Releases</h2>
              <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>Track version history and upcoming release channels.</p>
            </div>
          </div>
          <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PenTool size={14} /> Draft Release
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '32px' }}>
        
        {/* Timeline (Left) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '32px', paddingLeft: '16px', borderLeft: '2px solid rgba(255,255,255,0.05)' }}>
          {releaseNotes.map((note) => (
            <div key={note.id} style={{ position: 'relative' }}>
              <div style={{ 
                position: 'absolute', left: '-25px', top: '0', width: '16px', height: '16px', borderRadius: '50%',
                background: getChannelColor(note.channel), border: '4px solid var(--bg-primary)'
              }} />
              
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'monospace' }}>v{note.version}</span>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                      background: `color-mix(in srgb, ${getChannelColor(note.channel)} 10%, transparent)`,
                      color: getChannelColor(note.channel)
                    }}>
                      {note.channel}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} /> {new Date(note.releasedAt).toLocaleDateString()}
                  </div>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 8px 0' }}>{note.title}</h3>
                <p style={{ margin: '0 0 24px 0', fontSize: '14px', lineHeight: '1.6', color: '#e2e8f0' }}>{note.description}</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  {note.features.length > 0 && (
                    <div>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)' }}>
                        <Rocket size={14} /> New Features
                      </h4>
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {note.features.map((feat, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px' }}>
                            <span style={{ color: 'var(--color-primary)', marginTop: '2px' }}>•</span> {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {note.fixes.length > 0 && (
                    <div>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-success)' }}>
                        <CheckCircle size={14} /> Bug Fixes
                      </h4>
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {note.fixes.map((fix, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px' }}>
                            <span style={{ color: 'var(--color-success)', marginTop: '2px' }}>•</span> {fix}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Release Channels Sidebar (Right) */}
        <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px 0' }}>Release Channels</h3>
          
          {[
            { name: 'Development', desc: 'Internal engineering environment.', color: 'var(--color-warning)' },
            { name: 'Internal', desc: 'Dogfooding for staff members.', color: '#3b82f6' },
            { name: 'Private Beta', desc: 'Invited early adopters only.', color: 'var(--color-primary)' },
            { name: 'Release Candidate', desc: 'Staging before full release.', color: '#ec4899' },
            { name: 'General Availability', desc: 'Production environment.', color: 'var(--color-success)' }
          ].map(channel => (
            <div key={channel.name} className="glass-panel" style={{ padding: '16px', borderRadius: '12px', borderLeft: `4px solid ${channel.color}` }}>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>{channel.name}</h4>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-muted)' }}>{channel.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
