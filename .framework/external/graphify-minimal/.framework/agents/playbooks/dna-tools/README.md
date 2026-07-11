# dna-tools

DNA developer tools for code quality and workflow automation.

## Skills

### dna-pr

Azure DevOps PR workflow with Linear integration.

```bash
/dna-tools:dna-pr
```

Complete PR cycle: commit, bump version, push, create Azure DevOps PR, update Linear ticket, generate Slack message.

### dna-review

Clean up AI-generated code to look human-written.

```bash
/dna-tools:dna-review
```

Spawns a subagent that removes AI artifacts:
- Obvious comments restating code
- Redundant type annotations
- Defensive null checks for impossible scenarios
- Generic variable names
- Over-engineered abstractions

Preserves functionality and keeps meaningful documentation.
