import React from 'react';
import { useBuilderStore } from '../../store/useBuilderStore';
import { Play, Square, SkipBack, RotateCcw } from 'lucide-react';
import { ExecutionService } from '../../services/ExecutionService';

export const TopBarExecutionControls: React.FC = () => {
  const { isRunning, stopExecution } = useBuilderStore();

  const handleStart = () => {
    ExecutionService.init();
    ExecutionService.triggerExecution('test-workflow');
  };

  const handleStop = () => {
    ExecutionService.stop();
    stopExecution();
  };

  return (
    <div className="execution-controls">
      <div className="control-group">
        <button className="icon-btn tooltip-host disabled"><SkipBack size={16} /></button>
        <button className="icon-btn tooltip-host disabled"><RotateCcw size={16} /></button>
      </div>
      
      {!isRunning ? (
        <button className="btn-primary run-btn" onClick={handleStart}>
          <Play size={16} /> Run Workflow
        </button>
      ) : (
        <button className="btn-danger stop-btn" onClick={handleStop}>
          <Square size={16} /> Stop Execution
        </button>
      )}
    </div>
  );
};
