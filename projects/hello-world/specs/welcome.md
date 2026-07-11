# Welcome Message

## Feature
As a user, I want to see a welcome message so that I know the app loaded successfully.

## Acceptance Criteria

### Scenario 1: Page loads successfully
Given the user opens the application
When the page finishes loading
Then the user sees "Hello, World!" displayed on the screen

### Scenario 2: API returns welcome message
Given the backend service is running
When a GET request is made to /api/welcome
Then the response status is 200
And the response body contains { "message": "Hello, World!" }
