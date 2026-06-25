import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import type { Node, Edge, OnNodesChange, OnEdgesChange, OnConnect } from 'reactflow';

export interface NodeExecutionState {
  status: 'idle' | 'running' | 'success' | 'failed';
  duration?: number;
  logs?: string[];
  outputs?: any;
}

export interface TimelineEvent {
  id: string;
  timestamp: number;
  nodeId: string;
  type: 'started' | 'completed' | 'failed';
  message: string;
}

export interface BuilderState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  
  // Execution State
  isRunning: boolean;
  nodeStates: Record<string, NodeExecutionState>;
  timelineEvents: TimelineEvent[];

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node) => void;
  setSelectedNode: (id: string | null) => void;
  updateNodeData: (id: string, data: any) => void;

  // Execution Actions
  startExecution: () => void;
  updateNodeExecution: (nodeId: string, state: Partial<NodeExecutionState>, event?: TimelineEvent) => void;
  stopExecution: () => void;

  // AI Actions
  applyWorkflowTemplate: (nodes: Node[], edges: Edge[]) => void;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  isRunning: false,
  nodeStates: {},
  timelineEvents: [],

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
    // Sync selection state
    const selectedNode = get().nodes.find((n) => n.selected);
    set({ selectedNodeId: selectedNode ? selectedNode.id : null });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },

  setSelectedNode: (id) => {
    set({
      selectedNodeId: id,
      nodes: get().nodes.map((node) => ({
        ...node,
        selected: node.id === id,
      })),
    });
  },

  updateNodeData: (id, newData) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      }),
    });
  },

  applyWorkflowTemplate: (newNodes, newEdges) => {
    set({ nodes: newNodes, edges: newEdges, selectedNodeId: null });
  },

  startExecution: () => {
    set({
      isRunning: true,
      nodeStates: {},
      timelineEvents: [],
      selectedNodeId: null
    });
  },

  updateNodeExecution: (nodeId, state, event) => {
    set((prev) => ({
      nodeStates: {
        ...prev.nodeStates,
        [nodeId]: { ...(prev.nodeStates[nodeId] || { status: 'idle' }), ...state }
      },
      timelineEvents: event ? [...prev.timelineEvents, event] : prev.timelineEvents
    }));
  },

  stopExecution: () => {
    set({ isRunning: false });
  }
}));
