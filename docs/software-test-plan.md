# Zyra Software Test Plan

## 1. Purpose
This test plan defines how the Zyra application will be verified before submission or deployment. It explains what will be tested, how the testing will be done, who is responsible, and what success looks like.

## 2. Test Objectives
- Confirm the application starts correctly and all main modules load without errors.
- Verify that business rules are enforced in the backend.
- Verify that protected resources require authentication and the correct role.
- Confirm that public workflows work for customers without an account where intended.
- Check that data is stored, updated, and retrieved correctly from the database.
- Validate that the frontend communicates correctly with the API and displays data in the expected format.

## 3. Scope
### In Scope
- Authentication and JWT login/register flow
- Material Vault operations
- Product creation and production-stage tracking
- QA activation and store listing creation
- Public store browsing
- Order placement and order tracking
- Inquiry submission and staff replies
- Dashboard summaries and alerts
- Security rules and role-based access control

### Out of Scope
- Load testing at very high traffic levels
- Native mobile application testing
- Third-party payment gateway testing, because payments are not part of the current build
- Penetration testing beyond basic security checks

## 4. Test Strategy
The application will be tested using a combination of manual and automated testing.

### 4.1 Unit Testing
- Validate service-layer business rules.
- Test utility classes, enums, and important validation rules.
- Mock repositories and external dependencies where needed.

### 4.2 Integration Testing
- Test controllers, services, repositories, and database interaction together.
- Confirm that REST endpoints return the correct status codes and payloads.
- Verify persistence of products, materials, orders, inquiries, and listings.

### 4.3 Security Testing
- Check that unauthenticated requests are blocked from protected routes.
- Check that role restrictions work for ADMIN, MANAGER, and ARTISAN users.
- Verify password hashing and JWT token validation.

### 4.4 UI / End-to-End Testing
- Confirm that major user journeys work in the browser.
- Validate customer-facing forms and dashboard pages.
- Ensure the frontend handles success and error responses properly.

### 4.5 Regression Testing
- Re-run the full test suite after bug fixes or feature changes.
- Focus on authentication, product workflow, and public order/inquiry flows, because they are the most business-critical paths.

## 5. Test Environment
### Software
- Backend: Java 21, Spring Boot 4.0.x
- Frontend: React 19 + Vite
- Database: PostgreSQL 16
- Runtime: Docker / Docker Compose for local and submission-ready environments

### Tools
- JUnit 5 for automated backend tests
- Spring Boot Test for integration and context-loading tests
- Postman or Swagger UI for API checks
- Browser testing in Chrome or Edge for frontend verification

## 6. Test Coverage Matrix

| Module | What Will Be Tested | Test Type | Expected Result | Priority |
|---|---|---|---|---|
| Authentication | Register, login, JWT issuance, password hashing | Unit + Integration | Valid users can log in and receive a token | High |
| Security | Route protection and role access | Integration | Protected endpoints deny unauthorised access | High |
| Materials | Create, update, low-stock calculation, delete | Unit + Integration | Stock changes persist and low-stock logic is correct | High |
| Production Pipeline | Create product, move stages, stage logs | Integration | Stage changes are saved with audit trail entries | High |
| QA Activation | OTP generation and verification | Integration | Only valid OTP activates the product | High |
| Store Catalog | Listing creation and public browsing | Integration + UI | Activated products appear in the store correctly | High |
| Orders | Place order, update status, track order | Integration + UI | Orders are stored and tracked by reference | High |
| Inquiries | Submit, reply, close inquiry | Integration + UI | Inquiry lifecycle works end to end | Medium |
| Dashboard | KPI totals and recent activity | Integration + UI | Summary cards show accurate data | Medium |
| Frontend Forms | Validation, errors, loading states | UI | Users receive clear feedback and data is submitted correctly | Medium |

## 7. Key Test Scenarios
### 7.1 Authentication
1. Register a new user with valid details.
2. Attempt to register with an email that already exists.
3. Log in with valid credentials and verify that a JWT is returned.
4. Log in with an invalid password and verify a failure response.

### 7.2 Materials
1. Create a new material with quantity, threshold, and cost.
2. Reduce stock and confirm the low-stock flag is updated.
3. Update material details and confirm the new values persist.

### 7.3 Product Pipeline
1. Create a product and verify that an SKU is generated.
2. Move a product through the supported stages.
3. Confirm each transition creates a stage log entry.
4. Upload QA evidence and verify the product can be activated.

### 7.4 Store and Orders
1. Activate a product and create a store listing for it.
2. Open the public store page and confirm the listing is visible.
3. Place an order from the public endpoint and check that a reference number is generated.
4. Track the order using the reference and confirm the status matches the database.

### 7.5 Inquiries
1. Submit an inquiry without logging in.
2. Verify the inquiry appears in the staff view.
3. Add a reply and close the inquiry.

## 8. Test Data
- User accounts for ADMIN, MANAGER, ARTISAN, and customer-style public submissions.
- Materials with normal stock, low stock, and zero stock values.
- Products in different stages, including a completed and activated product.
- Listings that are available and unavailable.
- Orders in all supported statuses.
- Inquiries that are open and replied to.

## 9. Entry and Exit Criteria
### Entry Criteria
- The project builds successfully.
- The database is running and seeded where needed.
- Environment variables are configured.

### Exit Criteria
- All critical-path tests pass.
- No open high-severity defects remain.
- The main user workflows complete successfully.
- Test evidence is recorded in the README or submission notes.

## 10. Responsibilities
- Backend developer: service, repository, and API tests.
- Frontend developer: page flows, form behaviour, and client-side validation.
- Tester or reviewer: manual verification of key journeys and regression checks.

## 11. Schedule
| Phase | Activity | Output |
|---|---|---|
| Phase 1 | Smoke test the app and confirm startup | Application loads successfully |
| Phase 2 | Run unit and integration tests | Automated test results |
| Phase 3 | Perform manual browser checks | Verified user journeys |
| Phase 4 | Fix defects and rerun regression tests | Stable release candidate |

## 12. Risks and Mitigation
- Risk: authentication or role checks fail silently. Mitigation: include dedicated security tests for each role.
- Risk: a database migration changes entity behaviour. Mitigation: run integration tests against PostgreSQL, not only mocked repositories.
- Risk: frontend and backend payloads diverge. Mitigation: verify contract fields through Swagger and browser testing.
- Risk: public workflows break after refactoring. Mitigation: re-test store, orders, and inquiries after every major change.

## 13. Current Automated Baseline
The current backend test baseline is a Spring Boot context-load test in `backend/zyra/src/test/java/com/auca/zyra/ZyraApplicationTests.java`. That confirms the application context can start, and it should be expanded with the module tests listed above for stronger coverage.

## 14. Acceptance Summary
The software will be considered well tested when:
- Critical user flows work end to end.
- Authentication and authorisation are enforced correctly.
- Data is saved and retrieved accurately from the database.
- Public customer actions work without login where designed.
- Regression tests pass after changes.

