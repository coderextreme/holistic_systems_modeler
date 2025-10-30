import type { ComponentType } from 'react';
// The ForceGraph3D library is used as a constructor.
import ForceGraph3D from 'three-forcegraph';

// Extending the base NodeObject from the library
export interface NodeObject {
  id: string;
  name: string;
  type: string;
  description: string;
  val: number; // Represents node size
  startTime: number;
  // Optional properties from three-forcegraph that might be added at runtime
  x?: number;
  y?: number;
  z?: number;
  vx?: number;
  vy?: number;
  vz?: number;
  index?: number;
}

export interface LinkObject {
  source: string | NodeObject;
  target: string | NodeObject;
}

export interface GraphData {
  nodes: NodeObject[];
  links: LinkObject[];
}

export interface Domain {
    id: string;
    name: string;
    icon: ComponentType<{ className?: string }>;
    data: GraphData;
}

// The instance type is the created object from the constructor.
// FIX: Use InstanceType for a class constructor. 'ForceGraph3D' is a class, not a function.
export type ForceGraphInstance = InstanceType<typeof ForceGraph3D>;