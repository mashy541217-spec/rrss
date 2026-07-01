import React, { useState } from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import type { DAMAsset } from '../store/useWorkspaceStore';
import { 
  Folder, Image as ImageIcon, Video, FileText, Search, Plus, 
  Upload, List, Star, Trash2, X, 
  Download, History, Sparkles, FolderOpen, LayoutGrid
} from 'lucide-react';
import { useLimitEngine } from '../lib/LimitEngine';

export const DigitalAssetManager: React.FC = () => {
  const { 
    activeBusinessId, damAssets, damFolders, 
    uploadAsset, createFolder, deleteAsset 
  } = useWorkspaceStore();
  const { canUploadAsset } = useLimitEngine();

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAsset, setSelectedAsset] = useState<DAMAsset | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Filter assets by active business
  const businessAssets = damAssets.filter(a => a.businessId === activeBusinessId);
  const businessFolders = damFolders.filter(f => f.businessId === activeBusinessId);

  // Filter assets and folders by current view and search
  const displayedFolders = businessFolders.filter(f => 
    f.parentId === currentFolderId && f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const displayedAssets = businessAssets.filter(a => {
    const matchesFolder = a.folderId === currentFolderId;
    const matchesSearch = 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.metadata.keywords?.some(k => k.toLowerCase().includes(searchQuery.toLowerCase())) ||
      a.metadata.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return (searchQuery ? matchesSearch : matchesFolder);
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (!canUploadAsset()) return;
    const files = Array.from(e.target.files);
    
    setIsUploading(true);
    setUploadProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress(p => Math.min(p + 10, 90));
      }, 100);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('workspaceId', useWorkspaceStore.getState().workspaceId);
      formData.append('businessId', activeBusinessId);

      try {
        const response = await fetch('http://localhost:3000/api/publishing/upload', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        
        // Optimistically add to local store
        const isVideo = file.type.startsWith('video/');
        await uploadAsset({
          id: data.assetId,
          folderId: currentFolderId,
          name: file.name,
          type: isVideo ? 'video' : 'image',
          url: data.url, // URL returned from API
          size: file.size,
          metadata: {
            title: file.name.split('.')[0],
            description: `Auto-generated description for ${file.name}`,
            keywords: ['uploaded'],
            primaryColors: ['#000000'],
            suggestedCaption: []
          }
        } as any);

      } catch (err) {
        console.error('Upload failed', err);
      } finally {
        clearInterval(interval);
        setUploadProgress(100);
      }
    }

    setTimeout(() => {
      setIsUploading(false);
      setUploadProgress(0);
    }, 500);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Create a mock event to pass to handleFileUpload
      const mockEvent = {
        target: { files: e.dataTransfer.files }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      await handleFileUpload(mockEvent);
    }
  };

  const createNewFolder = () => {
    const name = prompt('Folder name:');
    if (name) {
      createFolder({ name, parentId: currentFolderId });
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getAssetIcon = (type: string) => {
    switch(type) {
      case 'video': case 'reel': case 'story': return <Video size={40} color="var(--color-primary)" />;
      case 'document': case 'template': return <FileText size={40} color="var(--color-warning)" />;
      default: return <ImageIcon size={40} color="var(--color-success)" />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '800px', background: 'var(--bg-secondary)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
      {/* Sidebar */}
      <div style={{ width: '240px', background: 'rgba(0,0,0,0.2)', borderRight: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px' }}>
          <label className="btn-primary" style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
            <Upload size={16} /> Upload Media
            <input type="file" multiple hidden onChange={handleFileUpload} accept="image/*,video/*,.pdf" />
          </label>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 12px' }}>
          <div className="nav-item active" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', background: currentFolderId === null ? 'var(--color-primary)' : 'transparent', color: currentFolderId === null ? '#fff' : 'var(--color-text-muted)' }} onClick={() => setCurrentFolderId(null)}>
            <FolderOpen size={16} /> All Assets
          </div>
          <div className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
            <Star size={16} /> Favorites
          </div>
          <div className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
            <Sparkles size={16} /> AI Generations
          </div>
          <div className="nav-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
            <Trash2 size={16} /> Trash
          </div>
        </div>

        <div style={{ padding: '20px 12px 10px', fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Collections
        </div>
        <div style={{ overflowY: 'auto', flex: 1, padding: '0 12px' }}>
          {businessFolders.filter(f => f.parentId === null).map(folder => (
            <div 
              key={folder.id} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', 
                background: currentFolderId === folder.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                color: currentFolderId === folder.id ? '#fff' : 'var(--color-text-muted)'
              }}
              onClick={() => setCurrentFolderId(folder.id)}
            >
              <Folder size={14} /> {folder.name}
            </div>
          ))}
        </div>
      </div>

      {/* Main View */}
      <div 
        style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '20px' }}>
              {currentFolderId ? businessFolders.find(f => f.id === currentFolderId)?.name : 'All Assets'}
            </h2>
            {currentFolderId && (
              <span style={{ fontSize: '12px', color: 'var(--color-primary)', cursor: 'pointer' }} onClick={() => setCurrentFolderId(null)}>
                ← Back to root
              </span>
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search assets, tags, colors..." 
                className="glass-input" 
                style={{ paddingLeft: '32px', width: '250px', height: '36px' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', overflow: 'hidden' }}>
              <button style={{ padding: '8px', background: viewMode === 'grid' ? 'var(--color-primary)' : 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={() => setViewMode('grid')}><LayoutGrid size={16} /></button>
              <button style={{ padding: '8px', background: viewMode === 'list' ? 'var(--color-primary)' : 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={() => setViewMode('list')}><List size={16} /></button>
            </div>
            <button className="btn-secondary" onClick={createNewFolder}><Plus size={16} /> Folder</button>
          </div>
        </div>

        {/* Upload Overlay */}
        {isUploading && (
          <div style={{ padding: '10px 20px', background: 'rgba(139, 92, 246, 0.1)', borderBottom: '1px solid rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${uploadProgress}%`, background: 'var(--color-primary)', height: '100%', transition: 'width 0.2s' }} />
            </div>
            <span style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 600 }}>Analyzing & Uploading... {uploadProgress}%</span>
          </div>
        )}

        {/* Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {displayedFolders.length === 0 && displayedAssets.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)', opacity: 0.6 }}>
              <Upload size={48} style={{ marginBottom: '16px' }} />
              <h3 style={{ marginBottom: '8px' }}>Drop assets here</h3>
              <p style={{ fontSize: '13px' }}>Images, videos, and templates will be auto-tagged by AI.</p>
            </div>
          ) : (
            <div style={{ 
              display: viewMode === 'grid' ? 'grid' : 'flex', 
              flexDirection: viewMode === 'list' ? 'column' : 'row',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
              gap: '20px' 
            }}>
              {/* Render Folders */}
              {displayedFolders.map(folder => (
                <div 
                  key={folder.id} 
                  className="glass-card" 
                  style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                  onClick={() => setCurrentFolderId(folder.id)}
                >
                  <Folder size={24} color="var(--color-primary)" />
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>{folder.name}</span>
                </div>
              ))}

              {/* Render Assets */}
              {displayedAssets.map(asset => (
                <div 
                  key={asset.id} 
                  className="glass-card" 
                  style={{ 
                    padding: viewMode === 'grid' ? '0' : '12px', 
                    display: 'flex', 
                    flexDirection: viewMode === 'grid' ? 'column' : 'row',
                    alignItems: viewMode === 'list' ? 'center' : 'stretch',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    borderColor: selectedAsset?.id === asset.id ? 'var(--color-primary)' : 'var(--glass-border)'
                  }}
                  onClick={() => setSelectedAsset(asset)}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div style={{ height: '140px', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        {asset.type === 'image' && asset.url.startsWith('blob') ? (
                          <img src={asset.url} alt={asset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          getAssetIcon(asset.type)
                        )}
                        {asset.metadata.primaryColors && (
                          <div style={{ position: 'absolute', bottom: '8px', right: '8px', display: 'flex', gap: '4px' }}>
                            {asset.metadata.primaryColors.map(c => (
                              <div key={c} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c, border: '1px solid rgba(255,255,255,0.5)' }} />
                            ))}
                          </div>
                        )}
                      </div>
                      <div style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{asset.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{formatSize(asset.size)}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ width: '40px', height: '40px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px' }}>
                        {getAssetIcon(asset.type)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{asset.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{asset.metadata.title}</div>
                      </div>
                      <div style={{ width: '100px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        {formatSize(asset.size)}
                      </div>
                      <div style={{ width: '120px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        {new Date(asset.createdAt).toLocaleDateString()}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details Panel (Right Sidebar) */}
      {selectedAsset && (
        <div style={{ width: '320px', background: 'rgba(0,0,0,0.2)', borderLeft: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Asset Details</h3>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }} onClick={() => setSelectedAsset(null)}>
              <X size={16} />
            </button>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {/* Preview */}
            <div style={{ height: '200px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               {selectedAsset.type === 'image' && selectedAsset.url.startsWith('blob') ? (
                  <img src={selectedAsset.url} alt={selectedAsset.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  getAssetIcon(selectedAsset.type)
                )}
            </div>

            <div style={{ padding: '20px' }}>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', wordBreak: 'break-all' }}>{selectedAsset.name}</h4>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
                Uploaded {new Date(selectedAsset.createdAt).toLocaleString()} • {formatSize(selectedAsset.size)}
              </div>

              {/* AI Metadata Section */}
              <div style={{ background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '12px', fontSize: '13px' }}>
                  <Sparkles size={14} /> AI Analysis
                </div>
                
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Generated Caption</div>
                  <div style={{ fontSize: '13px', lineHeight: '1.4' }}>{selectedAsset.metadata.description}</div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Smart Tags</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selectedAsset.metadata.keywords?.map(tag => (
                      <span key={tag} style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  <Download size={16} /> Download Original
                </button>
                <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  <History size={16} /> Version History
                </button>
                <button 
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                  onClick={() => {
                    deleteAsset(selectedAsset.id);
                    setSelectedAsset(null);
                  }}
                >
                  <Trash2 size={16} /> Move to Trash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
