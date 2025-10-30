
import type { Domain } from '../types';
import { CodeIcon, UserGroupIcon, CubeIcon } from '../components/icons/Icons';

const softwareData = {
  nodes: [
    { id: 'app', name: 'Application', type: 'Entrypoint', val: 10, startTime: 0, description: 'The main application entry point.' },
    { id: 'moduleA', name: 'Auth Module', type: 'Module', val: 8, startTime: 10, description: 'Handles user authentication and authorization.' },
    { id: 'moduleB', name: 'API Module', type: 'Module', val: 8, startTime: 10, description: 'Provides the core API endpoints.' },
    { id: 'classA', name: 'User Class', type: 'Class', val: 5, startTime: 20, description: 'Represents a user entity.' },
    { id: 'classB', name: 'Product Class', type: 'Class', val: 5, startTime: 25, description: 'Represents a product entity.' },
    { id: 'funcA', name: 'login()', type: 'Function', val: 3, startTime: 30, description: 'Function to log a user in.' },
    { id: 'funcB', name: 'getProduct()', type: 'Function', val: 3, startTime: 35, description: 'Fetches product details.' },
    { id: 'db', name: 'Database', type: 'Persistence', val: 7, startTime: 5, description: 'The primary data store.' },
    { id: 'iface', name: 'Repository Interface', type: 'Interface', val: 4, startTime: 15, description: 'Abstracts data access logic.' },
    { id: 'var', name: 'API_KEY', type: 'Constant', val: 2, startTime: 40, description: 'Constant for external API key.' },
  ],
  links: [
    { source: 'app', target: 'moduleA' },
    { source: 'app', target: 'moduleB' },
    { source: 'moduleA', target: 'classA' },
    { source: 'moduleB', target: 'classB' },
    { source: 'classA', target: 'funcA' },
    { source: 'classB', target: 'funcB' },
    { source: 'moduleA', target: 'iface' },
    { source: 'moduleB', target: 'iface' },
    { source: 'iface', target: 'db' },
    { source: 'funcB', target: 'var' },
  ],
};

const hrData = {
  nodes: [
    { id: 'employer', name: 'Tech Corp', type: 'Employer', val: 10, startTime: 0, description: 'The hiring company.' },
    { id: 'recruit', name: 'Recruiting Dept', type: 'Department', val: 8, startTime: 10, description: 'Manages the hiring process.' },
    { id: 'projA', name: 'Project Phoenix', type: 'Project', val: 7, startTime: 5, description: 'A major ongoing project.' },
    { id: 'emp1', name: 'Alice', type: 'Employee', val: 5, startTime: 50, description: 'A senior software engineer.' },
    { id: 'emp2', name: 'Bob', type: 'Employee', val: 5, startTime: 60, description: 'A project manager.' },
    { id: 'cand1', name: 'Charlie', type: 'Candidate', val: 4, startTime: 20, description: 'A candidate for an engineering role.' },
    { id: 'resume1', name: 'Charlie\'s Resume', type: 'Document', val: 3, startTime: 25, description: 'Details Charlie\'s qualifications.' },
    { id: 'interview1', name: 'Technical Interview', type: 'Meeting', val: 4, startTime: 35, description: 'Technical screening for Charlie.' },
    { id: 'offer', name: 'Job Offer', type: 'Document', val: 3, startTime: 45, description: 'Official job offer sent to Charlie.' },
  ],
  links: [
    { source: 'employer', target: 'recruit' },
    { source: 'employer', target: 'projA' },
    { source: 'recruit', target: 'cand1' },
    { source: 'cand1', target: 'resume1' },
    { source: 'recruit', target: 'interview1' },
    { source: 'cand1', target: 'interview1' },
    { source: 'interview1', target: 'offer' },
    { source: 'offer', target: 'emp1' },
    { source: 'projA', target: 'emp1' },
    { source: 'projA', target: 'emp2' },
  ],
};

const plmData = {
    nodes: [
        { id: 'product', name: 'Drone Model X', type: 'Product', val: 10, startTime: 0, description: 'A new generation commercial drone.' },
        { id: 'req', name: 'Requirements', type: 'Collection', val: 8, startTime: 10, description: 'The set of all product requirements.' },
        { id: 'req1', name: 'Flight Time > 30min', type: 'Requirement', val: 4, startTime: 15, description: 'Must have a flight time exceeding 30 minutes.' },
        { id: 'req2', name: '4K Camera', type: 'Requirement', val: 4, startTime: 20, description: 'Must include a 4K resolution camera.' },
        { id: 'design', name: 'Mechanical Design', type: 'Model', val: 7, startTime: 25, description: '3D CAD models of the drone body.' },
        { id: 'bom', name: 'Bill of Materials', type: 'Document', val: 6, startTime: 40, description: 'List of all parts and components.' },
        { id: 'test', name: 'Wind Tunnel Test', type: 'Test', val: 5, startTime: 55, description: 'Aerodynamic stability testing.' },
        { id: 'release', name: 'Version 1.0 Release', type: 'Release', val: 8, startTime: 80, description: 'The first official product release.' },
        { id: 'mfg', name: 'Manufacturing', type: 'Process', val: 7, startTime: 65, description: 'The manufacturing and assembly process.' },
    ],
    links: [
        { source: 'product', target: 'req' },
        { source: 'req', target: 'req1' },
        { source: 'req', target: 'req2' },
        { source: 'req1', target: 'design' },
        { source: 'req2', target: 'design' },
        { source: 'design', target: 'bom' },
        { source: 'design', target: 'test' },
        { source: 'bom', target: 'mfg' },
        { source: 'mfg', target: 'release' },
        { source: 'product', target: 'release' },
    ],
};

export const domains: Domain[] = [
  { id: 'software', name: 'Software Engineering', icon: CodeIcon, data: softwareData },
  { id: 'hr', name: 'Human Resources', icon: UserGroupIcon, data: hrData },
  { id: 'plm', name: 'Product Lifecycle', icon: CubeIcon, data: plmData },
];
