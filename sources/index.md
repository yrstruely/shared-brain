# Sources Index

> Raw inputs before ingestion into wiki.

---

## Categories

### [[sources/books/index\|Books]]
Technical books, architecture guides, and reference materials.

### [[sources/papers/index\|Papers]]
Research papers, whitepapers, and academic sources.

### [[sources/articles/index\|Articles]]
Blog posts, tutorials, and online articles.

### [[sources/meeting-notes/index\|Meeting Notes]]
Meeting transcripts, decisions, and action items.

---

## Ingest Workflow

```
1. Add source to appropriate category folder
2. Run /wiki:ingest sources/<category>/
3. Verify wiki pages created
4. Run /wiki:lint to check health
```

---

## Stats

| Category | Files | Ingested | Pending |
|----------|-------|----------|---------|
| Books | 0 | 0 | 0 |
| Papers | 0 | 0 | 0 |
| Articles | 0 | 0 | 0 |
| Meeting Notes | 0 | 0 | 0 |

---

## Commands

```bash
# Ingest all sources
/wiki:ingest sources/

# Ingest specific category
/wiki:ingest sources/books/

# Ingest project sources
/wiki:ingest projects/ip-hub/sources/
```
