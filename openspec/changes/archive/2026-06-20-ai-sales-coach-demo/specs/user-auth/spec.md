## ADDED Requirements

### Requirement: Demo account authentication
The system SHALL provide pre-configured demo accounts for field sales reps to log in without registration.

#### Scenario: Login with demo account
- **WHEN** user enters valid demo credentials (email + password) and clicks Sign In
- **THEN** system authenticates the user and redirects to the dashboard

#### Scenario: Invalid credentials
- **WHEN** user enters invalid email or password
- **THEN** system displays error message and remains on login page

### Requirement: Demo account list
The system SHALL provide three demo accounts with different experience levels.

#### Scenario: Display demo accounts on login
- **WHEN** user views the login page
- **THEN** system shows clickable demo accounts: 小王 (beginner), 李姐 (intermediate), 张总 (expert)

#### Scenario: Quick login via demo account
- **WHEN** user clicks a demo account button
- **THEN** system auto-fills credentials and signs in

### Requirement: User profile with experience level
The system SHALL store user experience level and preferences for personalization.

#### Scenario: Store experience level
- **WHEN** user account is created or seeded
- **THEN** system stores experience level as beginner, intermediate, or expert

#### Scenario: Store user preferences
- **WHEN** user interacts with the system (menu scans, chat feedback)
- **THEN** system updates user preferences (cuisine focus, regional focus)

### Requirement: Session persistence
The system SHALL maintain user sessions across browser refreshes.

#### Scenario: Persistent session
- **WHEN** user logs in and refreshes the browser
- **THEN** system maintains the authenticated session

#### Scenario: Session expiry
- **WHEN** session token expires after inactivity
- **THEN** system redirects user to login page

### Requirement: Protected routes
The system SHALL prevent unauthenticated access to dashboard features.

#### Scenario: Access protected route without auth
- **WHEN** unauthenticated user navigates to /chat, /scanner, or /history
- **THEN** system redirects to login page

#### Scenario: Access protected route with auth
- **WHEN** authenticated user navigates to protected routes
- **THEN** system allows access and displays the requested page
