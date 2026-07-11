/**
 * Graphify Minimal — JSON Graph Store
 *
 * Simple file-based persistence for the knowledge graph.
 * Stored per-project: .graphify/{project}-index.json
 */

import * as fs from 'fs';
import * as path from 'path';
import { GraphStore, Node, Edge } from './types';

const GRAPHIFY_DIR = '.graphify';
const VERSION = '1.0.0';

export class GraphStoreManager {
  private basePath: string;

  constructor(vaultPath: string) {
    this.basePath = path.join(vaultPath, GRAPHIFY_DIR);
    this.ensureDir();
  }

  private ensureDir(): void {
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath, { recursive: true });
    }
  }

  private getStorePath(projectName: string): string {
    return path.join(this.basePath, `${projectName}-index.json`);
  }

  createEmpty(): GraphStore {
    return {
      nodes: [],
      edges: [],
      version: VERSION,
      lastIndexed: new Date().toISOString()
    };
  }

  load(projectName: string): GraphStore {
    const storePath = this.getStorePath(projectName);
    if (!fs.existsSync(storePath)) {
      return this.createEmpty();
    }
    const data = fs.readFileSync(storePath, 'utf-8');
    return JSON.parse(data) as GraphStore;
  }

  save(projectName: string, store: GraphStore): void {
    const storePath = this.getStorePath(projectName);
    store.lastIndexed = new Date().toISOString();
    fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
  }

  delete(projectName: string): boolean {
    const storePath = this.getStorePath(projectName);
    if (fs.existsSync(storePath)) {
      fs.unlinkSync(storePath);
      return true;
    }
    return false;
  }

  listProjects(): string[] {
    if (!fs.existsSync(this.basePath)) return [];
    return fs
      .readdirSync(this.basePath)
      .filter(f => f.endsWith('-index.json'))
      .map(f => f.replace('-index.json', ''));
  }

  // Node operations
  addNode(store: GraphStore, node: Node): GraphStore {
    const existing = store.nodes.findIndex(n => n.id === node.id);
    if (existing >= 0) {
      store.nodes[existing] = node;
    } else {
      store.nodes.push(node);
    }
    return store;
  }

  removeNode(store: GraphStore, nodeId: string): GraphStore {
    store.nodes = store.nodes.filter(n => n.id !== nodeId);
    store.edges = store.edges.filter(e => e.from !== nodeId && e.to !== nodeId);
    return store;
  }

  getNode(store: GraphStore, nodeId: string): Node | undefined {
    return store.nodes.find(n => n.id === nodeId);
  }

  getNodesByType(store: GraphStore, type: string): Node[] {
    return store.nodes.filter(n => n.type === type);
  }

  // Edge operations
  addEdge(store: GraphStore, edge: Edge): GraphStore {
    const existing = store.edges.findIndex(
      e => e.from === edge.from && e.to === edge.to && e.type === edge.type
    );
    if (existing >= 0) {
      store.edges[existing] = edge;
    } else {
      store.edges.push(edge);
    }
    return store;
  }

  getEdgesFrom(store: GraphStore, nodeId: string): Edge[] {
    return store.edges.filter(e => e.from === nodeId);
  }

  getEdgesTo(store: GraphStore, nodeId: string): Edge[] {
    return store.edges.filter(e => e.to === nodeId);
  }

  getNeighbors(store: GraphStore, nodeId: string): Node[] {
    const edgeNodeIds = store.edges
      .filter(e => e.from === nodeId || e.to === nodeId)
      .map(e => (e.from === nodeId ? e.to : e.from));
    return store.nodes.filter(n => edgeNodeIds.includes(n.id));
  }

  // Stats
  getStats(store: GraphStore): { nodes: number; edges: number; types: Record<string, number> } {
    const types: Record<string, number> = {};
    for (const node of store.nodes) {
      types[node.type] = (types[node.type] || 0) + 1;
    }
    return {
      nodes: store.nodes.length,
      edges: store.edges.length,
      types
    };
  }
}
