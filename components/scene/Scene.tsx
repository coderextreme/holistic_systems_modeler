
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { ForceGraph } from './ForceGraph';
import type { GraphData, NodeObject } from '../../types';

interface SceneProps {
  graphData: GraphData;
  onNodeClick: (node: NodeObject | null) => void;
  onNodeHover: (node: NodeObject | null) => void;
  selectedNode: NodeObject | null;
  hoveredNode: NodeObject | null;
}

const Loader: React.FC = () => (
    <Text
      position={[0, 0, 0]}
      fontSize={0.5}
      color="white"
      anchorX="center"
      anchorY="middle"
    >
      Loading 3D Scene...
    </Text>
);

export const Scene: React.FC<SceneProps> = ({ graphData, onNodeClick, onNodeHover, selectedNode, hoveredNode }) => {
  return (
    <Suspense fallback={null}>
      <Canvas
        camera={{ position: [0, 0, 200], fov: 50 }}
        className="w-full h-full"
      >
        <ambientLight intensity={1.5} color="#ffffff" />
        <directionalLight position={[0, 10, 5]} intensity={1.5} />
        <pointLight position={[-100, -100, -100]} color="cyan" intensity={1} />
        <pointLight position={[100, 100, 100]} color="magenta" intensity={1} />
        
        {graphData.nodes.length > 0 ? (
          <ForceGraph 
            graphData={graphData} 
            onNodeClick={onNodeClick}
            onNodeHover={onNodeHover}
            selectedNode={selectedNode}
            hoveredNode={hoveredNode}
          />
        ) : (
            <Text
              position={[0, 0, 0]}
              fontSize={0.5}
              color="gray"
              anchorX="center"
              anchorY="middle"
              maxWidth={10}
              textAlign="center"
            >
              No data to display at this time.
            </Text>
        )}

        <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            enableRotate={true}
            minDistance={10}
            maxDistance={1000}
        />
      </Canvas>
    </Suspense>
  );
};
