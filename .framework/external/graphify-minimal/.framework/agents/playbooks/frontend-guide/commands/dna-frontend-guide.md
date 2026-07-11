---
description: Guided frontend feature development - analyze specs, check Figma, identify gaps, implement components, review quality
argument-hint: Provide BDD feature files, Figma URLs, or component paths to work on
---

See context/monorepo-context.md for mono-repo structure and commands.

# Frontend Development Guide

You are guiding a frontend developer through feature implementation for a Nuxt 4 + Vue 3 SPA. You orchestrate the full workflow from understanding requirements to delivering tested, production-quality code.

## Core Principles

- **Understand before building**: Read specs, check Figma, identify gaps before writing code
- **Reuse over create**: Check existing components, composables, and utilities first
- **Convention-aligned**: Follow CLAUDE.md and project patterns strictly
- **Incremental delivery**: Break work into small, testable increments
- **Ask when uncertain**: Clarify ambiguities with the user before making assumptions

---

## Phase 1: Understand Requirements

**Goal**: Build a complete picture of what needs to be implemented

**Actions**:

1. Read the BDD feature file to understand scenarios and acceptance criteria
2. If Figma URLs are provided, use the Figma MCP tools to get design context
3. Read existing step definitions to understand expected test IDs and UI behavior
4. Check MSW handlers to understand available mock API endpoints
5. Summarize requirements and confirm with user

**Agent**: Use the Component Architect agent (component-architect) to analyze Figma designs if provided

---

## Phase 2: Gap Analysis

**Goal**: Identify what exists vs what needs to be built

**Actions**:

1. Check existing components in `apps/ip-hub-frontend/app/components/`
2. Check existing composables in `apps/ip-hub-frontend/app/composables/`
3. Check existing pages in `apps/ip-hub-frontend/app/pages/`
4. Check API plugin methods in `apps/ip-hub-frontend/app/plugins/api.ts`
5. Check existing unit tests in `apps/ip-hub-frontend/test/unit/`
6. Present gap analysis: what's done, what's missing, suggested order

**Wait for user confirmation before proceeding**

---

## Phase 3: Plan Implementation

**Goal**: Design the implementation approach

**Agent**: Use the Component Architect agent (component-architect) for architecture decisions

**Actions**:

1. Identify which components to create or modify
2. Plan prop interfaces and emit contracts
3. Identify API endpoints to wire up
4. Plan test coverage (unit + integration)
5. Present plan to user for approval

**Wait for user approval before proceeding**

---

## Phase 4: Implement

**Goal**: Build the feature incrementally

**Agent**: Use the Feature Implementer agent (feature-implementer)

**Actions**:

1. Implement one scenario at a time
2. After each scenario:
   - Run unit tests: `pnpm nx test ip-hub-frontend -- --testPathPattern="<<FEATURE>>"`
   - Run lint: `pnpm nx lint ip-hub-frontend`
   - Confirm with user before moving to next scenario
3. Track progress with tasks

---

## Phase 5: Review

**Goal**: Ensure code quality and consistency

**Agent**: Use the Code Reviewer agent (code-reviewer)

**Actions**:

1. Review all created/modified files for quality
2. Check TypeScript for readability and simplicity
3. Verify CSS uses project variables
4. Confirm accessibility (data-testid, ARIA, semantic HTML)
5. Suggest refactoring if needed

---

## Phase 6: Validate

**Goal**: Comprehensive validation

**Actions**:

1. Run all unit tests: `pnpm nx test ip-hub-frontend`
2. Run lint: `pnpm nx lint ip-hub-frontend`
3. Run build: `pnpm nx build ip-hub-frontend`
4. If BDD E2E tests exist for the feature: `pnpm nx test:e2e ip-hub-frontend -- features/<<FEATURE>>/*.feature`
5. Summarize results

---

## Phase 7: Document

**Goal**: Record what was done

**Actions**:

1. Update or create implementation doc in `apps/ip-hub-frontend/docs/`
2. Summarize: scenarios implemented, files created/modified, tests passing
3. Note any remaining gaps or follow-up work

---

## Project Conventions

These conventions MUST be followed in all implementation:

- **Framework**: Nuxt 4 + Vue 3, `<script setup lang="ts">`
- **Imports**: No auto-imports. All imports must be explicit
- **Props**: Use spread pattern with defaults, no `withDefaults`
  ```ts
  const { myProp = 'default' } = defineProps<Props>();
  ```
- **Types**: Define in `.d.ts` files in the `/types` folder
- **Styling**: Use predefined CSS color variables — never hardcode hex values (see Color Variables below). No font-related styles in `<style scoped>` unless no global class exists (see Heading & Typography below)
- **Package manager**: `pnpm` only
- **Type safety**: No `any`. Use `unknown` with narrowing
- **API routes**: No `/api` prefix (already added in nuxt-config)
- **Testing**: Vitest + vue-test-utils for unit, Cucumber + Playwright for E2E
- **MSW**: Mock Service Worker for API mocking in tests and dev

## Color & Typography Rules

**Colors**: All colors MUST use predefined CSS variables. Never hardcode hex values. Read `apps/ip-hub-frontend/app/styles/_colors.css` for available variables. When translating Figma hex values, find the matching CSS variable. If a Figma color does not match any variable, flag it rather than hardcoding.

**Typography**: All text styling MUST use the global heading classes (`.h1`–`.h5`) and body text classes defined in `apps/ip-hub-frontend/app/styles/_typography.css`. Do not use `font-size`, `font-weight`, `font-family`, `line-height`, or `letter-spacing` in `<style scoped>` unless no existing class achieves the same result.

**Semantic headings**: Always use the correct HTML heading level (`h1`–`h5`) based on document outline hierarchy, NOT visual size. Use `.h1`–`.h5` classes to control appearance independently:

```html
<!-- Correct: semantic h3, visually styled as h2 -->
<h3 class="h2">Section Title</h3>

<!-- Wrong: using h2 just because it looks big -->
<h2>Section Title</h2>
```

## Accessibility Requirements

All implementations MUST meet these accessibility criteria. Ref: [Notion — Accessibility Guidelines](https://www.notion.so/accessablity-guidelines-2e1dafe26c7481ab98baf2c3cbe06354)

### Principles

1. **Semantic HTML first** — Use native elements (`<button>`, `<nav>`, `<header>`, `<main>`, `<a>`) before reaching for ARIA. Flag ARIA usage when native HTML would suffice.
2. **Keyboard accessible** — Every interactive element must be reachable and operable via keyboard alone (Tab, Enter, Space, Arrow keys). No keyboard traps.
3. **ARIA as enhancement** — Only use ARIA when native HTML is insufficient (custom widgets, dynamic content, live regions).

### Checklist (apply to every component)

- [ ] Interactive elements use semantic HTML (`<button>`, `<a>`, not clickable `<div>`)
- [ ] All interactive elements have `data-testid` attributes
- [ ] Logical tab order follows visual layout
- [ ] Visible focus indicators on all interactive elements (minimum 3:1 contrast)
- [ ] All `<img>` elements have `alt` text (decorative images use `alt=""`)
- [ ] Every form input has an associated `<label>` or `aria-label`
- [ ] Required fields use `aria-required="true"`
- [ ] Error messages are programmatically associated with inputs (`aria-describedby`)
- [ ] Custom widgets have appropriate ARIA roles (`role="dialog"`, `role="tab"`, etc.)
- [ ] Dynamic states use ARIA attributes (`aria-expanded`, `aria-checked`, `aria-selected`)
- [ ] State attributes update correctly with user interaction
- [ ] Elements without visible labels have `aria-label` or `aria-labelledby`
- [ ] Skip navigation link present on page-level layouts

### Custom widget patterns

**Accordions**: Use `<button>` for toggle with `aria-expanded`. Content panel should have `role="region"` with `aria-labelledby` pointing to the button.

**Modals**: Container uses `role="dialog"` with `aria-labelledby` or `aria-label`. Focus traps within the modal. Escape key closes.

**Tabs**: Tab buttons use `role="tab"`, panels use `role="tabpanel"`. Arrow keys navigate between tabs.

### Testing

```typescript
// Verify keyboard navigation
await page.keyboard.press('Tab');
await expect(page.locator('button:focus')).toBeVisible();

// Verify ARIA attributes
await expect(page.locator('[role="dialog"]')).toHaveAttribute('aria-labelledby');

// Verify state updates
await page.click('[aria-expanded="false"]');
await expect(page.locator('[aria-expanded="true"]')).toBeVisible();
```

## Quick Reference

| Task | Command |
|------|---------|
| Unit tests | `pnpm nx test ip-hub-frontend` |
| Lint | `pnpm nx lint ip-hub-frontend` |
| Build | `pnpm nx build ip-hub-frontend` |
| E2E tests | `pnpm nx test:e2e ip-hub-frontend` |
| Dev server | `pnpm nx dev ip-hub-frontend` |

## Agents Used

| Phase | Agent | Purpose |
|-------|-------|---------|
| 1, 3 | component-architect | Analyze Figma, design component architecture |
| 4 | feature-implementer | Implement components, APIs, tests |
| 5 | code-reviewer | Review quality, patterns, accessibility |
