import React, { useState } from "react";

export default function NodeForm({ initialData, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Título:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
          required
        />
      </div>
      <div>
        <label>Descripción:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />
      </div>
      <button type="submit" style={{ marginRight: 10 }}>
        Guardar
      </button>
      <button type="button" onClick={onCancel}>
        Cancelar
      </button>
    </form>
  );
}
