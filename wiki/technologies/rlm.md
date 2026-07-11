> **Type:** Technology
> **Source:** `.framework/skills/rlm-context-loader.md`
> **Related:** [[wiki/concepts/project-context|ProjectContext]], [[wiki/technologies/graphify|Graphify]]

# Recursive Language Model (RLM)

**RLM** (Recursive Language Model) is the context loading engine of the framework. It replaces naive "prompt stuffing" (dumping entire codebases into prompts) with intelligent, recursive exploration that targets ~15k tokens of highly relevant context.

---

## The Problem: Naive Prompt Stuffing

**Before RLM:**
```typescript
// Load entire codebase into prompt
const code = await readAllFiles('src/'); // 50,000+ tokens
const result = await claude.complete(prompt + code);
```

Problems:
- **Expensive:** 50k+ tokens per request
- **Slow:** More tokens = slower responses
- **Noisy:** Irrelevant code dilutes the signal
- **Context limit:** Often exceeds model limits

---

## The Solution: Recursive Context Loading

**With RLM:**
```typescript
const context = await loadProjectContext('ip-hub');
// ~15k tokens of highly relevant context
```

How it works:
1. **Load OKF index** — Understand project structure
2. **Query Graphify** — Find relevant entities and relationships
3. **Query Wiki** — Load cross-project patterns
4. **Explore recursively** — Dive into relevant code only
5. **Summarize** — Compress context intelligently

---

## RLM Implementations

| Implementation | Best For | Status |
|---------------|----------|--------|
| **hampton-io/RLM** | Claude Code plugins, interactive dev | ✅ Installed at `~/RLM` |
| **code-rabi/rllm** | NestJS backend, V8 isolates | ⏳ Available per-project via `pnpm add rllm` |

---

## Configuration

```typescript
import { RLM } from 'hampton-io/RLM';

const rlm = new RLM({
  model: 'claude-sonnet-4',
  verbose: true,
  tools: ['chunk', 'grep', 'summarize', 'groupBy'],
});
```

## Usage in Skills

Every skill uses RLM for context loading:

```typescript
// Phase 0 of every skill
const context = await loadProjectContext(projectName);

// Explore specific areas
const codePatterns = await rlm.explore({
  project: projectName,
  query: "Find existing component patterns for this feature domain",
  maxTokens: 8000
});

// Analyze requirements
const apiRequirements = await rlm.analyze({
  project: projectName,
  featureFiles,
  query: "Extract all API endpoints, methods, request/response schemas"
});
```

---

## Benefits

| Metric | Before (Naive) | After (RLM) |
|--------|---------------|-------------|
| Tokens per request | 50,000+ | ~15,000 |
| Cost per story | $5.00 | $1.50 |
| Relevance | Low (lots of noise) | High (targeted) |
| Speed | Slow | Fast |

---

## Related

- [[wiki/concepts/project-context|ProjectContext]] — What RLM loads
- [[wiki/technologies/graphify|Graphify]] — Code relationship graph that RLM queries
- [[technologies/rlm|rlm-context-loader]]
- `.framework/skills/MASTER_TEMPLATE.md` — RLM integration hooks for skills
