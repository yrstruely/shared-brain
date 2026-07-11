---
type: concept
created: 2025-03-26
updated: 2026-07-11
sources: ["[[sources/bdd-cucumber-gherkin-reference_7dfdd4]]"]
tags: [method]
aliases:
  - "BDD Formulation Practice"
  - "Specification by Example"
generation_complete: true
---


# Formulation

## Definition
Formulation is the second iterative practice in Behaviour-Driven Development (BDD) where discovered examples from the Discovery phase are documented as structured, executable specifications using the Gherkin language. The output is a set of Gherkin scenarios that serve both as human-readable documentation and as automated test specifications.

## Key Characteristics
- Bridges Discovery and Automation, ensuring that shared understanding is captured in a machine‑readable format
- Produces Gherkin scenarios written in a declarative style, focusing on behaviour rather than implementation details
- Output is both documentation and executable test specifications
- Scenarios are structured with Given–When–Then steps, optionally using Background, Scenario Outlines, Data Tables, or Doc Strings
- Enables traceability: each scenario maps directly to examples identified during Discovery

## Applications
- Converting requirements discovered in Example Mapping or Event Storming sessions into formal Gherkin feature files
- Creating living documentation that stays synchronized with automated tests
- Providing a common language for developers, testers, and domain experts to verify shared understanding
- Serving as input for test automation frameworks like Cucumber, Behat, SpecFlow, or Behave

## Related Concepts
- [[concepts/discovery|discovery]]
- [[concepts/automation|automation]]
- [[concepts/gherkin|gherkin]]
- [[concepts/specification-by-example|specification-by-example]]
- [[concepts/behaviour-driven-development|behaviour-driven-development]]
- [[concepts/given–when–then|given–when–then]]
- [[concepts/declarative-style|declarative-style]]

## Related Entities
None

## Mentions in Source

- "The three iterative practices: Formulation — Document examples as structured, executable specifications — Gherkin scenarios." — [[|]]
- "The three iterative practices: Discovery — Explore what the system could do through collaborative workshops — Shared understanding." — [[|]]

## Related Pages
- Defines the BDD Formulation practice, of which feature template Gherkin generation is a key component [[technologies/bdd-feature-agents|bdd-feature-agents]]