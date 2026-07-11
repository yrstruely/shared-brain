---
type: concept
created: 2026-07-11
updated: 2026-07-11
sources: ["[[sources/bdd-cucumber-gherkin-reference_7dfdd4]]"]
tags: [term]
aliases:
  - "Background section"
  - "Gherkin Background"
generation_complete: true
---


# Background

## Definition
Background is a Gherkin keyword that defines a set of steps executed before every scenario in a feature file. It is placed immediately after the Feature line and provides context common to all scenarios, eliminating repetitive Given steps.

## Key Characteristics
- Runs once before each scenario within the same feature.
- Steps are typically Given steps used for setup.
- Should be kept short — no more than three or four steps — to avoid overly complex preconditions.
- Placed after the Feature line and before the first Scenario keyword.
- Overuse can hide important context, making scenarios less readable and harder to maintain.

## Applications
- **User authentication**: Logging in as a specific user for all scenarios in a feature.
- **Data setup**: Populating a database with a known state (e.g., a blog post or product catalog).
- **Common environment**: Configuring test fixtures that are required by every scenario.

## Related Concepts
- [[concepts/gherkin|gherkin]]
- [[concepts/behaviour-driven-development|behaviour-driven-development]]

## Related Entities
None.

## Mentions in Source

- "Background — Adds context to the scenarios that follow it. Runs before each scenario in the feature." — [[sources/articles/bdd-cucumber-gherkin-reference|bdd-cucumber-gherkin-reference]]
- "Best Practice: Keep your Background section short. Don't use it to set up complicated states." — [[sources/articles/bdd-cucumber-gherkin-reference|bdd-cucumber-gherkin-reference]]