---
type: concept
created: 2026-07-11
updated: 2026-07-11
sources: ["[[sources/bdd-cucumber-gherkin-reference_7dfdd4]]"]
tags: [method]
aliases:
  - "EventStorming"
  - "Event Storming workshop"
generation_complete: true
---


# Event Storming

## Definition
Event Storming is a collaborative workshop technique for exploring complex business domains. It was listed in the source as a related pattern to Behaviour-Driven Development and is positioned as a "collaborative discovery technique for complex domains" that complements BDD's discovery practice.

## Key Characteristics
- **Large-wall modeling**: Participants gather around a large physical wall (or digital equivalent) and use sticky notes to model domain events over time.
- **Stakeholder-inclusive**: Involves domain experts, developers, testers, and product owners to build shared understanding.
- **Event-first approach**: Focuses on domain events (things that happen in the business) as the primary modeling unit.
- **Time-ordered narrative**: Events are arranged chronologically to reveal business workflows and boundary conditions.
- **Discovery-oriented**: Used when domain rules are unclear or at the start of a new project to surface hidden complexity.

## Applications
- **Initiating BDD adoption**: Helps teams identify meaningful Gherkin scenarios by first mapping the domain events they need to describe.
- **Domain-Driven Design**: Complements strategic design phases (e.g., bounded context identification, ubiquitous language creation).
- **Process discovery**: Uncovering unknown or implicitly understood workflows in older systems.
- **Legacy system analysis**: Reverse-engineering business logic from existing codebases.
- **Cross-team alignment**: Synchronizing different teams on a shared model of the business domain.

## Related Concepts
- [[concepts/behaviour-driven-development|Behaviour-Driven Development]]
- [[concepts/domain-driven-design|Domain-Driven Design]]

## Related Entities
No related entities.

## Mentions in Source

- "Event Storming — Collaborative discovery technique for complex domains" — [[sources/articles/bdd-cucumber-gherkin-reference|bdd-cucumber-gherkin-reference]]

## Related Pages
- The discovery interview phase of Domain Entity skill aligns with event storming workshops to identify domain entities. [[concepts/domain-entity|domain-entity]]
- Event Storming is a complementary DDD workshop technique that can feed into the entity discovery interview phase. [[skills/dna-domain-entity]]