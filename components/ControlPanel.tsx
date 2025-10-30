
import React from 'react';
import type { Domain } from '../types';

interface ControlPanelProps {
  domains: Domain[];
  selectedDomainId: string;
  onSelectDomain: (domain: Domain) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ domains, selectedDomainId, onSelectDomain }) => {
  return (
    <aside className="w-56 p-4 bg-gray-900/50 backdrop-blur-sm border-r border-gray-700/50 z-20 overflow-y-auto">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Domains</h2>
      <nav className="flex flex-col space-y-2">
        {domains.map(domain => {
          const isSelected = domain.id === selectedDomainId;
          return (
            <button
              key={domain.id}
              onClick={() => onSelectDomain(domain)}
              className={`flex items-center space-x-3 p-2 rounded-lg text-left transition-colors duration-200 ${
                isSelected 
                  ? 'bg-cyan-500/20 text-cyan-300' 
                  : 'text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <domain.icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{domain.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
