# Compound Vault: Agentic BDD/TDD Framework

> **Purpose:** A project-agnostic development framework that integrates AI Agent Playbooks, Karpathy LLM Wiki, Recursive Language Models (RLM), and Graphify into a single, compounding system.
>
> **Owner:** Kerry Harris
> **Framework Version:** 1.0
> **Last Updated:** 2026-07-11

---

## Vault Layout

```
.
├── .framework/          # Framework layer (skills, agents, patterns, templates)
├── wiki/                # Cross-project knowledge (auto-generated)
├── sources/             # Raw inputs (books, papers, articles, meeting notes)
├── projects/            # Per-project OKF bundles
└── CLAUDE.md            # This file — root schema & framework contract
```

---

## Framework Principles

1. **Project-Agnostic Agents** — Every agent receives a `ProjectContext` instead of hardcoded paths
2. **RLM over Naive Prompt Stuffing** — Recursive context loading targets ~15k tokens vs 50k+
3. **Graphify over Grep** — Code relationships are queried, not grepped
4. **Wiki as Shared Memory** — Cross-project patterns, anti-patterns, and learnings compound
5. **OKF Bundles** — Every project has a self-contained knowledge bundle

---

## Quick Commands

| Command | Purpose |
|---------|---------|
| `/wiki:query "..."` | Query cross-project knowledge |
| `/wiki:ingest <path>` | Ingest sources into wiki |
| `/wiki:sync` | Sync wiki with new sources |
| `/wiki:lint` | Health check wiki |
| `/graphify:index --project <name>` | Index project code relationships |
| `/graphify:query --pattern P<n> --params ...` | Query code graph |
| `/framework:init-project --name <n> --type <t>` | Initialize new project |
| `/rlm:load-context --project <name>` | Load project context via RLM |

---

## Project Types

See [[.framework/templates/project-types/index|Project Types Registry]] for supported types.

| Type | Stack | Status |
|------|-------|--------|
| `nestjs-vue` | NestJS (CQRS) + Nuxt 4 + PostgreSQL | ✅ Active |

---

## Active Projects

See [[projects/index|Projects Index]] for full list.

| Project | Type | Status |
|---------|------|--------|
| [[projects/ip-hub/okf/index\|IP Hub]] | nestjs-vue | 🚧 In Progress |

---

## Maintenance Schedule

| Frequency | Task | Command |
|-----------|------|---------|
| Weekly | Sync wiki | `/wiki:sync` |
| Weekly | Lint wiki | `/wiki:lint` |
| Weekly | Reindex all | `/graphify:reindex --all` |
| Per-feature | Run BDD/TDD pipeline | See [[.framework/agents/index\|Agents]] |
| Monthly | Review framework skills | Update `.framework/skills/` |

---

## External Dependencies

| Tool | Status | Location / Notes |
|------|--------|-----------------|
| Obsidian CLI | ✅ Ready | `D:\Program Files\Obsidian\Obsidian.com` |
| RLM (hampton-io) | ✅ Installed | `~/RLM` — cloned, built, loads successfully |
| Graphify Minimal | ✅ Implemented | `.framework/external/graphify-minimal/` — JSON-based, zero deps |
| Karpathy LLM Wiki Plugin | ✅ Active | OpenRouter → DeepSeek V4 Flash (nzfluentit@gmail.com) |
| Framework Skills | ✅ Ported | 11 skills in `.framework/skills/` |
| Playbooks | ✅ Copied | Original agents preserved in `.framework/agents/playbooks/` |
| Playbooks Ported | ✅ Complete | All 11 skills ported — see `.framework/skills/index.md` |

### Backend Library (Optional)

| Tool | Use Case | Install |
|------|----------|---------|
| `code-rabi/rllm` | Embedded RLM in NestJS backend services | `pnpm add rllm` per-project |

---

## Success Metrics

| Metric | Baseline | Target (3 months) |
|--------|----------|-------------------|
| Time to generate BDD features | 2 hours | 15 minutes |
| Time to implement + test a story | 3 days | 4 hours |
| Test coverage (new code) | 60% | 90% |
| Cross-project pattern reuse | 0% | 40% |
| Context loading tokens | 50,000 | 15,000 |
| Wiki pages | 0 | 200+ |

---

## Setup Checklist

- [x] Obsidian vault created with framework structure
- [x] Karpathy LLM Wiki plugin installed and configured (OpenRouter + DeepSeek V4 Flash)
- [x] RLM installed (hampton-io cloned + built)
- [x] Graphify Minimal implemented (JSON store, TypeScript parser, query engine, CLI)
- [x] IP Hub initialized as first project (OKF bundle, 12 bounded contexts, 3 ADRs)
- [x] Framework skills copied to `~/.claude/skills/`
- [x] Existing playbooks copied to `.framework/agents/playbooks/`
- [x] **All 11 playbook skills ported** to project-agnostic + RLM-aware framework skills
- [ ] Full BDD/TDD pipeline tested end-to-end
- [ ] Second project initialized (billing-service)
- [ ] Cross-project queries working
- [ ] Weekly maintenance schedule established
