---
type: concept
created: 2026-07-11
updated: 2026-07-11
sources: ["[[sources/bdd-cucumber-gherkin-reference_7dfdd4]]"]
tags: [phenomenon]
aliases:
  - "UI-centric testing"
  - "Brittle UI tests"
generation_complete: true
---


# Testing Through the UI

## Definition
Testing Through the UI is an anti-pattern in Behaviour-Driven Development (BDD) where Gherkin scenarios describe low-level, implementation-specific UI interactions, such as button clicks, form field fillings, and navigation paths. This approach is considered harmful because it couples scenarios directly to the user interface's rendering details, making tests fragile and costly to maintain. The fundamental principle violated is that BDD scenarios should focus on describing business behaviour and outcomes, not the mechanics of how the user interface achieves those outcomes.

## Key Characteristics
- Scenarios are written in an imperative style, using detailed UI element names (e.g., "When I click the 'Add to Cart' button").
- Step definitions contain minimal logic and primarily serve as wrappers around UI automation tool commands.
- The scenarios break whenever the UI layout, element IDs, CSS classes, or widgets are changed, even if the underlying business behaviour remains unchanged.
- Tests are slow to execute because they require a fully rendered browser or mobile application environment.
- The anti-pattern encourages the Test Pyramid to be inverted, with an excessive number of expensive UI tests instead of a majority of fast unit and integration tests.

## Applications
- **Identifying legacy test suites**: Teams migrating from traditional test automation to BDD can use "Testing Through the UI" as a diagnostic pattern to identify scenarios in their existing test base that need to be rewritten or refactored.
- **Training and onboarding**: The anti-pattern serves as a concrete teaching example of what *not* to do when writing BDD scenarios, helping new team members internalise the distinction between UI interactions and business behaviour.
- **Code review guidelines**: Reviewers can flag scenarios that describe UI mechanics (e.g., "When I select 'United States' from the country dropdown") and recommend rewriting them in a business-oriented, declarative style (e.g., "When I specify a US shipping address").

## Related Concepts
- [[concepts/behaviour-driven-development|Behaviour-Driven Development]]
- [[concepts/declarative-style|Declarative Style]]
- [[concepts/step-definition|Step Definition]]
- [[concepts/test-pyramid|Test Pyramid]]
- [[concepts/given–when–then|Given–When–Then]]

## Related Entities
- [[entities/cucumber|Cucumber BDD framework]]
- [[entities/behat|Behat]]
- [[entities/specflow|SpecFlow]]
- [[entities/behave|Behave (Python BDD framework)]]
- [[entities/pytest-bdd|pytest BDD]]

## Mentions in Source

- "Testing Through the UI: Scenarios that describe UI interactions are brittle and miss the underlying behaviour" — [[|]]
- "BAD — UI-centric: When I click the "Add to Cart" button | When I click the "Checkout" button" — [[|]]

## Related Pages
- This frontend TDD skill involves testing through the UI, but with an accessibility-first approach to mitigate brittleness: [[concepts/skillsfrontend-tdd-implementation|skillsfrontend-tdd-implementation]] [[concepts/skillsfrontend-tdd-implementation|skillsfrontend-tdd-implementation]]