---
type: concept
created: 2026-07-11
updated: 2026-07-11
sources: ["[[sources/bdd-cucumber-gherkin-reference_7dfdd4]]"]
tags: [term]
aliases:
  - "Docstring"
  - "Documentation strings"
generation_complete: true
---


# Doc Strings

## Definition
Doc Strings are a Gherkin feature that allows passing larger blocks of text as arguments to step definitions. They are delimited by triple quotes (`"""`) or triple backticks (`` ``` ``) and can include a language hint (e.g., `"""markdown`). Doc Strings are one of two types of step arguments in Gherkin, the other being Data Tables.

## Key Characteristics
- Delimited by triple quotes or triple backticks, optionally with a format hint.
- Preserve line breaks and indentation, enabling multi-line content.
- Can contain any text, including Markdown, JSON, XML, or plain prose.
- Typically placed after a step keyword (e.g., `Given`, `When`, `Then`) and indented relative to the step.
- Processed by the step definition as a single string argument.

## Applications
- Providing example data or configuration snippets within a scenario.
- Writing long explanatory text that complements a step (e.g., a user story description).
- Embedding formatted content like JSON payloads or Markdown documents for verification.
- Reusing predefined text blocks across multiple scenarios via Doc Strings.

## Related Concepts
- [[concepts/gherkin|Gherkin]]
- [[concepts/data-tables|Data Tables]]

## Related Entities
None.

## Mentions in Source

- "Doc Strings — For passing larger pieces of text. Delimited by """ or backticks." — [[sources/articles/bdd-cucumber-gherkin-reference|bdd-cucumber-gherkin-reference]]