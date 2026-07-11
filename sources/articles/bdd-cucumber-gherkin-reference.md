# BDD with Cucumber and Gherkin: A Comprehensive Reference

> Source: [cucumber.io/docs](https://cucumber.io/docs) — Official Cucumber documentation compiled for wiki ingestion.
>
> **Tags:** #bdd #cucumber #gherkin #testing #agile #collaboration

---

## What is Behaviour-Driven Development (BDD)?

BDD is a methodology focused on **discovery, collaboration, and examples** — not testing. It helps teams build shared understanding of what to build before writing code.

The three iterative practices:

| Practice | Purpose | Output |
|----------|---------|--------|
| **Discovery** | Explore what the system *could* do through collaborative workshops | Shared understanding |
| **Formulation** | Document examples as structured, executable specifications | Gherkin scenarios |
| **Automation** | Connect specifications to the system as failing tests | Automated test suite |

> "The hardest single part of building a software system is deciding precisely what to build." — Fred Brooks

---

## Gherkin: The Language of BDD

Gherkin is a set of grammar rules that makes plain text structured enough for Cucumber to understand. It uses a small set of keywords to describe software behavior in plain language.

### Primary Keywords

#### Feature
Provides a high-level description of a software feature and groups related scenarios.

```gherkin
Feature: Guess the word
  The word guess game is a turn-based game for two players.
  The Maker chooses a word and the Breaker guesses it.
```

#### Rule (Gherkin 6+)
Represents one business rule that should be implemented. Groups scenarios under a specific rule.

```gherkin
Feature: Highlander
  Rule: There can be only One
    Example: Only One -- More than one alive
      Given there are 3 ninjas
      When 2 ninjas meet, they will fight
      Then one ninja dies (there can be only one)
```

#### Scenario / Example
A concrete example that illustrates a business rule. `Scenario` is a synonym for `Example`.

```gherkin
Scenario: Breaker guesses a word
  Given the Maker has chosen a word
  When the Breaker makes a guess
  Then the Maker is asked to score
```

### Step Keywords

#### Given — Context
Puts the system in a known state. Describes preconditions.

```gherkin
Given my account has a balance of £430
Given there are 3 ninjas
And one ninja has a strong reputation
```

#### When — Action
Describes an event or action. "Imagine it's 1922, when there were no computers."

```gherkin
When I eat 5 cucumbers
When the Maker starts a game
```

#### Then — Outcome
Describes an expected outcome or result. Should verify observable output.

```gherkin
Then I should have 7 cucumbers
Then my account should have a balance of £430
```

#### And, But
Replace successive Given's or Then's for more fluid structure.

```gherkin
Given one thing
And another thing
And yet another thing
When I open my eyes
Then I should see something
But I shouldn't see something else
```

#### Asterisk (*)
Helpful when you have some steps that are effectively a list of things.

```gherkin
Scenario: All done
  Given I am out shopping
  * I have eggs
  * I have milk
  * I have butter
  When I check my list
  Then I don't need anything
```

### Structural Keywords

#### Background
Adds context to the scenarios that follow it. Runs before each scenario in the feature.

```gherkin
Feature: Multiple site support
  Background:
    Given a global administrator named "Greg"
    And a blog named "Greg's anti-tax rants"
    And a customer named "Wilson"

  Scenario: Dr. Bill posts to his own blog
    Given I am logged in as Dr. Bill
    When I try to post to "Greg's anti-tax rants"
    Then I should see "Hey! That's not your blog!"
```

> **Best Practice:** Keep your Background section short. Don't use it to set up complicated states.

#### Scenario Outline / Scenario Template
Runs the same Scenario multiple times with different combinations of values.

```gherkin
Scenario Outline: eating
  Given there are <start> cucumbers
  When I eat <eat> cucumbers
  Then I should have <left> cucumbers

  Examples:
    | start | eat | left |
    |    12 |   5 |    7 |
    |    20 |   5 |   15 |
```

### Step Arguments

#### Doc Strings
For passing larger pieces of text. Delimited by `"""` or backticks.

```gherkin
Given a blog post named "Random" with Markdown body
  """markdown
  Some Title, Eh?
  ===============
  Here is the first paragraph of my blog post.
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  """
```

#### Data Tables
For passing a list of values.

```gherkin
Given the following users exist:
  | name   | email              | twitter         |
  | Aslak  | aslak@email.com    | @aslak_hellesoy |
  | Julien | julien@email.com   | @jbpros         |
  | Matt   | matt@email.com     | @mattwynne      |
```

### Secondary Keywords

| Symbol | Purpose |
|--------|---------|
| `@` | Tags for grouping and filtering |
| `#` | Comments (start of line only) |
| `\|` | Pipe character for data tables |
| `\` | Escape character |

**Tags:** Place above `Feature` or `Scenario` to group related features.

```gherkin
@fast @ui
Feature: Login

  @smoke
  Scenario: Successful login
    Given I have a registered account
    When I log in with valid credentials
    Then I should see my dashboard
```

**Comments:** Only permitted at the start of a new line.

```gherkin
# This is a comment
Feature: Example
```

### Language Support

Gherkin supports over 70 languages. Specify with a header comment:

```gherkin
# language: no
Funksjonalitet: Gjett et ord
  Eksempel: Ordmaker starter et spill
```

Default is English (`en`) if omitted.

---

## Step Definitions

A Step Definition is a method with an expression that links it to one or more Gherkin steps. Step definitions connect Gherkin steps to programming code — they "hard-wire the specification to the implementation."

### Expression Types

| Type | Description | Example |
|------|-------------|---------|
| **Cucumber Expressions** | Default; simpler syntax with `{parameter}` patterns | `{int}`, `{string}`, `{word}` |
| **Regular Expressions** | Standard regex; capture groups become arguments | `\d+`, `[\w]+` |

### Example: Java Step Definition

```java
@Given("I have {int} cukes in my belly")
public void i_have_n_cukes_in_my_belly(int cukes) {
    System.out.format("Cukes: %d\n", cukes);
}
```

### Parameter Types

Built-in types transform captured values automatically:

| Type | Matches | Transforms To |
|------|---------|---------------|
| `{int}` | `-?\d+` | Integer |
| `{float}` | `-?\d*\.?\d+` | Float |
| `{word}` | `[^\s]+` | String |
| `{string}` | `""" or ''` | String (with quotes removed) |

---

## Writing Better Gherkin

### Core Principle: Describe Behaviour, Not Implementation

Scenarios should explain **what, not how**. Ask: "Will this wording need to change if the implementation does?" If yes, rework it.

### Declarative vs. Imperative Style

| Imperative (Avoid) | Declarative (Prefer) |
|---|---|
| `When I type "user@example.com" in the email field` | `When Free Frieda logs in with her valid credentials` |
| `And I type "password" in the password field` | |
| `And I press the "Submit" button` | |
| `Then I see "Welcome" on the home page` | `Then she sees her personalized dashboard` |

### The Transformation

**Before (imperative):**
```gherkin
Given I am on the login page
When I type "free.frieda@example.com" in the email field
And I type "password" in the password field
And I press "Submit"
Then I see "FreeArticle1" on the home page
```

**After (declarative):**
```gherkin
Given Free Frieda has a free subscription
When Free Frieda logs in with her valid credentials
Then she sees a free article
```

### Best Practices

1. **Use domain language** — Name users meaningfully ("Free Frieda," "Paid Patty") to clarify intent
2. **Hide implementation details** in step definitions, not scenarios
3. **Keep scenarios short** — 3-5 steps per scenario recommended
4. **Make scenarios resilient to UI changes** — avoid terms like "click a button"
5. **Use concrete examples** — Real names, specific dates, exact amounts
6. **Keep Background sections short and vivid**
7. **Use two-space indentation**
8. **Don't verify database state in Then steps** — verify observable outputs only

---

## Anti-Patterns

### 1. Starting with Automation Before Discovery

> "If you're new to BDD, discovery is the right place to start. You won't get much joy from the other two practices until you've mastered discovery."

### 2. Testing Through the UI

Scenarios that describe UI interactions are brittle and miss the underlying behaviour:

```gherkin
# BAD — UI-centric
When I click the "Add to Cart" button
And I click the "Checkout" button
And I fill in the shipping form
And I click "Place Order"
```

### 3. Mixing What with How

Don't describe implementation mechanics in scenarios:

```gherkin
# BAD — implementation detail
When the system writes the order to the database
And the event bus publishes an OrderCreated event
```

### 4. Building Without Shared Understanding

Skipping discovery workshops leads to building the wrong thing. The hardest part of software is deciding what to build.

### 5. Scope Creep

Discovery often reveals low-priority functionality that can be deferred. Capture it but don't let it derail the current increment.

### 6. Complicated Background Sections

Don't use Background to set up complex state. If you need more than 3-4 steps, consider using a helper method or restructuring.

---

## The Test Pyramid

BDD operates at the acceptance level, while TDD guides unit-level implementation:

```
        /\
       /  \     E2E / Acceptance Tests (BDD)
      /    \    Few tests, high value, slow
     /______\
    /        \   Integration Tests
   /          \  Medium tests, medium speed
  /____________\
 /              \ Unit Tests (TDD)
/                \ Many tests, fast, detailed
```

BDD scenarios serve as "guide-rails" at the top of the pyramid, while lower-level TDD tests guide implementation details.

---

## Related Patterns

- **[[Domain-Driven Design]]** — BDD's natural companion; shared ubiquitous language
- **[[Event Storming]]** — Collaborative discovery technique for complex domains
- **[[Example Mapping]]** — Structured conversation format for BDD discovery
- **[[Specification by Example]]** — Documenting requirements as concrete examples
- **[[Living Documentation]]** — Executable specs that stay current with code

## Related Technologies

- **Cucumber** — Reference BDD framework (Java, Ruby, JavaScript, and more)
- **SpecFlow** — .NET BDD framework inspired by Cucumber
- **Behave** — Python BDD framework
- **Behat** — PHP BDD framework
- **pytest-bdd** — BDD plugin for pytest

## File Conventions

| Convention | Description |
|------------|-------------|
| `.feature` extension | Gherkin documents |
| Version control | Feature files versioned alongside source code |
| Directory structure | Typically `features/` or `test/e2e/features/` |
| Step definitions | `step_definitions/` or `steps/` |

---

## Key Takeaways

1. **BDD is about collaboration**, not testing
2. **Discovery comes first** — understand before building
3. **Gherkin is the lingua franca** — readable by humans and computers
4. **Declarative over imperative** — what, not how
5. **Scenarios are living documentation** — they serve as specs, tests, and docs
6. **Keep scenarios short** — 3-5 steps, focused on single behaviour
7. **Use domain language** — reflect the problem domain, not the solution

---

*Compiled from cucumber.io/docs for wiki ingestion.*
*Tags: #bdd #cucumber #gherkin #testing #agile #collaboration #living-documentation*
