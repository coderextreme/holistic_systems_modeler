
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="p-3 bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 z-30">
      <h1 className="text-xl font-bold text-cyan-400">Holistic System Modeler</h1>
      <p className="text-xs text-gray-400">A 3D/4D conceptual proof-of-concept for complex system visualization</p>
    </header>
  );
};
