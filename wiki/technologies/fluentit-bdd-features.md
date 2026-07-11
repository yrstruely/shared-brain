> **Type:** Skill
> **Source:** `.framework/skills/fluentit-bdd-features.md`
> **Related:** [[wiki/technologies/fluentit-bdd-frontend-steps|BDD Frontend Steps]], [[wiki/technologies/fluentit-bdd-backend-steps|BDD Backend Steps]], [[wiki/technologies/rlm|RLM]]

# BDD Feature Generator

Generates Gherkin `.feature` files from specifications. **Pipeline entry point** for the BDD → TDD workflow. Project-agnostic skill ported to use [[wiki/technologies/rlm|RLM]] for context loading.

---

## Purpose

Converts PRDs, specs, and requirements into declarative Gherkin feature files.

## Pipeline

```
Phase 0: Load Project Context (via RLM)
Phase 1: Read Specs + Requirements
Phase 2: Identify Domain Entities + Rules
Phase 3: Draft Feature Files
Phase 4: Validate Declarative Style
Phase 5: Review with Domain Expert
Phase 6: Finalize + Write
Phase 7: Generate Step Definition Stubs
Phase 8: Summarize + Index
```

## Key Outputs

- `.feature` files with declarative scenarios
- Step definition stubs
- Domain entity discovery notes

## Usage

```bash
claude /framework:bdd-features --project ip-hub --specs specs/frontend/dashboard/
```

---

## Feature Template

```gherkin
Feature: <Feature Name>
  As a <role>
  I want to <action>
  So that <benefit>

  Background:
    Given the system is in <initial state>

  @<tag>
  Scenario: <Scenario Name>
    Given <precondition>
    When <action>
    Then <expected outcome>
    And <additional outcome>
```

---

## Alternative: MCP Services

Instead of skills, BDD/TDD tools can be exposed as MCP services:

| Approach | Pros | Cons |
|----------|------|------|
| Skills (Claude Code) | Tight integration, easy to invoke | Tied to Claude Code |
| MCP Server | Universal, any client can use | More setup, HTTP overhead |
| Hybrid | Skills for dev, MCP for CI/CD | More maintenance |

**Recommendation:** Start with skills. If team adoption grows, extract to MCP.
