import React, { useState } from "react";

export default function ModalAgregarTabla({ onClose, onAdd }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onAdd(name);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Agregar Tabla</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre tabla"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit">Agregar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
}
