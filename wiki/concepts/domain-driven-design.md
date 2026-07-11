---
type: concept
created: 2026-07-11
updated: 2026-07-11
sources: ["[[sources/bdd-cucumber-gherkin-reference_7dfdd4]]"]
tags: [method]
aliases:
  - "DDD"
generation_complete: true
---


# Domain-Driven Design

## Definition
Domain-Driven Design (DDD) is a software development methodology that emphasizes modeling software to closely reflect the domain of the business it serves. It focuses on creating a shared understanding of the domain through a "ubiquitous language" used by both technical and domain experts, and applies patterns such as aggregates, entities, value objects, and bounded contexts to structure the codebase.

## Key Characteristics
- **Ubiquitous Language:** Establishes a common, domain-specific vocabulary used consistently across code, documentation, and conversations between developers and business stakeholders.
- **Bounded Context:** Defines explicit boundaries within which a particular domain model applies, preventing ambiguity and conflicts between different sub-domains.
- **Strategic Design:** Uses patterns like context mapping, entities, value objects, aggregates, and domain events to capture business logic.
- **Collaboration-First Approach:** Encourages continuous interaction between domain experts and development teams to evolve the model.
- **Complements BDD:** Shares the concept of ubiquitous language, and in BDD/DDD projects, scenarios written in Gherkin embed the same domain terms used in the code.

## Applications
- **Complex Business Software:** Particularly effective in enterprise systems with intricate, evolving business rules that require high alignment between the code and domain knowledge.
- **Combined with BDD Practices:** The synergy between DDD and BDD is powerful—DDD structures the domain model, while BDD uses Gherkin scenarios to specify and verify behavioral outcomes in the same language.
- **Event Storming Workshops:** Often used together with [[concepts/event-storming|event-storming]] to discover bounded contexts, aggregates, and domain events collaboratively.
- **Microservices Decomposition:** The concept of bounded contexts directly maps to microservice boundaries, making DDD a natural fit for service-oriented architectures.

## Related Concepts
- [[concepts/behaviour-driven-development|Behaviour-Driven Development]]
- [[concepts/event-storming|Event Storming]]
- [[concepts/gherkin|Gherkin]]

## Related Entities
- [[entities/cucumber|Cucumber]]
- [[entities/specflow|SpecFlow]]

## Mentions in Source

- "Domain-Driven Design — BDD's natural companion; shared ubiquitous language" — [[sources/articles/bdd-cucumber-gherkin-reference|bdd-cucumber-gherkin-reference]]

## Related Pages
- Domain Entity skill implements DDD principles for designing framework-free domain entities. [[concepts/domain-entity|domain-entity]]
- Backend Modules are often implemented following Domain-Driven Design patterns for organizing application and infrastructure layers. [[entities/backend-module|backend-module]]
- Domain-Driven Design is the foundational methodology that the Domain Entity skill implements for entity design. [[skills/dna-domain-entity]]
- The Backend Module skill implements Domain-Driven Design principles by scaffolding application and infrastructure layers from domain models described in DESIGN.md. [[skills/dna-backend-module]]