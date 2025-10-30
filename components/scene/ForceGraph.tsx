import React, { useEffect, useRef, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import ForceGraph3D from 'three-forcegraph';
import * as THREE from 'three';
import type { GraphData, NodeObject, LinkObject, ForceGraphInstance } from '../../types';

interface ForceGraphProps {
  graphData: GraphData;
  onNodeClick: (node: NodeObject | null) => void;
  onNodeHover: (node: NodeObject | null) => void;
  selectedNode: NodeObject | null;
  hoveredNode: NodeObject | null;
}

// Define materials for different node types
const materials: { [key: string]: THREE.MeshPhongMaterial } = {
  Module: new THREE.MeshPhongMaterial({ color: '#1E90FF', transparent: true, opacity: 0.9 }), // DodgerBlue
  Class: new THREE.MeshPhongMaterial({ color: '#32CD32', transparent: true, opacity: 0.9 }), // LimeGreen
  Function: new THREE.MeshPhongMaterial({ color: '#FFD700', transparent: true, opacity: 0.9 }), // Gold
  Interface: new THREE.MeshPhongMaterial({ color: '#FF4500', transparent: true, opacity: 0.9 }), // OrangeRed
  Default: new THREE.MeshPhongMaterial({ color: '#9932CC', transparent: true, opacity: 0.9 }), // DarkOrchid
};

const getMaterial = (type: string) => materials[type] || materials.Default;

export const ForceGraph: React.FC<ForceGraphProps> = ({ graphData, onNodeClick, onNodeHover, selectedNode, hoveredNode }) => {
  const { scene, gl, camera } = useThree();
  const graphRef = useRef<ForceGraphInstance | null>(null);

  const memoizedNodeThreeObject = useCallback((node: NodeObject) => {
    const material = getMaterial(node.type);
    const size = Math.max(1, Math.log(node.val + 1) * 1.5);
    const geometry = new THREE.SphereGeometry(size, 16, 8);
    const mesh = new THREE.Mesh(geometry, material.clone());
    
    // Attach node data to the mesh for raycasting
    (mesh as any).__data = node;

    // Create label sprite
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
        const fontSize = 24;
        context.font = `Bold ${fontSize}px Arial`;
        const textWidth = context.measureText(node.name).width;
        canvas.width = textWidth + 20;
        canvas.height = fontSize + 16;

        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = `Bold ${fontSize}px Arial`;
        context.fillStyle = 'rgba(255, 255, 255, 0.95)';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(node.name, canvas.width / 2, canvas.height / 2);
    }
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(canvas.width / 8, canvas.height / 8, 1.0);
    sprite.position.set(0, size + 5, 0);
    sprite.visible = false;
    mesh.add(sprite);
    
    (mesh as any).__labelSprite = sprite;
    
    return mesh;
  }, []);

  // Initialization effect
  useEffect(() => {
    // FIX: Instantiate ForceGraph3D by calling its constructor with 'new'.
    const graph = new ForceGraph3D();
    graphRef.current = graph;
    
    // Configure the graph instance once
    graph.graphData({ nodes: [], links: [] });
    graph.linkWidth(0.5);
    graph.linkDirectionalParticles(2);
    graph.linkDirectionalParticleWidth(0.8);
    graph.linkDirectionalParticleSpeed(0.006);
    graph.nodeThreeObject(memoizedNodeThreeObject);
      
    scene.add(graph);

    return () => {
        // Clean up
        if(graphRef.current) {
            scene.remove(graphRef.current);
            graphRef.current.graphData({nodes:[], links:[]});
        }
    };
  }, [scene, memoizedNodeThreeObject]);
  
  // Manual raycasting for interaction
  useEffect(() => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleInteraction = (event: PointerEvent, callback: (node: NodeObject | null) => void) => {
        if (!graphRef.current) return;

        const canvas = gl.domElement;
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / canvas.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const nodes = graphRef.current.graphData().nodes;
        const nodeObjects = nodes.map((node: any) => node.__threeObj).filter(Boolean);
        
        const intersects = raycaster.intersectObjects(nodeObjects);

        if (intersects.length > 0) {
            const intersectedNode = (intersects[0].object as any).__data as NodeObject;
            callback(intersectedNode);
        } else {
            callback(null);
        }
    };

    const handlePointerDown = (event: PointerEvent) => handleInteraction(event, onNodeClick);
    const handlePointerMove = (event: PointerEvent) => handleInteraction(event, onNodeHover);

    const canvas = gl.domElement;
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);

    return () => {
        canvas.removeEventListener('pointerdown', handlePointerDown);
        canvas.removeEventListener('pointermove', handlePointerMove);
    };
  }, [gl, camera, onNodeClick, onNodeHover]);


  // Data update effect
  useEffect(() => {
    if (graphRef.current) {
        graphRef.current.graphData(graphData);
    }
  }, [graphData]);

  // Handle visual updates for selection and hover
  useEffect(() => {
    if (!graphRef.current) return;

    const hasSelection = selectedNode !== null;
    
    const adjacentNodeIds = new Set<string>();
    if (selectedNode) {
        adjacentNodeIds.add(selectedNode.id);
        graphRef.current.graphData().links.forEach((link: LinkObject) => {
            const sourceId = typeof link.source === 'object' ? (link.source as NodeObject).id : String(link.source);
            const targetId = typeof link.target === 'object' ? (link.target as NodeObject).id : String(link.target);
            if (sourceId === selectedNode.id) adjacentNodeIds.add(targetId);
            if (targetId === selectedNode.id) adjacentNodeIds.add(sourceId);
        });
    }

    graphRef.current.graphData().nodes.forEach((node: NodeObject) => {
        const threeObj = (node as any).__threeObj as THREE.Mesh;
        if (threeObj) {
            const material = threeObj.material as THREE.MeshPhongMaterial;
            const labelSprite = (threeObj as any).__labelSprite as THREE.Sprite;

            const isSelected = selectedNode?.id === node.id;
            const isHovered = hoveredNode?.id === node.id;
            const isAdjacent = adjacentNodeIds.has(node.id);

            material.emissive.setHex(0x000000);
            material.opacity = 0.9;

            if (hasSelection && !isAdjacent) {
                material.opacity = 0.15;
            }
            if (isHovered) {
                material.emissive.setHex(0x666666);
            }
            if (isSelected) {
                material.emissive.setHex(0xcccccc);
                material.opacity = 1.0;
            }
            if (labelSprite) {
                labelSprite.visible = isSelected || isHovered;
            }
        }
    });

    graphRef.current.linkColor((link: LinkObject) => {
        const sourceId = typeof link.source === 'object' ? (link.source as NodeObject).id : String(link.source);
        const targetId = typeof link.target === 'object' ? (link.target as NodeObject).id : String(link.target);

        if (hasSelection && selectedNode && (sourceId === selectedNode.id || targetId === selectedNode.id)) {
            return 'rgba(255, 255, 255, 0.8)';
        }
        return 'rgba(255, 255, 255, 0.2)';
    });

  }, [selectedNode, hoveredNode, graphData]);

  useFrame(() => {
    if (graphRef.current) {
      // FIX: The method to advance the physics simulation is called `tickFrame`, not `tick`.
      graphRef.current.tickFrame();
    }
  });

  return null;
};
