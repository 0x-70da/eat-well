# AGENTS.md (apps/admin)

Next.js frontend. Read the root `AGENTS.md` first; this file adds admin-specific rules.

These rules apply to **apps/admin**.

> How to extend this file: add a new numbered section at the bottom, or a new numbered rule inside the matching section.

---

## 1. Stack

1.1 Next.js (App Router), React, TypeScript, Tailwind CSS.
1.2 Components: **shadcn with Base UI** (not Radix UI). See section 9.
1.3 Forms: `react-hook-form` with the zod resolver (section 6).
1.4 Auth: `better-auth` client in `lib/auth-client.ts` (section 12). The auth routes and base URL live on the backend (`apps/server`). Check the better-auth docs for details.
1.5 Client-side state: **zustand with immer** (section 13).

---

## 2. Structure (Feature-Based)

The admin is organized by feature, and features live inside the `app/` folder (not a `features/` folder).

```
apps/admin/
├── app/
│   ├── <feature>/
│   │   ├── components/    # feature components (including XYSkeleton.tsx loading skeletons)
│   │   ├── sections/      # XYSection.tsx: page sections (they fetch data)
│   │   ├── hooks/         # hooks used only by this feature
│   │   ├── requests/      # one file per request function (API and better-auth calls)
│   │   ├── stores/        # zustand stores used only by this feature
│   │   ├── types/         # types used only by this feature
│   │   ├── utils/         # utils used only by this feature
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   └── page.tsx
│   ├── error.tsx          # root error boundary
│   ├── global-error.tsx   # root layout error boundary
│   ├── not-found.tsx      # root 404
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/            # shared components (used by more than 2 features)
│   └── <group>/           # e.g. components/products/ProductCard.tsx
├── constants/
├── hooks/                 # shared hooks
├── lib/
│   ├── api.ts             # prebuilt fetch functions
│   └── auth-client.ts     # better-auth client
├── requests/              # shared requests
├── stores/                # shared zustand stores (used by more than 2 features)
├── types/                 # shared app-only types
└── public/
```

2.1 Everything specific to a feature goes inside that feature's folder.
2.2 If something is used by **more than 2 features**, move it to the matching root-level folder outside `app/`.
2.3 Put the right file in the right place.
2.4 shadcn components are **not** placed in the admin. They live in `@workspace/ui` (see section 9).
2.5 **One unit per file.** One request function per file in `requests/`, one store per file in `stores/`, one component per file, one hook per file. Never group several of them in one file.

---

## 3. Prebuilt Functions

3.1 `lib/api.ts` contains `get`, `post`, `put`, `patch`, `delete`. **Always use them. Never use the raw `fetch` keyword.**
3.2 They are generic. Always pass the proper response type.
3.3 **Only functions inside `requests/` folders may call `lib/api.ts` or `authClient` (`lib/auth-client.ts`).** Pages, sections, components, hooks, and stores never call them directly.

---

## 4. Pages, Sections and Data Flow

4.1 A **page** (`page.tsx`) does **not** fetch data and does not call request functions. It only composes sections and components, and wraps data-fetching sections in `Suspense`.
4.2 A **section** (`sections/XYSection.tsx`) is the unit responsible for fetching. It is an async server component that calls a function from the feature's `requests/` folder, then passes the data down to components as props.
4.3 Components receive data through props and only render it. They do not fetch GET data themselves.
4.4 Each section that fetches data is wrapped in `Suspense` in the page, with a loading skeleton as the `fallback`.
4.5 The skeleton is `XYSkeleton.tsx`, placed in the feature's `components/` folder (or the proper root-level `components/` folder if shared), and matches the layout of the section it replaces.
4.6 Components may call functions from the `requests/` folder directly for non-GET operations (create, update, delete, auth actions). They must still never call `lib/api.ts` or `authClient` directly.
4.7 Sections that do not fetch anything do not need `Suspense`.
4.8 Do not build manual loading/error handling for data fetching with `useState`/`useEffect`. Loading is handled by `Suspense` + skeletons, errors by `error.tsx` (section 5).
4.9 Never write a whole page as one big file. Split every page into focused sections and components (one responsibility each).

---

## 5. Error and Not-Found Handling

5.1 Every route (feature) has its own `error.tsx` and `not-found.tsx`.
5.2 The root has `app/error.tsx`, `app/not-found.tsx`, and `app/global-error.tsx` (global-error catches errors in the root layout).
5.3 `error.tsx` must be a Client Component (`"use client"`), show a clear message, and include a **Retry** button that calls the `reset` function.
5.4 `not-found.tsx` shows a suitable 404 message for that route and includes a **Back** button.
5.5 Trigger the not-found UI from sections/pages with `notFound()` when the requested resource does not exist.
5.6 Messages must be user-friendly. Never show raw error messages, stack traces, or internal details to the user.

---

## 6. Validation and Forms

6.1 Zod schemas come from `@workspace/validation`. Never define them locally. If the schema you need does not exist, create it in `@workspace/validation` (the server shares it).
6.2 The `requests/` file that sends the data imports the schema (or its inferred type) from `@workspace/validation` to type and validate the payload.
6.3 **Every form, without exception, uses `react-hook-form` with `zodResolver`**, and the resolver receives the schema imported from `@workspace/validation`.
6.4 **Forbidden in forms:**
- `useState` for field values (no controlled-by-hand inputs).
- `useState` for validation errors, loading, or submit state.
- Manual validation with `if/else` chains or custom regex checks.
6.5 Use what react-hook-form already gives you: `register`/`Controller`/form field components for inputs, `handleSubmit` for submitting, `formState.errors` for field errors, `formState.isSubmitting` for pending state, and `setError("root", ...)` for errors coming back from the server or better-auth.
6.6 The form submit handler only calls a function from `requests/` (see 3.3). It does not contain business logic.
6.7 Each form is its own component so the page stays a composition of small parts.

---

## 7. Caching (`use cache`)

7.1 Caching is applied to the **functions in the `requests/` folders**, because they are the ones that talk to the API.
7.2 Not every function needs `use cache` and not every page needs to be cached.
7.3 User-specific data and admin views must never be cached in a shared manner.

---

## 8. Accessibility, Semantics and Performance

8.1 Use **semantic HTML**.
8.2 Accessibility: meaningful labels, visible focus states, RTL support.
8.3 Images: **always use `next/image`, never the plain `img` tag.**
8.4 Fonts: use `next/font`.
8.5 Keep Client Components to a minimum. Default to Server Components.

---

## 9. UI and Styling

9.1 shadcn is used with **Base UI**, not Radix UI. Do not install or import Radix primitives.
9.2 **All shadcn components are installed into `@workspace/ui`** (`packages/ui`) and imported from there.
9.3 Non-shadcn shared components go in `components/`.

---

## 10. Types

10.1 Shared and contract types come from `@workspace/types`.
10.2 Component props types live in the same file as the component.
10.3 Feature-only types go in the feature's `types/` folder (`xY.types.ts`).
10.4 Never use `any`.

---

## 11. Code Rules

11.1 Do not write logic directly in a page, section, or component. Extract it into a util, a hook, or a request function.
11.2 Follow the naming conventions in the root `AGENTS.md`.
11.3 Keep code simple, readable, and clean.

---

## 12. Authentication (better-auth on admin)

12.1 `lib/auth-client.ts` exports `authClient`. **Only functions inside `requests/` folders may use it**.
12.2 Every better-auth operation gets its **own function in its own file** inside `requests/`.
12.3 All admin routes must be protected; unauthenticated users or users without staff roles are redirected to `/login`.

---

## 13. Client-Side State (zustand + immer)

13.1 Client-side state uses **zustand with the immer middleware**.
13.2 Type state and actions explicitly. Never use `any`.
13.3 Read with selectors.

---

## 14. Commands

Run from `apps/admin`, or from the repo root with `pnpm --filter ./apps/admin <script>`.

| Command              | What it does                                  |
| -------------------- | --------------------------------------------- |
| `pnpm dev`           | `next dev -p 3001` (long-running)             |
| `pnpm build`         | `next build`                                  |
| `pnpm start`         | `next start -p 3001` (needs a build first)    |
| `pnpm lint`          | ESLint                                        |
| `pnpm typecheck`     | `tsc --noEmit`                                |
