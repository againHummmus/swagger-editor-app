# Swagger Editor App

A Swagger/OpenAPI editor and viewer with built-in REST client capabilities, built as a single full-stack React application. Users can edit OpenAPI/Swagger specifications, browse the generated API documentation, and test endpoints directly from the browser.

> This is the `main` branch. Active development happens on the `develop` branch.

## Links

- **Live demo:** _TBD - link will be added after deployment_
- **Repository:** https://github.com/againHummmus/swagger-editor-app

## Features

- **Swagger Editor** - paste/type OpenAPI specs in JSON or YAML with auto-detection, validation, and JSON-YAML conversion.
- **Swagger Viewer** - browse endpoints grouped by path/method, inspect parameters, request/response schemas, and Try-It-Out execution.
- **REST client** - execute requests through the SSR server and generate cURL commands.
- **Authentication** - email/password sign in / sign up with client-side validation and protected routes.
- **History & Analytics** - server-rendered history of executed requests with performance metrics.
- **i18n** - two supported languages with an in-header toggler.
- **Responsive split view** - horizontal/vertical layout based on screen orientation.

## Tech Stack

- Next.js
- TypeScript
- Tailwindcss
- ESLint + Prettier + Husky git hooks

## Getting Started

```bash
# clone and switch to the development branch
git clone https://github.com/againHummmus/swagger-editor-app.git
cd swagger-editor-app
git checkout develop

# install dependencies
npm install

# run the dev server
npm run dev
```

## Course

This project is part of the [RS School](https://rs.school/) React course.
