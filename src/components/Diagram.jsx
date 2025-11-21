import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  Position,
  Handle,
} from "react-flow-renderer";
import { HexColorPicker } from "react-colorful";

// ================= NODE ==================
const NodeContent = ({
  id,
  data,
  isEditing,
  onChangeLabel,
  onFinishEditing,
  onDoubleClick,
  isSelected,
  setNodes,
}) => {
  const commonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: data.locked ? "not-allowed" : "pointer",
    transition: "all 0.2s",
    boxShadow: isSelected ? "0 4px 15px rgba(0,0,0,0.25)" : "none",
    color: data.textColor || "#fff",
    fontWeight: "bold",
  };

  if (isEditing) {
    return (
      <input
        autoFocus
        value={data.tempLabel}
        onChange={(e) => onChangeLabel(e.target.value)}
        onBlur={onFinishEditing}
        onKeyDown={(e) => e.key === "Enter" && onFinishEditing()}
        style={{
          width: data.width || 150,
          height: data.height || 50,
          backgroundColor: data.color || "#4a90e2",
          border: "2px solid #4a90e2",
          borderRadius: data.shape === "diamond" ? 0 : 6,
          textAlign: "center",
          ...commonStyle,
        }}
      />
    );
  }

  const handles = (
    <>
      <Handle
        type="target"
        position={Position.Top}
        id={`top-${id}`}
        style={{ background: "#555" }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id={`left-${id}`}
        style={{ background: "#555" }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id={`right-${id}`}
        style={{ background: "#555" }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id={`bottom-${id}`}
        style={{ background: "#555" }}
      />
    </>
  );

  // Este es el rombo table
  if (data.shape === "diamond") {
    return (
      <div
        onDoubleClick={data.locked ? undefined : onDoubleClick}
        style={{
          width: data.width || 120,
          height: data.height || 120,
          backgroundColor: data.color || "#111111",
          transform: "rotate(45deg)",
          position: "relative",
          ...commonStyle,
        }}
      >
        <div
          style={{
            transform: "rotate(-45deg)",
            textAlign: "center",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {data.label}
        </div>
        {handles}
      </div>
    );
  }

  if (data.shape === "text") {
    return (
      <div
        onDoubleClick={data.locked ? undefined : onDoubleClick}
        style={{
          width: data.width || 150,
          height: data.height || 50,
          backgroundColor: "transparent",
          ...commonStyle,
        }}
      >
        {data.label}
      </div>
    );
  }

  // Nodo Tabla Aqui para editar
  if (data.shape === "table") {
    const rowHeight = 28;
    const headerHeight = 30;
    const rowWidth = data.width || 180;

    return (
      <div
        style={{
          width: rowWidth,
          minHeight: headerHeight + (data.fields?.length || 1) * rowHeight,
          backgroundColor: data.color || "#4a90e2",
          borderRadius: 6,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          color: data.textColor,
          fontSize: 13,
        }}
      >
        <div
          style={{
            height: headerHeight,
            fontWeight: "bold",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 8,
            borderBottom: "1px solid #999",
          }}
        >
          {data.label}
        </div>

        {Array.isArray(data.fields)
          ? data.fields.map((f, i) => {
              const handleY = headerHeight + i * rowHeight + rowHeight / 1.1;

              return (
                <div
                  key={i}
                  style={{
                    height: rowHeight,
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                    alignItems: "center",
                    paddingTop: 3,
                    borderBottom: "1px solid #ccc",
                    backgroundColor: "#eee",
                    transition: "background 0.2s",
                    color: "black",
                  }}
                  onMouseEnter={(e) => (
                    (e.currentTarget.style.backgroundColor = "#000000ff"),
                    (e.currentTarget.style.color = "white")
                  )}
                  onMouseLeave={(e) => (
                    (e.currentTarget.style.backgroundColor = "#ffffffff"),
                    (e.currentTarget.style.color = "black")
                  )}
                >
                  {f}
                  <Handle
                    type="target"
                    position={Position.Left}
                    id={`left-${id}-${i}`}
                    style={{
                      top: handleY + 3.3 * i,
                      left: -3,
                      background: "#000000ff",
                    }}
                  />
                  <Handle
                    type="source"
                    position={Position.Right}
                    id={`right-${id}-${i}`}
                    style={{
                      top: handleY + 3.3 * i,
                      right: -3,
                      background: "#000000ff",
                    }}
                  />
                </div>
              );
            })
          : null}

        <Handle
          type="target"
          position={Position.Top}
          id={`top-${id}`}
          style={{ background: "#555" }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id={`bottom-${id}`}
          style={{ background: "#555" }}
        />
      </div>
    );
  }
  if (data.shape === "number") {
    return (
      <div className="">
        <div
          className="number-input"
          onDoubleClick={data.locked ? undefined : onDoubleClick}
          style={{
            width: data.width || 150,
            background: data.color || "#0000FF",
            color: data.textColor || "#ffffff",
          }}
          className="flex flex-col justify-center items-center p-5 rounded-2xl"
        >
          <div>{data.label}</div>
          <input
            id="number-id"
            name="number"
            type="number"
            min="0"
            max="255"
            value={data.numberValue || 0} // Agregar esta línea
            onChange={(e) => {
              // Agregar este manejador
              setNodes((nds) =>
                nds.map((n) =>
                  n.id === id
                    ? {
                        ...n,
                        data: {
                          ...n.data,
                          numberValue: parseInt(e.target.value) || 0,
                        },
                      }
                    : n,
                ),
              );
            }}
            className="nodrag"
          />
          <Handle type="source" position={Position.Right} />
        </div>
      </div>
    );
  }
  if (data.shape === "range") {
    return (
      <div className="">
        <div
          className="range-input"
          onDoubleClick={data.locked ? undefined : onDoubleClick}
          style={{
            width: data.width || 150,
            background: data.color || "#0000FF",
            color: data.textColor || "#ffffff",
          }}
          className="flex flex-col justify-center items-center p-5 rounded-2xl"
        >
          <div>{data.label}</div>
          <input
            id="range-id"
            name="range"
            type="range"
            min="0"
            max="100"
            value={data.FrecuenziaValue || 0} // Agregar esta línea
            onChange={(e) => {
              // Agregar este manejador
              setNodes((nds) =>
                nds.map((n) =>
                  n.id === id
                    ? {
                        ...n,
                        data: {
                          ...n.data,
                          FrecuenziaValue: parseInt(e.target.value) || 0,
                        },
                      }
                    : n,
                ),
              );
            }}
            className="nodrag"
          />
          <div className="flex justify-end items-end">
          <h3 className="font-stretch-50%">{data.FrecuenziaValue}</h3>
          </div>
          <Handle type="source" position={Position.Right} />
        </div>
      </div>
    );
  }

  if (data.shape === "image") {
    return (
      <div
        style={{
          width: data.width || 150,
          height: data.height || 150,
          backgroundImage: `url(${data.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: 6,
          ...commonStyle,
        }}
      >
        {handles}
      </div>
    );
  }

  return (
    <div
      onDoubleClick={data.locked ? undefined : onDoubleClick}
      style={{
        width: data.width || 150,
        height: data.height || 50,
        backgroundColor: data.color || "#4a90e2",
        borderRadius: 6,
        ...commonStyle,
      }}
    >
      {data.label}
      {handles}
    </div>
  );
};

// ================== DIAGRAM ==================
export default function Diagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const [editingNodeId, setEditingNodeId] = useState(null);
  const [showTableModal, setShowTableModal] = useState(false);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [sizeModalVisible, setSizeModalVisible] = useState(false);
  const [tempColor, setTempColor] = useState("#4a90e2");
  const [tempTextColor, setTempTextColor] = useState("#ffffff");
  const [tempWidth, setTempWidth] = useState(150);
  const [tempHeight, setTempHeight] = useState(50);
  const [loaded, setLoaded] = useState(false);

  const functionsPanelRef = useRef(null);

  // Cargar desde backend
  useEffect(() => {
    fetch("/load-diagram")
      .then((res) => res.json())
      .then((data) => {
        if (data.nodes && data.edges) {
          setNodes(data.nodes.map((n) => ({ ...n, tempLabel: n.data.label })));
          setEdges(data.edges);
        }
        setLoaded(true); // ✅ marcamos que ya cargó
      })
      .catch((err) => {
        console.error("Error al cargar diagrama:", err);
        setLoaded(true);
      });
  }, []);

  // Guardar en backend automáticamente
  useEffect(() => {
    if (!loaded) return; // ✅ evitamos guardar en vacío
    fetch("/save-diagram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nodes, edges }),
    }).catch((err) => console.error("Error al guardar diagrama:", err));
  }, [nodes, edges, loaded]);

  const [highlightedNode, setHighlightedNode] = useState(null);

  const handleNodeEnter = (event, node) => {
    setHighlightedNode(node.id);
  };

  const handleNodeLeave = () => {
    setHighlightedNode(null);
  };

  const nodeTypes = useMemo(
    () => ({
      custom: (props) => (
        <NodeContent
          {...props}
          isEditing={editingNodeId === props.id}
          isSelected={selectedNode?.id === props.id}
          onChangeLabel={(val) =>
            setNodes((nds) =>
              nds.map((n) =>
                n.id === props.id
                  ? { ...n, data: { ...n.data, tempLabel: val } }
                  : n,
              ),
            )
          }
          onFinishEditing={() => {
            setNodes((nds) =>
              nds.map((n) =>
                n.id === editingNodeId
                  ? { ...n, data: { ...n.data, label: n.data.tempLabel } }
                  : n,
              ),
            );
            setEditingNodeId(null);
          }}
          onDoubleClick={(e) => setEditingNodeId(props.id)}
          setNodes={setNodes}
        />
      ),
    }),
    [editingNodeId, selectedNode, setNodes],
  );
  const colors = ["#4a90e2", "#e94e77", "#50e3c2", "#f5a623", "#b8e986"];

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            style: {
              stroke: colors[Math.floor(Math.random() * colors.length)],
              strokeWidth: 2,
            },
          },
          eds,
        ),
      ),
    [setEdges],
  );

  const addNode = (type) => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      type: "custom",
      data: {
        label:
          type === "text"
            ? "Texto"
            : type === "diamond"
              ? "Rombo"
              : type === "table"
                ? "Tabla"
                : type === "image"
                  ? "Imagen"
                  : type === "number"
                    ? "NumberInput"
                    : type === "range"
                      ? "range"
                      : "rectangulo",
        tempLabel:
          type === "text"
            ? "Texto"
            : type === "diamond"
              ? "Rombo"
              : type === "table"
                ? "Tabla"
                : type === "image"
                  ? "Imagen"
                  : type === "number"
                    ? "NumberInput"
                    : type === "range"
                      ? "range"
                      : "rectangulo",

        shape: type,
        numberValue: type === "number" ? 0 : undefined,
        FrecuenziaValue: type === "range" ? 0 : undefined,
        color: type !== "text" ? "#4a90e2" : "transparent",
        locked: false,
        fields: type === "table" ? ["campo1", "campo2"] : undefined,
        src: type === "image" ? "" : undefined,
      },
      position: { x: 100 + nodes.length * 30, y: 100 + nodes.length * 30 },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleImageImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const imageUrl = data.url;

      const newNode = {
        id: (nodes.length + 1).toString(),
        type: "custom",
        data: {
          label: "Imagen",
          tempLabel: "Imagen",
          shape: "image",
          color: "#fff",
          src: imageUrl,
        },
        position: { x: 100 + nodes.length * 30, y: 100 + nodes.length * 30 },
      };
      setNodes((nds) => [...nds, newNode]);
    } catch (err) {
      console.error("Error al subir imagen:", err);
    }
  };

  const deleteNode = () => {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) =>
      eds.filter(
        (e) => e.source !== selectedNode.id && e.target !== selectedNode.id,
      ),
    );
    setSelectedNode(null);
  };

  const duplicateNode = () => {
    if (!selectedNode) return;
    const newId = (nodes.length + 1).toString();
    setNodes((nds) => [
      ...nds,
      {
        ...selectedNode,
        id: newId,
        position: {
          x: selectedNode.position.x + 50,
          y: selectedNode.position.y + 50,
        },
        data: { ...selectedNode.data, tempLabel: selectedNode.data.label },
      },
    ]);
    setSelectedNode(null);
  };

  const openColorPicker = () => {
    if (!selectedNode) return;
    setTempColor(selectedNode.data.color || "#4a90e2");
    setTempTextColor(selectedNode.data.textColor || "#fff");
    setColorPickerVisible(true);
  };

  const changeSize = () => {
    if (!selectedNode) return;
    setTempWidth(selectedNode.data.width || 150);
    setTempHeight(selectedNode.data.height || 50);
    setSizeModalVisible(true);
  };

  useEffect(() => {
    if (selectedNode && colorPickerVisible) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === selectedNode.id
            ? {
                ...n,
                data: { ...n.data, color: tempColor, textColor: tempTextColor },
              }
            : n,
        ),
      );
    }
  }, [tempColor, tempTextColor]);

  const toggleLockNode = () => {
    if (!selectedNode) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode.id
          ? { ...n, data: { ...n.data, locked: !n.data.locked } }
          : n,
      ),
    );
    setSelectedNode(null);
  };

  const exportDiagram = () => {
    navigator.clipboard.writeText(JSON.stringify({ nodes, edges }, null, 2));
    alert("Diagrama copiado al portapapeles!");
  };

  const importDiagram = () => {
    const json = prompt("Pega el JSON del diagrama:");
    if (!json) return;
    try {
      const data = JSON.parse(json);
      if (data.nodes && data.edges) {
        setNodes(data.nodes.map((n) => ({ ...n, tempLabel: n.data.label })));
        setEdges(data.edges);
      } else {
        alert("JSON inválido.");
      }
    } catch (err) {
      alert("Error al parsear JSON: " + err.message);
    }
  };

  const onNodeRightClick = (event, node) => {
    event.preventDefault(); // evita que se abra el menú del navegador
    setSelectedNode(node);
    setMenuPos({ x: event.clientX, y: event.clientY });
  };
  const handleDiagramClick = (event) => {
    // Si se hizo clic en el canvas y no en un nodo
    if (!event.target.closest(".react-flow__node")) {
      setSelectedNode(null); // cerrar panel de funciones
    }
  };

  const handleClickOutside = (event) => {
    if (
      functionsPanelRef.current &&
      !functionsPanelRef.current.contains(event.target) &&
      !showTableModal &&
      !colorPickerVisible &&
      !sizeModalVisible
    ) {
      setSelectedNode(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showTableModal, colorPickerVisible, sizeModalVisible]);

  const saveTableModal = (updatedData) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode.id
          ? {
              ...n,
              data: {
                ...n.data,
                label: updatedData.name,
                tempLabel: updatedData.name,
                fields: updatedData.fields,
              },
            }
          : n,
      ),
    );
    setShowTableModal(false);
  };
  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      {/* Panel lateral */}
      <div style={{ width: 160, background: "#000000ff", padding: 10 }}>
        <button
          onClick={() => addNode("rectangle")}
          style={{ width: "100%", marginBottom: 5 }}
        >
          🟦 Rectángulo
        </button>
        <button
          onClick={() => addNode("diamond")}
          style={{ width: "100%", marginBottom: 5 }}
        >
          🔷 Rombo
        </button>
        <button
          onClick={() => addNode("range")}
          style={{ width: "100%", marginBottom: 5 }}
        >
          📏 Range
        </button>
        <button
          onClick={() => addNode("number")}
          style={{ width: "100%", marginBottom: 5 }}
        >
        🧮  Number
        </button>
        <button
          onClick={() => addNode("table")}
          style={{ width: "100%", marginBottom: 5 }}
        >
          🗂 Tabla
        </button>
        <label
          htmlFor="imageUpload"
          style={{
            display: "inline-block",
            padding: "8px 12px",
            backgroundColor: "#4a90e2",
            color: "white",
            borderRadius: "6px",
            cursor: "pointer",
            textAlign: "center",
            width: "85%",
            marginBottom: 5,
          }}
        >
          📷 Subir Imagen
        </label>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={handleImageImport}
          style={{ display: "none" }}
        />

        <button
          onClick={exportDiagram}
          style={{ width: "100%", marginBottom: 5 }}
        >
          💾 Exportar
        </button>
        <button
          onClick={importDiagram}
          style={{ width: "100%", marginBottom: 5 }}
        >
          📥 Importar
        </button>
      </div>

      <div style={{ flex: 1, position: "relative" }}>
        <ReactFlow
          nodes={nodes.map((n) => ({ ...n, draggable: !n.data.locked }))}
          edges={edges.map((e) => {
            const isConnected =
              highlightedNode &&
              (e.source === highlightedNode || e.target === highlightedNode);

            return {
              ...e,
              animated: isConnected, // 🔥 animar si está conectado al nodo hovered
              style: {
                ...e.style,
                stroke: isConnected ? "#ff0000" : e.style?.stroke, // rojo si está animado
                strokeWidth: isConnected ? 3 : 2,
              },
            };
          })}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeDoubleClick={(event, edge) => {
            // eliminar la arista doble clic
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
          }}
          nodeTypes={nodeTypes}
          onNodeContextMenu={onNodeRightClick}
          onClick={handleDiagramClick} // clic izquierdo sobre el lienzo
          onNodeMouseEnter={handleNodeEnter} // 👈 añadir
          onNodeMouseLeave={handleNodeLeave} // 👈 añadir
          fitView
        >
          {/* MiniMap mejorado */}
          <MiniMap
            nodeColor={(n) => {
              if (n.data.shape === "text") return "#ffffff";
              if (n.data.shape === "image") return "#888888";
              return n.data.color || "#4a90e2";
            }}
            nodeStrokeColor={(n) => (n.selected ? "#ff0000" : "#333")}
            nodeBorderRadius={2}
            maskColor="rgba(0, 0, 0, 0.35)"
            style={{
              backgroundColor: "#1e1e1e",
              border: "2px solid #4a90e2",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              width: 220,
              height: 160,
              bottom: 15,
              right: 15,
            }}
          />
          <Controls />
          <Background />
        </ReactFlow>
        {/* Panel funciones */}
        {selectedNode && (
          <div
            ref={functionsPanelRef}
            style={{
              position: "absolute",
              top: menuPos.y - 15,
              left: menuPos.x - 150,
              background: "#000000ff",
              border: "1px solid #ccc",
              borderRadius: 6,
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              padding: 5,
              zIndex: 1000,
            }}
          >
            <button
              onClick={() => setEditingNodeId(selectedNode.id)}
              style={{ display: "block", width: "100%" }}
            >
              ✏️ Editar
            </button>
            {selectedNode.data.shape === "table" && (
              <button
                onClick={() => setShowTableModal(true)}
                style={{ display: "block", width: "100%" }}
              >
                🗂 Editar Tabla
              </button>
            )}
            <button
              onClick={duplicateNode}
              style={{ display: "block", width: "100%" }}
            >
              📄 Duplicar
            </button>
            <button
              onClick={deleteNode}
              style={{ display: "block", width: "100%" }}
            >
              🗑 Eliminar
            </button>
            <button
              onClick={openColorPicker}
              style={{ display: "block", width: "100%" }}
            >
              🎨 Color
            </button>
            <button
              onClick={changeSize}
              style={{ display: "block", width: "100%" }}
            >
              📏 Tamaño
            </button>
            <button
              onClick={toggleLockNode}
              style={{ display: "block", width: "100%" }}
            >
              {selectedNode.data.locked ? "🔓 Desbloquear" : "🔒 Bloquear"}
            </button>
          </div>
        )}

        {/* Modal tabla */}
        {showTableModal && selectedNode && (
          <TableModal
            fields={selectedNode.data.fields || []}
            tableName={selectedNode.data.label}
            onClose={saveTableModal}
          />
        )}

        {/* Modal color */}
        {colorPickerVisible && selectedNode && (
          <ColorPickerModal
            tempColor={tempColor}
            tempTextColor={tempTextColor}
            setTempColor={setTempColor}
            setTempTextColor={setTempTextColor}
            onClose={() => setColorPickerVisible(false)}
          />
        )}

        {/* Modal tamaño */}
        {sizeModalVisible && selectedNode && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#000000ff",
              padding: 20,
              borderRadius: 10,
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              zIndex: 2000,
              width: 350,
            }}
          >
            <h3>Ajustar Tamaño</h3>
            <div style={{ marginBottom: 10 }}>
              <label>Ancho: </label>
              <input
                type="number"
                value={tempWidth}
                onChange={(e) => setTempWidth(parseInt(e.target.value))}
                style={{ width: 80, marginRight: 10 }}
              />
              <label>Alto: </label>
              <input
                type="number"
                value={tempHeight}
                onChange={(e) => setTempHeight(parseInt(e.target.value))}
                style={{ width: 80 }}
              />
            </div>

            <div
              style={{
                border: "1px solid #fff",
                marginBottom: 10,
                padding: 10,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 50,
                width: tempWidth,
                height: tempHeight,
                backgroundColor: selectedNode.data.color || "#4a90e2",
                borderRadius: selectedNode.data.shape === "diamond" ? 0 : 6,
                color: selectedNode.data.textColor || "#fff",
                fontWeight: "bold",
                textAlign: "center",
                overflow: "hidden",
              }}
            >
              {selectedNode.data.shape === "table" ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <strong>{selectedNode.data.label}</strong>
                  {selectedNode.data.fields?.map((f, i) => (
                    <div key={i} style={{ fontSize: 12, minHeight: 24 }}>
                      {f}
                    </div>
                  ))}
                </div>
              ) : selectedNode.data.shape === "image" ? (
                <img
                  src={selectedNode.data.src}
                  alt="preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                selectedNode.data.label
              )}
            </div>

            <div>
              <button
                onClick={() => {
                  setNodes((nds) =>
                    nds.map((n) =>
                      n.id === selectedNode.id
                        ? {
                            ...n,
                            data: {
                              ...n.data,
                              width: tempWidth,
                              height: tempHeight,
                            },
                          }
                        : n,
                    ),
                  );
                  setSizeModalVisible(false);
                }}
                style={{ marginRight: 5 }}
              >
                💾 Guardar
              </button>
              <button onClick={() => setSizeModalVisible(false)}>
                ❌ Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Modal tabla
function TableModal({ fields, onClose, tableName = "Tabla" }) {
  const [localFields, setLocalFields] = useState(
    Array.isArray(fields) ? fields : [],
  );
  const [localTableName, setLocalTableName] = useState(tableName);

  const lastInputRef = useRef(null);

  // ✅ Sincronizar estado cuando cambian las props
  useEffect(() => {
    setLocalTableName(tableName);
    setLocalFields(Array.isArray(fields) ? fields : []);
  }, [tableName, fields]);

  const removeField = (index) => {
    setLocalFields(localFields.filter((_, i) => i !== index));
  };

  const addField = () => {
    setLocalFields((prev) => [...prev, ""]);
  };

  // ✅ Enfocar automáticamente el último input agregado
  useEffect(() => {
    if (lastInputRef.current) {
      lastInputRef.current.focus();
    }
  }, [localFields.length]);

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "#222",
        padding: 20,
        borderRadius: 12,
        color: "#fff",
        zIndex: 3000,
        minWidth: 320,
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
      }}
    >
      {/* Nombre de la tabla editable */}
      <input
        value={localTableName}
        onChange={(e) => setLocalTableName(e.target.value)}
        style={{
          width: "100%",
          marginBottom: 15,
          padding: "8px 12px",
          borderRadius: 6,
          border: "1px solid #555",
          backgroundColor: "#333",
          color: "#fff",
          fontSize: 16,
          fontWeight: "bold",
          textAlign: "center",
        }}
      />

      {/* Campos */}
      {localFields.map((field, i) => (
        <div
          key={i}
          style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
        >
          <input
            ref={i === localFields.length - 1 ? lastInputRef : null} // ✅ Asignar ref solo al último input
            value={field}
            onChange={(e) => {
              const newFields = [...localFields];
              newFields[i] = e.target.value;
              setLocalFields(newFields);
            }}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #555",
              backgroundColor: "#333",
              color: "#fff",
              fontSize: 14,
            }}
          />
          <button onClick={() => removeField(i)}>❌</button>
        </div>
      ))}

      {/* Botones */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <button
          onClick={addField}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "none",
            backgroundColor: "#50e3c2",
            color: "#000",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ➕ Agregar Campo
        </button>

        <div>
          <button
            onClick={() =>
              onClose({ name: localTableName, fields: localFields })
            }
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "none",
              backgroundColor: "#4a90e2",
              color: "#fff",
              fontWeight: "bold",
              marginRight: 5,
            }}
          >
            💾 Guardar
          </button>

          <button
            onClick={() => onClose({ name: tableName, fields })}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "none",
              backgroundColor: "#e94e77",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            ❌ Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal color
function ColorPickerModal({
  tempColor,
  tempTextColor,
  setTempColor,
  setTempTextColor,
  onClose,
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "#222",
        padding: 20,
        borderRadius: 8,
        color: "#fff",
        zIndex: 3000,
      }}
    >
      <h3>Seleccionar Color</h3>
      <label>Fondo:</label>
      <HexColorPicker color={tempColor} onChange={setTempColor} />
      <input
        type="color"
        value={tempColor}
        onChange={(e) => setTempColor(e.target.value)}
      />
      <label>Texto:</label>
      <HexColorPicker color={tempTextColor} onChange={setTempTextColor} />
      <input
        type="color"
        value={tempTextColor}
        onChange={(e) => setTempTextColor(e.target.value)}
      />
      <button onClick={onClose}>💾 Guardar</button>
    </div>
  );
}
