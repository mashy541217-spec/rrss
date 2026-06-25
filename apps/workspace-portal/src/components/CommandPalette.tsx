import React, { useState, useEffect, useRef } from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { 
  LayoutDashboard, Share2, Briefcase, Play, Calendar, FolderOpen, 
  BarChart3, Bot, ShoppingBag, FileText, Settings, Sun, Moon, Languages, X 
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const { 
    setActiveModule, setTheme, theme, setLanguage, language, t 
  } = useWorkspaceStore();
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const commands = [
    { 
      id: 'nav_home', 
      label: t.navigation.home, 
      category: 'Navigation', 
      icon: <LayoutDashboard size={16} />, 
      action: () => setActiveModule('dashboard') 
    },
    { 
      id: 'nav_social', 
      label: t.navigation.social, 
      category: 'Navigation', 
      icon: <Share2 size={16} />, 
      action: () => setActiveModule('social') 
    },
    { 
      id: 'nav_bus', 
      label: t.navigation.businesses, 
      category: 'Navigation', 
      icon: <Briefcase size={16} />, 
      action: () => setActiveModule('businesses') 
    },
    { 
      id: 'nav_auto', 
      label: t.navigation.automation, 
      category: 'Navigation', 
      icon: <Play size={16} />, 
      action: () => setActiveModule('automation') 
    },
    { 
      id: 'nav_cal', 
      label: t.navigation.calendar, 
      category: 'Navigation', 
      icon: <Calendar size={16} />, 
      action: () => setActiveModule('calendar') 
    },
    { 
      id: 'nav_med', 
      label: t.navigation.media, 
      category: 'Navigation', 
      icon: <FolderOpen size={16} />, 
      action: () => setActiveModule('media') 
    },
    { 
      id: 'nav_an', 
      label: t.navigation.analytics, 
      category: 'Navigation', 
      icon: <BarChart3 size={16} />, 
      action: () => setActiveModule('analytics') 
    },
    { 
      id: 'nav_as', 
      label: t.navigation.assistant, 
      category: 'Navigation', 
      icon: <Bot size={16} />, 
      action: () => setActiveModule('assistant') 
    },
    { 
      id: 'nav_mp', 
      label: t.navigation.marketplace, 
      category: 'Navigation', 
      icon: <ShoppingBag size={16} />, 
      action: () => setActiveModule('marketplace') 
    },
    { 
      id: 'nav_rep', 
      label: t.navigation.reports, 
      category: 'Navigation', 
      icon: <FileText size={16} />, 
      action: () => setActiveModule('reports') 
    },
    { 
      id: 'nav_set', 
      label: t.navigation.settings, 
      category: 'Navigation', 
      icon: <Settings size={16} />, 
      action: () => setActiveModule('settings') 
    },
    { 
      id: 'cmd_theme', 
      label: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode', 
      category: 'Preferences', 
      icon: theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />, 
      action: () => setTheme(theme === 'dark' ? 'light' : 'dark') 
    },
    { 
      id: 'cmd_lang', 
      label: language === 'en' ? 'Cambiar a Español' : 'Switch to English', 
      category: 'Preferences', 
      icon: <Languages size={16} />, 
      action: () => setLanguage(language === 'en' ? 'es' : 'en') 
    }
  ];

  const filteredCommands = commands.filter((cmd) => 
    cmd.label.toLowerCase().includes(query.toLowerCase()) || 
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        setIsOpen(false);
      }
    }
  };

  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, 
      background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      paddingTop: '15vh'
    }} onClick={() => setIsOpen(false)}>
      
      <div 
        className="glass-panel" 
        style={{
          width: '100%', maxWidth: '600px', borderRadius: '12px',
          border: '1px solid var(--glass-border)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          overflow: 'hidden', display: 'flex', flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input block */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyItems: 'center',
          padding: '16px', borderBottom: '1px solid var(--color-border)'
        }}>
          <input
            ref={inputRef}
            type="text"
            className="glass-input"
            placeholder={t.commandPalette.placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '15px', color: '#fff', outline: 'none', padding: '4px 0' }}
          />
          <button 
            onClick={() => setIsOpen(false)} 
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Results list */}
        <div 
          ref={listRef}
          style={{ maxHeight: '320px', overflowY: 'auto', padding: '8px' }}
        >
          {filteredCommands.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
              {t.commandPalette.noResults}
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    setIsOpen(false);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', borderRadius: '8px', cursor: 'pointer',
                    background: isSelected ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                    border: isSelected ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid transparent',
                    color: isSelected ? '#fff' : 'var(--color-text-muted)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: isSelected ? 'var(--color-primary)' : 'inherit', display: 'flex', alignItems: 'center' }}>
                      {cmd.icon}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: isSelected ? 600 : 400 }}>{cmd.label}</span>
                  </div>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>
                    {cmd.category}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Status Help Footer */}
        <div style={{
          padding: '10px 16px', background: 'rgba(0,0,0,0.2)', 
          borderTop: '1px solid var(--color-border)', fontSize: '11px', 
          color: 'var(--color-text-muted)', display: 'flex', justifyContent: 'space-between'
        }}>
          <span>{t.commandPalette.shortcuts}</span>
          <span>Esc</span>
        </div>
      </div>
    </div>
  );
};
