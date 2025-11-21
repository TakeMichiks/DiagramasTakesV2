import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

export default function GroupNode({ data }) {
  return (
    <div style={{
      padding: 10,
      border: '2px dashed #555',
      borderRadius: 10,
      backgroundColor: '#f0f0f0',
      minWidth: 150
    }}>
      {data.label}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
