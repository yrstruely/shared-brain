# TDD Frontend Agents Plugin

A comprehensive, structured workflow for Test-Driven Development of frontend features with specialized agents for: generating failing tests (Red), implementing code to pass tests (Green), validating architecture and accessibility (Validate), and refactoring for quality (Clean).

## Overview

The TDD Frontend Agents Plugin provides a systematic approach to building frontend features using Test-Driven Development. Instead of writing code first and testing later, it guides you through the proven Red → Green → Validate → Clean cycle—resulting in well-tested, high-quality code that works correctly from the start.

## Philosophy

Building features with TDD requires discipline:

- **Red first**: Write failing tests before any implementation
- **Minimal implementation**: Write only enough code to make tests pass (YAGNI)
- **Never modify tests to pass**: Fix implementation, not tests
- **Validate before refactoring**: Ensure green state and architecture compliance
- **Refactor with confidence**: Improve code quality knowing tests protect you

This plugin embeds these practices into a structured workflow that runs automatically when you use the `/dna-tdd-frontend:dna-tdd-implement` command.

## Command: `/dna-tdd-frontend:dna-tdd-implement`

Launches a guided TDD development workflow with 8 distinct phases.

**Usage:**

```bash
/dna-tdd-frontend:dna-tdd-implement Implement the BDD features in @specs/<YOUR_FEATURE>/*.feature
```

Or simply:

```bash
/dna-tdd-frontend:dna-tdd-implement
```

The command will guide you through the entire process interactively.

### Workflow Shortcuts

For experienced users, shortcuts are available:

| Shortcut    | Description                 | Phases |
| ----------- | --------------------------- | ------ |
| `full`      | Complete TDD cycle          | 1-8    |
| `implement` | Tests exist, implement only | 3-5, 8 |
| `validate`  | Just run validation         | 4 only |
| `refactor`  | Tests pass, refactor only   | 6-7, 8 |
| `e2e-only`  | Just run E2E validation     | 5 only |

**Usage:**

```bash
/dna-tdd-frontend:dna-tdd-implement specs/dashboard/*.feature --shortcut=implement
```

## The 8-Phase Workflow

```
┌─────────────────────────────────────────────────────────────┐
│  Phase 1: Generate Tests (Red)                              │
│  └─→ Tests fail because implementation doesn't exist        │
├─────────────────────────────────────────────────────────────┤
│  Phase 2: Review Tests                                      │
│  └─→ User confirms test coverage and quality                │
├─────────────────────────────────────────────────────────────┤
│  Phase 3: Implement Code (Green)                            │
│  └─→ Minimal code to make tests pass                        │
├─────────────────────────────────────────────────────────────┤
│  Phase 4: Validate Green Status                             │
│  └─→ Architecture, accessibility, regression checks         │
├─────────────────────────────────────────────────────────────┤
│  Phase 5: BDD E2E Validation                                │
│  └─→ End-to-end scenarios pass                              │
├─────────────────────────────────────────────────────────────┤
│  Phase 6: Refactor (TDD Clean)                              │
│  └─→ Improve code without changing behavior                 │
├─────────────────────────────────────────────────────────────┤
│  Phase 7: Validate After Refactoring                        │
│  └─→ Confirm no regressions from refactoring                │
├─────────────────────────────────────────────────────────────┤
│  Phase 8: Summarize                                         │
│  └─→ Document what was accomplished                         │
└─────────────────────────────────────────────────────────────┘
```

### Phase 1: Generate Unit and Integration Tests (TDD Red)

**Goal**: Generate failing tests from BDD feature files

**What happens:**

- Analyzes BDD feature files to understand expected behavior
- Generates unit tests in `test/unit/` for component logic
- Generates integration tests in `test/integration/` for page/route logic
- Runs tests to confirm they fail (Red phase)
- Summarizes generated tests for user review

**Example:**

```
You: /dna-tdd-frontend:dna-tdd-implement Implement features in @specs/dashboard/*.feature
Claude: Let me analyze the BDD features and generate failing tests...
```

### Phase 2: Review and Refine Tests

**Goal**: User reviews generated tests and provides feedback

**What happens:**

- Reviews generated test files with the user
- Clarifies any ambiguous feedback
- Updates tests to match user expectations
- Confirms test coverage before implementation

### Phase 3: Implement Code to Pass Tests (TDD Green)

**Goal**: Implement minimal code to make all failing tests pass

**What happens:**

- Analyzes failing tests to understand requirements
- Reviews existing codebase patterns
- Implements Vue components with required `data-testid` attributes
- Implements props interfaces matching test expectations
- Adds accessibility attributes (ARIA labels, semantic HTML)
- Runs tests iteratively until all pass

### Phase 4: Validate Green Status

**Goal**: Comprehensively validate that all tests pass and architecture is correct

**What happens:**

- Pre-validation checks (TypeScript compilation, lint)
- Validates Vue/Nuxt architecture patterns:
  - All components use `<script setup lang="ts">`
  - Props defined with `defineProps<Props>()` using TypeScript interface
  - Emits defined with `defineEmits<{...}>()` with typed events
  - No `any` types in component code
  - Composables follow `useXxx` naming and return object pattern
- Validates accessibility compliance:
  - All interactive elements have `data-testid` attributes
  - ARIA attributes on custom controls
  - Semantic HTML structure
  - Keyboard navigation support
- Runs all test suites (unit, integration)
- Runs regression tests (existing features still pass)
- Generates validation report

### Phase 5: BDD E2E Validation

**Goal**: Validate implementation with Cucumber E2E tests

**What happens:**

- Runs Cucumber E2E tests against the implementation
- Identifies and fixes any scenario failures
- Confirms user acceptance criteria are met

### Phase 6: Refactor (TDD Clean)

**Goal**: Improve code quality without changing behavior

**What happens:**

- Verifies all tests pass (baseline)
- Analyzes code for refactoring opportunities
- Presents refactoring plan for user approval
- Executes refactorings one at a time with test verification
- Documents suggested tests for future Red phase

### Phase 7: Validate After Refactoring

**Goal**: Confirm all tests still pass after refactoring

**What happens:**

- Runs full test suite
- Verifies test counts match pre-refactor baseline
- Checks TypeScript compilation and lint
- Generates comparison report (before vs after)
- Reverts problematic changes if regressions detected

### Phase 8: Summarize

**Goal**: Document what was accomplished

**What happens:**

- Summarizes tests generated and implementation completed
- Lists key decisions made
- Suggests next steps

## Agents

### `tdd-red-test-generator`

**Purpose**: Generates failing unit and integration tests from BDD feature files

**AI Identity**: Senior Frontend Test Engineer specializing in Vue/Nuxt TDD

**Focus areas:**

- Parsing Gherkin features and extracting steps
- Mapping BDD steps to test scenarios
- Generating Vitest unit tests with @vue/test-utils
- Generating integration tests with @nuxt/test-utils
- Ensuring tests fail appropriately (Red phase)

**When triggered:**

- Automatically in Phase 1
- Can be invoked manually for test generation

**Output:**

- Unit tests in `test/unit/`
- Integration tests in `test/integration/`

### `tdd-green-implementer`

**Purpose**: Implements minimal code to make failing tests pass

**AI Identity**: Senior Vue/Nuxt Frontend Developer specializing in Composition API and Accessibility

**Focus areas:**

- Analyzing test expectations
- Creating Vue components with Composition API
- Implementing TypeScript interfaces
- Adding accessibility attributes
- Following existing codebase patterns

**When triggered:**

- Automatically in Phase 3
- Can be invoked manually for implementation

**Output:**

- Vue components in `app/components/`
- Nuxt pages in `app/pages/`
- Composables in `app/composables/`
- Type definitions in `app/types/`

### `tdd-green-validator`

**Purpose**: Validates green state, architecture compliance, and accessibility

**AI Identity**: Senior QA Engineer specializing in Vue/Nuxt Frontend Testing and Accessibility

**Focus areas:**

- Vue/Nuxt architecture validation (script setup, typed props/emits)
- Accessibility compliance (data-testid, ARIA, semantic HTML, keyboard navigation)
- Regression testing across all test types
- Validation report generation

**When triggered:**

- Automatically in Phase 4 and Phase 7
- Can be invoked manually for validation

**Output:**

- Validation report with pass/fail status
- Architecture compliance checklist
- Accessibility compliance checklist

### `tdd-clean-refactorer`

**Purpose**: Refactors code while maintaining test compliance

**AI Identity**: Senior Vue/Nuxt Architect specializing in Component Design and Refactoring

**Focus areas:**

- Component extraction (splitting large components)
- Composable extraction (reusable logic)
- Type improvements (removing `any`, adding interfaces)
- Performance optimization (computed, v-once, lazy loading)
- Accessibility improvements

**When triggered:**

- Automatically in Phase 6
- Can be invoked manually for refactoring

**Output:**

- Refactored components and composables
- Suggested tests for future Red phase

## Architecture Validations

The green-validator agent checks these patterns based on Vue/Nuxt best practices:

| Category       | What's Validated                                                                         |
| -------------- | ---------------------------------------------------------------------------------------- |
| Components     | `<script setup lang="ts">`, `defineProps<Props>()`, `defineEmits<{}>()`, no `any`        |
| Composables    | `useXxx` naming convention, return object pattern, ref/computed state                    |
| Accessibility  | data-testid on interactive elements, ARIA attributes, semantic HTML, keyboard navigation |
| Stores (Pinia) | Composition API style, state as refs, getters as computed, actions as functions          |
| Types          | No implicit any, proper interfaces, typed props/emits                                    |

## Usage Patterns

### Full workflow (recommended for new features):

```bash
/dna-tdd-frontend:dna-tdd-implement Implement the dashboard feature from @specs/dashboard/*.feature
```

Let the workflow guide you through all phases.

### Manual agent invocation:

**Generate tests:**

```
"Launch tdd-red-test-generator to create tests for the user profile feature"
```

**Implement code:**

```
"Launch tdd-green-implementer to make the failing tests in test/unit/UserProfile.test.ts pass"
```

**Validate implementation:**

```
"Launch tdd-green-validator to validate the dashboard implementation"
```

**Refactor code:**

```
"Launch tdd-clean-refactorer to improve the Dashboard component"
```

## Best Practices

1. **Use the full workflow for complex features**: The phases ensure thorough test coverage and implementation
2. **Answer clarifying questions thoughtfully**: Better context leads to better tests
3. **Don't skip the review phases**: Catching issues early saves time
4. **Trust the Red phase**: Tests should fail initially—that's the point
5. **Keep implementations minimal**: Only write code to make tests pass
6. **Validate before refactoring**: Ensure green state is confirmed first
7. **Run validation after refactoring**: Catch regressions immediately

## When to Use This Plugin

**Use for:**

- New features that need comprehensive test coverage
- Complex components with multiple interactions
- Features where requirements are defined in BDD specs
- Code that needs to be maintainable and refactorable

**Don't use for:**

- Single-line bug fixes
- Trivial changes with existing test coverage
- Urgent hotfixes (but add tests later!)
- Exploratory prototyping

## Technology Stack

| Technology       | Version | Purpose                                    |
| ---------------- | ------- | ------------------------------------------ |
| Nuxt             | 4.x     | SSR Framework (app/ directory, auto-imports) |
| Vue              | 3.x     | Component framework (Composition API)      |
| TypeScript       | 5.x     | Type safety                                |
| Vitest           | -       | Test runner                                |
| @vue/test-utils  | -       | Component testing                          |
| @nuxt/test-utils | -       | Nuxt integration testing                   |
| happy-dom        | -       | DOM environment                            |
| Cucumber         | 11.x    | BDD framework                              |
| Playwright       | -       | E2E browser automation                     |
| MSW              | -       | API mocking                                |
| Pinia            | -       | State management (Composition API stores)  |
| VueUse           | -       | Composables library                        |
| Tailwind CSS     | v4      | Styling (Vite plugin)                      |
| Storybook        | 9.1     | Component documentation                    |
| i18n             | -       | Localization (English, Arabic, RTL)        |

## Domain Model Reference (Frontend)

The frontend is closely tied to the Domain Model. Before implementing components, understand the domain entities your UI will display and manipulate.

**Location**: `documentation/Technical Project Context/Domain Model/`

### UX Bounded Context Anti-Corruption Layer

**Critical for Frontend Implementation**: The UX layer uses business-friendly terminology that maps to underlying domain concepts. Read `UX Bounded Context anti-corruption layer.md` to understand:

| UX Term | Domain Concept |
|---------|----------------|
| Patent Application | IP Asset Instance (AssetCategory=Patent, Status in application_statuses) |
| Trademark Application | IP Asset Instance (AssetCategory=Trademark, Status in application_statuses) |
| Copyright Application | IP Asset Instance (AssetCategory=Copyright, Status in application_statuses) |
| My Applications | IP Asset Instances filtered by owner + application statuses |
| Registered Assets | IP Asset Instances with status in [Registered, Active, Renewed] |

### Relevant Bounded Contexts for Frontend

| Context | Implementation Relevance | Documentation File |
|---------|-------------------------|-------------------|
| **IP Asset Management** | Asset display components, status tracking | `IP Asset Management Context.md` |
| **Patent Application** | Patent form components, filing workflow pages | `Patent Application Context.md` |
| **Trademark Application** | Trademark form components, registration pages | `Trademark Application Context.md` |
| **Copyright Application** | Copyright registration components | `Copyright Application Context.md` |
| **Identity Management** | User profile components, auth state | `Identity Management Context.md` |
| **Shared Kernel** | Reusable value object types, form validation | `Shared Kernel Context.md` |
| **Document Management** | File upload components, document viewers | `Document Management Context.md` |
| **Workflow & Status** | Status badge components, progress indicators | `Worfklow Status Tracking Context.md` |
| **Fee & Payment** | Payment form components, fee calculators | `Fee calculation Payment.md` |

### TypeScript Types from Domain Model

Generate TypeScript interfaces that mirror domain entities:

```typescript
// types/domain/ip-asset.ts - from IP Asset Management Context
interface IPAssetInstance {
  id: string // UUID
  assetCategory: 'Patent' | 'Trademark' | 'Copyright'
  status: ApplicationStatus | GrantedStatus | TerminatedStatus
  ownerId: string // UUID
  filingDate?: Date
  registrationDate?: Date
}

// types/domain/patent-application.ts - from Patent Application Context
interface PatentApplicationDraft {
  id: string // UUID
  title: string
  inventors: Inventor[]
  claims: PatentClaim[]
  status: 'Draft' | 'Review' | 'Ready-to-File'
}
```

### Pinia Store Structure

Pinia stores should mirror domain bounded contexts:

```typescript
// stores/patent-application.ts - mirrors Patent Application Context
export const usePatentApplicationStore = defineStore('patentApplication', () => {
  // State mirrors domain entities
  const applications = ref<IPAssetInstance[]>([])
  const draftApplication = ref<PatentApplicationDraft | null>(null)

  // Getters mirror domain queries
  const pendingApplications = computed(() =>
    applications.value.filter(app => applicationStatuses.includes(app.status))
  )

  // Actions mirror domain commands
  async function submitApplication(draft: PatentApplicationDraft) {
    // Maps to SubmitPatentApplication command
  }

  return { applications, draftApplication, pendingApplications, submitApplication }
})
```

### Form Validation from Value Objects

Use value object validation rules from the Shared Kernel:

```typescript
// composables/useValidation.ts - from Shared Kernel Context
import { z } from 'zod'

// Email value object validation
export const emailSchema = z.string().email('Invalid email format')

// UAE Phone value object validation
export const uaePhoneSchema = z.string().regex(
  /^\+971[0-9]{9}$/,
  'Must be valid UAE phone number (+971XXXXXXXXX)'
)

// Address value object validation
export const addressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  emirate: z.enum(['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Fujairah', 'Ras Al Khaimah', 'Umm Al Quwain']),
  country: z.literal('UAE'),
})
```

### Component Props from Domain Entities

Component props should reflect domain entity structures:

```typescript
// components/PatentApplicationCard.vue
interface Props {
  application: IPAssetInstance // From domain model
  showActions?: boolean
}

// components/StatusBadge.vue
interface Props {
  status: ApplicationStatus | GrantedStatus | TerminatedStatus
  size?: 'sm' | 'md' | 'lg'
}
```

## Directory Structure

```
app/
├── components/       # Vue components (implementation target)
├── pages/            # Nuxt pages (implementation target)
├── composables/      # Reusable composition functions
├── stores/           # Pinia state management
├── types.ts          # TypeScript interfaces
└── test-utils/       # Factory functions for testing

test/
├── unit/             # Unit tests (generated in Red phase)
├── integration/      # Integration tests (generated in Red phase)
├── mocks/            # Mock helpers
├── msw/              # MSW handlers
└── setup.ts          # Test configuration and mocks

specs/                # BDD feature files (input for Red phase)
```

## Project Test Commands

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

# All tests
pnpm run test:all          # Run all tests (unit, coverage, E2E)

# Code quality
npx tsc --noEmit          # TypeScript check
pnpm run lint              # Lint check
pnpm run build             # Build verification
```

## Code Coverage Validation

Run coverage and verify thresholds:

```bash
pnpm run test:coverage
```

Coverage report should show:
- **Lines**: >= 80%
- **Branches**: >= 80%
- **Functions**: >= 80%

## Pinia Store Testing

Generate tests for Pinia stores following Composition API patterns:

```typescript
// test/unit/stores/user-store.spec.ts
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '~/stores/user'

describe('UserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default state', () => {
    const store = useUserStore()
    expect(store.isAuthenticated).toBe(false)
  })

  it('should update user on login', async () => {
    const store = useUserStore()
    await store.login({ email: 'alice@example.com' })
    expect(store.isAuthenticated).toBe(true)
  })

  it('should compute fullName from user state', () => {
    const store = useUserStore()
    store.user = { firstName: 'Alice', lastName: 'Smith' }
    expect(store.fullName).toBe('Alice Smith')
  })
})
```

## VueUse Composable Patterns

When implementing with VueUse composables:

```typescript
// Use VueUse for browser APIs
import { useStorage, useMediaQuery, useDark } from '@vueuse/core'

// Local storage with reactivity
const userPreferences = useStorage('preferences', { theme: 'light' })

// Responsive design
const isMobile = useMediaQuery('(max-width: 768px)')

// Dark mode toggle
const isDark = useDark()
```

Testing VueUse-based functionality:

```typescript
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

describe('Component using VueUse', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // Mock localStorage for useStorage
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
    })
  })

  it('should respond to media query changes', async () => {
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(max-width: 768px)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    })
    // ... test responsive behavior
  })
})
```

## Troubleshooting

### Tests pass immediately (should fail)

**Issue**: Generated tests pass without implementation

**Solution:**

- Tests may be too lenient or mocking incorrectly
- Review test assertions for specificity
- Ensure tests check actual behavior, not just existence

### Implementation doesn't pass tests

**Issue**: Code written but tests still fail

**Solution:**

- Check `data-testid` attributes match test expectations exactly
- Verify props interface matches test assertions
- Review test error messages for specific failures

### Validation fails on architecture

**Issue**: Green validator reports architecture issues

**Solution:**

- Ensure components use `<script setup lang="ts">`
- Check props are defined with `defineProps<Props>()`
- Replace any `any` types with proper interfaces
- Verify composables follow `useXxx` naming

### Accessibility validation fails

**Issue**: Green validator reports accessibility issues

**Solution:**

- Add `data-testid` attributes to all interactive elements
- Add ARIA attributes to custom controls (dropdowns, modals)
- Use semantic HTML elements (`<button>`, `<nav>`, `<main>`)
- Ensure keyboard navigation works (Tab, Enter, Escape)

### Refactoring breaks tests

**Issue**: Tests fail after refactoring

**Solution:**

- Revert the change immediately
- Analyze what the test expected vs. what changed
- Ensure `data-testid` attributes are preserved
- Consider if the test needs updating (do this in Red phase)

## Tips

- **Start with clear BDD specs**: Well-written features lead to better tests
- **Review generated tests carefully**: They define your implementation contract
- **Run tests frequently**: Catch issues early in the cycle
- **Keep refactorings small**: One change at a time with test verification
- **Document suggested tests**: The Clean phase identifies gaps for future work
- **Use validation shortcuts**: `--shortcut=validate` for quick architecture checks

## Author

Kerry Harris (kerry.harris@dna.co.nz)

## Version

1.3.0 - Added Domain Model reference (UX ACL, TypeScript types, Pinia stores, form validation), Nuxt 4 patterns, Pinia store testing, VueUse patterns, coverage validation
