---
type: concept
created: 2026-07-11
updated: 2026-07-11
sources: ["[[sources/bdd-cucumber-gherkin-reference_7dfdd4]]"]
tags: [method]
aliases:
  - "BDD Automation Practice"
  - "Test Automation"
generation_complete: true
---


# Automation

## Definition
Automation is the third iterative practice in Behaviour‑Driven Development (BDD) that connects Gherkin specifications to the system under test by implementing step definitions. The output is an automated test suite that verifies the system behaves according to the specified examples.

## Key Characteristics
- Positioned as the third practice in the BDD cycle, following Discovery and Formulation.
- Relies on step definitions to map natural‑language Gherkin steps to executable code.
- Executed using frameworks such as Cucumber, which interpret Gherkin scenarios as automated tests.
- Should never be the starting point for BDD beginners; Discovery must come first to ensure the right behaviour is being automated.
- Produces living documentation that remains in sync with the system’s actual behaviour.

## Applications
- Integrating Gherkin scenario execution into continuous integration pipelines (e.g., Jenkins, GitHub Actions).
- Regression testing of critical business flows after each code change.
- Automating acceptance criteria defined collaboratively during Discovery workshops.
- Generating executable specifications that double as regression tests.

## Related Concepts
- [[concepts/discovery|Discovery]] – the first practice, which identifies examples before automation.
- [[concepts/formulation|Formulation]] – the second practice, which translates examples into structured Gherkin.
- [[concepts/step-definition|Step Definition]] – the glue code that implements each Gherkin step.
- [[concepts/behaviour-driven-development|Behaviour-Driven Development]] – the umbrella methodology that includes Automation.
- [[concepts/gherkin|Gherkin]] – the language in which scenarios are written.
- [[concepts/living-documentation|Living Documentation]] – a key outcome of automated BDD suites.

## Related Entities
- [[entities/cucumber|cucumber]] – the most widely used BDD framework for executing Gherkin scenarios.
- [[entities/behat|Behat]] – a PHP‑based BDD framework.
- [[entities/specflow|SpecFlow]] – a .NET BDD framework.
- [[entities/behave|Behave]] – a Python BDD framework.
- [[entities/pytest-bdd|pytest-bdd]] – a BDD plugin for pytest.

## Mentions in Source

- "The three iterative practices: Automation — Connect specifications to the system as failing tests — Automated test suite." — [[|]]
- "If you're new to BDD, discovery is the right place to start. You won't get much joy from the other two practices until you've mastered discovery." — [[|]]