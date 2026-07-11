---
description: Framework skills registry. Lists all available skills, their categories, and installation instructions.
---

# Framework Skills

> Claude Code skill definitions. Copy to `~/.claude/skills/` to activate.

---

## Available Skills

### [[.framework/skills/rlm-context-loader\|RLM Context Loader]]
Load project context recursively using RLM instead of naive prompt stuffing.

### [[.framework/skills/wiki-ingest-pipeline\|Wiki Ingest Pipeline]]
Ingest sources into the wiki: extract entities, concepts, patterns, and update indexes.

### [[.framework/skills/graphify-minimal\|Graphify Minimal]]
Project-agnostic knowledge graph for code relationships. JSON-based MVP implementation.

---

## Ported Skills (Project-Agnostic + RLM-Aware)

### Pipeline Skills

| Skill | Phases | Role |
|-------|--------|------|
| [[.framework/skills/dna-bdd-features\|BDD Feature Generator]] | 8 | Pipeline entry — specs → features |
| [[.framework/skills/dna-bdd-frontend-steps\|BDD Frontend Steps]] | 11 | Frontend glue — steps + mocks + contracts |
| [[.framework/skills/dna-bdd-backend-steps\|BDD Backend Steps]] | 7 | Backend glue — API E2E steps |
| [[.framework/skills/dna-tdd-frontend\|TDD Frontend]] | 8 | Frontend implementation |
| [[.framework/skills/dna-tdd-backend\|TDD Backend]] | 7 | Backend implementation |

### Scaffolding Skills

| Skill | Role |
|-------|------|
| [[.framework/skills/dna-domain-entity\|Domain Entity]] | Interview-driven DDD entity creation |
| [[.framework/skills/dna-api-contracts\|API Contracts]] | DTOs + response types + frontend wiring |
| [[.framework/skills/dna-backend-module\|Backend Module]] | Full backend module (CQRS/MVC/Hexagonal) |

### Workflow Skills

| Skill | Role |
|-------|------|
| [[.framework/skills/dna-frontend-guide\|Frontend Guide]] | Feature dev from specs to production |
| [[.framework/skills/dna-pr\|Pull Request]] | Commit → version → PR → ticket update |
| [[.framework/skills/dna-review\|Code Review]] | Clean AI-generated code |

### Meta Skills

| Skill | Role |
|-------|------|
| [[.framework/skills/dna-orchestrator\|Project Orchestrator]] | Detects state, routes to correct skill, manages pipeline |

---

## Porting Resources

### [[.framework/skills/MASTER_TEMPLATE\|Master Porting Template]]
Step-by-step guide for converting any playbook skill. Includes path abstraction cheat sheet, RLM integration hooks, and before/after examples.

### [[.framework/agents/PORTING_GUIDE\|Agent Porting Guide]]
Maps existing playbook agents to framework agents with specific refactoring instructions.

---

## Skill Installation

```bash
# Copy all skills to Claude Code
mkdir -p ~/.claude/skills
cp -r .framework/skills/* ~/.claude/skills/

# Verify
claude /skills:list
```

---

## Skill Architecture

Each skill follows this contract:

1. **Discovery Phase** — Identify what project/context is active
2. **Context Loading** — Call `rlm-context-loader` to get relevant context (~15k tokens)
3. **Execution** — Perform the skill's primary function
4. **Output** — Write results to wiki, project OKF, or codebase
5. **Indexing** — Trigger `graphify-minimal` to update code relationships
