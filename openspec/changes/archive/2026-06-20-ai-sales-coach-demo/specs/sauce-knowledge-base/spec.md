## ADDED Requirements

### Requirement: Sauce product data structure
The system SHALL maintain structured data for KHC sauce products with categorization.

#### Scenario: Store sauce metadata
- **WHEN** sauce data is seeded into database
- **THEN** system stores name, Chinese name, description, and category for each sauce

#### Scenario: Sauce categories
- **WHEN** system loads sauce knowledge base
- **THEN** system organizes sauces by category (chili, soy, oyster, hoisin, specialty)

### Requirement: Pairing guidelines
The system SHALL store pairing rules connecting sauces to cuisines and dishes.

#### Scenario: Store cuisine pairings
- **WHEN** sauce pairing data is seeded
- **THEN** system stores which cuisines each sauce pairs with (e.g., Sichuan, Cantonese)

#### Scenario: Store dish recommendations
- **WHEN** sauce pairing data is seeded
- **THEN** system stores specific dish recommendations for each sauce

#### Scenario: Retrieve pairings for dish
- **WHEN** AI coach or menu scanner needs sauce recommendations
- **THEN** system queries pairing rules to find matching sauces

### Requirement: Demo sauce data seeding
The system SHALL provide pre-seeded demo data for KHC sauce products.

#### Scenario: Seed sauce knowledge base
- **WHEN** database is seeded with `pnpm db:seed`
- **THEN** system populates sauce_kb table with KHC sauce products

#### Scenario: Seed includes Chinese names
- **WHEN** sauce data is seeded
- **THEN** each sauce includes Chinese name (nameZh field)

### Requirement: Vector embeddings for RAG search
The system SHALL support vector embeddings on sauce data for semantic search.

#### Scenario: Store sauce embeddings
- **WHEN** sauce data is processed
- **THEN** system generates and stores 1536-dimensional embeddings

#### Scenario: Semantic search for sauces
- **WHEN** user asks about a sauce use case in natural language
- **THEN** system can perform vector similarity search to find relevant sauces

### Requirement: Sauce knowledge for AI context
The system SHALL provide sauce knowledge to AI models as context.

#### Scenario: Inject sauce data into prompts
- **WHEN** AI coach generates response about sauces
- **THEN** system includes relevant sauce data from knowledge base in prompt context

#### Scenario: Menu scanner sauce lookup
- **WHEN** menu scanner identifies a dish
- **THEN** system queries sauce KB to find matching recommendations
