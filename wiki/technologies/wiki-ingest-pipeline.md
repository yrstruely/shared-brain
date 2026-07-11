> **Type:** Skill
> **Source:** `.framework/skills/wiki-ingest-pipeline.md`
> **Related:** [[wiki/technologies/rlm|RLM]], [[wiki/technologies/graphify|Graphify]], [[wiki/concepts/living-documentation|Living Documentation]]

# Wiki Ingest Pipeline

Ingest sources into the wiki: extract entities, concepts, patterns, and update indexes.

---

## Status

✅ **Active** — Uses `claude-obsidian:wiki-ingest` skill and Obsidian CLI transport.

## Dependencies

- Obsidian CLI (`Obsidian.com`) or filesystem fallback
- `claude-obsidian:wiki-ingest` skill
- `claude-obsidian:wiki-lint` skill (for post-ingest health check)

## Supported Sources

| Source Type | Location | Extraction |
|-------------|----------|------------|
| Books | `sources/books/` | Chapters, concepts, key quotes |
| Papers | `sources/papers/` | Abstract, methodology, findings, citations |
| Articles | `sources/articles/` | Key points, technologies mentioned, patterns |
| Meeting Notes | `sources/meeting-notes/` | Decisions, action items, domain concepts |
| PRDs | `projects/<name>/sources/prds/` | Requirements, features, acceptance criteria |
| RFCs | `projects/<name>/sources/rfcs/` | Technical decisions, architecture |

## Usage

```bash
# Ingest a single source
claude /wiki:ingest --source sources/articles/bdd-guide.md

# Batch ingest
claude /wiki:ingest --batch sources/articles/
```
