import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { updateNodeStyle } from "../store/graphSlice";
import { SketchPicker } from "react-color";

const NodeCustomizationPanel = () => {
  const dispatch = useDispatch();
  const selectedNode = useSelector((state: RootState) =>
    state.graphy.nodes.find((node) => node.selected)
  );

  const handleColorChange = (color: string) => {
    if (selectedNode) {
      dispatch(updateNodeStyle({ id: selectedNode.id, color }));
    }
  };

  const handleFontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedNode) {
      dispatch(updateNodeStyle({ id: selectedNode.id, fontSize: Number(event.target.value) }));
    }
  };
  

  if (!selectedNode) return <p>Select a node to customize</p>;

  return (
    <div className="customization-panel">
      <h3>Customize Node</h3>
      <label>Color</label>
      <SketchPicker color={selectedNode.data.color} onChangeComplete={(color) => handleColorChange(color.hex)} />
      
      <label>Font Size</label>
      <input type="number" min="12" max="24" value={selectedNode.data.fontSize} onChange={handleFontSizeChange} />
    </div>
  );
};

export default NodeCustomizationPanel;
