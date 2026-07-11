/**
 * Graphify Minimal — Query Engine
 *
 * Parses simple Cypher-like queries and executes against JSON store.
 */

import { GraphStore, Node, Edge, QueryResult, ParsedQuery, MatchClause, Condition } from './types';

export class QueryEngine {
  execute(store: GraphStore, cypher: string, params: Record<string, any> = {}): QueryResult {
    const parsed = this.parseQuery(cypher, params);
    return this.runQuery(store, parsed);
  }

  private parseQuery(cypher: string, params: Record<string, any>): ParsedQuery {
    // Simple Cypher parser for patterns like:
    // MATCH (p:Project {name: $project}) RETURN p
    // MATCH (e:DomainEntity) WHERE e.project = $project RETURN e
    // MATCH (e:DomainEntity {name: $entity})<-[:DEPENDS_ON]-(d) RETURN d

    const matchMatch = cypher.match(/MATCH\s*\((\w+)(?::(\w+))?\s*(?:\{([^}]+)\})?\)/i);
    if (!matchMatch) {
      throw new Error('Invalid query: MATCH clause required');
    }

    const [, alias, nodeType, propStr] = matchMatch;
    const properties = this.parseProperties(propStr);

    // Substitute params
    for (const key of Object.keys(properties)) {
      if (properties[key].startsWith('$')) {
        const paramKey = properties[key].slice(1);
        properties[key] = params[paramKey];
      }
    }

    const match: MatchClause = {
      nodeAlias: alias,
      nodeType: nodeType || undefined,
      properties: Object.keys(properties).length > 0 ? properties : undefined
    };

    // Parse WHERE
    let conditions: Condition[] = [];
    const whereMatch = cypher.match(/WHERE\s+(.+?)(?:RETURN|$)/i);
    if (whereMatch) {
      conditions = this.parseWhere(whereMatch[1], params);
    }

    // Parse RETURN
    const returnMatch = cypher.match(/RETURN\s+(.+)$/i);
    const returnSelections = returnMatch
      ? returnMatch[1].split(',').map(s => s.trim())
      : [alias];

    return {
      match,
      where: conditions.length > 0 ? { conditions } : undefined,
      return_: { selections: returnSelections },
      params
    };
  }

  private parseProperties(propStr: string | undefined): Record<string, string> {
    const props: Record<string, string> = {};
    if (!propStr) return props;

    const pairs = propStr.split(',');
    for (const pair of pairs) {
      const [key, value] = pair.split(':').map(s => s.trim());
      if (key && value) {
        props[key] = value.replace(/^["']|["']$/g, '');
      }
    }
    return props;
  }

  private parseWhere(whereStr: string, params: Record<string, any>): Condition[] {
    const conditions: Condition[] = [];
    // Simple parser: e.project = $project AND e.name = "Cart"
    const parts = whereStr.split(/\s+AND\s+/i);

    for (const part of parts) {
      const match = part.match(/(\w+)\.?(\w+)?\s*(=|<>|<|>|<=|>=)\s*(.+)/);
      if (match) {
        let [, , prop, op, value] = match;
        if (!prop) prop = match[1];
        value = value.trim();

        // Substitute params
        if (value.startsWith('$')) {
          value = params[value.slice(1)];
        } else {
          value = value.replace(/^["']|["']$/g, '');
        }

        conditions.push({ property: prop, operator: op as any, value });
      }
    }
    return conditions;
  }

  private runQuery(store: GraphStore, parsed: ParsedQuery): QueryResult {
    // Filter nodes by type and properties
    let results = store.nodes.filter(node => {
      if (parsed.match.nodeType && node.type !== parsed.match.nodeType) {
        return false;
      }
      if (parsed.match.properties) {
        for (const [key, value] of Object.entries(parsed.match.properties)) {
          if (node.properties[key] !== value) {
            return false;
          }
        }
      }
      return true;
    });

    // Apply WHERE conditions
    if (parsed.where) {
      for (const condition of parsed.where.conditions) {
        results = results.filter(node => {
          const propValue = node.properties[condition.property];
          switch (condition.operator) {
            case '=': return propValue === condition.value;
            case '<>': return propValue !== condition.value;
            case '<': return propValue < condition.value;
            case '>': return propValue > condition.value;
            case '<=': return propValue <= condition.value;
            case '>=': return propValue >= condition.value;
            case 'IN': return Array.isArray(condition.value) && condition.value.includes(propValue);
            default: return false;
          }
        });
      }
    }

    // Handle relationship traversal (simple)
    const relMatch = parsed.match.nodeAlias.match(/\)<?-\[:(\w+)\]-\)>?\((\w+)\)/);
    // Complex relationship parsing would go here

    // Build result rows
    const columns = parsed.return_.selections;
    const rows = results.map(node => {
      const row: Record<string, any> = {};
      for (const selection of columns) {
        if (selection === parsed.match.nodeAlias) {
          row[selection] = node;
        } else if (selection.includes('.')) {
          const [, prop] = selection.split('.');
          row[selection] = node.properties[prop];
        } else {
          row[selection] = node.properties[selection];
        }
      }
      return row;
    });

    return { columns, rows, count: rows.length };
  }

  // Predefined query patterns
  runPattern(store: GraphStore, patternId: string, params: Record<string, any>): QueryResult {
    const patterns: Record<string, string> = {
      P1: 'MATCH (p:Project) RETURN p',
      P2: 'MATCH (e:DomainEntity) WHERE e.project = $project RETURN e',
      P3: 'MATCH (e:DomainEntity) WHERE e.name = $entity RETURN e',
      P4: 'MATCH (p:Pattern) WHERE p.name = $pattern RETURN p',
      P5: 'MATCH (f:Feature) WHERE f.project = $project AND f.status = "done" RETURN f'
    };

    const query = patterns[patternId];
    if (!query) {
      throw new Error(`Unknown pattern: ${patternId}. Available: ${Object.keys(patterns).join(', ')}`);
    }

    return this.execute(store, query, params);
  }
}
