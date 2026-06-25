import React, { useCallback, useRef } from 'react';
import ReactFlow, { MiniMap, Controls, Background, BackgroundVariant } from 'reactflow';
import 'reactflow/dist/style.css';
import { useBuilderStore } from '../../store/useBuilderStore';
import CustomActionNode from './nodes/CustomActionNode';
import { v4 as uuidv4 } from 'uuid';

const nodeTypes = {
  customAction: CustomActionNode,
};

const BuilderCanvas: React.FC = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } = useBuilderStore();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow/type');
      const payload = event.dataTransfer.getData('application/reactflow/data');
      
      if (!type || !payload) return;

      const nodeData = JSON.parse(payload);
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      
      if (reactFlowBounds) {
        const position = {
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        };

        const newNode = {
          id: uuidv4(),
          type: 'customAction', // Always use our premium custom node
          position,
          data: nodeData,
        };

        addNode(newNode);
      }
    },
    [addNode]
  );

  return (
    <div className="canvas-wrapper" ref={reactFlowWrapper} style={{ flex: 1, height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="var(--border-color)" />
        <Controls />
        <MiniMap nodeStrokeColor="var(--accent-primary)" nodeColor="var(--bg-secondary)" maskColor="rgba(10, 10, 11, 0.7)" />
      </ReactFlow>
    </div>
  );
};

export default BuilderCanvas;
