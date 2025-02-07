import { useCallback } from "react";
import ReactFlow, { Background, Controls, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange,Node } from "reactflow";
import "reactflow/dist/style.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { updateNodes, updateEdges, undo, redo } from "../store/graphSlice";

const GraphContainer = () => {
  const dispatch = useDispatch();
  const { nodes, edges, history, future } = useSelector((state: RootState) => state.graph);

  const styledNodes:Node[] = nodes.map((node) => ({
    ...node,
    style: {
      backgroundColor: node.data.color,
      fontSize: `${node.data.fontSize}px`,
      padding: "10px",
      borderRadius: "5px",
      textAlign: "center",
      color: "#fff",
    },
  }));

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      dispatch(updateNodes(applyNodeChanges(changes, nodes)));
    },
    [nodes, dispatch]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      dispatch(updateEdges(applyEdgeChanges(changes, edges)));
    },
    [edges, dispatch]
  );

  return (
    <div style={{ width: "75vw", height: "100vh", position: "relative" }}>
      
      <ReactFlow

        nodes={styledNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
      <div style={{ position: "absolute", bottom: 10, left: 50, display: "flex", gap: "10px" }}>
        <button onClick={() => dispatch(undo())} disabled={history.length === 0}>Undo</button>
        <button onClick={() => dispatch(redo())} disabled={future.length === 0}>Redo</button>
      </div>
    </div>
  );
};

export default GraphContainer;
