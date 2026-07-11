---
type: concept
created: 2026-07-11
updated: 2026-07-11
sources: ["[[sources/bdd-cucumber-gherkin-reference_7dfdd4]]"]
tags: [term]
aliases:
  - "Gherkin Data Tables"
generation_complete: true
---


# Data Tables

## Definition
Data Tables are a Gherkin feature that allows passing a list of values as a tabular argument to a single step. They are defined inline within a Gherkin scenario using pipe characters (`|`) to separate columns, providing structured test data in a readable, compact format.

## Key Characteristics
- Columns are delimited by the pipe character (`|`), and rows are separated by line breaks.
- Data Tables are tied to a specific step — unlike the Examples table in a Scenario Outline, they belong to one step only.
- They enable passing multiple values (e.g., a list of users with name, email, twitter) in a single step, keeping scenarios concise.
- The table is parsed and made available to the step definition as a data structure (e.g., a list of maps or a table object in Cucumber, Behat, SpecFlow, etc.).
- Data Tables improve readability by structuring test data instead of requiring long, comma‑separated step arguments.

## Applications
- Providing test data for REST API calls that require multiple records (e.g., batch creation of users).
- Supplying multiple input parameters to a single step, such as verifying a list of expected items in a shopping cart.
- Reusing a step with different sets of data without duplicating the step definition.
- Used across BDD frameworks (Cucumber, SpecFlow, Behat, Behave, pytest‑bdd) to implement data‑driven steps.

## Related Concepts
- [[concepts/gherkin|gherkin]]
- [[concepts/doc-strings|doc-strings]]
- [[concepts/scenario-outline|scenario-outline]]

## Related Entities
None

## Mentions in Source

- "Data Tables — For passing a list of values." — [[sources/articles/bdd-cucumber-gherkin-reference|bdd-cucumber-gherkin-reference]]