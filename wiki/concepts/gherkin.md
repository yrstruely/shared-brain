---
type: concept
created: 2026-07-11
updated: 2026-07-11
sources: ["[[sources/bdd-cucumber-gherkin-reference_7dfdd4]]"]
tags: [standard]
aliases:
  - "Gherkin language"
  - "BDD language"
generation_complete: true
---


# Gherkin

## Definition
Gherkin is a set of grammar rules that defines a structured plain-text language used to describe software behaviour in a way that both humans and computers can understand. It serves as the language of Behaviour-Driven Development (BDD), defining a standard syntax for documenting and automating executable specifications.

## Key Characteristics
- **Domain-Specific Language**: Gherkin is a structured plain-text language with its own grammar and keywords, not a general-purpose programming language
- **Keyword-Driven**: Uses a core set of keywords including `Feature`, `Rule`, `Scenario` (or `Example`), `Given`, `When`, `Then`, `And`, `But`, `Background`, and `Scenario Outline`
- **Multilingual**: Supports over 70 languages, specified via a header comment (e.g., `# language: no` for Norwegian)
- **Executable Specifications**: Gherkin documents (with `.feature` extension) are both human-readable documentation and machine-interpretable test inputs when paired with a BDD framework
- **Collaboration-Focused**: Designed to be the *lingua franca* of BDD, enabling collaboration across roles with different technical backgrounds
- **Supporting Elements**: Includes step arguments like Doc Strings and Data Tables, and secondary elements like tags (`@tag`) and comments
- **Standard File Organization**: Typically stored in directories such as `features/` or `test/e2e/features/`

## Applications
- **Behaviour-Driven Development (BDD)**: Gherkin is the primary language for writing BDD scenarios that define expected software behaviour before code is written
- **Executable Documentation**: `.feature` files serve as living documentation that describes the system's behaviour and can be executed as automated tests
- **Cross-Role Communication**: Enables product owners, developers, and testers to collaborate on a shared, readable description of software behaviour
- **Test Automation**: When combined with step definitions in frameworks like Cucumber, Gherkin scenarios drive automated acceptance tests
- **Specification by Example**: Supports the practice of illustrating requirements through concrete examples using the `Scenario Outline` and `Examples` table structures

## Related Concepts
- [[concepts/behaviour-driven-development|Behaviour-Driven Development]]
- [[concepts/cucumber-expressions|Cucumber Expressions]]
- [[concepts/step-definition|Step Definition]]
- [[concepts/test-pyramid|Test Pyramid]]

## Related Entities
- [[entities/cucumber|Cucumber]]
- [[entities/behat|Behat]]
- [[entities/specflow|SpecFlow]]
- [[entities/behave|Behave]]
- [[entities/pytest-bdd|pytest-bdd]]

## Mentions in Source

- "Gherkin is a set of grammar rules that makes plain text structured enough for Cucumber to understand. It uses a small set of keywords to describe software behavior in plain language." — [[sources/articles/bdd-cucumber-gherkin-reference|bdd-cucumber-gherkin-reference]]
- "Gherkin is the lingua franca — readable by humans and computers" — [[sources/articles/bdd-cucumber-gherkin-reference|bdd-cucumber-gherkin-reference]]