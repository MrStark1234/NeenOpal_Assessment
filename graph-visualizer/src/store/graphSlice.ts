import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Node, Edge } from "reactflow";

interface GraphState {
  nodes: Node[];
  edges: Edge[];
  history: { nodes: Node[]; edges: Edge[] }[];
  future: { nodes: Node[]; edges: Edge[] }[];
}

const initialNodes: Node[] = Array.from({ length: 10 }, (_, i) => ({
  id: (i + 1).toString(),
  position: { x: Math.random() * 400, y: Math.random() * 400 },
  data: { label: `Node ${i + 1}`, color: "#000", fontSize: 16 },
}));

const initialEdges: Edge[] = initialNodes.slice(1).map((node, i) => ({
  id: `e${i + 1}-${i + 2}`,
  source: `${i + 1}`,
  target: node.id,
}));

const initialState: GraphState = {
  nodes: initialNodes,
  edges: initialEdges,
  history: [],
  future: [],
};

const graphSlice = createSlice({
  name: "graph",
  initialState,
  reducers: {
    updateNodes: (state, action: PayloadAction<Node[]>) => {
      state.history.push(JSON.parse(JSON.stringify({ nodes: state.nodes, edges: state.edges })));
      state.future = []; // Clear redo stack
      state.nodes = action.payload;
    },
    updateEdges: (state, action: PayloadAction<Edge[]>) => {
      state.history.push(JSON.parse(JSON.stringify({ nodes: state.nodes, edges: state.edges })));
      state.future = [];
      state.edges = action.payload;
    },
    updateNodeStyle: (state, action: PayloadAction<{ id: string; color?: string; fontSize?: number }>) => {
      const nodeIndex = state.nodes.findIndex((n) => n.id === action.payload.id);
      if (nodeIndex !== -1) {
        state.history.push(JSON.parse(JSON.stringify({ nodes: state.nodes, edges: state.edges })));
        state.future = [];

        if (action.payload.color) state.nodes[nodeIndex].data.color = action.payload.color;
        if (action.payload.fontSize) state.nodes[nodeIndex].data.fontSize = action.payload.fontSize;
      }
    },
    updateNodePosition: (state, action: PayloadAction<{ id: string; position: { x: number; y: number } }>) => {
      const nodeIndex = state.nodes.findIndex((n) => n.id === action.payload.id);
      if (nodeIndex !== -1) {
        state.history.push(JSON.parse(JSON.stringify({ nodes: state.nodes, edges: state.edges })));
        state.future = [];
        state.nodes[nodeIndex].position = action.payload.position;
      }
    },
    undo: (state) => {
      if (state.history.length > 0) {
        const lastState = state.history.pop();
        if (lastState) {
          state.future.push(JSON.parse(JSON.stringify({ nodes: state.nodes, edges: state.edges })));
          state.nodes = lastState.nodes;
          state.edges = lastState.edges;
        }
      }
    },
    redo: (state) => {
      if (state.future.length > 0) {
        const nextState = state.future.pop();
        if (nextState) {
          state.history.push(JSON.parse(JSON.stringify({ nodes: state.nodes, edges: state.edges })));
          state.nodes = nextState.nodes;
          state.edges = nextState.edges;
        }
      }
    },
  },
});

export const { updateNodes, updateEdges, updateNodeStyle, updateNodePosition, undo, redo } = graphSlice.actions;
export default graphSlice.reducer;
