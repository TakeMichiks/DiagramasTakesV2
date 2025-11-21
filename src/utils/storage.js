export const saveData = (nodes, edges) => {
  localStorage.setItem('nodes', JSON.stringify(nodes));
  localStorage.setItem('edges', JSON.stringify(edges));
};

export const loadData = () => {
  const nodes = JSON.parse(localStorage.getItem('nodes') || '[]');
  const edges = JSON.parse(localStorage.getItem('edges') || '[]');
  return { nodes, edges };
};
