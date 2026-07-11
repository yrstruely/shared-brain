---
type: source
created: 2026-07-11
updated: 2026-07-11
source_file: "[[sources/articles/bdd-cucumber-gherkin-reference.md]]"
tags: [Behaviour-Driven Development, Gherkin, Step Definition, Test Pyramid, Cucumber Expressions, Declarative Style, Scenario Outline, Background, Doc Strings, Data Tables, Given–When–Then, Living Documentation, Specification by Example, Example Mapping, Event Storming, Domain-Driven Design, Gherkin Tags, Discovery, Formulation, Automation, Rule, Imperative Style, Testing Through the UI, Starting with Automation Before Discovery]
aliases: ["BDD with Cucumber and Gherkin Reference", "Cucumber.io BDD Documentation"]
contentHash: 2be6-8cb2ad2e
generation_complete: true
---

# BDD with Cucumber and Gherkin: A Comprehensive Reference - Summary

## Source
- Original file: [[sources/articles/bdd-cucumber-gherkin-reference.md]]
- Ingested: 2026-07-11

## Core Content
This comprehensive reference, compiled from official Cucumber documentation, provides an authoritative overview of Behaviour-Driven Development (BDD) and its core tooling. It defines [[concepts/behaviour-driven-development|Behaviour-Driven Development]] as a methodology emphasizing discovery, collaboration, and examples—not merely testing—through three iterative practices: [[concepts/discovery|Discovery]], [[concepts/formulation|Formulation]], and [[concepts/automation|Automation]]. The source thoroughly explains [[concepts/gherkin|Gherkin]] as the structured natural language for specifying behaviour, covering all keywords including [[concepts/given–when–then|Given–When–Then]], [[concepts/background|Background]], [[concepts/scenario-outline|Scenario Outline]], and [[concepts/rule|Rule]]. It details [[concepts/step-definition|Step Definitions]] as the bridge between Gherkin steps and code, differentiating between [[concepts/cucumber-expressions|Cucumber Expressions]] and regular expressions. The document provides extensive guidance on effective Gherkin writing, advocating for [[concepts/declarative-style|Declarative Style]] over [[concepts/imperative-style|Imperative Style]], and warns against anti-patterns like [[concepts/starting-with-automation-before-discovery|Starting with Automation Before Discovery]] and [[concepts/testing-through-the-ui|Testing Through the UI]]. It relates BDD to the [[concepts/test-pyramid|Test Pyramid]] and lists complementary practices including [[concepts/domain-driven-design|Domain-Driven Design]], [[concepts/example-mapping|Example Mapping]], [[concepts/event-storming|Event Storming]], and [[concepts/living-documentation|Living Documentation]].

## Key Entities
- [[entities/cucumber|Cucumber]] — Reference BDD framework (Java, Ruby, JavaScript)
- [[entities/specflow|SpecFlow]] — .NET BDD framework inspired by Cucumber
- [[entities/behave|Behave]] — Python BDD framework
- [[entities/behat|Behat]] — PHP BDD framework
- [[entities/pytest-bdd|pytest-bdd]] — BDD plugin for pytest
- [[entities/fred-brooks|Fred Brooks]] — Author of quote on deciding what to build

## Key Concepts
- [[concepts/behaviour-driven-development|Behaviour-Driven Development]] — Core methodology (Discovery, Formulation, Automation)
- [[concepts/gherkin|Gherkin]] — Structured plain-text specification language
- [[concepts/step-definition|Step Definition]] — Code linking Gherkin steps to implementation
- [[concepts/cucumber-expressions|Cucumber Expressions]] — Default pattern syntax for step definitions
- [[concepts/given–when–then|Given–When–Then]] — Fundamental scenario pattern
- [[concepts/declarative-style|Declarative Style]] — Preferred approach focusing on "what" not "how"
- [[concepts/scenario-outline|Scenario Outline]] — Data-driven scenario execution
- [[concepts/background|Background]] — Shared context for all scenarios in a feature
- [[concepts/doc-strings|Doc Strings]] — Large text arguments for steps
- [[concepts/data-tables|Data Tables]] — Tabular arguments for steps
- [[concepts/gherkin-tags|Gherkin Tags]] — Grouping and filtering mechanism
- [[concepts/test-pyramid|Test Pyramid]] — BDD positioned at acceptance level
- [[concepts/specification-by-example|Specification by Example]] — Requirements as executable examples
- [[concepts/example-mapping|Example Mapping]] — Structured discovery conversation format
- [[concepts/event-storming|Event Storming]] — Collaborative domain exploration technique
- [[concepts/domain-driven-design|Domain-Driven Design]] — Companion methodology sharing ubiquitous language
- [[concepts/living-documentation|Living Documentation]] — Executable specs as always-current docs

## Main Points
- BDD comprises three iterative practices: Discovery (workshops for shared understanding), Formulation (Gherkin scenarios), and Automation (step definitions as tests)
- Gherkin uses declarative keywords (Feature, Rule, Scenario, Given, When, Then, And, But, Background, Scenario Outline) to describe behaviour in plain language understandable by both humans and computers
- Step Definitions use Cucumber Expressions (with built-in parameter types like {int}, {float}, {word}, {string}) or Regular Expressions to capture arguments from step text
- Write scenarios in declarative style focusing on business intent rather than UI interactions; keep scenarios short (3-5 steps)
- Major anti-patterns: starting with automation before mastering discovery, testing through the UI, and using overly complicated Background sections
- BDD operates at the acceptance level of the Test Pyramid, providing guide-rails for business behaviour while TDD handles implementation details
- BDD integrates naturally with Domain-Driven Design's ubiquitous language, Specification by Example, Example Mapping, and Event Storming