/**
 * Graphify Minimal — CLI Interface (zero dependencies)
 *
 * Usage:
 *   node bin/graphify.js index --project <name> --code <path> [--features <path>] [--okf <path>] [--vault <path>]
 *   node bin/graphify.js query --project <name> --pattern P<n> [--params '{...}'] [--vault <path>]
 *   node bin/graphify.js query --project <name> --cypher "MATCH ..." [--vault <path>]
 *   node bin/graphify.js stats --project <name> [--vault <path>]
 *   node bin/graphify.js list [--vault <path>]
 */

import * as path from 'path';
import { GraphStoreManager } from './graph-store';
import { QueryEngine } from './query-engine';
import { Indexer } from './indexer';

function parseArgs(argv: string[]): Record<string, string> {
  const args: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const nextArg = argv[i + 1];
      if (nextArg && !nextArg.startsWith('--')) {
        args[key] = nextArg;
        i++;
      } else {
        args[key] = 'true';
      }
    }
  }
  return args;
}

async function main() {
  const argv = process.argv.slice(2);
  const command = argv[0];
  const args = parseArgs(argv.slice(1));
  const vaultPath = path.resolve(args.vault || process.cwd());

  switch (command) {
    case 'index': {
      if (!args.project || !args.code) {
        console.error('Usage: graphify index --project <name> --code <path>');
        process.exit(1);
      }

      const indexer = new Indexer(vaultPath);
      console.log(`Indexing project: ${args.project}`);
      console.log(`  Code: ${args.code}`);
      if (args.features) console.log(`  Features: ${args.features}`);
      if (args.okf) console.log(`  OKF: ${args.okf}`);

      const store = await indexer.indexProject({
        projectName: args.project,
        codePath: path.resolve(args.code),
        featuresPath: args.features ? path.resolve(args.features) : undefined,
        okfPath: args.okf ? path.resolve(args.okf) : undefined
      });

      const stats = new GraphStoreManager(vaultPath).getStats(store);
      console.log(`\n✅ Indexed ${args.project}`);
      console.log(`   Nodes: ${stats.nodes}`);
      console.log(`   Edges: ${stats.edges}`);
      console.log(`   Types: ${Object.entries(stats.types).map(([k, v]) => `${k}=${v}`).join(', ')}`);
      break;
    }

    case 'query': {
      if (!args.project) {
        console.error('Usage: graphify query --project <name> --pattern P<n> | --cypher "..."');
        process.exit(1);
      }

      const storeManager = new GraphStoreManager(vaultPath);
      const store = storeManager.load(args.project);
      const engine = new QueryEngine();
      const params = args.params ? JSON.parse(args.params) : {};

      let result;
      if (args.pattern) {
        console.log(`Running pattern ${args.pattern}...`);
        result = engine.runPattern(store, args.pattern, params);
      } else if (args.cypher) {
        console.log(`Running query: ${args.cypher}`);
        result = engine.execute(store, args.cypher, params);
      } else {
        console.error('Provide either --pattern or --cypher');
        process.exit(1);
      }

      console.log(`\n📊 Results: ${result.count} rows`);
      console.log(`   Columns: ${result.columns.join(', ')}`);
      for (const row of result.rows) {
        console.log('   ---');
        for (const [key, value] of Object.entries(row)) {
          const display = typeof value === 'object'
            ? JSON.stringify(value, null, 2).split('\n').join('\n      ')
            : value;
          console.log(`   ${key}: ${display}`);
        }
      }
      break;
    }

    case 'stats': {
      if (!args.project) {
        console.error('Usage: graphify stats --project <name>');
        process.exit(1);
      }

      const storeManager = new GraphStoreManager(vaultPath);
      const store = storeManager.load(args.project);
      const stats = storeManager.getStats(store);

      console.log(`📈 Graph Stats: ${args.project}`);
      console.log(`   Nodes: ${stats.nodes}`);
      console.log(`   Edges: ${stats.edges}`);
      console.log(`   Last Indexed: ${store.lastIndexed}`);
      console.log('   By Type:');
      for (const [type, count] of Object.entries(stats.types)) {
        console.log(`     ${type}: ${count}`);
      }
      break;
    }

    case 'list': {
      const storeManager = new GraphStoreManager(vaultPath);
      const projects = storeManager.listProjects();

      if (projects.length === 0) {
        console.log('No projects indexed yet.');
        return;
      }

      console.log('📁 Indexed Projects:');
      for (const project of projects) {
        const store = storeManager.load(project);
        const stats = storeManager.getStats(store);
        console.log(`   ${project} — ${stats.nodes} nodes, ${stats.edges} edges`);
      }
      break;
    }

    case 'reindex': {
      console.log('🔄 Reindex all — use `graphify index` for each project');
      break;
    }

    default:
      console.log('Graphify Minimal v1.0.0');
      console.log('');
      console.log('Commands:');
      console.log('  index   --project <name> --code <path> [--features <path>] [--okf <path>]');
      console.log('  query   --project <name> --pattern P<n> | --cypher "MATCH ..."');
      console.log('  stats   --project <name>');
      console.log('  list');
      console.log('  reindex');
      console.log('');
      console.log('Options:');
      console.log('  --vault <path>  Vault root path (default: cwd)');
      console.log('  --params <json> Query parameters as JSON');
      process.exit(0);
  }
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
