# Quick Start Checklist

## Day 1: Foundation
- [ ] Create Obsidian vault with framework structure
- [ ] Install Karpathy LLM Wiki plugin
- [ ] Configure plugin (API key, folders)
- [ ] Install Claude Code
- [ ] Copy framework skills to `~/.claude/skills/`

## Day 2: RLM
- [ ] Clone hampton-io/RLM or install code-rabi/rllm
- [ ] Test RLM with simple query
- [ ] Create `rlm-context-loader` skill

## Day 3: Graphify
- [ ] Set up minimal graph implementation (JSON store)
- [ ] Create indexing pipeline for TypeScript + Gherkin
- [ ] Test graph queries

## Day 4: First Project
- [ ] Initialize IP Hub: `/framework:init-project --name ip-hub --type nestjs-vue`
- [ ] Configure `projects/ip-hub/okf/index.md`
- [ ] Link codebase in `projects/ip-hub/links.md`
- [ ] Ingest existing PRDs: `/wiki:ingest projects/ip-hub/sources/prds/`

## Day 5: Playbooks
- [ ] Port BDD feature agents to framework
- [ ] Port TDD implementation agents
- [ ] Add RLM context loading to each agent
- [ ] Replace file grepping with Graphify queries

## Day 6: Test Pipeline
- [ ] Run full BDD pipeline on one feature
- [ ] Verify tests fail (RED), pass (GREEN), refactor (CLEAN)
- [ ] Check wiki for new patterns
- [ ] Check graph for indexed relationships

## Week 2: Second Project
- [ ] Initialize billing-service
- [ ] Ingest sources
- [ ] Run cross-project query: `/wiki:query "patterns used by >1 project"`
- [ ] Reuse IP Hub patterns in billing-service

## Ongoing
- [ ] Weekly: `/wiki:sync` + `/wiki:lint`
- [ ] Weekly: `/graphify:reindex --all`
- [ ] Per-feature: Run BDD/TDD pipeline
- [ ] Monthly: Review framework skills, add new patterns
