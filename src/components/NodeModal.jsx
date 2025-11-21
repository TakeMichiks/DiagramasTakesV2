import React from "react";
import NodeForm from "./NodeForm";

export default function NodeModal({ onClose, onSubmit, initialData }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: 20,
          borderRadius: 8,
          minWidth: 300,
        }}
      >
        <NodeForm
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
