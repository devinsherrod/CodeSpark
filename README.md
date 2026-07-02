# CodeSpark
Our team’s goal is to develop a web app that encourages users to learn programming via small daily coding challenges. The app aims to make learning programming easier and more fun for beginners by focusing on bite-sized exercises and consistent practice. 
## Release Notes: Milestone 1
### Features Completed
- Created the React frontend prototype for CodeSpark.
- Added an intro splash screen with CodeSpark branding.
- Implemented Login, Dashboard, Challenges, Challenge Detail, and Progress pages.
- Added navigation between pages using React Router.
- Applied a consistent dark theme UI across all pages.
### Known Limitations
- Authentication is not yet implemented.
- Challenge data is currently hardcoded.
- Progress tracking is not connected to a database.
- Backend functionality will be added in future milestones.

## Release Notes: Milestone 2
### Features Completed
- Integrated Jest and Supertest for automated backend API testing.
- Updated the Express server to export the application for testing.
- Modified the server so it only starts when run directly, allowing Jest to run tests without opening a server port.
- Implemented tests for the API status endpoint.
- Implemented Challenge API tests, including retrieving all challenges, retrieving a challenge by ID, and handling requests for non-existent challenges.
- Implemented Submission API tests, including successful submissions, input validation, invalid challenge IDs, retrieving user submissions, and database error handling.
- Mocked the database connection during testing so the test suite can run without requiring a MySQL server.
### Known Limitations
- Current automated tests cover backend API functionality only.
- Frontend components are not included in the test suite.
- Database interactions are tested using mocked responses instead of a real database.
- Authentication and authorization features have not yet been implemented or tested.
- Additional automated tests will be added in future milestones.
