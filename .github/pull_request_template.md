1. Task: https://github.com/rolling-scopes-school/tasks/blob/master/react/modules/tasks/final.md
2. Screenshot:
   <!-- ![screenshot](link-to-screenshot) -->
3. Deployment: <!-- link to the deployed app -->
4. Video: <!-- link to the 5-7 min YouTube walkthrough -->
5. Done: dd.mm.yyyy / deadline dd.mm.yyyy
6. Score: 0 / 550

### Feature 1: App Header (60)
- [ ] Non-authenticated users see Sign In and Sign Up buttons in the header (15)
- [ ] Authenticated users see History and Sign Out buttons in the header (10)
- [ ] Navigation link to About page is available in header and footer (10)
- [ ] Expired/invalid token redirects from private routes to the Main page (10)
- [ ] Pressing Sign In / Sign Up redirects to the route with the respective form (15)

### Feature 2: Sign In / Sign Up (50)
- [ ] Sign In / Sign Up / Sign Out buttons are present everywhere they should be (10)
- [ ] Client-side validation (email format, password strength, Unicode supported) (20)
- [ ] Successful login redirects to the Main page (10)
- [ ] Authenticated user is redirected from Sign In / Sign Up routes to the Main page (10)

### Feature 3: Swagger Editor (120)
- [ ] Loading/pasting OpenAPI/Swagger schema in JSON and YAML formats (25)
- [ ] Auto-detection of input format (JSON vs YAML) (20)
- [ ] Format switching with automatic JSON ↔ YAML conversion (20)
- [ ] Schema validation with error indication (15)
- [ ] Authenticated users can save schemas; saved schema is restored on next login (10)
- [ ] Viewer automatically populates with endpoints when the schema is valid (10)
- [ ] Responsive split view (horizontal/vertical) based on screen orientation (20)

### Feature 4: Swagger Viewer (120)
- [ ] Endpoint list organized by path/method (20)
- [ ] Endpoint details show method, path, and all parameter types (path, query, header, cookie) (25)
- [ ] Request schema and example payloads are displayed (20)
- [ ] Response schema, examples, and all supported status codes are displayed (25)
- [ ] Try-It-Out: fill parameters/headers/body, execute requests, display responses (20)
- [ ] Generate cURL button with copy-to-clipboard (10)

### Feature 5: History and Analytics (70)
- [ ] SSR-generated history with informational message and links to editor/viewer when empty (15)
- [ ] Requests sorted by timestamp (most recent first) (10)
- [ ] Analytics recorded server-side: duration, status, timestamp, method, request size, response size, error details, endpoint/URL (45)

### Feature 6: About Page (25)
- [ ] About page accessible to all users (public route) (5)
- [ ] Contains information about the RS School course (5)
- [ ] Contains team member info (names, roles, GitHub links) (10)
- [ ] Design consistent with the application (5)

### Feature 7: General Requirements (55)
- [ ] At least 2 languages with an i18n toggler in the header (30)
- [ ] Sticky header with animation when it becomes sticky (10)
- [ ] Errors displayed in a user-friendly format (10)
- [ ] Private routes properly protected (401 if not authenticated) (5)

### Feature 8: YouTube Video (50)
- [ ] 5-7 minute YouTube video linked in the PR demonstrating all implemented features (50)
