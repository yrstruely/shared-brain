/**
 * Graphify Minimal — Indexing Pipeline
 *
 * Parses TypeScript and Gherkin files to build the knowledge graph.
 */

import * as fs from 'fs';
import * as path from 'path';
import { GraphStore, Node, Edge, IndexConfig, DomainEntity, Feature, ModuleIndex } from './types';
import { GraphStoreManager } from './graph-store';

export class Indexer {
  private storeManager: GraphStoreManager;

  constructor(vaultPath: string) {
    this.storeManager = new GraphStoreManager(vaultPath);
  }

  async indexProject(config: IndexConfig): Promise<GraphStore> {
    let store = this.storeManager.load(config.projectName);

    // Clear existing project nodes
    store.nodes = store.nodes.filter(n => n.properties.project !== config.projectName);
    store.edges = store.edges.filter(
      e => e.properties?.project !== config.projectName
    );

    // 1. Index project node
    store = this.storeManager.addNode(store, {
      id: `project:${config.projectName}`,
      type: 'Project',
      properties: {
        name: config.projectName,
        codePath: config.codePath,
        indexedAt: new Date().toISOString()
      }
    });

    // 2. Parse TypeScript files
    if (fs.existsSync(config.codePath)) {
      const modules = await this.parseTypeScriptModules(config.codePath, config.excludePatterns);
      for (const mod of modules) {
        // Add module node
        store = this.storeManager.addNode(store, {
          id: `module:${config.projectName}:${mod.path}`,
          type: 'Module',
          properties: {
            name: mod.name,
            path: mod.path,
            project: config.projectName,
            classCount: mod.classes.length,
            functionCount: mod.functions.length
          }
        });

        // Add class nodes
        for (const cls of mod.classes) {
          store = this.storeManager.addNode(store, {
            id: `class:${config.projectName}:${cls}`,
            type: 'Class',
            properties: {
              name: cls,
              module: mod.path,
              project: config.projectName
            }
          });
          store = this.storeManager.addEdge(store, {
            id: `edge:contains:${mod.path}:${cls}`,
            type: 'CONTAINS',
            from: `module:${config.projectName}:${mod.path}`,
            to: `class:${config.projectName}:${cls}`,
            properties: { project: config.projectName }
          });
        }

        // Add function nodes
        for (const fn of mod.functions) {
          store = this.storeManager.addNode(store, {
            id: `function:${config.projectName}:${fn}`,
            type: 'Function',
            properties: {
              name: fn,
              module: mod.path,
              project: config.projectName
            }
          });
        }

        // Add import edges
        for (const imp of mod.imports) {
          const targetModule = modules.find(m =>
            m.path.includes(imp) || imp.includes(m.name)
          );
          if (targetModule) {
            store = this.storeManager.addEdge(store, {
              id: `edge:imports:${mod.path}:${targetModule.path}`,
              type: 'IMPORTS',
              from: `module:${config.projectName}:${mod.path}`,
              to: `module:${config.projectName}:${targetModule.path}`,
              properties: { project: config.projectName }
            });
          }
        }
      }
    }

    // 3. Parse Gherkin features
    if (config.featuresPath && fs.existsSync(config.featuresPath)) {
      const features = await this.parseGherkinFeatures(config.featuresPath);
      for (const feature of features) {
        store = this.storeManager.addNode(store, {
          id: `feature:${config.projectName}:${feature.name}`,
          type: 'Feature',
          properties: {
            name: feature.name,
            path: feature.path,
            project: config.projectName,
            status: feature.status,
            scenarios: feature.scenarios,
            tags: feature.tags
          }
        });
      }
    }

    // 4. Parse OKF bundle
    if (config.okfPath && fs.existsSync(config.okfPath)) {
      const entities = await this.parseOkfEntities(config.okfPath, config.projectName);
      for (const entity of entities) {
        store = this.storeManager.addNode(store, {
          id: `entity:${config.projectName}:${entity.name}`,
          type: 'DomainEntity',
          properties: {
            name: entity.name,
            type: entity.type,
            codePath: entity.codePath,
            boundedContext: entity.boundedContext,
            project: config.projectName
          }
        });
      }
    }

    this.storeManager.save(config.projectName, store);
    return store;
  }

  private async parseTypeScriptModules(
    codePath: string,
    excludePatterns?: string[]
  ): Promise<ModuleIndex[]> {
    const modules: ModuleIndex[] = [];
    const files = this.findFiles(codePath, ['.ts'], excludePatterns);

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      const relPath = path.relative(codePath, file);

      const mod: ModuleIndex = {
        path: relPath,
        name: path.basename(file, '.ts'),
        imports: this.extractImports(content),
        exports: this.extractExports(content),
        classes: this.extractClasses(content),
        functions: this.extractFunctions(content)
      };

      modules.push(mod);
    }

    return modules;
  }

  private extractImports(content: string): string[] {
    const imports: string[] = [];
    const regex = /import\s+(?:(?:\{[^}]*\}|[^'"]*)\s+from\s+)?['"]([^'"]+)['"];?/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const importPath = match[1];
      if (!importPath.startsWith('.')) {
        imports.push(importPath.split('/')[0]);
      }
    }
    return [...new Set(imports)];
  }

  private extractExports(content: string): string[] {
    const exports: string[] = [];
    const regex = /export\s+(?:class|interface|function|const)\s+(\w+)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      exports.push(match[1]);
    }
    return exports;
  }

  private extractClasses(content: string): string[] {
    const classes: string[] = [];
    const regex = /(?:export\s+)?class\s+(\w+)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      classes.push(match[1]);
    }
    return classes;
  }

  private extractFunctions(content: string): string[] {
    const functions: string[] = [];
    // Match function declarations and arrow functions
    const regex = /(?:export\s+)?(?:async\s+)?function\s+(\w+)|const\s+(\w+)\s*=\s*(?:async\s+)?\(/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      functions.push(match[1] || match[2]);
    }
    return functions.filter(Boolean);
  }

  private async parseGherkinFeatures(featuresPath: string): Promise<Feature[]> {
    const features: Feature[] = [];
    const files = this.findFiles(featuresPath, ['.feature']);

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      const relPath = path.relative(featuresPath, file);

      // Extract feature name
      const featureMatch = content.match(/Feature:\s*(.+)/);
      const name = featureMatch ? featureMatch[1].trim() : path.basename(file, '.feature');

      // Count scenarios
      const scenarios = (content.match(/Scenario(?:\s+Outline)?:/g) || []).length;

      // Extract tags
      const tags = [...content.matchAll(/@(\w+)/g)].map(m => m[1]);

      features.push({
        name,
        path: relPath,
        status: 'draft',
        scenarios,
        tags: [...new Set(tags)]
      });
    }

    return features;
  }

  private async parseOkfEntities(okfPath: string, projectName: string): Promise<DomainEntity[]> {
    const entities: DomainEntity[] = [];

    // Parse bounded-contexts/index.md for domain entities
    const bcPath = path.join(okfPath, 'bounded-contexts', 'index.md');
    if (fs.existsSync(bcPath)) {
      const content = fs.readFileSync(bcPath, 'utf-8');

      // Extract entity mentions from tables
      const entityRegex = /\*\*Key Entities:\*\*\s*([^\n]+)/g;
      let match;
      while ((match = entityRegex.exec(content)) !== null) {
        const names = match[1].split(',').map(s => s.trim());
        for (const name of names) {
          entities.push({
            name,
            type: 'domain-entity',
            codePath: `src/${projectName}/${name.toLowerCase()}`,
            boundedContext: 'unknown'
          });
        }
      }
    }

    return entities;
  }

  private findFiles(dir: string, extensions: string[], excludePatterns?: string[]): string[] {
    const files: string[] = [];

    if (!fs.existsSync(dir)) return files;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === 'dist') continue;
        files.push(...this.findFiles(fullPath, extensions, excludePatterns));
      } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }

    return files;
  }
}
