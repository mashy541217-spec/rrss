import React from 'react';
import BuilderCanvas from '../components/builder/BuilderCanvas';
import NodePalette from '../components/builder/NodePalette';
import BuilderInspector from '../components/builder/BuilderInspector';
import DebuggerPanel from '../components/debugger/DebuggerPanel';
import TimelineVisualizer from '../components/debugger/TimelineVisualizer';
import AIAssistantPanel from '../components/ai/AIAssistantPanel';
import { useBuilderStore } from '../store/useBuilderStore';
import { useAIAssistantStore } from '../store/useAIAssistantStore';
import '../components/builder/builder.css';
import '../components/debugger/debugger.css';

const BuilderPage: React.FC = () => {
  const { isRunning } = useBuilderStore();
  const { isOpen } = useAIAssistantStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="builder-container" style={{ flex: 1 }}>
        <NodePalette />
        <BuilderCanvas />
        {isRunning || useBuilderStore.getState().timelineEvents.length > 0 ? <DebuggerPanel /> : <BuilderInspector />}
        {isOpen && <AIAssistantPanel />}
      </div>
      <TimelineVisualizer />
    </div>
  );
};

export default BuilderPage;
