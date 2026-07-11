# dna-frontend-guide

Frontend development guide plugin for Nuxt 4 + Vue 3 projects. Provides agents for feature implementation, code review, and component architecture design.

## Skills

### `/dna-frontend-guide:dna-frontend-guide`

Main entry point. Orchestrates the full frontend development workflow:

1. Read BDD feature file to understand requirements
2. Check Figma designs for visual spec
3. Identify implementation gaps
4. Plan implementation approach
5. Delegate to sub-agents
6. Track progress

### Agents

| Agent | Purpose |
|-------|---------|
| `feature-implementer` | Implements features end-to-end from BDD specs + Figma designs |
| `code-reviewer` | Reviews code for patterns, quality, consistency, and accessibility |
| `component-architect` | Designs component architecture, identifies reuse, plans interfaces |

## Usage

```
/dna-frontend-guide:dna-frontend-guide features/0480-office-action/phase1-office-action-display-and-amendments.feature
```
