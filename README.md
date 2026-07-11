# About This Wiki

> **Compound Vault: Agentic BDD/TDD Development Framework**
>
created: 2026-07-11
modified: 2026-07-11
>
tags: #meta #framework #about

---

## What Is This?

This is an **AI-augmented knowledge base** that combines:

- **Obsidian** — Your notes, structured and linked
- **Karpathy LLM Wiki** — Automatic ingestion of sources into wiki pages
- **Claude Code** — AI coding assistant with custom skills
- **RLM** — Recursive Language Models for intelligent context loading
- **Graphify** — Code relationship knowledge graph

Together they form a **project-agnostic development framework** for Behaviour-Driven Development (BDD) and Test-Driven Development (TDD).

---

> [!NOTE]
> ## Quick Start
> 
> ### New? Start Here
> 
> 📖 **[Project Workflow Guide](setup-instructions/WORKFLOW.md)** — Step-by-step guide for building projects with this framework

---

# Karpathy AI Wiki
### 1. Add a Source

Drop any file into a `sources/` folder:

```
sources/
├── articles/     # Blog posts, tutorials, documentation
├── books/        # Book chapters, PDFs
├── papers/       # Research papers, whitepapers
└── meeting-notes/# Transcripts, decisions
```

### 2. Ingest It

**Via Karpathy Plugin (Obsidian):**
1. Open the source file
2. Press `Ctrl+P` → "LLM Wiki: Capture"
3. The plugin extracts entities, concepts, and patterns

**Via Claude Code:**
```bash
/wiki:ingest sources/articles/my-article.md
```

### 3. Explore the Wiki

New pages appear automatically in `wiki/`:

| Folder | Contains |
|--------|----------|
| `wiki/concepts/` | Domain concepts and ideas |
| `wiki/patterns/` | Reusable design patterns |
| `wiki/technologies/` | Tech evaluations and deep-dives |
| `wiki/anti-patterns/` | Mistakes and lessons learned |
| `wiki/post-mortems/` | Incident analyses |

---

## LLM Configuration

**Provider:** OpenRouter
**Account:** nzfluentit@gmail.com
**Model:** DeepSeek V4 Flash
**Purpose:** Wiki ingestion (source → structured knowledge)

---

## Development Pipeline

For software projects, this framework supports a full BDD/TDD cycle.

**📖 See the [Project Workflow Guide](setup-instructions/WORKFLOW.md) for detailed step-by-step instructions.**

Quick reference:

```
PRDs / Specs
    ↓
/fluentit-bdd-features       → .feature files (Gherkin)
    ↓
/fluentit-bdd-frontend-steps → Playwright step definitions
/fluentit-bdd-backend-steps  → NestJS step definitions
    ↓
/fluentit-tdd-frontend       → Vue components (Red→Green→Clean)
/fluentit-tdd-backend        → CQRS handlers (Red→Green→Clean)
    ↓
/graphify:index         → Index code relationships
```

---

## Projects

Active projects tracked in this vault:

| Project | Type | Status |
|---------|------|--------|
| [[projects/ip-hub/okf/index\|IP Hub]] | NestJS + Vue (CQRS) | 🚧 In Progress |

---

## Maintenance

| Task | Frequency | Command |
|------|-----------|---------|
| Sync wiki | Weekly | `/wiki:sync` |
| Health check | Weekly | `/wiki:lint` |
| Reindex code | Weekly | `/graphify:reindex --all` |
| Review patterns | Monthly | Manual |

---

## Vault Structure

```
.
├── .framework/          # Skills, agents, patterns, templates
├── wiki/                # Auto-generated knowledge
├── sources/             # Raw inputs
├── projects/            # Per-project OKF bundles
├── setup-instructions/  # Framework setup docs
└── CLAUDE.md            # Root schema
```

---

## Framework Components

| Component         | Status        | Location                                 |
| ----------------- | ------------- | ---------------------------------------- |
| Obsidian CLI      | ✅ Ready       | `D:\Program Files\Obsidian\Obsidian.com` |
| Karpathy LLM Wiki | ✅ Active      | OpenRouter → DeepSeek V4 Flash           |
| RLM (hampton-io)  | ✅ Installed   | `~/RLM`                                  |
| Graphify Minimal  | ✅ Implemented | `.framework/external/graphify-minimal/`  |
| Framework Skills  | ✅ Copied      | `~/.claude/skills/`                      |

### Backend Libraries (Optional)

| Library | Use Case | Install |
|---------|----------|---------|
| `code-rabi/rllm` | Embedded RLM in NestJS backend services | `pnpm add rllm` per-project |

---

## Getting Help

- **Wiki issues:** Run `/wiki:lint`
- **Ingestion issues:** Check Karpathy plugin settings (OpenRouter, DeepSeek V4 Flash)
- **Pipeline issues:** See `.framework/agents/PORTING_GUIDE.md`
- **Setup guide:** See `setup-instructions/SETUP_GUIDE.md`

---

*Framework v1.0 — Kerry Harris*
