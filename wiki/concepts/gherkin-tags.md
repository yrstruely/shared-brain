---
type: concept
created: 2026-07-11
updated: 2026-07-11
sources: ["[[sources/bdd-cucumber-gherkin-reference_7dfdd4]]"]
tags: [term]
aliases:
  - "@tags"
  - "Tags"
  - "Gherkin Tags"
generation_complete: true
---


# Gherkin Tags

## Definition
Gherkin Tags are a secondary keyword feature in the Gherkin language used for grouping and filtering scenarios and features. They are prefixed with the `@` character and can be placed above a `Feature` or `Scenario` keyword. Tags enable selective execution of scenarios, such as running only a subset of tests tagged with a specific label, or organizing scenarios by priority, quality attribute, or team.

## Key Characteristics
- Tags are defined with a leading `@` (e.g., `@smoke`, `@fast`, `@ui`).
- They can be placed on a `Feature` or `Scenario` line, or on a `Scenario Outline` or `Example` block.
- Multiple tags can be applied to the same element (e.g., `@fast @ui`).
- Tags are inherited: a tag on a `Feature` applies to all scenarios inside that feature, but tags on individual scenarios can be added or overridden.
- Tags are part of the Gherkin grammar and are used by BDD tools (e.g., Cucumber, Behave, SpecFlow) for runtime filtering and reporting.
- They are case-sensitive by convention (e.g., `@Smoke` and `@smoke` are different tags).

## Applications
- **Selective test execution**: Run only scenarios tagged with `@smoke` for a quick smoke test, or `@regression` for a full regression suite.
- **Organizing by quality attribute**: Use tags like `@performance`, `@security`, `@usability` to group scenarios by non-functional requirements.
- **Team or ownership tagging**: Apply `@team-payments` or `@team-checkout` to assign ownership.
- **Priority or risk level**: Use `@P0`, `@P1`, `@critical` to indicate importance.
- **Environment-specific filtering**: Tags such as `@chrome-only` or `@api` can restrict execution to certain environments.
- **Reporting and analytics**: Tags appear in test reports, allowing teams to generate metrics per tag group.

## Related Concepts
- [[concepts/gherkin|gherkin]]
- [[concepts/behaviour-driven-development|behaviour-driven-development]]
- [[concepts/step-definition|step-definition]]
- [[concepts/scenario-outline|scenario-outline]]

## Related Entities
- [[entities/cucumber|cucumber]]
- [[entities/behave|behave]]
- [[entities/behat|behat]]
- [[entities/specflow|specflow]]
- [[entities/pytest-bdd|pytest-bdd]]

## Mentions in Source

- "Tags — Place above Feature or Scenario to group related features." — [[sources/articles/bdd-cucumber-gherkin-reference|bdd-cucumber-gherkin-reference]]