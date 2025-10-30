
import React from 'react';

interface TimelineProps {
  currentTime: number;
  onTimeChange: (time: number) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ currentTime, onTimeChange }) => {
  return (
    <footer className="p-3 bg-gray-900/50 backdrop-blur-sm border-t border-gray-700/50 z-30 flex items-center space-x-4">
      <label htmlFor="timeline" className="text-sm font-medium text-gray-400 whitespace-nowrap">Time</label>
      <input
        id="timeline"
        type="range"
        min="0"
        max="100"
        value={currentTime}
        onChange={(e) => onTimeChange(parseInt(e.target.value, 10))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
      />
      <span className="text-sm font-mono bg-gray-800 text-cyan-300 px-2 py-1 rounded w-16 text-center">{currentTime}</span>
    </footer>
  );
};
