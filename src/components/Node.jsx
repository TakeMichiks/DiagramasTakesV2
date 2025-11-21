import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

export default function Node({ data }) {
  return (
    <div style={{ padding: 10, border: '1px solid #777', borderRadius: 5, backgroundColor: '#fff' }}>
      {data.label}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
