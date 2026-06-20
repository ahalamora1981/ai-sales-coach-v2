## ADDED Requirements

### Requirement: Menu image upload
The system SHALL allow users to upload menu images via file selection or camera capture.

#### Scenario: Upload image via file picker
- **WHEN** user clicks upload area and selects an image file
- **THEN** system displays image preview and enables scan button

#### Scenario: Upload image via camera
- **WHEN** user clicks "Take Photo" and captures a menu image
- **THEN** system displays captured image preview and enables scan button

#### Scenario: Invalid file type
- **WHEN** user uploads a non-image file (PDF, text, etc.)
- **THEN** system displays error message requesting image format

### Requirement: Vision AI menu analysis
The system SHALL use Qwen Vision-Language model to extract dishes from menu images.

#### Scenario: Extract dishes from Chinese menu
- **WHEN** user uploads a Chinese restaurant menu image and clicks Scan
- **THEN** system sends image to Qwen VL API and extracts dish names (Chinese + English)

#### Scenario: Extract dishes from English menu
- **WHEN** user uploads an English menu image and clicks Scan
- **THEN** system extracts dish names and identifies cuisine type

#### Scenario: Vision model unavailable
- **WHEN** Qwen VL API is unavailable or returns error
- **THEN** system displays error message and suggests trying again later

### Requirement: Sauce recommendation
The system SHALL recommend KHC sauces for each extracted dish with pairing rationale.

#### Scenario: Generate sauce recommendations
- **WHEN** system extracts dishes from menu
- **THEN** system recommends 1-2 KHC sauces per dish with reason and confidence level

#### Scenario: Low confidence recommendations
- **WHEN** system has low confidence in dish identification
- **THEN** system marks recommendation with low confidence and provides alternative suggestions

### Requirement: Menu scan results persistence
The system SHALL save menu scan results to the user's conversation history.

#### Scenario: Save scan to history
- **WHEN** menu scan completes successfully
- **THEN** system stores dishes and recommendations as a conversation with menu items

#### Scenario: View past scans
- **WHEN** user navigates to history page
- **THEN** system displays previous menu scans with timestamps and dish counts

### Requirement: Qwen model requirement for scanning
The system SHALL restrict menu scanning to Qwen model only (DeepSeek lacks vision capability).

#### Scenario: Scan with Qwen selected
- **WHEN** user has Qwen model selected and uploads menu
- **THEN** system enables scanning functionality

#### Scenario: Scan with DeepSeek selected
- **WHEN** user has DeepSeek model selected
- **THEN** system displays message that menu scanning requires Qwen model
