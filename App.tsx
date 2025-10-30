
import React, { useState, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { InfoPanel } from './components/InfoPanel';
import { Timeline } from './components/Timeline';
import { Scene } from './components/scene/Scene';
import { domains } from './data/domainData';
import type { NodeObject, Domain } from './types';

const App: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<Domain>(domains[0]);
  const [selectedNode, setSelectedNode] = useState<NodeObject | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(100);
  const [hoveredNode, setHoveredNode] = useState<NodeObject | null>(null);

  const handleSelectDomain = useCallback((domain: Domain) => {
    setSelectedDomain(domain);
    setSelectedNode(null);
    setHoveredNode(null);
  }, []);

  const handleTimeChange = useCallback((newTime: number) => {
    setCurrentTime(newTime);
    setSelectedNode(null);
    setHoveredNode(null);
  }, []);

  const handleNodeClick = useCallback((node: NodeObject | null) => {
    setSelectedNode(node);
  }, []);

  const handleNodeHover = useCallback((node: NodeObject | null) => {
    setHoveredNode(node);
  }, []);

  const filteredData = useMemo(() => {
    const { nodes, links } = selectedDomain.data;
    const visibleNodes = nodes.filter(node => node.startTime <= currentTime);
    const visibleNodeIds = new Set(visibleNodes.map(n => n.id));
    
    const visibleLinks = links.filter(link => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        return visibleNodeIds.has(sourceId) && visibleNodeIds.has(targetId);
    });

    return { nodes: visibleNodes, links: visibleLinks };
  }, [selectedDomain, currentTime]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden font-sans bg-gray-900">
      <Header />
      <div className="flex flex-1 relative overflow-hidden">
        <ControlPanel
          domains={domains}
          selectedDomainId={selectedDomain.id}
          onSelectDomain={handleSelectDomain}
        />
        <main className="flex-1 relative bg-gray-800/30">
          <Scene 
            graphData={filteredData} 
            onNodeClick={handleNodeClick}
            onNodeHover={handleNodeHover}
            selectedNode={selectedNode}
            hoveredNode={hoveredNode}
          />
        </main>
        <InfoPanel node={selectedNode} />
      </div>
      <Timeline 
        currentTime={currentTime}
        onTimeChange={handleTimeChange}
      />
    </div>
  );
};

export default App;
