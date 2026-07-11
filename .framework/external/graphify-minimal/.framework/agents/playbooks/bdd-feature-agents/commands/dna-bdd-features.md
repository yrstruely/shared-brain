---
description: Guided feature development with requirements (specs) and previous feature file understanding and architecture focus
argument-hint: Provide the relevant requirements/specs documentation files
---

# Feature Development

See context/monorepo-context.md for mono-repo paths and commands.

You are helping a business analyst implement new feature files (to the Gherkin level). Follow a systematic approach: understand the provided requirements/specs deeply, identify and ask about all under-specified details and design elegant features.

## Core Principles

- **Ask clarifying questions**: Identify all ambiguities, edge cases, and under-specified behaviors. Ask specific, concrete questions rather than making assumptions. Wait for user answers before proceeding. Ask questions early (after understanding the requirements, before designing the features).
- **Understand before acting**: Read and comprehend existing feature file patterns first
- **Read files identified by agents**: When launching agents, ask them to return lists of the most important files to read. After agents complete, read those files to build detailed context before proceeding.
- **Simple and elegant**: Prioritize readable, maintainable, architecturally sound features
- **Use TodoWrite**: Track all progress throughout
- **Mark unclear items with TODO comments**: All generator agents MUST add `# TODO:` comments in generated feature files for any unclear scenarios, steps, or acceptance criteria that need user clarification or further refinement
- **Human-readable table formatting**: When generating markdown tables or Gherkin data tables in feature files, ALL columns MUST be padded with spaces so that each column width accommodates the longest entry in that column. This ensures tables are visually aligned and easy to read in plain text editors. Example:
  ```gherkin
  | Field Name     | Value              | Expected Result    |
  | email          | user@example.com   | Valid              |
  | password       | secret123          | Valid              |
  | confirmPassword| secret123          | Passwords match    |
  ```

---

## Phase 0: Spec Type Detection

**Goal**: Determine the specification type to guide the feature generation approach

**Actions**:

1. **Detect Spec Type** by checking for folders **within the feature's spec folder**:

   - **Visual Specs**: `specs/frontend/<SPEC-FOLDER>/UI/` folder OR `*.png`, `*.jpg`, `*.pdf`, `*.fig` files
   - **Detailed Specs**: `specs/frontend/<SPEC-FOLDER>/Detailed Specs/` folder
   - **Architecture Spec**: `specs/<frontend|backend>/<SPEC-FOLDER>/(Architecture/cqrs-contract/)` folder

2. **Determine Spec Type**:

   | Found                                           | Spec Type   | Spec Path                     |
   | ----------------------------------------------- | ----------- | ----------------------------- |
   | `UI/` + `(Architecture/cqrs-contract/)` folders | `combined`  | specs/frontend/<SPEC-FOLDER>/ |
   | `(Architecture/cqrs-contract/)` only (no `UI/`) | `technical` | specs/backend/<SPEC-FOLDER>/  |
   | `UI/` or `Detailed Specs/` only                 | `ui`        | specs/frontend/<SPEC-FOLDER>/ |

3. **Verify Self-Contained Spec Folder**:

   - All required specs should be in the feature's spec folder
   - If `(Architecture/cqrs-contract/)` folder is missing but needed, prompt user to copy from master:
     ```
     cp documentation/Architecture\ Specification/<feature>-architecture.md \
        specs/<frontend|backend>/<SPEC-FOLDER>/(Architecture/cqrs-contract/)
     ```

4. **Report to User**:

   - Display detected spec type
   - List the specification files/folders found
   - If Architecture folder found, list files within
   - **Get user confirmation** before proceeding

5. **Load Architecture Specification** (for `technical` or `combined` types):
   - Read files from `specs/<frontend|backend>/<SPEC-FOLDER>/(Architecture/cqrs-contract/)`
   - Extract key elements: API contracts, CQRS commands/queries, domain events, NFRs
   - This will inform ALL subsequent phases

**Note**: If spec type cannot be determined, ask the user to specify:

- Is this a UI-focused feature (visual specs only)?
- Is this a technical/backend feature (needs Architecture folder)?
- Is this a combined full-stack feature (needs both UI and Architecture)?

---

## Phase 1: Discovery and Frontend Features Generation

**Goal**: Understand what needs to be built for the given requirement/spec and generate feature files to describe them

**User Prompt**: Initial request and user specified specs/frontend/<SPEC-FOLDER>/ documents: $ARGUMENTS

**Agent**: Use the BDD Features Generator Agent for this Phase

**Spec Type Consideration**:

- **UI type**: Focus on visual specs, user interactions, UI behavior
- **Technical type**: SKIP this phase (no frontend features) OR generate minimal UI stubs if needed
- **Combined type**: Generate frontend features, reference Architecture Specification for API integration points

**Actions**:

1. Create todo list with all phases
2. **Pass detected spec type** to agent (from Phase 0)
3. If any requirements/specs are unclear, ask user for:
   - What problem are they solving?
   - What should the feature do?
   - Any constraints or requirements?
4. Generate the feature files based on spec type:
   - **For UI/Combined**: Generate full frontend features from visual specs
   - **For Technical**: Skip or generate minimal placeholder features
   - Include `# TODO:` comments for any unclear scenarios/steps
   - **For Combined**: Reference Architecture Specification for backend integration points
5. Summarize understanding and confirm with user
6. Ask the user to review and add comments/changes, where required to the generated files
7. **Wait for answers before proceeding to Phase 2**

---

## Phase 2: Refactor Frontend Features

**Goal**: Understand users comments/changes regarding the generated frontend features and refactor them accordingly

**CRITICAL**: DO NOT SKIP this phase. User review and refinement is essential.

**User Prompt**: Initial request and user specified: specs/frontend/<SPEC-FOLDER>/ or specs/backend/<SPEC-FOLDER>/ documents (if not given use the ones from Phase 1): $ARGUMENTS

**Agent**: Use the BDD Features Refactorer Agent for this Phase

**Actions**:

1. Review the relevant frontend feature files for comments/changes (if the user hasn't provided any changes do your own review, provide your recommendation and get explicit confirmation.)
2. If any user comments/changes are unclear, ask user for clarifications
3. Create todo list with all refactoring steps
4. Refactor the features as per your list
5. Summarize the changes and confirm with user
6. **Wait for answers before proceeding to Phase 3**

If the user says "whatever you think is best", provide your recommendation and get explicit confirmation.

---

## Phase 3: Generate Non-functional Features

**Goal**: Considering the newly documented features, write up comprehensive non-functional features to match

**User Prompt**: Initial request and user specified: specs/frontend/<SPEC-FOLDER>/ or specs/backend/<SPEC-FOLDER>/ documents (if not given use the ones from Phase 2): $ARGUMENTS

**Agent**: Use the BDD Non-functional Requirements Generator Agent for this Phase

**Actions**:

1. Review the relevant feature files
2. Analyze them with a non-functional focus to identify what non-functional requirements are required
3. Create todo list to generate features for these non-functional requirements
4. Generate the features as per your list (include `# TODO:` comments for any unclear scenarios/steps)
5. Summarize the changes and confirm with user
6. Ask the user to review and add comments/changes, where required to the generated files
7. **Wait for answers before proceeding to Phase 4**

---

## Phase 4: Refactor Non-functional Features

**Goal**: Understand users comments/changes regarding the generated non-functional features and refactor them accordingly

**CRITICAL**: DO NOT SKIP this phase. User review and refinement is essential.

**User Prompt**: Initial request and user specified: specs/frontend/<SPEC-FOLDER>/ or specs/backend/<SPEC-FOLDER>/ documents (if not given use the ones from Phase 3): $ARGUMENTS

**Agent**: Use the BDD Features Refactorer Agent for this Phase

**Actions**:

1. Review the relevant non-functional feature files for comments/changes (if the user hasn't provided any changes do your own review, provide your recommendation and get explicit confirmation.)
2. If any user comments/changes are unclear, ask user for clarifications
3. Create todo list with all refactoring steps
4. Refactor the features as per your list
5. Summarize the changes and confirm with user
6. **Wait for answers before proceeding to Phase 5**

If the user says "whatever you think is best", provide your recommendation and get explicit confirmation.

---

## Phase 5: Generate Backend Features

**Goal**: Generate backend features from Architecture Specification and/or frontend features

**User Prompt**: Initial request and user specified: specs/backend/<SPEC-FOLDER>/ documents (if not given use the ones from Phase 4): $ARGUMENTS

**Agent**: Use the BDD Backend Features Generator Agent for this Phase

**Spec Type Consideration**:

- **UI type**: Generate backend features IMPLIED by frontend features (traditional approach)
- **Technical type**: Architecture Specification is PRIMARY source - generate comprehensive backend features
- **Combined type**: Start with Architecture Specification, cross-reference with frontend features

**Actions**:

1. **Pass detected spec type** to agent (from Phase 0)
2. Review the relevant input sources based on spec type:
   - **UI type**: Review frontend feature files for implied backend behavior
   - **Technical type**: Read Architecture Specification as PRIMARY source
   - **Combined type**: Read Architecture Specification FIRST, then cross-reference frontend features
3. Analyze with a backend focus to identify what requirements are required:
   - **For Technical/Combined**: Extract ALL API contracts from Architecture Specification
   - **For UI**: Identify BFFE endpoints supporting frontend scenarios
4. Create todo list to generate features for these backend requirements
5. Generate the features as per your list:
   - **For Technical/Combined**: Generate features that EXACTLY match Architecture Specification
   - Include `@architecture-aligned` tag when feature matches architecture
   - Include `# TODO:` comments for any unclear scenarios/steps
6. Summarize the changes and confirm with user
7. Ask the user to review and add comments/changes, where required to the generated files
8. **Wait for answers before proceeding to Phase 6**

---

## Phase 6: Refactor Backend Features

**Goal**: Understand users comments/changes regarding the generated backend features and refactor them accordingly

**CRITICAL**: DO NOT SKIP this phase. User review and refinement is essential.

**User Prompt**: Initial request and user specified: specs/frontend/<SPEC-FOLDER>/ or specs/backend/<SPEC-FOLDER>/ documents (if not given use the ones from Phase 5): $ARGUMENTS

**Agent**: Use the BDD Features Refactorer Agent for this Phase

**Actions**:

1. Review the relevant backend feature files for comments/changes (if the user hasn't provided any changes do your own review, provide your recommendation and get explicit confirmation.)
2. If any user comments/changes are unclear, ask user for clarifications
3. Create todo list with all refactoring steps
4. Refactor the features as per your list
5. Summarize the changes and confirm with user
6. **Wait for answers before proceeding to Phase 7**

If the user says "whatever you think is best", provide your recommendation and get explicit confirmation.

---

## Phase 7: Summarize

**Goal**: Document what was accomplished

**Actions**:

1. Mark all todos complete
2. Summarize:
   - **Spec Type Used**: UI / Technical / Combined
   - **Architecture Specification** (if used): File path and sections referenced
   - What was built
   - Key decisions made
   - Files modified
   - Suggested next steps

---
