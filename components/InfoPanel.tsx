
import React from 'react';
import type { NodeObject } from '../types';
import { TagIcon } from './icons/Icons';

interface InfoPanelProps {
  node: NodeObject | null;
}

const InfoCell: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="py-2 px-3 bg-gray-800/50 rounded-md">
    <p className="text-xs text-gray-400 font-medium">{label}</p>
    <p className="text-sm text-gray-100 truncate">{value}</p>
  </div>
);

export const InfoPanel: React.FC<InfoPanelProps> = ({ node }) => {
  return (
    <aside 
      className={`w-72 p-4 bg-gray-900/50 backdrop-blur-sm border-l border-gray-700/50 z-20 transition-transform duration-300 ease-in-out ${
        node ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Node Details</h2>
      {node ? (
        <div className="space-y-3">
          <InfoCell label="Name" value={node.name} />
          <InfoCell label="ID" value={node.id} />
          <InfoCell label="Type" value={node.type} />
          <div className="py-2 px-3 bg-gray-800/50 rounded-md">
              <p className="text-xs text-gray-400 font-medium">Description</p>
              <p className="text-sm text-gray-100">{node.description}</p>
          </div>
          <InfoCell label="Size Value" value={node.val} />
          <InfoCell label="Start Time" value={node.startTime} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
            <TagIcon className="w-12 h-12 mb-4"/>
            <p className="text-sm">Click on a node in the graph to see its details.</p>
        </div>
      )}
    </aside>
  );
};
