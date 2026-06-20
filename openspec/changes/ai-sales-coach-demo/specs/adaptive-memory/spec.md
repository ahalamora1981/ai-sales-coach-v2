## ADDED Requirements

### Requirement: User preference tracking
The system SHALL track and remember user preferences across sessions.

#### Scenario: Learn cuisine preference from menu scan
- **WHEN** user scans a Sichuan restaurant menu
- **THEN** system updates user's cuisine focus to include Sichuan

#### Scenario: Learn regional preference from questions
- **WHEN** user asks multiple questions about Shanghai restaurants
- **THEN** system updates user's regional focus to include Shanghai

#### Scenario: Apply preferences to responses
- **WHEN** user with Sichuan preference asks for sauce recommendations
- **THEN** system prioritizes Sichuan-relevant sauces in responses

### Requirement: Experience level adaptation
The system SHALL adapt response complexity based on user's experience level.

#### Scenario: Beginner user explanation
- **WHEN** user with beginner experience level asks a question
- **THEN** system provides detailed explanations with basic terminology

#### Scenario: Expert user explanation
- **WHEN** user with expert experience level asks a question
- **THEN** system provides concise, advanced insights without basic explanations

#### Scenario: Dynamic experience detection
- **WHEN** user asks complex technical questions despite beginner profile
- **THEN** system updates experience level based on question complexity

### Requirement: Mistake tracking
The system SHALL remember user's past mistakes to avoid repeating them.

#### Scenario: Record correction from user feedback
- **WHEN** user gives thumbs down on a response
- **THEN** system analyzes and stores the mistake pattern in memory

#### Scenario: Avoid past mistakes in future
- **WHEN** user asks similar question after previous mistake
- **THEN** system provides corrected information and avoids repeating error

### Requirement: Memory retrieval for context
The system SHALL retrieve relevant memories to personalize AI responses.

#### Scenario: Build personalized prompt
- **WHEN** user sends a message to AI coach
- **THEN** system loads user profile, recent messages, and relevant memories into context

#### Scenario: Memory relevance scoring
- **WHEN** system retrieves memories for context
- **THEN** system prioritizes recent and frequently accessed memories

### Requirement: Preference feedback storage
The system SHALL store explicit user feedback as memory entries.

#### Scenario: Store thumbs up preference
- **WHEN** user clicks thumbs up on response about chili sauces
- **THEN** system creates preference memory for chili sauce content

#### Scenario: Store thumbs down pattern
- **WHEN** user clicks thumbs down on response with certain style
- **THEN** system creates mistake memory to adjust response style
