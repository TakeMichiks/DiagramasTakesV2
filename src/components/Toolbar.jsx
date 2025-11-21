import React from "react";

export default function Toolbar({ onUndo, onRedo, onExport }) {
  return (
    <div style={{ padding: "10px", borderBottom: "1px solid #ccc", display: "flex", gap: "10px" }}>
      <button onClick={onUndo}>Undo</button>
      <button onClick={onRedo}>Redo</button>
      <button onClick={onExport}>Export JSON</button>
    </div>
  );
}
