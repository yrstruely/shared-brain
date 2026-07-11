---
type: concept
created: 2026-07-11
updated: 2026-07-11
sources: ["[[sources/bdd-cucumber-gherkin-reference_7dfdd4]]"]
tags: [term]
aliases:
  - "Executable Documentation"
  - "Living Specifications"
generation_complete: true
---


# Living Documentation

## Definition
Living Documentation is a software documentation approach where specifications are written as executable scenarios (e.g., Gherkin scenarios) that serve simultaneously as specs, tests, and documentation. Because these scenarios are run as part of the automated test suite, the documentation stays perpetually current with the actual system behavior, eliminating the problem of stale, outdated documentation.

## Key Characteristics
- **Executable**: The documentation is code that can be run to verify system behavior
- **Always current**: Since it is part of the automated test suite, it reflects the actual system state
- **Triple-purpose**: Serves as specification, test, and documentation simultaneously
- **Human-readable**: Written in natural language (e.g., Gherkin) accessible to non-technical stakeholders
- **Behavior-focused**: Describes what the system does, not implementation details
- **Verifiable**: Can be automatically validated against the live system

## Applications
- **Behavior-Driven Development (BDD)**: The primary context where Living Documentation is achieved, using tools like Cucumber, Behat, or SpecFlow
- **Acceptance Test-Driven Development (ATDD)**: Ensuring acceptance criteria are documented and verifiable
- **Stakeholder Communication**: Providing a single source of truth that business analysts, developers, and testers can all read and validate
- **Regression Testing**: The same scenarios that document behavior also catch regressions when run

## Related Concepts
- [[concepts/behaviour-driven-development|Behaviour-Driven Development]]
- [[concepts/gherkin|Gherkin]]
- [[concepts/step-definition|Step Definition]]
- [[concepts/scenario-outline|Scenario Outline]]
- [[concepts/background|Background]]
- [[concepts/declarative-style|Declarative Style]]

## Related Entities
- [[entities/cucumber|Cucumber]]
- [[entities/behat|Behat]]
- [[entities/specflow|SpecFlow]]
- [[entities/behave|Behave]]
- [[entities/pytest-bdd|Pytest BDD]]

## Mentions in Source

- "Living Documentation — Executable specs that stay current with code" — [[sources/articles/bdd-cucumber-gherkin-reference|bdd-cucumber-gherkin-reference]]

## Related Pages
- The BDD Feature Generator produces living documentation from feature templates, work superseded by the merged skill [[technologies/bdd-feature-agents|bdd-feature-agents]]
- The PR Workflow automates version bumps and ticket updates, contributing to living documentation that stays in sync with code changes [[entities/pull-request-workflow|pull-request-workflow]]
- Living documentation relies on code clarity — Code Review helps ensure Gherkin scenarios and step definitions look human-authored. [[skills/dna-review|Code Review]]