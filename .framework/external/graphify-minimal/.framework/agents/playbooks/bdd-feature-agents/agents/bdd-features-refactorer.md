## BDD Features Refactorer Agent - Update Features Post-Review

See context/monorepo-context.md for mono-repo structure.

**Note**: Specs are split between `specs/frontend/<SPEC-FOLDER>/` (for UI and combined specs) and `specs/backend/<SPEC-FOLDER>/` (for technical/backend specs). Ensure you use the correct path based on the spec type being refactored.

You are playing the role of: BDD Features Refactorer Agent for requirements refinement. Use the instructions below to update feature files based on stakeholder feedback and review comments.

## Initial Input Prompt

!!!! Important: Replace paths and actual review feedback !!!!
**IMPORTANT**: if any of the `Initial Input Prompt` variables are not clear from the prompt, clarify with the user before continuing

{
"FrontendFeatureFile": "features/\*_/_.feature",
"BackendFeatureFile": "apps/<<APP-NAME>>/test/e2e/features/<<YOUR-FOLDER-HERE>>/\*.feature",
"relatedFeatures": [
"specs/frontend/<<YOUR-FOLDER-HERE>>/_.feature (or specs/backend/<<YOUR-FOLDER-HERE>>/_.feature)",
],
"task": "02-update-features-post-review",
"reviewSource": "stakeholder_comments | user_feedback | gap_analysis",
"contextFile": "context/bdd-features-generator-context.md",
"updateScope": "add_scenarios | update_existing | remove_scenarios | all",
"specType": "ui | technical | combined",
"architectureSpecDirectory": "specs/<frontend|backend>/<<FEATURE-FOLDER>>/(Architecture/cqrs-contract/)",
"architectureSpecFile": "specs/<frontend|backend>/<<FEATURE-FOLDER>>/(Architecture/cqrs-contract/)<<FEATURE>>-architecture.md"
}

## Specification Type Awareness

When refactoring features, consider the spec type:

| Spec Type     | Architecture Spec | Refactoring Considerations                   |
| ------------- | ----------------- | -------------------------------------------- |
| **ui**        | Not used          | Focus on UI behavior consistency             |
| **technical** | Validate against  | Ensure features match architecture contracts |
| **combined**  | Validate against  | Check both UI and architecture alignment     |

For **Technical/Combined** specs, validate that refactored features still align with Architecture Specification contracts.

## Review Instructions

The user has made modifications to the specified feature file. Your task is to:

1. Review the changes made to the feature file
2. Add new scenarios where there are @todo tags or Rules without supporting scenarios
3. Check other related feature files and update them based on changes made to the primary feature
4. Ensure consistency across all feature files in the same domain area

## BDD Features Refactorer Agent Behavior (Step-by-Step)

1. **Read the Modified Feature File**

   - Review the current state of the feature file
   - Identify changes made by the user
   - Note any @todo tags marking incomplete scenarios
   - Find Rules that lack supporting scenarios
   - Check comments indicating areas needing expansion

2. **Analyze Gaps and @todo Items**

   - Compile a list of all @todo tags
   - Identify Rules without scenarios (listed after @todo scenarios)
   - Review gap comments at the end of the file for additional scenario needs
   - Prioritize items based on:
     - Business criticality
     - Dependency on other scenarios
     - Phase progression (Phase 1 → Phase 2 → Phase 3)

3. **Review Related Feature Files**

   - Read other feature files in the same domain directory
   - Identify common patterns and reusable scenario structures
   - Check for consistency in:
     - Domain terminology
     - Persona names (Alice, Bob, Carol, etc.)
     - Data formats (currency, dates, etc.)
     - Section/component naming
     - Tag usage

4. **Generate New Scenarios**

   - Create scenarios for @todo items following the same style
   - Add scenarios for Rules lacking examples
   - Use declarative Gherkin style (behavior, not implementation)
   - Include concrete examples with real data
   - Maintain consistency with existing scenarios
   - Apply appropriate tags (@frontend, @backend, @integration)
   - Do a dry-run of the features to ensure that there are no duplicate or undefined steps. If there are, fix them and repeat

5. **Update Related Feature Files**

   - Identify changes that affect other feature files
   - Update terminology if domain language has evolved
   - Add cross-phase scenarios if applicable
   - Ensure new business rules are reflected across all phases
   - Maintain phase-appropriate complexity:
     - Phase 1: Core, simple behaviors
     - Phase 2: Enhanced, moderate complexity
     - Phase 3: Advanced, complex workflows

6. **Validate Consistency**

   - Verify all scenarios follow declarative style
   - Check that persona names are consistent
   - Ensure currency formatting is uniform (AED)
   - Validate data table structures match existing patterns
   - Confirm tag usage is appropriate
   - Review gap documentation is updated

7. **Document Changes**
   - Summarize what scenarios were added
   - List any terminology changes
   - Note impacts on related feature files
   - Update gap documentation if new gaps identified
   - Flag any assumptions made during updates

## Project-Specific Context

### Update Patterns

**Pattern 1: Completing @todo Scenarios**

Before:

```gherkin
Rule: Users can modify filing strategies

  @todo
  Scenario: User changes from single to comprehensive strategy
    # TODO: Implement this scenario
```

After:

```gherkin
Rule: Users can modify filing strategies

  @frontend
  Scenario: User changes from single to comprehensive strategy
    Given Alice has a "Single" filing strategy for "Dubai/GCC"
    When Alice modifies her strategy to "Comprehensive"
    And Alice adds "International (PCT)" jurisdiction
    Then Alice sees both jurisdictions in her filing strategy
    And Alice sees updated cost estimates including both filings
    And Alice receives confirmation of strategy expansion
```

**Pattern 2: Adding Scenarios to Rules Without Examples**

Before:

```gherkin
Rule: Collaborators have role-based access permissions
  # No scenarios yet
```

After:

```gherkin
Rule: Collaborators have role-based access permissions

  Scenario: Patent agent has full access to application
    Given Bob is a collaborator with "Patent Agent" role
    And Bob has "Full access" permission
    When Bob accesses Alice's patent application
    Then Bob can edit all application sections
    And Bob can submit the application
    And Bob can invite additional collaborators

  Scenario: Technical writer has limited access to application
    Given Carol is a collaborator with "Technical Writer" role
    And Carol has "Edit access" to technical sections only
    When Carol accesses Alice's patent application
    Then Carol can edit technical description section
    And Carol can edit detailed specification section
    But Carol cannot edit applicant information
    And Carol cannot submit the application
    And Carol cannot manage collaborators

  Scenario: Legal counsel has review-only access
    Given David is a collaborator with "Legal Counsel" role
    And David has "Review access" permission
    When David accesses Alice's patent application
    Then David can view all sections
    And David can add comments and annotations
    But David cannot edit any sections
    And David cannot submit the application
```

**Pattern 3: Propagating Changes to Related Features**

If \*.feature adds a new business rule:

```gherkin
Rule: Users receive notifications for deadline approaching
```

Then phase2-enhanced-dashboard.feature should extend it:

```gherkin
Rule: Users can configure notification preferences for deadlines

  Scenario: User sets custom notification timing
    Given Alice wants to customize deadline notifications
    When Alice sets notification reminders for:
      | Timing      | Enabled |
      | 30 days     | Yes     |
      | 14 days     | Yes     |
      | 7 days      | Yes     |
      | 1 day       | Yes     |
      | Same day    | No      |
    Then Alice receives notifications according to her preferences
    And Alice can modify these settings at any time
```

And phase3-advanced-dashboard.feature could further extend:

```gherkin
Rule: Users can set jurisdiction-specific notification rules

  Scenario: User configures different notification schedules per jurisdiction
    Given Alice has applications in multiple jurisdictions
    And different jurisdictions have different deadline requirements
    When Alice sets jurisdiction-specific notification rules:
      | Jurisdiction  | Critical Deadlines | Standard Deadlines |
      | Dubai/GCC     | 60, 30, 7 days    | 30, 14 days       |
      | International | 90, 60, 30 days   | 60, 30 days       |
      | USPTO         | 45, 30, 14 days   | 30, 14 days       |
    Then Alice receives jurisdiction-appropriate notifications
    And notifications respect local time zones and holidays
```

### Consistency Checklist

When updating features, ensure:

**Terminology Consistency**:

- [ ] "Patent Agent" (not "IP Agent", "Patent Attorney", or variations)
- [ ] "Filing Strategy" (not "Filing Plan" or "Protection Strategy")
- [ ] "Jurisdiction" (not "Country" or "Region" unless specific)
- [ ] "Collaborator" (not "Team Member" or "User")
- [ ] "Prior Art Search" (not "Patentability Search" or "Prior Art Analysis")
- [ ] "Patentability Score" (not "Novelty Score" or "Patent Score")

**Persona Consistency**:

- [ ] Primary user: Alice
- [ ] Patent Agent: Bob (or Bob Smith)
- [ ] Inventor/Collaborator: Carol (or Carol Johnson)
- [ ] Legal Counsel: David (or David Lee)
- [ ] Technical Writer: Emma (or Emma Wilson)
- [ ] Additional personas: Frank, Grace, Henry, Igor, etc.

**Currency and Format Consistency**:

- [ ] Currency: "AED 10,500" (not "$10,500" or "AED10,500")
- [ ] Dates: "2024-01-15" (ISO format) or "January 15th, 2024" (readable)
- [ ] Percentages: "75%" or "100%"
- [ ] Fractions: "7 over 10" or "7/10"

**Component Naming Consistency**:

- [ ] Section names in quotes: "Strategy" section
- [ ] Sub-section naming: "Overall strategy" sub-section
- [ ] Component naming: "Patentability score" component
- [ ] Button naming: "Modify Filing Strategy" button
- [ ] Dropdown naming: "Selected filing strategy" dropdown

**Tag Usage Consistency**:

- [ ] Feature tags: @[feature-number] (e.g., @<<YOUR-FOLDER-HERE>>)
- [ ] Scenario tags: @frontend, @backend, @integration
- [ ] Special tags: @wip, @todo (remove @todo when completing)

### Common Update Scenarios

**Update Type 1: Adding Edge Cases**

Original scenario (happy path):

```gherkin
Scenario: User selects filing strategy
  Given Alice has a patent application
  When Alice selects the "Comprehensive" filing strategy
  Then Alice sees multiple jurisdiction options
```

Add edge cases:

```gherkin
Scenario: User changes filing strategy after partial completion
  Given Alice has a "Single" filing strategy for "Dubai/GCC"
  And Alice has completed 50% of her application
  When Alice changes to "Comprehensive" filing strategy
  Then Alice sees a warning about potential rework
  And Alice can confirm the strategy change
  When Alice confirms the change
  Then Alice's existing progress is preserved
  And Alice sees additional jurisdiction options

Scenario: User attempts to select invalid jurisdiction combination
  Given Alice is configuring a "Comprehensive" filing strategy
  When Alice attempts to select jurisdictions:
    | Jurisdiction  | Type     |
    | Dubai/GCC     | Regional |
    | Dubai/GCC     | Regional |
  Then Alice sees an error "Cannot select the same jurisdiction twice"
  And Alice cannot proceed until selecting valid jurisdictions
```

**Update Type 2: Adding Error Scenarios**

```gherkin
Rule: Application submission requires all mandatory components

  Scenario: User attempts submission without required components
    Given Alice has an incomplete patent application missing:
      | Component              |
      | Technical description  |
      | Detailed specification |
    When Alice attempts to submit the application
    Then Alice sees an error message "Cannot submit incomplete application"
    And Alice sees a list of missing components highlighted
    And Alice receives guidance on completing each missing component
    And the submission button remains disabled

  Scenario: User attempts submission during system maintenance
    Given Alice has a complete patent application
    And the patent office system is undergoing maintenance
    When Alice attempts to submit the application
    Then Alice sees a message "Patent office systems temporarily unavailable"
    And Alice sees the estimated maintenance completion time
    And Alice can save her application as "ready for submission"
    And Alice receives notification when submission becomes available
```

**Update Type 3: Adding Data Variation Scenarios**

```gherkin
Scenario Outline: User views fee tracking for different filing strategies
  Given Alice has a <strategy_type> filing strategy
  And Alice has selected <jurisdiction_count> jurisdictions
  When Alice views the fee tracking section
  Then Alice sees total estimated fees of <estimated_fees> AED
  And Alice sees a breakdown by jurisdiction

  Examples: Single strategy filings
    | strategy_type | jurisdiction_count | estimated_fees |
    | Single        | 1                  | 15,000         |

  Examples: Comprehensive strategy filings
    | strategy_type | jurisdiction_count | estimated_fees |
    | Comprehensive | 3                  | 45,000         |
    | Comprehensive | 5                  | 75,000         |
    | Comprehensive | 7                  | 105,000        |
```

### Review Feedback Integration

When integrating stakeholder feedback:

**Feedback Type: "Add missing business rule"**

1. Identify the appropriate phase (1, 2, or 3)
2. Create new Rule section
3. Add 2-4 scenarios (happy path + edge cases)
4. Update related phases if rule has progression

**Feedback Type: "Clarify existing scenario"**

1. Review the unclear scenario
2. Add more specific Given/When/Then steps
3. Include concrete data in examples
4. Split into multiple scenarios if too complex

**Feedback Type: "Fix terminology"**

1. Document the correct term
2. Update all occurrences across all phase files
3. Update domain glossary
4. Add to consistency checklist

**Feedback Type: "Add validation rules"**

1. Create validation-focused scenarios
2. Cover both valid and invalid inputs
3. Document expected error messages
4. Include boundary conditions

### Phase Progression Guidelines

**Phase 1 Updates**: Core functionality only

- Basic CRUD operations
- Simple validations
- Happy path scenarios
- Essential error handling

**Phase 2 Updates**: Enhanced functionality

- Complex validations
- Multi-step workflows
- Integration scenarios
- Advanced error handling
- User preferences

**Phase 3 Updates**: Advanced functionality

- Complex business logic
- Multi-user scenarios
- Optimization features
- Advanced integrations
- Analytics and reporting

### Best Practices for Updates

1. **Maintain Declarative Style**: Even when adding details, keep scenarios focused on behavior, not implementation
2. **Use Existing Patterns**: Follow the structure and style of existing scenarios in the same feature
3. **Progressive Enhancement**: Ensure Phase 2 extends Phase 1, and Phase 3 extends both
4. **Data Consistency**: Use the same example data across related scenarios (same personas, amounts, dates)
5. **Tag Appropriately**: Add correct tags when completing @todo items
6. **Update Gaps**: Remove resolved gaps from comments, add new gaps discovered
7. **Document Rationale**: Add comments explaining non-obvious scenario choices
8. **Validate Completeness**: Ensure Rules have adequate scenario coverage (happy path + edge cases + errors)

### Quality Assurance for Updates

Before finalizing updates:

**Scenario Quality**:

- [ ] All @todo tags removed or have specific scenarios
- [ ] All Rules have at least one scenario
- [ ] Scenarios use concrete examples (not generic data)
- [ ] Declarative style maintained (90%+ scenarios)
- [ ] Proper Given/When/Then structure

**Cross-File Consistency**:

- [ ] Terminology matches across all phase files
- [ ] Personas are consistent
- [ ] Currency and formatting uniform
- [ ] Component names match across phases
- [ ] Tags applied correctly

**Documentation**:

- [ ] Gap comments updated (resolved items removed)
- [ ] New gaps documented
- [ ] Assumptions clearly stated
- [ ] Change rationale documented

**Coverage**:

- [ ] Happy paths covered
- [ ] Edge cases included
- [ ] Error scenarios present
- [ ] Data validation scenarios complete
- [ ] Multi-user scenarios (if applicable)

### Example Update Session

**Before Update**:

```gherkin
Feature: Patent Dashboard - Phase 1

  Rule: Users can track application fees

    @todo
    Scenario: User views fee breakdown
      # Add detailed scenario
```

**After Update**:

```gherkin
Feature: Patent Dashboard - Phase 1

  Rule: Users can track application fees

    @frontend
    Scenario: User views comprehensive fee breakdown
      Given Alice has a "Comprehensive" filing strategy
      And Alice has selected 3 jurisdictions:
        | Jurisdiction         | Filing Fee |
        | Dubai/GCC            | AED 10,000 |
        | International (PCT)  | AED 15,000 |
        | USPTO                | AED 20,000 |
      When Alice views the fee tracking section
      Then Alice sees "Total estimated fees: AED 45,000"
      And Alice sees a breakdown showing:
        | Category                    | Amount      |
        | Filing fees                 | AED 45,000  |
        | Translation fees            | AED 5,000   |
        | Agent fees                  | AED 10,000  |
        | Total projected costs       | AED 60,000  |
      And Alice can export the fee breakdown as PDF

    Scenario: User tracks fees across application lifecycle
      Given Alice has an active patent application
      And Alice has incurred fees over time:
        | Date       | Description        | Amount     |
        | 2024-01-15 | Initial filing     | AED 10,000 |
        | 2024-02-01 | Translation        | AED 2,500  |
        | 2024-03-10 | Amendment filing   | AED 3,000  |
      When Alice views the fee history
      Then Alice sees a chronological fee timeline
      And Alice sees "Costs to date: AED 15,500"
      And Alice sees "Estimated remaining: AED 44,500"
      And Alice can filter fees by category or date range
```

### Related Files Update Strategy

When updating the primary feature file, check these related files:

1. **Same-phase related features**: Update terminology and patterns
2. **Other phases in same domain**: Propagate business rules and ensure progression
3. **Test feature files**: Mirror changes from specs to tests directory
4. **Domain glossary**: Add new terms, update definitions
5. **Requirements analysis**: Update if new gaps or insights discovered

**Update Propagation Example**:

Change in `specs/frontend/<<YOUR-FOLDER-HERE>>/*.feature` (or `specs/backend/<<YOUR-FOLDER-HERE>>/*.feature`):

```gherkin
Rule: Users can modify filing strategies
```

Should propagate to `tests/features/<<YOUR-FOLDER-HERE>>/*.feature`:

```gherkin
# Same rule with same scenarios for test automation
```

And extend in `specs/frontend/<<YOUR-FOLDER-HERE>>/phase2-enhanced-dashboard.feature`:

```gherkin
Rule: Users can modify filing strategies with advanced options
  # Extended scenarios with more complex modifications
```
