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
- Integrated Jest and Supertest to provide automated testing for the backend API.
- Updated the Express server to export the application for automated testing.
- Modified the server to start only when run directly, allowing Jest to execute tests without opening a server port.
- Added automated tests for the API status endpoint.
- Added automated tests for the Challenges API, including retrieving all challenges, retrieving a challenge by ID, and handling requests for non-existent challenges.
- Added automated tests for the Submissions API, including successful submissions, input validation, invalid challenge IDs, retrieving user submissions, and database error handling.
- Configured database mocking during testing so the test suite can run without requiring a MySQL server.

## Release Notes: Milestone 3
### Features Completed
- Added actual coding challenge content for users to practice programming.
- Created challenge descriptions, instructions, and examples to guide users through solving problems.
- Updated the Challenges page to display available coding exercises.
- Expanded challenge details pages to provide users with the information needed to complete each challenge.
- Improved the project structure to support adding more coding challenges in future milestones.
### Known Limitations
- Authentication and user accounts are not yet implemented.
- Challenge progress tracking is not connected to a database.
- Code submission and automatic evaluation features are still under development.
- Additional coding challenges and features will be added in future milestones.
