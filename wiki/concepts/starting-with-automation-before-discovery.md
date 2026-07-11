---
type: concept
created: 2026-07-11
updated: 2026-07-11
sources: ["[[sources/bdd-cucumber-gherkin-reference_7dfdd4]]"]
tags: [phenomenon]
aliases:
  - "Automation-first mistake"
  - "BDD automation trap"
generation_complete: true
---


# Starting with Automation Before Discovery

## Definition
Starting with Automation Before Discovery is an anti-pattern in [[concepts/behaviour-driven-development|Behaviour-Driven Development]] (BDD) adoption. Teams new to BDD often skip the collaborative discovery phase and jump directly to writing step definitions and automating tests. The source warns that "you won't get much joy from the other two practices until you've mastered discovery". Without shared understanding, automation efforts may validate the wrong behaviour. The recommended order is Discovery → Formulation → Automation, emphasising collaboration before coding.

## Key Characteristics
- **Premature automation**: Teams begin implementing step definitions and test execution before conducting [[concepts/discovery|discovery]] workshops.
- **Lack of shared understanding**: Without discovery, team members may have different interpretations of the desired behaviour, leading to automated tests that verify incorrect or incomplete scenarios.
- **Low return on investment**: Automated tests created without prior discovery often require significant rework when the actual requirements are later clarified.
- **Violation of BDD flow**: The anti-pattern directly contradicts the prescribed BDD sequence of Discovery → [[concepts/formulation|Formulation]] → [[concepts/automation|Automation]].
- **Common in early BDD adoption**: Often observed when teams treat BDD solely as a test automation tool rather than a collaborative practice.

## Applications
- **Training and coaching**: Used as a cautionary example when introducing BDD to new teams, highlighting the importance of Discovery before Automation.
- **Process audits**: Teams can evaluate their BDD adoption by checking whether automation was started before achieving shared understanding through discovery workshops.
- **Retrospectives**: Teams experiencing difficulties with automated BDD tests can trace the root cause to this anti-pattern and pivot to a discovery-first approach.

## Related Concepts
- [[concepts/discovery|Discovery]] – the practice of collaborative exploration to build shared understanding
- [[concepts/formulation|Formulation]] – the practice of capturing examples in structured format (e.g., Gherkin)
- [[concepts/automation|Automation]] – the practice of implementing step definitions and executing tests
- [[concepts/behaviour-driven-development|Behaviour-Driven Development]] – the overarching methodology that prescribes the Discovery–Formulation–Automation flow

## Related Entities
None

## Mentions in Source

- "If you're new to BDD, discovery is the right place to start. You won't get much joy from the other two practices until you've mastered discovery." — [[|]]
- "Anti-Patterns: 1. Starting with Automation Before Discovery" — [[|]]