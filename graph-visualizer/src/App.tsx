import GraphContainer from "./components/GraphContainer";
import NodeCustomizationPanel from "./components/NodeCustomizationPanel";

function App() {
  return (
    <div style={{ display: "flex" }}>
      
      <GraphContainer />
      <div style={{ width: "300px", padding: "10px", borderLeft: "1px solid gray", overflowY: "auto" }}>
        <NodeCustomizationPanel />
      </div>
    </div>
  );
}

export default App;
