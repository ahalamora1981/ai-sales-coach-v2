# Business Requirements Document (BRD)
## AI Sales Coach — Kraft Heinz China Foodservice

| Field | Value |
|-------|-------|
| **Document Version** | 1.0 |
| **Date** | 2026-06-20 |
| **Status** | Draft |
| **Author** | Infosys AI Team |
| **Client** | Kraft Heinz China (KHC China) |
| **Business Unit** | Foodservice Sales |

---

## Table of Contents

- [1. Executive Summary](#1-executive-summary)
- [2. Business Objectives](#2-business-objectives)
- [3. Scope](#3-scope)
  - [3.1 In Scope](#31-in-scope)
  - [3.2 Out of Scope](#32-out-of-scope-current-phase)
- [4. Stakeholders](#4-stakeholders)
- [5. Functional Requirements](#5-functional-requirements)
  - [5.1 Module A — Menu Analyzer & Sauce Recommender](#51-module-a--menu-analyzer--sauce-recommender)
  - [5.2 Module B — Sales Coach (AI-Powered E-Learning)](#52-module-b--sales-coach-ai-powered-e-learning)
  - [5.3 Module C — Taste Innovation Advisor](#53-module-c--taste-innovation-advisor)
  - [5.4 Common / Cross-Cutting Requirements](#54-common--cross-cutting-requirements)
- [6. Non-Functional Requirements](#6-non-functional-requirements)
- [7. Technical Architecture Requirements](#7-technical-architecture-requirements)
  - [7.1 AI / LLM Layer](#71-ai--llm-layer)
  - [7.2 Application Layer](#72-application-layer)
  - [7.3 Data Layer](#73-data-layer)
- [8. Demo / POC Deliverables (July Meeting)](#8-demo--poc-deliverables-july-meeting)
  - [8.1 Demo Data Strategy](#81-demo-data-strategy)
- [9. Assumptions](#9-assumptions)
- [10. Dependencies](#10-dependencies)
- [11. Risks](#11-risks)
- [12. Success Criteria](#12-success-criteria)
- [13. Open Items](#13-open-items)
- [14. Next Steps](#14-next-steps)

---

## 1. Executive Summary

Kraft Heinz China (KHC China) is seeking an **AI-powered Sales Coach mobile application** to empower its field sales team with intelligent, on-the-go assistance for selling KHC sauces to foodservice restaurants. The solution will serve as a personal AI coach — helping sales reps analyze restaurant menus, recommend appropriate KHC sauce products, discover taste innovation opportunities, and access training materials — all from their phones.

This initiative supports KHC China's strategic goal of **becoming a leader in the China sauces market**, addressing competitive pressure from rivals who already leverage AI for sales enablement.

---

## 2. Business Objectives

| ID | Objective | Success Metric |
|----|-----------|----------------|
| OBJ-01 | Increase KHC sauce adoption in foodservice restaurants | % increase in sauce sales pitch success rate |
| OBJ-02 | Enable mobile-first sales coaching (no laptop dependency) | 100% of field reps using mobile app |
| OBJ-03 | Reduce time to prepare for restaurant sales visits | Avg. preparation time reduction |
| OBJ-04 | Improve product knowledge & sales skills of field team | Training completion rate; quiz scores |
| OBJ-05 | Leverage China's AI ecosystem for competitive advantage | AI response quality; user satisfaction |
| OBJ-06 | Deliver demo-ready prototype for July stakeholder meeting | Working demo by early July 2026 |

---

## 3. Scope

### 3.1 In Scope

| Aspect | Detail |
|--------|--------|
| **Target Users** | KHC China Foodservice Field Sales Representatives |
| **Geography** | China (initial deployment) |
| **Platform** | Mobile Application (iOS / Android) |
| **Languages** | Chinese (Simplified) — primary; English — secondary |
| **Timeline** | Demo/POC target: Early July 2026 |

### 3.2 Out of Scope (Current Phase)

- Retail sales team
- Global rollout (future consideration)
- Deep SAP/CRM integration (to be determined)
- Full production deployment (POC/Demo phase first)

---

## 4. Stakeholders

| Role | Responsibility |
|------|----------------|
| KHC China IT Lead | Business owner, requirements validation |
| KHC China Foodservice Sales Team | End users, UAT participants |
| KHC China Marketing | Knowledge base owner (sauce KB, training materials) |
| Infosys AI Architects | Solution design, development |
| Infosys Delivery Team | Project execution |

---

## 5. Functional Requirements

### 5.1 Module A — Menu Analyzer & Sauce Recommender

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-A01 | User can input restaurant menu (text entry or photo upload) | P0 |
| FR-A02 | System recognizes menu items from uploaded image (OCR + VL) | P0 |
| FR-A03 | System analyzes menu and identifies KHC sauce application opportunities | P0 |
| FR-A04 | System provides taste-based sauce recommendations per menu item | P0 |
| FR-A05 | System explains *why* a sauce is recommended (flavor pairing rationale) | P1 |
| FR-A06 | User can save menu analyses for future reference | P1 |

### 5.2 Module B — Sales Coach (AI-Powered E-Learning)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-B01 | AI coach can answer questions about KHC sauce products | P0 |
| FR-B02 | AI coach can conduct interactive sales training scenarios | P0 |
| FR-B03 | AI coach can quiz users on product knowledge | P1 |
| FR-B04 | Training content is sourced from KHC marketing knowledge base | P0 |
| FR-B05 | AI coach supports conversational, natural language interaction | P0 |
| FR-B06 | User can track learning progress | P2 |

### 5.3 Module C — Taste Innovation Advisor

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-C01 | System recommends menu items and applicable sauces based on cuisine type | P0 |
| FR-C02 | System recommends menu items and applicable sauces based on restaurant type | P0 |
| FR-C03 | System provides consumer taste trend insights for China market | P1 |
| FR-C04 | System can suggest new menu items for restaurants using KHC sauces | P1 |
| FR-C05 | Recommendations are localized to Chinese culinary preferences | P0 |

### 5.4 Common / Cross-Cutting Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-X01 | User authentication and profile management | P0 |
| FR-X02 | Chat-based conversational UI | P0 |
| FR-X03 | Voice input support (for field use) | P1 |
| FR-X04 | Offline mode for basic features (cached KB) | P2 |
| FR-X05 | Feedback mechanism (thumbs up/down on AI responses) | P1 |

---

## 6. Non-Functional Requirements

| ID | Requirement | Detail |
|----|-------------|--------|
| NFR-01 | **Language** | Primary: Simplified Chinese; Secondary: English |
| NFR-02 | **Performance** | AI response time < 5 seconds (95th percentile) |
| NFR-03 | **Scalability** | Support 100+ concurrent users (China region) |
| NFR-04 | **Security** | Data residency in China; comply with China data regulations |
| NFR-05 | **Availability** | 99.5% uptime during business hours |
| NFR-06 | **Accessibility** | Mobile-first responsive design; usable on mid-range Android devices |

---

## 7. Technical Architecture Requirements

### 7.1 AI / LLM Layer

| Requirement | Detail |
|-------------|--------|
| **LLM Flexibility** | System MUST be model-agnostic and configurable to switch between China LLM providers |
| **Supported LLMs (Initial)** | DeepSeek, Qwen (通义千问), ERNIE (文心一言), Kimi, GLM (智谱) |
| **Abstraction Layer** | LLM Adapter/Abstraction layer to decouple application logic from specific LLM |
| **Vision-Language (VL) Support** | Must support VL models for image recognition (menu OCR, product images) |
| **Model Selection** | Allow configuration per feature (e.g., VL for menu scan, text LLM for chat) |

### 7.2 Application Layer

| Requirement | Detail |
|-------------|--------|
| **Mobile App** | Cross-platform (React Native / Flutter recommended) |
| **Backend** | API-first architecture; cloud-native (TBD: cloud provider) |
| **Knowledge Base** | Vector database for sauce KB and training materials (RAG pattern) |
| **Integration** | Open APIs for future CRM/SAP integration (specifics TBD) |

### 7.3 Data Layer

| Requirement | Detail |
|-------------|--------|
| **Knowledge Base Input** | KHC to provide: sauce product catalog, pairing guidelines, training materials |
| **Demo Data** | Infosys to source/create sample data for July demo |
| **Data Storage** | China-region data residency |

---

## 8. Demo / POC Deliverables (July Meeting)

| Deliverable | Description |
|-------------|-------------|
| **Interactive Demo App** | Working mobile prototype with all 3 modules |
| **Menu Scan Demo** | VL-powered menu image recognition + sauce recommendation |
| **AI Coach Demo** | Conversational AI answering sauce-related questions |
| **Taste Innovation Demo** | Cuisine/restaurant-type based recommendations |
| **Architecture Deck** | Technical architecture overview for IT discussion |

### 8.1 Demo Data Strategy

Since KHC knowledge base is not yet available:

| Action | Owner |
|--------|-------|
| Research KHC sauce product portfolio (public info) | Infosys |
| Build sample sauce pairing knowledge base | Infosys |
| Source sample restaurant menus for demo | Infosys |
| Prepare sample training content | Infosys |

---

## 9. Assumptions

| ID | Assumption |
|----|------------|
| A01 | KHC China will provide sauce knowledge base and training materials for production |
| A02 | KHC China IT team will be available for requirements validation sessions |
| A03 | DeepSeek or similar China LLM will be accessible via API for demo |
| A04 | Mobile app distribution will use enterprise MDM (not public app store initially) |
| A05 | Internet connectivity is available for field sales reps during work |
| A06 | Demo is for internal stakeholder review, not end-user UAT |

---

## 10. Dependencies

| ID | Dependency | Status | Risk |
|----|------------|--------|------|
| D01 | KHC sauce knowledge base | Pending | 🟡 Medium — demo will use simulated data |
| D02 | KHC training materials | Pending | 🟡 Medium — demo will use simulated data |
| D03 | LLM API access (DeepSeek/Qwen/etc.) | To Confirm | 🟡 Medium — need API keys for demo |
| D04 | Cloud infrastructure decision | Open | 🟡 Medium — China cloud options TBD |
| D05 | KHC security & compliance approval | Pending | 🔴 High — may impact timeline |

---

## 11. Risks

| ID | Risk | Impact | Mitigation |
|----|------|--------|------------|
| R01 | Knowledge base not ready for demo | High | Build sample KB with public info; iterate post-demo |
| R02 | LLM API latency in China | Medium | Test early; consider multiple providers |
| R03 | Scope creep during demo prep | Medium | Strict POC scope; parking lot for enhancements |
| R04 | Data privacy concerns | High | Ensure China data residency; involve legal early |
| R05 | July timeline is aggressive | High | Daily standups; parallel workstreams |

---

## 12. Success Criteria

### Demo Success (July 2026)
- [ ] Working mobile prototype demonstrating all 3 modules
- [ ] Menu image recognition and sauce recommendation functional
- [ ] AI coach can answer basic sauce questions in Chinese
- [ ] Stakeholders can see clear value and roadmap

### Production Success (Future)
- [ ] Field sales reps actively using the app daily
- [ ] Measurable increase in sauce product pitch frequency
- [ ] Positive user satisfaction scores
- [ ] Scalable to full China foodservice sales team

---

## 13. Open Items

| Item | Owner | Target Date |
|------|-------|-------------|
| Confirm cloud infrastructure provider | Infosys + KHC IT | TBD |
| LLM provider selection and API access | Infosys + KHC IT | TBD |
| Data privacy & compliance review | KHC Legal | TBD |
| CRM/SAP integration scope | KHC IT | TBD |
| UI/UX design approval | KHC Business | TBD |

---

## 14. Next Steps

1. **Review & align** on this BRD with stakeholders
2. **Confirm** demo timeline and July meeting details
3. **Begin** demo data research and knowledge base scaffolding
4. **Evaluate** LLM API access for DeepSeek / Qwen / others
5. **Draft** technical architecture proposal

---

*Document will be iteratively updated based on stakeholder feedback.*
