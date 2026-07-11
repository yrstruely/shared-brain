# Framework Setup Guide: Agentic BDD/TDD with RLM, Wiki & Graphify

> **Goal:** Deploy a project-agnostic development framework that integrates your AI Agent Playbooks, Karpathy LLM Wiki, Recursive Language Models (RLM), and Graphify into a single, compounding system.

---

## Prerequisites

Before starting, ensure you have:

| Tool | Version | Purpose |
|------|---------|---------|
| **Obsidian** | Latest | Vault for Karpathy LLM Wiki |
| **Claude Code** | Latest | AI coding assistant with plugin support |
| **Node.js** | 20+ | RLM TypeScript implementations |
| **Git** | Latest | Version control for framework & projects |
| **GitHub/CI** | — | Pact Broker, CI/CD pipelines |

---

## Phase 1: Vault & Framework Setup (Day 1)

### Step 1.1: Create the Obsidian Vault Structure

Create a new Obsidian vault (or use an existing one) with this directory layout:

```
obsidian-vault/
├── .framework/              # Framework layer (copy from output)
│   ├── skills/
│   ├── agents/
│   ├── patterns/
│   ├── templates/
│   └── registry/
├── wiki/                    # Cross-project knowledge (auto-generated)
│   ├── concepts/
│   ├── patterns/
│   ├── technologies/
│   ├── anti-patterns/
│   └── post-mortems/
├── sources/                 # Raw inputs (your curated sources)
│   ├── books/
│   ├── papers/
│   ├── articles/
│   └── meeting-notes/
├── projects/                # Per-project OKF bundles
└── CLAUDE.md                # Root schema (copy from output)
```

**Action:** Copy all files from `/mnt/agents/output/` into your vault root.

---

### Step 1.2: Install Karpathy LLM Wiki Plugin

1. **Download the plugin** from [green-dalii/obsidian-llm-wiki](https://github.com/green-dalii/obsidian-llm-wiki)
2. **Manual install:**
   - Obsidian → Settings → Community Plugins → Installed plugins → click folder icon
   - Create folder `karpathywiki`, drop the three plugin files inside
   - Refresh — plugin appears in Installed Plugins list
3. **Configure:**
   - Settings → Karpathy LLM Wiki → select provider (Anthropic recommended)
   - Enter API key → Fetch Models → Test Connection
   - Look for green "LLM Ready" indicator
4. **Set folders:**
   - Sources folder: `sources/`
   - Wiki folder: `wiki/`

**Verify:** Run `/capture` on a test source file. Check that wiki pages are generated in `wiki/`.

---

### Step 1.3: Install Claude Code & Configure Framework Skills

1. **Install Claude Code:**
   ```bash
   npm install -g @anthropic-ai/claude-code
   ```

2. **Create Claude Code skills directory:**
   ```bash
   mkdir -p ~/.claude/skills
   ```

3. **Install framework skills:**
   ```bash
   # Copy framework skills to Claude Code
   cp -r obsidian-vault/.framework/skills/* ~/.claude/skills/
   ```

4. **Verify skill loading:**
   ```bash
   claude /skills:list
   # Should show: rlm-context-management, wiki-ingest-pipeline, graphify-query-patterns
   ```

---

## Phase 2: RLM Setup (Day 1–2)

### Step 2.1: Choose & Install RLM Implementation

You have two TypeScript implementations. Choose based on use case:

| Implementation | Best For | Install |
|---------------|----------|---------|
| **hampton-io/RLM** | Claude Code plugins, production features | `git clone https://github.com/hampton-io/RLM.git && cd RLM && npm install && npm run build` |
| **code-rabi/rllm** | Embedded in NestJS backend, fast V8 isolates | `pnpm add rllm` or `npm install rllm` |

**Recommendation:** Install both. Use `hampton-io/RLM` for Claude Code integration (MCP server), `code-rabi/rllm` for backend services.

---

### Step 2.2: Configure RLM for Project-Agnostic Context Loading

Create `~/.claude/skills/rlm-context-loader/skill.md`:

```markdown
# RLM Context Loader

## Purpose
Load project context recursively using RLM instead of naive prompt stuffing.

## Configuration
```typescript
import { RLM } from 'rllm'; // or hampton-io/RLM

const rlm = createRLM({
  model: 'claude-sonnet-4',
  verbose: true,
  // For hampton-io/RLM:
  // tools: ['chunk', 'grep', 'summarize', 'groupBy'],
  // For code-rabi/rllm:
  // contextSchema: ProjectContextSchema
});
```

## Project Discovery
```typescript
async function loadProjectContext(projectName: string) {
  // 1. Load project OKF index
  const project = await readOkfIndex(`projects/${projectName}/okf/index.md`);

  // 2. Load project-type config
  const projectType = await readProjectType(project.projectType);

  // 3. Query Graphify for relevant context
  const graphContext = await graphify.query(`
    MATCH (p:Project {name: $project})
    RETURN p, p.features, p.domain, p.adrs
  `, { project: projectName });

  // 4. Query Wiki for cross-project patterns
  const wikiContext = await wiki.query(`
    Find patterns for: ${project.techStack}
    Find anti-patterns for: ${project.projectType}
  `);

  return { project, projectType, graphContext, wikiContext };
}
```

## Usage in Agents
All BDD/TDD agents call this loader before execution:
```typescript
const context = await loadProjectContext('ip-hub');
// Agent receives ~15k tokens of highly relevant context
// instead of 50k+ tokens of raw codebase
```
```

---

### Step 2.3: Test RLM Integration

```bash
# Create a test script
cat > /tmp/test-rlm.ts << 'EOF'
import { createRLM } from 'rllm';

const rlm = createRLM({ model: 'gpt-4o-mini', verbose: true });

const result = await rlm.completion(
  "What testing patterns exist for NestJS CQRS?",
  {
    context: {
      projectType: 'nestjs-vue',
      wikiIndex: await loadWikiIndex()
    }
  }
);

console.log(result.answer);
EOF

npx tsx /tmp/test-rlm.ts
```

**Expected:** RLM should query wiki, find relevant patterns, and return structured answer.

---

## Phase 3: Graphify Setup (Day 2–3)

### Step 3.1: Install Graphify

Graphify is not yet a published package. You have two options:

**Option A: Use Graphify as a Service (if available)**
- Sign up at [graphify.net](https://graphify.net)
- Get API key for indexing and queries

**Option B: Self-Host Graphify**
- Clone the Graphify repository (if open-sourced)
- Or build a minimal version using:
  - Neo4j or Memgraph for graph storage
  - Tree-sitter for AST parsing
  - Your own indexing pipeline

**Option C: Start with a Simpler Graph (Recommended for MVP)**
Use a combination of:
- `ripgrep` + `tree-sitter` for code parsing
- `sqlite` or `json` file for graph storage
- Custom query functions that mirror Graphify's API

This gives you 80% of the value with 20% of the setup time.

---

### Step 3.2: Create Minimal Graphify Implementation

Create `~/.claude/skills/graphify-minimal/skill.md`:

```markdown
# Graphify Minimal (MVP)

## Purpose
Project-agnostic knowledge graph for code relationships.

## Storage
```typescript
// Simple JSON-based graph store
interface GraphStore {
  nodes: Node[];
  edges: Edge[];
  version: string;
}

// Saved per-project: .graphify/{project}-index.json
```

## Indexing Pipeline
```typescript
async function indexProject(projectName: string) {
  const project = await loadProject(projectName);

  // 1. Parse TypeScript AST
  const entities = await parseTypeScriptEntities(project.codePath);

  // 2. Parse Gherkin features
  const features = await parseGherkinFeatures(project.featuresPath);

  // 3. Parse OKF bundle
  const okf = await loadOkfBundle(project.okfPath);

  // 4. Build graph
  const graph = buildGraph({ entities, features, okf });

  // 5. Save
  await saveGraph(projectName, graph);
}
```

## Query API
```typescript
// Mirror Graphify's query interface
async function query(cypher: string, params: object): Promise<Result[]> {
  // Parse simple Cypher-like queries
  // Execute against JSON store
  // Return results
}
```

## Commands
```bash
/graphify:index --project ip-hub
/graphify:query --pattern P4 --params entity=Cart,project=ip-hub
/graphify:reindex --all
```
```

---

### Step 3.3: Index Your First Project

```bash
# After initializing IP Hub project
/graphify:index --project ip-hub

# Verify
/graphify:query "MATCH (p:Project {name: 'ip-hub'}) RETURN p"
```

---

## Phase 4: Project Initialization (Day 3)

### Step 4.1: Initialize IP Hub as First Project

```bash
# Use framework command
/framework:init-project --name ip-hub --type nestjs-vue

# Or manually:
mkdir -p projects/ip-hub/okf
mkdir -p projects/ip-hub/sources/prds
mkdir -p projects/ip-hub/sources/rfcs
mkdir -p projects/ip-hub/sources/meeting-notes

# Copy OKF template
cp -r .framework/templates/okf-bundle/nestjs-vue/* projects/ip-hub/okf/
```

---

### Step 4.2: Configure Project Metadata

Edit `projects/ip-hub/okf/index.md`:

```yaml
---
type: Project
title: "IP Hub"
description: "Intellectual Property Management Platform"
project-type: nestjs-vue
tech-stack:
  frontend:
    framework: nuxt
    version: "4"
    state: pinia
    testing: vitest
  backend:
    framework: nestjs
    architecture: cqrs
    database: postgresql
    testing: jest
repo-url: "https://github.com/org/ip-hub"
ci-url: "https://ci.ip-hub.internal"
---

# IP Hub

## Overview
Intellectual Property Management Platform with 12 bounded contexts.

## Bounded Contexts
See [bounded-contexts/index.md](bounded-contexts/index.md)
```

---

### Step 4.3: Link Existing Codebase

Create `projects/ip-hub/links.md`:

```markdown
# IP Hub Links

- **Repository:** https://github.com/org/ip-hub
- **CI/CD:** https://ci.ip-hub.internal
- **Documentation:** https://docs.ip-hub.internal
- **Pact Broker:** https://pact.ip-hub.internal
- **Staging:** https://staging.ip-hub.internal
```

---

### Step 4.4: Ingest Existing Sources

```bash
# Copy existing PRDs, RFCs, meeting notes
# Then ingest into wiki
/wiki:ingest projects/ip-hub/sources/prds/
/wiki:ingest projects/ip-hub/sources/rfcs/

# Or ingest all at once
/wiki:ingest --project ip-hub --all
```

---

## Phase 5: Playbook Integration (Day 4–5)

### Step 5.1: Port Existing Playbooks to Framework

Your existing playbooks live at `C:\Users\Kerry\Programming\ai-agent-playbooks\`. Port them:

1. **Copy playbook agents** to `.framework/agents/`:
   ```bash
   cp ai-agent-playbooks/plugins/bdd-feature-agents/agents/*       obsidian-vault/.framework/agents/
   ```

2. **Copy playbook commands** to `.framework/skills/`:
   ```bash
   cp ai-agent-playbooks/plugins/bdd-feature-agents/commands/*       obsidian-vault/.framework/skills/bdd/feature-generation/
   ```

3. **Add project-agnostic wrappers**:
   Each agent now receives `ProjectContext` instead of hardcoded paths:
   ```typescript
   // Before (hardcoded)
   const features = await generateFeatures('features/cart/');

   // After (project-agnostic)
   const context = await loadProjectContext(projectName);
   const features = await generateFeatures(context.featuresPath);
   ```

---

### Step 5.2: Add RLM Context Loading to Each Agent

Modify each playbook agent to use RLM:

```typescript
// Before: Agent loads entire codebase into prompt
const code = await readAllFiles('src/');
const result = await claude.complete(prompt + code);

// After: Agent uses RLM to explore context
const context = await rlm.completion(task, {
  context: await loadProjectContext(projectName),
  contextSchema: AgentContextSchema
});
const result = context.answer;
```

---

### Step 5.3: Add Graphify Queries to Each Agent

Replace file grepping with graph queries:

```typescript
// Before: grep for related files
const related = await grep('Cart', 'src/**/*.ts');

// After: graph traversal
const related = await graphify.query(`
  MATCH (e:DomainEntity {name: 'Cart'})
  <-[:DEPENDS_ON]-(d:DomainEntity)
  RETURN d.name, d.codePath
`);
```

---

### Step 5.4: Test Full Pipeline

```bash
# Stage 1: Requirements → BDD Features
/fluentit-bdd-features:fluentit-bdd-features @specs/cart-redesign/ --project ip-hub

# Stage 2a: Frontend Step Definitions
/fluentit-bdd-frontend-features:fluentit-bdd-frontend-features   features/cart/*.feature --project ip-hub

# Stage 2b: Backend Step Definitions
/fluentit-bdd-backend-features:fluentit-bdd-backend-features   apps/backend-e2e/features/cart/*.feature --project ip-hub

# Stage 3a: Frontend TDD
/fluentit-tdd-frontend:fluentit-tdd-implement specs/cart/*.feature --project ip-hub

# Stage 3b: Backend TDD
/fluentit-tdd-backend:fluentit-tdd-backend   apps/backend-e2e/features/cart.feature "Add item to cart" --project ip-hub
```

---

## Phase 6: Add Second Project (Week 2)

### Step 6.1: Initialize New Project

```bash
/framework:init-project --name billing-service --type nestjs-vue
```

---

### Step 6.2: Observe Cross-Project Intelligence

After ingesting billing-service sources:

```bash
# Query for shared patterns
/wiki:query "Find patterns used by both ip-hub and billing-service"

# Expected output:
# - Repository with Unit of Work (used in 2 projects)
# - CQRS Command/Query separation (used in 2 projects)
# - Pact contract testing (used in 2 projects)
```

---

### Step 6.3: Reuse Patterns from IP Hub

When billing-service needs a similar feature:

```bash
# Find how IP Hub solved it
/graphify:query --pattern P3 --params sourceProject=ip-hub,pattern=Cart

# Result shows:
# - ADR-003: Cart Aggregate Design
# - Test patterns from ip-hub
# - Reusable domain logic
```

---

## Phase 7: Maintenance & Optimization (Ongoing)

### Weekly Tasks

| Task | Command | Time |
|------|---------|------|
| Sync wiki with new sources | `/wiki:sync` | 10 min |
| Lint wiki health | `/wiki:lint` | 5 min |
| Reindex projects | `/graphify:reindex --all` | 15 min |
| Review cross-project patterns | `/wiki:query "patterns used by >1 project"` | 5 min |

### Per-Project Tasks (on significant changes)

| Task | Command | Time |
|------|---------|------|
| Reindex project | `/graphify:index --project {name}` | 5 min |
| Ingest new sources | `/wiki:ingest projects/{name}/sources/` | 10 min |
| Update ADRs | Edit `projects/{name}/okf/adr/` | 15 min |

### Monthly Tasks

| Task | Purpose |
|------|---------|
| Archive old projects | Move `projects/{name}` to `archive/` |
| Review framework skills | Update `.framework/skills/` with new learnings |
| Add new project type | Copy `_template.md`, customize |
| Benchmark RLM costs | Compare token usage vs. naive approach |

---

## Troubleshooting

### Issue: Project Not Found
```
Error: No project discovered in /home/user/random-dir
```
**Fix:**
1. Run from project directory, or
2. Use `--project ip-hub` flag, or
3. Run `/framework:init-project` to create new project

---

### Issue: Wiki Out of Sync
```
Warning: Wiki last synced 14 days ago
```
**Fix:**
```bash
/wiki:sync --project ip-hub
# Or enable auto-sync in CLAUDE.md:
# autoSync: true
# syncOnGitCommit: true
```

---

### Issue: Graphify Not Indexed
```
Error: Graphify KG not found for project ip-hub
```
**Fix:**
```bash
/graphify:index --project ip-hub
# Or set auto-index in project config:
# autoIndex: true
```

---

### Issue: RLM Timeout
```
Error: RLM query timed out after 30s
```
**Fix:**
1. Reduce context size: `maxTokens: 10000`
2. Use faster model: `model: 'gpt-4o-mini'`
3. Enable caching: `cacheContext: true`
4. For hampton-io/RLM: use `modelFallback: ['gpt-4o-mini', 'claude-haiku-4-5']`

---

### Issue: Playbook Agents Not Loading
```
Error: Skill 'bdd-feature-agents' not found
```
**Fix:**
```bash
# Verify skill path
ls ~/.claude/skills/bdd/feature-generation/

# Reinstall from playbook repo
/plugin uninstall ai-agent-playbooks@my-workflow-plugins
/plugin install ai-agent-playbooks@my-workflow-plugins
```

---

## Success Metrics

Track these to measure framework effectiveness:

| Metric | Baseline | Target (3 months) |
|--------|----------|-------------------|
| Time to generate BDD features | 2 hours | 15 minutes |
| Time to implement + test a story | 3 days | 4 hours |
| Test coverage (new code) | 60% | 90% |
| Cross-project pattern reuse | 0% | 40% |
| Context loading tokens | 50,000 | 15,000 |
| Agent cost per story | $5.00 | $1.50 |
| Wiki pages | 0 | 200+ |
| Projects using framework | 1 | 3+ |

---

## Summary Checklist

- [ ] Obsidian vault created with framework structure
- [ ] Karpathy LLM Wiki plugin installed and configured
- [ ] Claude Code installed with framework skills
- [ ] RLM installed (hampton-io and/or code-rabi)
- [ ] Graphify indexed (or minimal implementation created)
- [ ] IP Hub initialized as first project
- [ ] Existing playbooks ported to project-agnostic agents
- [ ] Full BDD/TDD pipeline tested end-to-end
- [ ] Second project initialized (billing-service)
- [ ] Cross-project queries working
- [ ] Weekly maintenance schedule established

---

## Next Steps After Setup

1. **Refine RLM sub-agent delegation** — measure which tasks benefit from recursion
2. **Build Graphify dashboard** — visualize code relationships
3. **Add more project types** — Django, Go, Flutter
4. **Integrate with CI/CD** — auto-index on commit, auto-ingest on PRD merge
5. **Share with team** — onboard colleagues to the framework

---

*Generated for Kerry Harris — IP Hub Project*
*Framework version: 1.0*
*Last updated: 2026-07-08*
