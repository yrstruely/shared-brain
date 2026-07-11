---
type: concept
created: 2026-07-11
updated: 2026-07-11
sources: ["[[sources/bdd-cucumber-gherkin-reference_7dfdd4]]"]
tags: [term]
aliases:
  - "step definition function"
  - "step implementation"
generation_complete: true
---


# Step Definition

## Definition
A Step Definition is a code construct (typically a method annotated with a Cucumber expression or regular expression) that links a Gherkin step (like “Given I have 5 cucumbers”) to its implementation in a programming language. The source describes it as “hard-wiring the specification to the implementation.” Step definitions use either Cucumber Expressions (default, simpler syntax with placeholders like {int}, {string}) or Regular Expressions to capture arguments from step text.

## Key Characteristics
- Links Gherkin steps (Given/When/Then) to executable code.
- Uses Cucumber Expressions or Regular Expressions to parse step text.
- Captures arguments from step text using placeholders like {int}, {string}, {word}, {float}.
- Supports built-in parameter types that automatically transform matched values.
- Stored in directories named `step_definitions/` or `steps/`.
- Core automation component of the Behaviour-Driven Development (BDD) workflow.

## Applications
- Automating acceptance tests in BDD frameworks (Cucumber, Behat, SpecFlow, pytest-bdd, Behave).
- Integrating with Continuous Integration pipelines to validate business requirements.
- Allowing non-technical stakeholders to define scenarios in plain language while developers implement the underlying automation.

## Related Concepts
- [[concepts/Gherkin|Gherkin]]
- [[concepts/Cucumber-Expressions|Cucumber Expressions]]
- [[concepts/Behaviour-Driven-Development|Behaviour-Driven Development]]

## Related Entities
- [[entities/cucumber|cucumber]]
- [[entities/behat|behat]]
- [[entities/specflow|specflow]]
- [[entities/pytest-bdd|pytest-bdd]]
- [[entities/behave|behave]]

## Mentions in Source

- "A Step Definition is a method with an expression that links it to one or more Gherkin steps. Step definitions connect Gherkin steps to programming code — they 'hard-wire the specification to the implementation.'" — [[sources/articles/bdd-cucumber-gherkin-reference|bdd-cucumber-gherkin-reference]]