---
description: Ingest sources into the wiki. Extract entities, concepts, patterns, and update indexes. Supports books, papers, articles, PRDs, and RFCs.
argument-hint: Provide source file path or directory to ingest
---

# Wiki Ingest Pipeline

> Ingest sources into the wiki: extract entities, concepts, patterns, and update indexes.

---

## Status

✅ **Active** — Uses `claude-obsidian:wiki-ingest` skill and Obsidian CLI transport.

## Dependencies

- Obsidian CLI (`Obsidian.com`) or filesystem fallback
- `claude-obsidian:wiki-ingest` skill
- `claude-obsidian:wiki-lint` skill (for post-ingest health check)

---

## Supported Sources

| Source Type | Location | Extraction |
|-------------|----------|------------|
| Books | `sources/books/` | Chapters, concepts, key quotes |
| Papers | `sources/papers/` | Abstract, methodology, findings, citations |
| Articles | `sources/articles/` | Key points, technologies mentioned, patterns |
| Meeting Notes | `sources/meeting-notes/` | Decisions, action items, domain concepts |
| PRDs | `projects/<name>/sources/prds/` | Requirements, features, acceptance criteria |
| RFCs | `projects/<name>/sources/rfcs/` | Technical decisions, architecture |

---

## Ingest Workflow

```
1. Read source file
2. Extract entities (people, concepts, technologies)
3. Extract patterns (design, implementation, testing)
4. Create/update wiki pages
5. Cross-reference with existing pages
6. Update wiki/index.md statistics
7. Log operation
```

---

## Commands

| Command | Description |
|---------|-------------|
| `/wiki:ingest <path>` | Ingest a single file or directory |
| `/wiki:ingest --project <name> --all` | Ingest all sources for a project |
| `/wiki:sync` | Sync wiki with new/modified sources |
| `/wiki:lint` | Health check: orphans, dead links, gaps |

---

## Ingest Output

For each source, the pipeline creates:

- **Wiki page** in appropriate `wiki/` subdirectory
- **Concept pages** for each extracted concept
- **Pattern pages** for each discovered pattern
- **Technology pages** for each mentioned technology
- **Cross-references** via wikilinks

---

## Example

```bash
# Ingest PRDs for IP Hub
/wiki:ingest projects/ip-hub/sources/prds/

# Expected output:
# - wiki/concepts/cart-aggregate.md
# - wiki/concepts/bounded-context.md
# - wiki/patterns/repository-with-unit-of-work.md
# - wiki/patterns/cqrs-command-query-separation.md
# - wiki/technologies/nestjs-cqrs.md
# - Updated wiki/index.md statistics
```

---

## Post-Ingest

After ingestion, always run:

```bash
/wiki:lint
```

This checks for:
- Orphan pages (no inbound links)
- Dead wikilinks
- Missing cross-references
- Frontmatter gaps
- Empty sections
