import { useState } from 'react';

export function useUndoRedo(initialState) {
  const [history, setHistory] = useState([initialState]);
  const [index, setIndex] = useState(0);

  const current = history[index];

  const set = (newState) => {
    const newHistory = history.slice(0, index + 1);
    setHistory([...newHistory, newState]);
    setIndex(newHistory.length);
  };

  const undo = () => index > 0 && setIndex(i => i - 1);
  const redo = () => index < history.length - 1 && setIndex(i => i + 1);

  return [current, set, undo, redo];
}
