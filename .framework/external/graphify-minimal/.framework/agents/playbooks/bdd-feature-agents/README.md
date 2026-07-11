# BDD Feature Agents Plugin

A comprehensive, structured workflow for BDD feature development with specialized agents for: feature generation from requirements, feature updates from user feedback, non-functional requirements generation, and backend feature generation.

## Overview

The BDD Feature Agents Plugin provides a systematic 4-phase approach to building new features. Instead of jumping straight into code, it guides you through understanding the requirements, asking clarifying questions, and ensuring quality--—resulting in better-designed features that integrate seamlessly with your existing code.

## Philosophy

Building features requires more than just writing Gherkin. You need to:

- **Understand the requirements** before making changes
- **Ask questions** to clarify ambiguous requirements
- **Consider non-functional requirements** to ensure a great overall user experience
- **Design thoughtfully** before implementing

This plugin embeds these practices into a structured workflow that runs automatically when you use the `/dna-bdd-features:dna-bdd-features` command.

## Command: `/dna-bdd-features:dna-bdd-features`

Launches a guided BDD development workflow with 4 distinct phases.

**Usage:**

```bash
/dna-bdd-features:dna-bdd-features Generate feature files from the requirements specified in @specs/<YOUR_SPEC>/ folder
```

Or simply:

```bash
/dna-bdd-features:dna-bdd-features
```

The command will guide you through the entire process interactively.

## The 4-Phase Workflow

### Phase 1: Discovery and Frontend Features Generation

**Goal**: Understand the requirements and generate features

**What happens:**

- Clarifies the feature request if it's unclear
- Asks what problem you're solving
- Identifies constraints and requirements
- Summarizes understanding and confirms with you
- Generates features

**Example:**

```
You: /dna-bdd-features:dna-bdd-features Generate feature files from the requirements specified in @specs/01-Onboarding/
Claude: Let me understand what you need...
```

### Phase 2: Refactoring Post User Review

**Goal**: Understand users comments/changes regarding the generated features and refactor them accordingly

**What happens:**

- Review the relevant feature files for comments/changes
- If any comments/changes are unclear, ask user for clarifications
- Refactor the features
- Summarize the changes and confirm with user

### Phase 3: Generate Non-functional Features

**Goal**: Write up comprehensive non-functional features to match

**What happens:**

- Review the relevant feature files
- Analyze them with a non-functional focus to identify what non-functional requirements are required
- Generate the features
- Summarize the changes

### Phase 4: Generate Backend Features

**Goal**: Document corresponding backend features

**What happens:**

- Review the relevant feature files
- Analyze them with a backend focus to identify what requirements are required
- Create todo list to generate features for these backend requirements
- Generate the features as per your list
- Summarize the changes and confirm with user

## Agents

### `bdd-features-generator`

**Purpose**: Deeply analyzes existing requirements/specs and created BDD features

**Focus areas:**

- Deep BDD, cucumber, Gherkin knowledge
- Requirements analysis
- Gap analysis
- Feature file generation
- Ensures cucumber/gherkin validity via cucumber dry run
- Domain model language documentation

**When triggered:**

- Automatically in Phase 1
- Can be invoked manually when exploring feature files

**Output:**

- Feature files to the Gherkin level

### `bdd-features-refactorer`

**Purpose**: Refactors existing features based on user changes and comments

**Focus areas:**

- Checks for user changes to feature files
- Implements suggested changes
- Ensures consistency with other feature files
- Ensures cucumber/gherkin validity via cucumber dry run

**When triggered:**

- Automatically in Phase 2
- Can be invoked manually when exploring feature files

**Output:**

- Refactored feature files to the Gherkin level

### `bdd-non-functional-requirements-generator`

**Purpose**: Generates Complementary Non-functional Features

**Focus areas:**

- Identifies and categorizes non-functional requirements
- Generates non-functional features
- Ensures cucumber/gherkin validity via cucumber dry run

**When triggered:**

- Automatically in Phase 3
- Can be invoked manually when exploring feature files

**Output:**

- Refactored feature files to the Gherkin level

### `bdd-backend-features-generator`

**Purpose**: Generates Complementary Backend Features

**Focus areas:**

- Analyze frontend features for backend coverage
- Generates backend features
- Generates non-functional features for the backend
- Ensures cucumber/gherkin validity via cucumber dry run

**When triggered:**

- Automatically in Phase 4
- Can be invoked manually when exploring feature files

**Output:**

- Backend feature files to the Gherkin level

## Usage Patterns

### Full workflow (recommended for new features):

```bash
/dna-bdd-features:dna-bdd-features Analyze existing and generate new features for the requirements in: specs/<YOUR-SPEC>/
```

Let the workflow guide you through all phases.

### Manual agent invocation:

**Add a feature:**

```
"Launch bdd-features-generator to add a new feature xyz to ..."
```

**Edit a feature:**

```
"Launch bdd-features-refactorer to edit feature xyz to ..."
```

**Add non-functional features:**

```
"Launch bdd-non-functional-requirements-generator to update the non-functional features based on changes to feature xyz"
```

**Add non-functional features:**

```
"Launch bdd-backend-features-generator to update the backend features based on changes to feature xyz"
```

## Best Practices

1. **Use the full workflow for complex features**: The phases ensure thorough feature generation
2. **Answer clarifying questions thoughtfully**: better context leads to better results
3. **Don't skip code review**: this catches issues before they reach production

## When to Use This Plugin

**Use for:**

- New features that touch multiple files
- Complex integrations with existing code
- Features where requirements are somewhat unclear

**Don't use for:**

- Single-line bug fixes
- Trivial changes
- Well-defined, simple tasks
- Urgent hotfixes

## Architecture References

### Domain Model (Required for Backend Features)

Before generating features, review the relevant Domain Model documentation:

**Location**: `documentation/Technical Project Context/Domain Model/`

**Available Bounded Contexts**:

| Context | Documentation File |
|---------|-------------------|
| Patent Application | `Patent Application Context.md` |
| Trademark Application | `Trademark Application Context.md` |
| Copyright Application | `Copyright Application Context.md` |
| IP Asset Management | `IP Asset Management Context.md` |
| Identity Management | `Identity Management Context.md` |
| Shared Kernel | `Shared Kernel Context.md` |
| Document Management | `Document Management Context.md` |
| Workflow & Status | `Worfklow Status Tracking Context.md` |
| Fee & Payment | `Fee calculation Payment.md` |
| Domain Events | `Domain Events.md` |

**Usage**: Reference these documents when generating backend features to ensure correct entity names, value objects, and domain events.

### Component Catalogue (Frontend Features)

When generating frontend features, reference the available UI components:

| Component | Purpose |
|-----------|---------|
| Accordion/AccordionGroup | Collapsible content sections |
| Button | Actions and navigation |
| TextField/NumberField | Text and numeric input |
| SelectField | Dropdown selection |
| RadioGroup | Single selection from options |
| Checkbox/ToggleSwitch | Boolean toggles |
| FileUploadField | File uploads |
| TextAreaField | Multi-line text input |

### UUID Identifiers

All resource identifiers in scenarios MUST be UUIDs:

```gherkin
# Correct
Scenario: Get application by ID
  When the client sends a GET request to "/applications/550e8400-e29b-41d4-a716-446655440000"

# Incorrect - never use numeric or string IDs
Scenario: Get application by ID
  When the client sends a GET request to "/applications/123"
```

## Requirements

- Claude Code installed
- Git repository (for code review)

## Troubleshooting

### Agents take too long

**Issue**: Agents are slow

**Solution**:

- This is normal for large codebases
- The thoroughness pays off in better understanding

### Too many clarifying questions

**Issue**: Phase 3 asks too many questions

**Solution**:

- Be more specific in your initial feature request
- Provide context about constraints upfront
- Say "whatever you think is best" if truly no preference

## Tips

- **Be specific in your feature request**: More detail = fewer clarifying questions
- **Trust the process**: Each phase builds on the previous one
- **Review agent outputs**: Agents provide valuable insights about your codebase
- **Don't skip phases**: Each phase serves a purpose
- **Use for learning**: The exploration phase teaches you about your own codebase

## Author

Kerry Harris (kerry.harris@dna.co.nz)

## Version

1.1.0 - Added Domain Model reference, Component Catalogue, UUID requirements
