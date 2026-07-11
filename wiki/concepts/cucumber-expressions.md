---
type: concept
created: 2026-07-11
updated: 2026-07-11
sources: ["[[sources/bdd-cucumber-gherkin-reference_7dfdd4]]"]
tags: [standard]
aliases:
  - "Cucumber Expression language"
  - "Cucumber pattern syntax"
generation_complete: true
---


# Cucumber Expressions

## Definition
Cucumber Expressions are the default pattern syntax used in [[concepts/step-definition|Step Definitions]] within the [[entities/cucumber|Cucumber BDD framework]] to match [[concepts/gherkin|Gherkin]] step text and capture typed arguments. They provide a simpler and more readable alternative to regular expressions, using curly-brace parameter placeholders such as `{int}`, `{string}`, `{word}`, and `{float}`.

## Key Characteristics
- **Simpler syntax**: Uses curly-brace placeholders (`{parameter_type}`) instead of regex patterns, making step definitions more readable
- **Automatic type conversion**: Built-in parameter types automatically convert captured text to the corresponding native type — `{int}` to Integer, `{float}` to Float, `{word}` to String, and `{string}` to String with surrounding quotes removed
- **Default matching mechanism**: Cucumber Expressions are the default choice in Cucumber; users must explicitly opt into [[concepts/step-definition|Regular Expressions]]
- **Limited to literal text matching**: Cannot express complex patterns like optional groups or alternation — for such cases, regular expressions are required

## Applications
- **Step definition authoring**: Allows test automation engineers to write concise and expressive step definitions that capture dynamic values directly from Gherkin scenarios
- **BDD automation**: Used across all Cucumber-based testing frameworks (e.g., Behave, SpecFlow, Behat, pytest-bdd) to link Gherkin steps to automated code
- **Rapid test development**: Simplifies the creation of parameterized step definitions by eliminating the need for regex expertise

## Related Concepts
- [[concepts/step-definition|Step Definition]]
- [[concepts/gherkin|Gherkin]]
- [[concepts/behaviour-driven-development|Behaviour-Driven Development]]

## Related Entities
- [[entities/cucumber|Cucumber BDD framework]]
- [[entities/behave|Behave (Python BDD framework)]]
- [[entities/specflow|SpecFlow]]
- [[entities/behat|Behat BDD framework]]
- [[entities/pytest-bdd|pytest BDD plugin]]

## Mentions in Source

- "Cucumber Expressions — Default; simpler syntax with {parameter} patterns" — [[sources/articles/bdd-cucumber-gherkin-reference|bdd-cucumber-gherkin-reference]]