# ng-nest-sse

An Nx workspace containing a NestJS API, an Angular application, and a shared TypeScript library.

## Workspace Setup

The initial workspace was created from the Nx TypeScript preset with package workspace linking disabled:

```sh
npx create-nx-workspace@latest ng-nest-sse --preset=ts --workspaces=false
```

Nx manages the projects in the repository. The `datatypes` library is imported by the applications through a TypeScript path alias, not through npm workspace or project package linking. The `tsconfig.base.json` shows that package linking is disabled because the following property is not set :

```json
"composite": true
```

Instead, the `paths` property is used to resolve the `@ng-nest-sse/datatypes` alias to the library's source code:

```json
{
  "compilerOptions": {
    "paths": {
      "@ng-nest-sse/datatypes": ["packages/datatypes/src/index.ts"]
    }
  }
}
```

## Components

- **API (`apps/api`)**: A NestJS backend that listens on port `3000`. It exposes the user endpoint at `/api/user` and an SSE stream at `/api/sse/stream`.
- **Angular app (`apps/ngapp`)**: The browser frontend. It fetches user data from `/api/user` and connects to the SSE stream. During development, its proxy forwards `/api` requests to the API on port `3000`.
- **Datatypes library (`packages/datatypes`)**: Shared TypeScript types used by the API and Angular app, including the `User` type. It is resolved through the `@ng-nest-sse/datatypes` TypeScript path alias.

## Run Locally

Install dependencies from the workspace root, then start each project in a separate terminal:

```sh
npm install
npx nx serve api
```

```sh
npx nx serve ngapp
```

The API listens on `http://localhost:3000`. Nx serves the Angular app on its development-server port (normally `http://localhost:4200`). The Angular development proxy routes API requests to the backend.

## Project Tags and Linting

Nx project tags describe each project's role and are used by the `@nx/enforce-module-boundaries` ESLint rule:

- `type:app` marks the `api` and `ngapp` applications. Applications may depend on libraries tagged `type:shared`.
- `type:shared` marks the `datatypes` library. Shared libraries may depend only on other shared libraries.

Run lint across all projects with:

```sh
npx nx run-many -t lint
```
