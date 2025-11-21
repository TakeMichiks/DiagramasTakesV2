import React, { useCallback } from 'react';
import ReactFlow, {
  addEdge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';
import { v4 as uuidv4 } from 'uuid';
import TableNode from './TableNode';

const initialNodes = [];
const initialEdges = [];

const nodeTypes = {
  table: TableNode,
};

export default function DiagramConTablas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Actualizar datos del nodo personalizado
  const updateNodeData = (id, data) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...data } } : n))
    );
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addTableNode = () => {
    const newNode = {
      id: uuidv4(),
      type: 'table',
      position: { x: 50, y: 50 },
      data: { label: 'Nueva Tabla', fields: [], updateNodeData },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div style={{ height: '80vh', border: '1px solid #ddd', marginTop: 20 }}>
      <div style={{ marginBottom: 10 }}>
        <button onClick={addTableNode}>Agregar Tabla</button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
}
