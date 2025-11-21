import React from 'react';
import { v4 as uuid } from 'uuid';

export default function Sidebar({ addNode, addGroup }) {
  return (
    <div style={{ padding: 10, width: 200, borderRight: '1px solid #ccc' }}>
      <button onClick={() => addNode({ id: uuid(), label: 'Nuevo Nodo', type: 'default', position: { x: 50, y: 50 } })}>
        Agregar Nodo
      </button>
      <br/><br/>
      <button onClick={() => addGroup({ id: uuid(), label: 'Nuevo Grupo', type: 'group', position: { x: 100, y: 100 } })}>
        Agregar Grupo
      </button>
    </div>
  );
}
