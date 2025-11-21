import React from "react";
import { Handle, Position } from "react-flow-renderer";

export default function CustomNode({ data }) {
  return (
    <div style={{
      padding: 10,
      border: "1px solid #333",
      borderRadius: 5,
      backgroundColor: "#fff",
      minWidth: 150,
      textAlign: "center",
    }}>
      <Handle type="target" position={Position.Top} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
