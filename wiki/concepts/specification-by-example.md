---
type: concept
created: 2026-07-11
updated: 2026-07-11
sources: ["[[sources/bdd-cucumber-gherkin-reference_7dfdd4]]"]
tags: [method]
aliases:
  - "SBE"
generation_complete: true
---


# Specification by Example

## Definition
Specification by Example (SBE) is a method for defining software requirements using concrete, executable examples rather than abstract specifications. It aligns closely with Behaviour-Driven Development (BDD) by turning discovered examples into Gherkin scenarios, forming the "Formulation" step of the BDD process. SBE is often considered a precursor or broader framework that BDD exemplifies.

## Key Characteristics
- **Example-Driven**: Requirements are documented as specific, real-world examples that illustrate desired behavior.
- **Executable Specifications**: Examples are written in a format (e.g., Gherkin) that can be automated and serve as living documentation.
- **Collaborative**: Involves stakeholders in discovering and agreeing on examples, fostering shared understanding.
- **Prevention of Ambiguity**: Concrete examples reduce misinterpretation compared to textual requirements.
- **Complementary to BDD**: SBE provides the underlying practice that BDD formalizes through Given–When–Then scenarios.

## Applications
- **Acceptance Test–Driven Development (ATDD)**: SBE is often used to define acceptance criteria before implementation.
- **Agile Requirements Elicitation**: Teams use SBE workshops to clarify user stories and identify edge cases.
- **Automated Regression Testing**: Executable examples are run as automated tests, ensuring behavior remains correct after changes.
- **Living Documentation**: The examples serve as up-to-date documentation of system behavior, easily understood by both technical and non-technical audiences.

## Related Concepts
- [[concepts/behaviour-driven-development|Behaviour-Driven Development]]
- [[concepts/example-mapping|Example Mapping]]
- [[concepts/gherkin|Gherkin]]
- [[concepts/living-documentation|Living Documentation]]
- [[concepts/given–when–then|Given–When–Then]]

## Related Entities
*None specified in the source.*

---

> **Mentions in Source**: The source document describes Specification by Example as a pattern listed alongside Event Storming and Example Mapping, noting its role in building shared understanding and automating acceptance criteria.

## Mentions in Source

- "Specification by Example — Documenting requirements as concrete examples" — [[sources/articles/bdd-cucumber-gherkin-reference|bdd-cucumber-gherkin-reference]]

## Related Pages
- The BDD Feature Agents skill originally automated specification-by-example workflows before being absorbed into the generator [[technologies/bdd-feature-agents|bdd-feature-agents]]