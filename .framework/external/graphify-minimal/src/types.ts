/**
 * Graphify Minimal — Core Type Definitions
 */

export interface Node {
  id: string;
  type: NodeType;
  properties: Record<string, any>;
}

export type NodeType =
  | 'Project'
  | 'DomainEntity'
  | 'Feature'
  | 'ADR'
  | 'Pattern'
  | 'Test'
  | 'Module'
  | 'Function'
  | 'Class'
  | 'Interface'
  | 'File';

export interface Edge {
  id: string;
  type: EdgeType;
  from: string; // node id
  to: string;   // node id
  properties?: Record<string, any>;
}

export type EdgeType =
  | 'DEPENDS_ON'
  | 'IMPORTS'
  | 'IMPLEMENTS'
  | 'TESTED_BY'
  | 'USES_PATTERN'
  | 'PART_OF'
  | 'REFERENCES'
  | 'CALLS'
  | 'EXTENDS'
  | 'CONTAINS';

export interface GraphStore {
  nodes: Node[];
  edges: Edge[];
  version: string;
  lastIndexed: string;
}

export interface QueryResult {
  columns: string[];
  rows: Record<string, any>[];
  count: number;
}

export interface ParsedQuery {
  match: MatchClause;
  where?: WhereClause;
  return_: ReturnClause;
  params: Record<string, any>;
}

export interface MatchClause {
  nodeAlias: string;
  nodeType?: string;
  properties?: Record<string, any>;
}

export interface WhereClause {
  conditions: Condition[];
}

export interface Condition {
  property: string;
  operator: '=' | '<>' | '<' | '>' | '<=' | '>=' | 'IN';
  value: any;
}

export interface ReturnClause {
  selections: string[];
}

export interface IndexConfig {
  projectName: string;
  codePath: string;
  featuresPath?: string;
  okfPath?: string;
  excludePatterns?: string[];
}

export interface EntityIndex {
  project: string;
  entities: DomainEntity[];
  features: Feature[];
  modules: ModuleIndex[];
}

export interface DomainEntity {
  name: string;
  type: string;
  codePath: string;
  boundedContext?: string;
  properties?: string[];
  methods?: string[];
}

export interface Feature {
  name: string;
  path: string;
  status: 'draft' | 'in-progress' | 'done';
  scenarios: number;
  tags: string[];
}

export interface ModuleIndex {
  path: string;
  name: string;
  imports: string[];
  exports: string[];
  classes: string[];
  functions: string[];
}
