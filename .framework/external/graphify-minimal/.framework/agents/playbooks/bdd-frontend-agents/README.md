# BDD Frontend Agents Plugin

A comprehensive, structured workflow for implementing BDD step definitions with specialized agents for: API requirements analysis, MSW handler generation, step definition scaffolding and implementation, BDD red phase validation, and Pact contract generation.

## Overview

The BDD Frontend Agents Plugin provides a systematic 9-phase approach to implementing Gherkin feature files. Instead of jumping straight into step definition code, it guides you through analyzing API requirements, creating MSW mocks, scaffolding and implementing step definitions, validating the BDD red phase, and generating Pact contracts for backend coordination—resulting in well-tested features with proper contract testing.

## Philosophy

Implementing BDD features requires more than just writing step definitions. You need to:

- **Analyze API requirements** from Gherkin scenarios before implementing
- **Create MSW handlers** to mock backend APIs consistently
- **Scaffold step definitions** to identify what needs to be implemented
- **Implement with proper patterns** using Playwright and TypeScript best practices
- **Validate the BDD red phase** to ensure tests fail for the right reasons
- **Generate Pact contracts** to coordinate with backend teams

This plugin embeds these practices into a structured workflow that runs automatically when you use the `/dna-bdd-frontend-features:dna-bdd-frontend-features` command.

## Command: `/dna-bdd-frontend-features:dna-bdd-frontend-features`

Launches a guided BDD implementation workflow with 9 distinct phases.

**Usage:**

```bash
/dna-bdd-frontend-features:dna-bdd-frontend-features Implement step definitions for apps/ip-hub-frontend/features/dashboard/*.feature using specs/frontend/dashboard/bffe-spec.md
```

Or simply:

```bash
/dna-bdd-frontend-features:dna-bdd-frontend-features
```

The command will guide you through the entire process interactively.

## The 9-Phase Workflow

### Phase 1: Analyze API Requirements

**Goal**: Extract API requirements from Gherkin scenarios and cross-reference with BFFE spec

**What happens:**

- Reads feature files and BFFE specification
- Extracts API endpoints needed for each scenario
- Plans environment-specific data (test, dev.local, ci)
- Documents variations (success, error, empty states)
- Saves analysis to `temp/api-requirements-analysis.md`

**Example:**

```
You: /dna-bdd-frontend-features:dna-bdd-frontend-features Implement apps/ip-hub-frontend/features/dashboard/*.feature
Claude: Let me analyze the API requirements from your feature files...
```

### Phase 2: Generate MSW Handlers

**Goal**: Create Mock Service Worker handlers from the API requirements analysis

**What happens:**

- Reads API requirements analysis and BFFE spec
- Creates MSW handler files in `apps/ip-hub-frontend/test/msw/handlers/`
- Implements environment-specific mock data
- Registers handlers in `apps/ip-hub-frontend/test/msw/handlers/index.ts`
- Validates TypeScript compilation

### Phase 3: Scaffold Step Definitions

**Goal**: Generate step definition scaffolds by running Cucumber.js dry-run

**What happens:**

- Executes Cucumber.js in dry-run mode
- Identifies undefined steps
- Groups steps by domain/feature area
- Creates scaffold files in `apps/ip-hub-frontend/features/step-definitions/`
- Saves scaffolding output to `temp/step-definition-scaffolds.txt`

### Phase 4: Implement Step Definitions

**Goal**: Implement step definitions with Playwright using MSW-mocked APIs

**What happens:**

- Transforms scaffold placeholders into full implementations
- Uses Playwright for browser automation
- Uses `@playwright/test` expect for assertions
- Integrates with MSW-mocked APIs
- Ensures TypeScript type safety

### Phase 5: Review Step Definitions

**Goal**: Review and improve step definitions based on user feedback

**What happens:**

- Analyzes modifications to step definition files
- Evaluates against project standards
- Classifies changes as improved, regressed, or unchanged
- Provides actionable recommendations
- Validates TypeScript and test execution

### Phase 6: Validate BDD Red Phase

**Goal**: Verify step definitions fail appropriately before application code exists

**What happens:**

- Executes Cucumber.js tests
- Categorizes failures (expected vs unexpected)
- Validates expected failures are due to missing app code
- Generates implementation roadmap from failures
- Confirms readiness to proceed

### Phase 7: Generate Pact Contracts

**Goal**: Generate consumer-driven contracts from MSW handlers

**What happens:**

- Reads MSW handlers
- Generates Pact interactions in standard format
- Cross-checks against BFFE spec
- Writes contracts to `apps/ip-hub-frontend/test/pact/pacts/`

### Phase 8: Validate MSW-Pact Sync

**Goal**: Validate MSW handlers and Pact contracts are in sync with BFFE spec

**What happens:**

- Compares response structures between MSW and Pact
- Cross-validates against BFFE specification
- Reports matches and mismatches
- Provides publication guidance on success

### Phase 9: Summarize

**Goal**: Document what was accomplished

**What happens:**

- Marks all todos complete
- Summarizes what was built
- Lists files created/modified
- Provides implementation roadmap
- Suggests next steps

## Agents

### `api-requirements-analyzer`

**Purpose**: Analyzes Cucumber/Gherkin scenarios and extracts API requirements for MSW handler creation

**Focus areas:**

- Feature file parsing
- BFFE spec cross-referencing
- Environment-specific data planning
- Response structure documentation

**When triggered:**

- Automatically in Phase 1
- Can be invoked manually for API analysis

**Output:**

- `temp/api-requirements-analysis.md` with comprehensive API requirements

### `msw-handler-generator`

**Purpose**: Creates MSW handlers from API requirements analysis

**Focus areas:**

- Handler file creation in `apps/ip-hub-frontend/test/msw/handlers/`
- Environment-specific mock data
- Response delay implementation
- Error scenario handling

**When triggered:**

- Automatically in Phase 2
- Can be invoked manually for handler creation

**Output:**

- MSW handler TypeScript files

### `step-definition-scaffolder`

**Purpose**: Generates step definition scaffolds from feature files

**Focus areas:**

- Cucumber.js dry-run execution
- Undefined step identification
- Domain-based step grouping
- Scaffold file generation

**When triggered:**

- Automatically in Phase 3
- Can be invoked manually for scaffolding

**Output:**

- Step definition scaffold files in `apps/ip-hub-frontend/features/step-definitions/`

### `step-definition-implementer`

**Purpose**: Implements step definitions using Playwright and MSW-mocked APIs

**Focus areas:**

- Playwright browser automation
- `@playwright/test` expect assertions
- `toTestId()` helper usage
- TypeScript type safety

**When triggered:**

- Automatically in Phase 4
- Can be invoked manually for implementation

**Output:**

- Fully implemented step definition files

### `step-definition-reviewer`

**Purpose**: Reviews and improves step definitions after developer changes

**Focus areas:**

- TypeScript type safety evaluation
- Playwright best practices
- BDD alignment
- Code quality assessment

**When triggered:**

- Automatically in Phase 5
- Can be invoked manually for code review

**Output:**

- Review findings and recommendations

### `bdd-red-phase-validator`

**Purpose**: Verifies step definitions fail appropriately before application code exists

**Focus areas:**

- Expected failure validation
- Unexpected failure detection
- Implementation roadmap generation
- Test environment validation

**When triggered:**

- Automatically in Phase 6
- Can be invoked manually for validation

**Output:**

- BDD red phase verification report

### `pact-contract-generator`

**Purpose**: Generates Pact contracts from MSW handlers

**Focus areas:**

- MSW handler analysis
- Pact interaction generation
- BFFE spec cross-checking
- Contract file creation

**When triggered:**

- Automatically in Phase 7
- Can be invoked manually for contract generation

**Output:**

- Pact contract JSON files in `apps/ip-hub-frontend/test/pact/pacts/`

### `pact-sync-validator`

**Purpose**: Validates MSW-Pact contract synchronization

**Focus areas:**

- Structure comparison
- BFFE spec cross-validation
- Mismatch detection and reporting
- Publication readiness

**When triggered:**

- Automatically in Phase 8
- Can be invoked manually for validation

**Output:**

- Validation report with sync status

## Usage Patterns

### Full workflow (recommended for new features):

```bash
/dna-bdd-frontend-features:dna-bdd-frontend-features Implement step definitions for apps/ip-hub-frontend/features/dashboard/*.feature using specs/frontend/dashboard/bffe-spec.md
```

Let the workflow guide you through all phases.

### Manual agent invocation:

**Analyze API requirements:**

```
"Launch api-requirements-analyzer to extract API requirements from apps/ip-hub-frontend/features/dashboard/*.feature"
```

**Generate MSW handlers:**

```
"Launch msw-handler-generator to create handlers for the dashboard domain"
```

**Scaffold step definitions:**

```
"Launch step-definition-scaffolder to generate scaffolds for apps/ip-hub-frontend/features/dashboard/*.feature"
```

**Implement step definitions:**

```
"Launch step-definition-implementer to implement the dashboard step definitions"
```

**Review step definitions:**

```
"Launch step-definition-reviewer to review changes in apps/ip-hub-frontend/features/step-definitions/dashboard-steps.ts"
```

**Validate BDD red phase:**

```
"Launch bdd-red-phase-validator to verify expected failures for apps/ip-hub-frontend/features/dashboard/*.feature"
```

**Generate Pact contracts:**

```
"Launch pact-contract-generator to create contracts from MSW handlers"
```

**Validate MSW-Pact sync:**

```
"Launch pact-sync-validator to verify contract synchronization"
```

## Best Practices

1. **Use the full workflow for new features**: The phases ensure thorough implementation
2. **Answer clarifying questions thoughtfully**: Better context leads to better results
3. **Don't skip user review phases**: This catches issues before they reach production
4. **Use BFFE spec as authoritative source**: All MSW handlers and Pact contracts should match it
5. **Validate the BDD red phase**: Ensures tests fail for the right reasons before implementation

## When to Use This Plugin

**Use for:**

- Implementing step definitions for new feature files
- Creating MSW handlers for API mocking
- Generating Pact contracts for backend coordination
- Complex features requiring multiple step definition files

**Don't use for:**

- Single-line step definition fixes
- Trivial changes to existing steps
- Features without API dependencies
- Urgent hotfixes

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Nuxt | 4.x | SSR Framework (app/ directory, auto-imports) |
| Vue | 3.x | Component Framework |
| @cucumber/cucumber | 11.3.0 | BDD Framework |
| Playwright | 1.55.1 | Browser Automation |
| MSW | - | API Mocking |
| Pact | - | Contract Testing |
| TypeScript | 5.9.3 | Language |
| Pinia | - | State Management (Composition API) |
| VueUse | - | Composables Library |
| Tailwind CSS | v4 | Styling (Vite plugin) |
| i18n | - | Localization (English, Arabic, RTL) |

## Domain Model Reference (Frontend)

The frontend is closely tied to the Domain Model. Before implementing step definitions, understand the domain entities your UI will display and manipulate.

**Location**: `documentation/technical-project-context/domain-model/` (at mono-repo root)

### UX Bounded Context Anti-Corruption Layer

**Critical for Frontend**: The UX layer uses business-friendly terminology that maps to underlying domain concepts. Read `UX Bounded Context anti-corruption layer.md` to understand:

| UX Term | Domain Concept |
|---------|----------------|
| Patent Application | IP Asset Instance (AssetCategory=Patent, Status in application_statuses) |
| Trademark Application | IP Asset Instance (AssetCategory=Trademark, Status in application_statuses) |
| Copyright Application | IP Asset Instance (AssetCategory=Copyright, Status in application_statuses) |

### Relevant Bounded Contexts for Frontend

| Context | Frontend Relevance | Documentation File |
|---------|-------------------|-------------------|
| **IP Asset Management** | Asset display, status tracking | `IP Asset Management Context.md` |
| **Patent Application** | Patent forms, filing workflows | `Patent Application Context.md` |
| **Trademark Application** | Trademark forms, registration | `Trademark Application Context.md` |
| **Copyright Application** | Copyright registration forms | `Copyright Application Context.md` |
| **Identity Management** | User profiles, authentication | `Identity Management Context.md` |
| **Shared Kernel** | Common value objects (Email, Phone, Address) | `Shared Kernel Context.md` |
| **Document Management** | File uploads, document display | `Document Management Context.md` |
| **Workflow & Status** | Status badges, progress tracking | `Worfklow Status Tracking Context.md` |
| **Fee & Payment** | Payment forms, fee display | `Fee calculation Payment.md` |

### Status Mapping for UI

When displaying application statuses, use the UX-friendly labels:

```typescript
// Application statuses (shown as "In Progress" in UX)
const applicationStatuses = [
  'Draft', 'Review', 'Ready-to-File', 'Filed',
  'Under-Examination', 'Office-Action-Issued', 'Response-Due'
]

// Granted statuses (shown as "Registered" in UX)
const grantedStatuses = ['Registered', 'Active', 'Renewed']

// Terminated statuses (shown as "Closed" in UX)
const terminatedStatuses = ['Abandoned', 'Rejected', 'Withdrawn', 'Expired']
```

### Pinia Store Structure

Pinia stores should mirror domain bounded contexts:

```typescript
// stores/patent-application.ts - mirrors Patent Application Context
export const usePatentApplicationStore = defineStore('patentApplication', () => {
  const applications = ref<IPAssetInstance[]>([])
  const draftApplication = ref<PatentApplicationDraft | null>(null)
  // ...
})
```

### Form Validation from Value Objects

Use value object validation rules from the Shared Kernel for form validation:

```typescript
// From Shared Kernel Context - Email value object
const emailSchema = z.string().email()

// From Shared Kernel Context - UAE Phone value object
const uaePhoneSchema = z.string().regex(/^\+971[0-9]{9}$/)
```

## Component Catalogue Reference

Use component-specific test patterns based on the IP Hub Component Catalogue:

| Component | Test ID Pattern | Interaction |
|-----------|----------------|-------------|
| Button | `[data-testid="${label}-button"]` | `click()` |
| TextField | `[data-testid="${name}-text-field"]` | `fill(value)` |
| SelectField | `[data-testid="${name}-select-field"]` | `selectOption(value)` |
| Checkbox | `[data-testid="${name}-checkbox"]` | `check()` / `uncheck()` |
| RadioGroup | `[data-testid="${name}-radio-group"]` | `locator('input[value="${value}"]').check()` |
| ToggleSwitch | `[data-testid="${name}-toggle"]` | `click()` |
| FileUploadField | `[data-testid="${name}-file-upload"]` | `setInputFiles(path)` |
| Accordion | `[data-testid="${title}-accordion"]` | `click()` to expand |
| TextAreaField | `[data-testid="${name}-textarea"]` | `fill(value)` |
| NumberField | `[data-testid="${name}-number-field"]` | `fill(value)` |

**Example:**

```typescript
When('Alice fills the patent title field with {string}', async function (this: ICustomWorld, title: string) {
  if (!this.page) throw new Error('Page not initialized')
  const textField = this.page.locator('[data-testid="patent-title-text-field"]')
  await textField.fill(title)
})

When('Alice selects {string} from the filing strategy dropdown', async function (this: ICustomWorld, strategy: string) {
  if (!this.page) throw new Error('Page not initialized')
  const selectField = this.page.locator('[data-testid="filing-strategy-select-field"]')
  await selectField.selectOption({ label: strategy })
})
```

## Internationalization Testing

When testing i18n-enabled components:

```typescript
// Test with locale switching
Then('Alice sees the page in Arabic', async function (this: ICustomWorld) {
  if (!this.page) throw new Error('Page not initialized')

  // Switch locale
  await this.page.evaluate(() => {
    window.__NUXT_I18N__.setLocale('ar')
  })

  // Verify RTL direction
  const html = this.page.locator('html')
  await expect(html).toHaveAttribute('dir', 'rtl')
})

// Verify translated content
Then('Alice sees {string} translated', async function (this: ICustomWorld, key: string) {
  if (!this.page) throw new Error('Page not initialized')
  // Content should be in current locale
  const element = this.page.locator(`[data-i18n-key="${key}"]`)
  await expect(element).toBeVisible()
})
```

## Project Test Commands

Use these project-specific commands:

```bash
# Unit tests
pnpm run test              # Single run
pnpm run test:watch        # Watch mode
pnpm run test:ui           # Vitest UI
pnpm run test:coverage     # With coverage report

# BDD E2E tests
pnpm run test:e2e          # Full run
pnpm run test:e2e:wip      # Only @wip tagged
pnpm run test:e2e:dry      # Dry-run for undefined steps
pnpm run test:e2e:results  # View HTML report

# Pact contracts
pnpm --filter @ip-hub/frontend pact:test         # Run Pact contract tests
pnpm --filter @ip-hub/frontend pact:generate     # Clean and regenerate contracts
pnpm --filter @ip-hub/frontend pact:validate     # Validate MSW-Pact sync
pnpm --filter @ip-hub/frontend pact:publish      # Publish to Pact Broker
pnpm --filter @ip-hub/frontend pact:workflow     # Full workflow (generate + validate)

# All tests
pnpm run test:all          # Run all tests (unit, coverage, E2E)
```

## Requirements

- Claude Code installed
- Git repository (for code review)
- Node.js with npm/yarn
- Playwright browsers installed (`npx playwright install`)

## Troubleshooting

### Agents take too long

**Issue**: Agents are slow

**Solution**:

- This is normal for large feature files
- The thoroughness pays off in better implementation

### Too many clarifying questions

**Issue**: Phase 1 asks too many questions

**Solution**:

- Be more specific in your initial request
- Provide feature files and BFFE spec location upfront
- Say "whatever you think is best" if truly no preference

### TypeScript compilation errors

**Issue**: Step definitions don't compile

**Solution**:

- Ensure `@playwright/test` is used (not Chai)
- Check for proper `ICustomWorld` type annotation
- Verify imports are correct

### MSW handlers not intercepting

**Issue**: API calls not being mocked

**Solution**:

- Verify handlers are registered in `apps/ip-hub-frontend/test/msw/handlers/index.ts`
- Check MSW server is started in `apps/ip-hub-frontend/features/support/hooks.ts`
- Confirm `MSW_ENV` environment variable is set

## Tips

- **Be specific in your feature request**: More detail = fewer clarifying questions
- **Trust the process**: Each phase builds on the previous one
- **Review agent outputs**: Agents provide valuable insights about your implementation
- **Don't skip phases**: Each phase serves a purpose
- **Use for learning**: The exploration phase teaches you about BDD patterns

## Author

Kerry Harris (kerry.harris@dna.co.nz)

## Version

1.2.0 - Added Domain Model reference (UX ACL, bounded contexts, Pinia stores, form validation), Component Catalogue, i18n/RTL testing, project test commands
