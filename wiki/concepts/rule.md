---
type: concept
created: 2026-07-11
updated: 2026-07-11
sources: ["[[sources/bdd-cucumber-gherkin-reference_7dfdd4]]"]
tags: [term]
aliases:
  - "Gherkin Rule keyword"
  - "Business Rule"
generation_complete: true
---


# Rule

## Definition
A **Rule** is a Gherkin keyword introduced in Gherkin 6 that represents a single business rule to be implemented. It groups one or more related [[concepts/scenario-outline|Scenarios]] under a specific business rule, providing additional structure between the [[concepts/gherkin|Feature]] and individual Scenario blocks.

## Key Characteristics
- Introduced in Gherkin 6 (Cucumber 3.0+), making it a relatively recent addition to the language.
- Placed after the `Feature` keyword and before its associated Scenarios, visually separating different business rules within the same feature file.
- Each `Rule` block contains one or more [[concepts/given–when–then|Scenarios]] that implement that rule.
- Helps organize feature files by business logic rather than by test case, aligning with [[concepts/behaviour-driven-development|Behaviour-Driven Development]] principles.
- Does not introduce any new step syntax; it purely adds structural grouping.

## Applications
- Structuring complex feature files where multiple business rules are defined under a single feature (e.g., an online shop with separate rules for checkout, discounts, and returns).
- Improving readability and maintainability by grouping scenarios that belong to the same business rule.
- Facilitating communication between stakeholders, as the `Rule` name directly reflects a business requirement.
- Used in combination with [[concepts/gherkin-tags|Gherkin Tags]] and [[concepts/background|Background]] sections for fine-grained organisation.

## Related Concepts
- [[concepts/gherkin|Gherkin]]
- [[concepts/scenario-outline|Scenario]]
- [[concepts/gherkin|Gherkin]]
- [[concepts/behaviour-driven-development|Behaviour-Driven Development]]

## Related Entities
None

## Mentions in Source

- "Rule (Gherkin 6+) — Represents one business rule that should be implemented. Groups scenarios under a specific rule." — [[|]]
- "Feature: Highlander
  Rule: There can be only One
    Example: Only One -- More than one alive
      Given there are 3 ninjas
      When 2 ninjas meet, they will fight
      Then one ninja dies (there can be only one)" — [[|]]

## Related Pages
- Business rules defined during entity design can be expressed using the Gherkin Rule keyword for validation. [[skills/dna-domain-entity]]