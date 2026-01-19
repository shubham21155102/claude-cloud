# Example Issue Templates

## Bug Fix Example

```
Title: Fix login button not working on mobile

Description:
The login button on the mobile version of the application is not responding to clicks.

Steps to reproduce:
1. Open the app on a mobile device
2. Navigate to the login page
3. Try to click the login button

Expected behavior: Login form should submit
Actual behavior: Button does not respond

Suggested fix: Check the CSS z-index and touch event handlers for the login button
```

## Feature Request Example

```
Title: Add dark mode support

Description:
Add a dark mode theme to the application to improve user experience in low-light environments.

Requirements:
- Add a toggle switch in settings
- Implement dark color scheme
- Persist user preference
- Apply theme across all pages

Technical considerations:
- Use CSS variables for easy theme switching
- Follow accessibility guidelines for color contrast
```

## Refactoring Example

```
Title: Refactor authentication module

Description:
The current authentication module has duplicate code and needs refactoring for better maintainability.

Goals:
- Extract common authentication logic into reusable functions
- Remove code duplication
- Add proper error handling
- Improve code documentation

Files to focus on:
- src/auth/login.js
- src/auth/register.js
- src/auth/reset-password.js
```

## Documentation Example

```
Title: Add API documentation for user endpoints

Description:
Create comprehensive API documentation for all user-related endpoints.

Requirements:
- Document all endpoints (GET, POST, PUT, DELETE)
- Include request/response examples
- Add authentication requirements
- Document error codes and messages

Format: OpenAPI/Swagger specification
```

## Performance Improvement Example

```
Title: Optimize database queries in user dashboard

Description:
The user dashboard page is loading slowly due to inefficient database queries.

Issues:
- Multiple separate queries instead of joins
- No query result caching
- N+1 query problem in user posts

Expected improvement: Reduce page load time from 3s to under 1s

Suggested approach:
- Combine queries using JOINs
- Implement query result caching
- Add database indexes where needed
```
