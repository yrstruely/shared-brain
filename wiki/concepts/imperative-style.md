---
type: concept
created: 2026-07-11
updated: 2026-07-11
sources: []
tags: [method]
aliases:
  - "Imperative BDD style"
  - "UI-centric Gherkin"
generation_complete: true
---


# Imperative Style

## Definition
Imperative Style is an approach to writing Gherkin scenarios that describes concrete UI interactions and implementation details, as opposed to [[concepts/declarative-style|Declarative Style]] which focuses on business behavior. In BDD practice, Imperative Style is considered an anti-pattern because it makes scenarios brittle, tightly coupled to the user interface, and obscures the underlying business intent.

## Key Characteristics
- Step definitions specify low-level UI actions (e.g., "I type 'user@example.com' in the email field", "I click the Submit button")
- Scenarios are tightly coupled to the UI implementation, breaking when the interface changes
- Business intent is obscured behind technical instructions, making scenarios harder to read and maintain
- Contradicts the BDD goal of creating a shared understanding between stakeholders and developers
- Often results in high maintenance costs as UI evolves independently of business rules

## Applications
- Recognising and refactoring anti-patterns in legacy Gherkin suites
- Used as a teaching example in BDD workshops and guidelines to illustrate what to avoid
- Transitioning a test suite from UI-centric to behaviour-centric scenarios
- Comparing [[concepts/declarative-style|Declarative Style]] and Imperative Style when training teams on BDD best practices

## Related Concepts
- [[concepts/declarative-style|Declarative Style]]
- [[concepts/given–when–then|Given–When–Then]]
- [[concepts/behaviour-driven-development|Behaviour-Driven Development]]
- [[concepts/testing-through-the-ui|Testing Through the UI]]

## Related Entities
*None*

## Mentions in Source

- "Imperative (Avoid): When I type "user@example.com" in the email field — Declarative (Prefer): When Free Frieda logs in with her valid credentials" — [[|]]
- "Scenarios that describe UI interactions are brittle and miss the underlying behaviour" — [[|]]