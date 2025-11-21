import { useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';

export default function TableNode({ data }) {
  const { label, fields, textcolor , updateNodeData } = data;
  const [fieldList, setFieldList] = useState(fields || []);
  const [newField, setNewField] = useState('');

  const addField = () => {
    if (newField.trim() === '') return;
    const id = `${label}_${newField}_${Math.random()}`;
    const updatedFields = [...fieldList, { id, name: newField }];
    setFieldList(updatedFields);
    updateNodeData(data.id, { fields: updatedFields });
    setNewField('');
  };

  return (
    <div
      style={{
        padding: '10px',
        border: '1px solid #888',
        borderRadius: '5px',
        backgroundColor: '#fff',
        minWidth: '150px',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: 5 }}>{label}</div>

      {fieldList.map((f) => (
        <div
          key={f.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 3,
            justifyContent: 'space-between',
          }}
        >
          <span>{f.name}</span>
          {/* Handle derecho para conectar */}
          <Handle
            type="source"
            position={Position.Right}
            id={f.id}
            style={{ background: '#555', width: 10, height: 10 }}
          />
          {/* Handle izquierdo para recibir conexión */}
          <Handle
            type="target"
            position={Position.Left}
            id={f.id}
            style={{ background: '#555', width: 10, height: 10 }}
          />
        </div>
      ))}

      <div style={{ marginTop: 5 }}>
        <input
          value={newField}
          onChange={(e) => setNewField(e.target.value)}
          placeholder="Agregar campo"
          style={{ width: '80%' }}
        />
        <button onClick={addField} style={{ marginLeft: 5 }}>
          +
        </button>
      </div>
    </div>
  );
}
