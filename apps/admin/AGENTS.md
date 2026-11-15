# AGENTS.md (apps/admin)

Next.js Admin Dashboard. Read the root `AGENTS.md` first; this file adds Admin-specific rules.

This application follows the same frontend architecture, coding conventions, shared packages, and engineering standards as `apps/client`, with additional requirements for administrative authentication, authorization, data management, and security.

These rules apply to the entire `apps/admin` application.

The Admin application is a privileged interface for managing the restaurant platform. Security, authorization, data integrity, and maintainability are mandatory.

> How to extend this file: add a new numbered section at the bottom, or a new numbered rule inside the matching section. Do not silently weaken or override existing rules.

---

## 1. Stack

1.1 Next.js (App Router), React, TypeScript, and Tailwind CSS.

1.2 UI components: shadcn with **Base UI**, installed in `@workspace/ui` (`packages/ui`). Do not use Radix UI.

1.3 Forms: `react-hook-form` with `zodResolver`.

1.4 Validation: Zod schemas from `@workspace/validation`.

1.5 Authentication: `better-auth` client through `lib/auth-client.ts`, following section 12. Authentication routes and backend configuration belong to `apps/server`.

1.6 Client-side state: **Zustand with Immer** (`zustand/middleware/immer`).

1.7 Tests: **Vitest + Testing Library** using jsdom.

1.8 API communication: use the prebuilt functions from `lib/api.ts`, following section 3.

1.9 Types shared between frontend and backend come from `@workspace/types`.

1.10 Linting and formatting are performed from the repository root using the configured Oxlint and Prettier tools.

1.11 Do not introduce alternative libraries or architectural patterns without a clear reason and owner approval when required by the root `AGENTS.md`.

---

## 2. Structure (Feature-Based)

The Admin application is organized by feature. Features live inside the `app/` folder, not in a separate `features/` folder.

Use the same feature-based structure as `apps/client`.

```text
apps/admin/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   ├── components/
│   │   │   ├── sections/
│   │   │   ├── requests/
│   │   │   ├── tests/
│   │   │   ├── error.tsx
│   │   │   ├── not-found.tsx
│   │   │   └── page.tsx
│   │   └── ...
│   │
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── categories/
│   │   ├── users/
│   │   ├── customers/
│   │   ├── coupons/
│   │   ├── reviews/
│   │   └── ...
│   │
│   ├── error.tsx
│   ├── global-error.tsx
│   ├── not-found.tsx
│   ├── globals.css
│   └── layout.tsx
│
├── components/
│   ├── helper-components/
│   └── ...
│
├── constants/
├── hooks/
├── lib/
│   ├── api.ts
│   └── auth-client.ts
├── requests/
├── stores/
├── test/
├── types/
├── public/
├── components.json
├── vitest.config.ts
└── vitest.setup.ts
```

This is a conceptual structure. Follow the actual existing route groups, layouts, and project organization where they already exist.

2.1 Everything specific to a feature goes inside that feature's folder.

2.2 If something is used by **more than 2 features**, move it to the matching root-level folder outside `app/`.

2.3 Put every file in its correct location. For example, a product-specific component belongs in `app/products/components/`, while a component genuinely shared across multiple features belongs in `components/`.

2.4 Shared shadcn components are installed in `@workspace/ui`, never duplicated inside `apps/admin`.

2.5 **One unit per file.** One request function per file, one store per file, one component per file, and one hook per file. Never group unrelated units in one file.

2.6 Each feature has one `tests/` folder for its unit tests. The global `test/` folder contains shared test setup, helpers, and tests for shared root-level code.

2.7 Keep authentication routes separate from protected dashboard routes using the existing route groups and layouts.

2.8 Do not create multiple dashboard layouts or duplicate navigation implementations for individual features. Use the appropriate shared dashboard layout and components.

2.9 Keep feature-specific logic inside the feature. Do not move everything into generic root-level folders.

---

## 3. Prebuilt Functions

3.1 `lib/api.ts` contains the prebuilt HTTP functions:

- `get`
- `post`
- `put`
- `patch`
- `delete`

**Always use these functions. Never use the raw `fetch` keyword.**

3.2 These functions are generic. Always provide the appropriate response type.

3.3 **Only functions inside `requests/` folders may call `lib/api.ts` or `authClient` from `lib/auth-client.ts`.**

Pages, sections, components, hooks, and stores must never call them directly.

3.4 Every API operation should have its own request function in its own file.

3.5 Request functions must:

- Accept appropriately typed input.
- Use the prebuilt API functions.
- Handle errors consistently.
- Return typed results.
- Avoid mixing presentation logic with API communication.
- Use validation schemas or inferred types from `@workspace/validation` when applicable.

3.6 Keep feature-specific requests inside their feature's `requests/` folder.

3.7 If a request is used by more than 2 features, move it to the root `requests/` folder.

---

## 4. Pages, Sections, and Data Flow

4.1 A page (`page.tsx`) does not fetch data and does not call request functions. It only composes sections and components and wraps data-fetching sections in `Suspense`.

4.2 A section (`sections/XYSection.tsx`) is responsible for fetching its data. It is an async Server Component that calls the appropriate request function and passes the retrieved data to its child components through props.

4.3 Components receive data through props and focus on rendering and user interaction. They do not independently fetch GET data.

4.4 Every section that fetches data must be wrapped in `Suspense` in its page, with an appropriate loading skeleton.

4.5 Skeletons use the naming convention `XYSkeleton.tsx` and live in the feature's `components/` folder, or the shared root-level `components/` folder when genuinely shared.

4.6 Components may call functions from `requests/` for non-GET operations such as creating, updating, deleting, changing statuses, or submitting forms.

They must never call `lib/api.ts` or `authClient` directly.

4.7 Sections that do not fetch data do not need `Suspense`.

4.8 Do not implement manual data-fetching loading/error handling using `useState` and `useEffect`. Use `Suspense` and skeletons for loading, and route `error.tsx` boundaries for errors.

4.9 Never implement an entire dashboard page in one large file. Split every page into focused sections and components.

4.10 Dashboard sections should be independent where practical. For example, dashboard statistics, recent orders, and top products should be separate sections if they fetch different data.

4.11 Do not make the entire dashboard depend on one large API request if its sections can load independently.

4.12 Use pagination and server-side filtering for large datasets such as orders, products, customers, and users.

4.13 Never retrieve an unbounded collection merely to filter or paginate it in the browser.

4.14 Keep query parameters, filters, sorting, and pagination consistent with the backend API contracts.

4.15 Do not duplicate API response data in Zustand stores. API-owned data belongs in the data-fetching flow, not client-owned global state.

### Expected data flow

```text
page.tsx
  └── Suspense fallback={<XYSkeleton />}
        └── sections/XYSection.tsx
              └── requests/getXY.ts
                    └── lib/api.ts
                          └── apps/server

        └── components/XY.tsx
              └── receives typed props
```

---

## 5. Error and Not-Found Handling

5.1 Every feature route must have its own `error.tsx` and `not-found.tsx`.

5.2 The application root must have:

- `app/error.tsx`
- `app/not-found.tsx`
- `app/global-error.tsx`

5.3 `error.tsx` must be a Client Component (`"use client"`), display a clear user-friendly error message, and provide a Retry button that calls `reset`.

5.4 `not-found.tsx` must display an appropriate 404 message and include a Back button.

The Back button must use `router.back()` through a small reusable Client Component.

5.5 Use `notFound()` when a requested resource does not exist.

5.6 Never display raw backend errors, stack traces, database errors, or internal implementation details to administrators.

5.7 Display appropriate messages for:

- Unauthorized access.
- Forbidden actions.
- Missing resources.
- Invalid input.
- Network failures.
- Server errors.
- Failed mutations.

5.8 Distinguish between authentication errors (`401`) and authorization errors (`403`).

5.9 Do not redirect a user with insufficient permissions to an unrelated page without explaining that access is forbidden.

5.10 Do not silently hide API errors by returning empty arrays or fake data.

5.11 A failed data request must be represented as an actual error state, not as a successful empty result.

---

## 6. Validation and Forms

6.1 All Zod schemas must come from `@workspace/validation`.

Never define duplicate feature schemas locally.

If a required schema does not exist, add it to `@workspace/validation` following that package's conventions.

6.2 The request function that sends form data should import the relevant schema or inferred type from `@workspace/validation`.

6.3 **EVERY form, without exception, uses `react-hook-form` with `zodResolver`.**

The resolver must receive a schema imported from `@workspace/validation`.

This applies to:

- Login forms.
- User management forms.
- Role and permission forms.
- Product forms.
- Category forms.
- Order update forms.
- Coupon forms.
- Review management forms.
- Search forms.
- Filter forms.
- Dialog forms.
- One-field forms.
- Any other form in the application.

6.4 The following approaches are forbidden for form handling:

- `useState` for form field values.
- `useState` for form validation errors.
- `useState` for form submission/loading state.
- Manual validation with `if/else` chains.
- Custom regex validation outside the shared schema.
- Building a custom form validation system when React Hook Form and Zod already cover the requirement.

6.5 Use React Hook Form's built-in capabilities:

- `register`
- `Controller`
- `handleSubmit`
- `formState.errors`
- `formState.isSubmitting`
- `setError("root", ...)`
- `reset`
- `setValue`
- `watch` when needed

6.6 The submit handler should call a function from `requests/`. It must not contain business logic.

6.7 Every form must be its own focused component.

6.8 Forms must display appropriate validation feedback and server errors.

6.9 Destructive actions and sensitive administrative changes must require an appropriate confirmation step.

6.10 Client-side validation improves UX but does not replace backend validation.

The backend must independently validate every incoming request.

6.11 For role and permission forms, the backend must verify that the current administrator is authorized to assign the requested role or permission.

Never rely on the options displayed in the frontend.

---

## 7. Caching

7.1 Apply caching to request functions only when there is a real benefit and the data is safe to cache.

7.2 **Administrative and user-specific data must never be cached in a way that allows it to leak between users or sessions.**

7.3 Treat the following as sensitive and dynamic data:

- Dashboard statistics.
- Orders.
- Customers.
- User accounts.
- Roles and permissions.
- Payment information.
- Customer addresses.
- Inventory.
- Order statuses.
- User account statuses.
- Administrative audit information.

7.4 Do not apply shared public caching to authenticated Admin responses.

7.5 When using Next.js caching features, ensure the authorization context is handled correctly and no private data is shared between users.

7.6 Do not cache authorization decisions in a way that could preserve revoked permissions.

7.7 After successful CRUD operations, refresh or invalidate the appropriate data according to the existing caching architecture.

7.8 Check the current Next.js documentation before using:

- `use cache`
- `cacheTag`
- `cacheLife`
- `updateTag`
- `revalidateTag`

7.9 Cache invalidation must run on the server, not directly in Client Components.

7.10 No new actions folder should be introduced without notifying the owner, following the root project's conventions.

7.11 Never trust cached prices, stock, payment status, order status, or user permissions for security-sensitive operations. The backend must verify the current trusted state.

---

## 8. Accessibility, Semantics, and Performance

8.1 Use semantic HTML:

- `main`
- `header`
- `nav`
- `section`
- `article`
- `aside`
- `footer`
- Correct heading hierarchy.
- `button` for actions.
- `a` for navigation.
- `ul` and `ol` for lists.

8.2 Accessibility requirements:

- Meaningful image `alt` text.
- Labels for every form field.
- Visible focus states.
- Full keyboard support.
- Appropriate ARIA attributes only when semantic HTML is insufficient.
- Sufficient color contrast.
- Respect `prefers-reduced-motion`.

8.3 Always use `next/image`, never a plain `img` tag.

Provide dimensions or `fill` with appropriate `sizes`.

8.4 Use `next/font` for fonts. Do not load fonts through manual link tags.

8.5 Keep Client Components to a minimum.

Default to Server Components and add `"use client"` only to the smallest component that requires interactivity.

8.6 Lazy-load heavy components when they are not needed for the initial render.

8.7 Use `Suspense` and skeletons for independent dashboard sections.

8.8 Every route must define appropriate page metadata.

8.9 Use `next/link` for internal navigation.

8.10 Admin tables must be responsive and usable on smaller screens.

8.11 Avoid unnecessary client-side JavaScript for large tables and dashboard statistics.

8.12 Keep dashboard layouts stable while data loads. Skeletons should match the expected content layout and prevent significant layout shifts.

---

## 9. UI and Styling

9.1 Use shadcn with **Base UI**, not Radix UI.

9.2 All shared shadcn components live in `@workspace/ui` (`packages/ui/src/components`).

Import them from `@workspace/ui`, for example:

```tsx
import { Button } from "@workspace/ui/components/button";
```

Do not create duplicate shadcn components inside `apps/admin`.

9.3 Add new shadcn components using the repository's configured shadcn command.

After running the command:

- Verify that files were created inside `packages/ui`.
- Verify that components use Base UI.
- Verify that no unwanted files were created inside `apps/admin`.
- If a registry requires Radix UI or the destination is unclear, ask before proceeding.

9.4 Treat `@workspace/ui` components as generated/shared code.

Compose them inside Admin feature components instead of modifying shared generated components unnecessarily.

If modifying `packages/ui` is required, keep the change minimal and notify the owner because other applications use the same package.

9.5 Use the `cn()` helper from `@workspace/ui` to merge conditional class names.

9.6 Prefer existing shared components over implementing duplicate controls.

9.7 Use Tailwind CSS utilities. Do not write custom CSS unless explicitly required by the existing design system.

9.8 Use the CSS variables and design tokens defined in the Admin application's `app/globals.css`.

9.9 Follow the existing Admin design system. Do not introduce a second unrelated visual system.

9.10 Keep sidebar, navigation, header, tables, dialogs, cards, forms, and dashboard widgets consistent.

9.11 Use responsive layouts and mobile-friendly navigation.

9.12 Keep the interface in Arabic and RTL wherever that is the application's current language requirement.

9.13 Use appropriate number, currency, and date formatting.

9.14 Display order and payment statuses with consistent labels and visual indicators.

9.15 Do not communicate a successful operation using only color. Provide meaningful text or accessible status information.

9.16 Use existing icons and UI components instead of adding unnecessary dependencies.

---

## 10. Types

10.1 Shared types and API contract types must come from `@workspace/types`.

10.2 Component prop types live in the same file as the component.

10.3 Feature-specific types belong in the feature's `types/` folder.

10.4 Follow the root naming convention for types: `xY.types.ts`.

10.5 **Never use `any`.**

10.6 Do not duplicate backend response types inside the Admin application.

10.7 Do not use unsafe type assertions to bypass incorrect API contracts.

10.8 Use explicit types for API responses, form inputs, permissions, role data, table rows, filters, and pagination.

10.9 Handle nullable and optional fields correctly.

10.10 Do not assume an authenticated user always has a specific role or permission.

10.11 Permission types must match the actual backend authorization model.

---

## 11. Code Rules

11.1 Do not write business logic directly inside pages, sections, or components.

Extract it into appropriate functions, hooks, requests, or utilities.

11.2 Follow the naming conventions in the root `AGENTS.md`:

- Components: `XY.tsx`
- Sections: `XYSection.tsx`
- Skeletons: `XYSkeleton.tsx`
- Hooks: `useXY.ts`
- Requests: `xY.ts`
- Stores: `xY.store.ts`
- Types: `xY.types.ts`

11.3 Keep code simple, readable, and clean.

11.4 Use one responsibility per function and per file.

11.5 Avoid large components that combine data retrieval, validation, business logic, state management, and rendering.

11.6 Extract reusable logic into small, appropriately named functions.

11.7 Avoid deeply nested conditions and unnecessary abstractions.

11.8 Avoid duplicating logic between features.

11.9 Use the existing project conventions rather than introducing new patterns.

11.10 Do not use `useEffect` as a replacement for proper data fetching or state management.

11.11 Do not use prop drilling for shared state.

11.12 Do not create a generic abstraction for a single use case unless it clearly improves maintainability.

11.13 Every meaningful operation must have a descriptive name and appropriate TypeScript input/output types.

11.14 Keep request functions focused on API communication, and keep presentation components focused on UI.

11.15 Do not take shortcuts that bypass these rules.

---

## 12. Authentication (better-auth)

12.1 `lib/auth-client.ts` exports `authClient`.

**Only functions inside `requests/` folders may use it.**

12.2 Every Better Auth operation must have its own function in its own file inside the appropriate `requests/` folder.

Examples:

- `loginWithEmail.ts`
- `logout.ts`
- `getSession.ts`
- `getCurrentUser.ts`
- Other operations required by the existing authentication system.

12.3 Each function handles the entire authentication request:

- Calls `authClient`.
- Handles the `{ data, error }` result.
- Returns a properly typed value or throws a clear error.

12.4 Never call `authClient` directly from a page, section, component, hook, or store.

12.5 Authentication UI must be split into focused components.

12.6 Authentication forms must follow section 6.

12.7 Use the existing Better Auth configuration. Do not create a second authentication system for Admin.

12.8 Do not implement custom password handling or store authentication credentials manually.

12.9 Follow the backend's existing session and cookie configuration.

12.10 Handle expired sessions and unauthenticated states correctly.

12.11 A login success does not automatically grant administrative access. The authenticated user's role and permissions must be checked independently.

---

## 13. Administrative Authentication and Route Protection

This section is security-critical.

13.1 **Every protected Admin route requires an authenticated user with the appropriate administrative permissions.**

13.2 An unauthenticated user must not be able to access protected dashboard pages.

13.3 Unauthenticated users must be redirected to the appropriate Admin login route.

13.4 Preserve the intended destination where appropriate so an authorized user can return to the requested page after login.

13.5 Authenticated customer accounts without administrative permissions must not access protected Admin pages.

13.6 Admin and Super Admin privileges must follow the existing backend RBAC model.

13.7 Never assume that a user is an administrator because:

- The user can access the Admin URL.
- The user knows the route.
- A role value exists in client-side state.
- A button is visible.
- A navigation item is displayed.
- A request was previously authorized.

13.8 Implement route protection using the appropriate server-side authentication and authorization mechanism supported by the existing Next.js and Better Auth setup.

13.9 Do not rely only on client-side route guards.

13.10 A layout-level guard is useful, but it does not replace backend authorization on individual protected API operations.

13.11 Every protected API endpoint must independently validate the authenticated user and the required permissions in `apps/server`.

13.12 Never expose privileged data before authorization has been verified.

13.13 If the user's permissions are insufficient, return or display a proper forbidden state.

13.14 Do not allow ordinary users to access Admin login-protected areas by manipulating client-side state.

13.15 Do not implement public Admin registration.

13.16 Administrative accounts must be provisioned through the authorized existing account management or trusted administrative process.

13.17 Do not duplicate authentication logic between the client and Admin applications.

13.18 Do not bypass the backend RBAC rules for convenience.

13.19 When the user's role or permissions are changed or revoked, the next protected operation must respect the updated backend authorization state.

13.20 Never cache a previous authorization result in a way that grants access after permission revocation.

---

## 14. RBAC and Permission-Based UI

14.1 The backend authorization system is the source of truth for roles and permissions.

14.2 Reuse the existing RBAC model. Do not invent a second role hierarchy inside the Admin application.

14.3 The Admin frontend may use the authenticated user's permissions to decide which navigation items, actions, and sections should be displayed.

14.4 Hiding a button is not authorization.

Every administrative operation must be authorized by the backend.

14.5 Display only the navigation items allowed by the current user's permissions.

14.6 Hide or disable actions that the current user is not allowed to perform.

14.7 If a user attempts a forbidden operation through a direct URL or manually constructed request, the backend must reject it.

14.8 Do not grant permissions based on frontend role names alone.

14.9 Do not assume all Admin users have identical privileges.

14.10 Do not assume Super Admin permissions from hardcoded frontend conditions. Read the actual authorization model.

14.11 Do not allow an Admin to promote themselves or other users beyond their assigned authority.

14.12 Do not allow administrators to assign permissions they do not possess the authority to grant.

14.13 Protect sensitive role changes, account bans, and administrative operations with appropriate confirmation UI.

14.14 Display clear forbidden and unauthorized states.

14.15 Avoid rendering sensitive administrative data before permissions have been established.

---

## 15. Dashboard and Data Management

15.1 Dashboard data must come from real backend API endpoints.

15.2 Never use mock data to make dashboard widgets appear functional.

15.3 Do not replace API failures with fake statistics or empty successful responses.

15.4 Every dashboard section must use the appropriate request function and typed API response.

15.5 Separate independent dashboard sections when appropriate.

15.6 Dashboard statistics should be retrieved using appropriate aggregated backend queries rather than fetching entire datasets and calculating everything in the browser.

15.7 Recent orders, top products, and other widgets must use their intended backend endpoints.

15.8 Display correct loading, empty, and error states.

15.9 All displayed information must reflect the actual database state.

15.10 Respect the current administrator's permissions when displaying dashboard sections and statistics.

15.11 Never expose data to an administrator that their permissions do not allow them to access.

15.12 Refresh or invalidate relevant data after successful mutations.

15.13 Avoid refetching the entire dashboard when only one independent section needs updating.

15.14 Use server-side pagination, search, filtering, and sorting for large datasets.

15.15 Preserve the existing API contracts and shared types.

---

## 16. Orders Management

16.1 Orders must be retrieved from real backend endpoints.

16.2 Display the correct order information, including:

- Order number.
- Customer information.
- Guest or registered customer identification.
- Order items.
- Delivery information.
- Payment method.
- Payment status.
- Order fulfillment status.
- Order totals.
- Creation date.

16.3 Support both guest orders and authenticated customer orders.

16.4 Do not assume every order has an associated registered user.

16.5 Guest orders must display their saved order-specific customer information.

16.6 Historical order information must use the order's saved customer and delivery snapshot, not the customer's current profile or address book.

16.7 Order details must be retrieved through authorized backend endpoints.

16.8 Only expose the information allowed by the current administrator's permissions.

16.9 Order status updates must use the appropriate backend operation.

16.10 Validate allowed order status transitions on the backend.

16.11 Do not allow an administrator to mark an order paid merely by changing its order fulfillment status.

16.12 Payment status must be controlled by the payment lifecycle and verified payment processing.

16.13 Display payment status separately from fulfillment status.

16.14 Handle failed, expired, cancelled, and successful payments accurately.

16.15 Require confirmation for sensitive or destructive order operations.

16.16 Refresh the relevant order queries after successful mutations.

---

## 17. User and Customer Management

17.1 User management must follow the existing backend RBAC rules.

17.2 Display only the user information permitted by the current administrator's permissions.

17.3 Support appropriate user listing, pagination, search, and filtering.

17.4 User details must be retrieved through authorized backend requests.

17.5 Role and permission management must reflect the existing backend authorization model.

17.6 Only administrators with the required permissions may assign roles or permissions.

17.7 Never allow an administrator to grant themselves additional privileges through frontend manipulation.

17.8 Account banning, suspension, unbanning, and reactivation must use authorized backend operations.

17.9 Require confirmation for account status changes.

17.10 Display meaningful success and error feedback.

17.11 Respect restrictions against banning or removing critical administrative accounts, including the last Super Admin where the backend enforces this rule.

17.12 Do not expose private customer information unnecessarily.

17.13 Do not assume guest customers are registered users.

17.14 Guest orders should be identifiable as guest orders without creating fake user accounts.

17.15 User-management UI must not bypass backend authorization.

---

## 18. Client-Side State (Zustand + Immer)

18.1 Client-owned application state uses Zustand with Immer.

18.2 Never use `createContext`, `useContext`, or `useReducer` to manage application state.

18.3 Do not use prop drilling for state shared between unrelated components.

18.4 Use Zustand only for client-owned state.

18.5 API-owned data is fetched through sections and request functions, not copied into Zustand stores.

18.6 One store per file.

18.7 Store filenames follow the `xY.store.ts` convention.

18.8 Export a hook named `useXYStore`.

18.9 Feature-specific stores belong in `app/<feature>/stores/`.

18.10 Stores used by more than 2 features belong in the root `stores/` folder.

18.11 Explicitly type state and actions.

18.12 Never use `any`.

18.13 Always use selectors:

```tsx
const selectedItems = useExampleStore((state) => state.items);
```

Do not subscribe to the entire store when only a small part is required.

18.14 Keep store actions thin.

18.15 Put reusable logic into small functions inside the store file or appropriate `utils/` folders.

18.16 Stores are used in Client Components only.

18.17 Do not use Zustand as a replacement for server-side authorization or trusted backend state.

18.18 Never store sensitive authentication credentials, provider secrets, or privileged security decisions in a client-side store.

18.19 Do not use persisted client state as the source of truth for permissions or roles.

---

## 19. Tables, Search, Filtering, and Pagination

19.1 Large administrative datasets must use server-side pagination whenever appropriate.

19.2 Search and filters must follow the backend API contract.

19.3 Do not fetch all records simply to implement client-side pagination.

19.4 Use typed filter and pagination parameters.

19.5 Keep URL query parameters consistent with the selected page, filters, and sorting where appropriate.

19.6 Reset pagination when a filter change makes the current page invalid.

19.7 Handle empty results separately from API failures.

19.8 Provide appropriate skeletons for loading tables.

19.9 Tables must have clear column headers and accessible actions.

19.10 Do not place complex business logic inside table column definitions.

19.11 Extract repeated cell renderers or action components when they are genuinely reusable.

19.12 Avoid duplicating table implementations between features when a shared abstraction is justified.

19.13 Do not build an unnecessarily generic table system for unrelated use cases.

19.14 Ensure all table actions respect the current user's permissions.

---

## 20. Testing (Vitest + Testing Library)

20.1 Tests run using Vitest in a jsdom environment.

20.2 Use the existing Testing Library dependencies and setup.

20.3 Do not modify `vitest.config.ts` or `vitest.setup.ts` without notifying the owner.

20.4 Feature tests belong in the feature's single `tests/` folder:

```text
app/<feature>/tests/
```

20.5 Name each test after the source file it tests:

- `UserTable.tsx` → `UserTable.test.tsx`
- `useUsers.ts` → `useUsers.test.ts`
- `formatOrder.ts` → `formatOrder.test.ts`

20.6 One test file per unit.

20.7 The global `test/` folder contains shared test helpers and tests for root-level shared code.

20.8 Test:

- Utilities and hooks.
- Zustand stores.
- Request functions.
- Forms.
- Components.
- Permission-based UI behavior.
- Loading, error, and empty states.
- Dashboard data rendering.
- Table filtering and pagination behavior.
- Confirmation dialogs.
- Route-related client components where applicable.

20.9 Request function tests must mock `lib/api.ts` or `authClient` using Vitest.

20.10 Never use the real network in unit tests.

20.11 Do not attempt to render async Server Components in Vitest. Test their request functions and the presentational components separately.

20.12 Use accessible queries such as:

- `getByRole`
- `getByLabelText`
- `getByText`

20.13 Prefer `user-event` over `fireEvent`.

20.14 Tests must be fully typed. Never use `any`.

20.15 Never delete, skip, or weaken existing tests to make a task pass.

20.16 Never leave `.only` in the test suite.

20.17 Security-sensitive authorization behavior should also be tested at the backend/integration level in the appropriate server test suite.

20.18 Frontend permission visibility tests do not replace backend authorization tests.

---

## 21. Commands

Run commands from `apps/admin`, or from the repository root using:

```bash
pnpm --filter ./apps/admin <script>
```

The exact scripts must be verified against the current `apps/admin/package.json`.

Do not assume a script exists without checking it.

Typical commands, if defined:

| Command           | Purpose                                           |
| ----------------- | ------------------------------------------------- |
| `pnpm dev`        | Start Next.js development server                  |
| `pnpm build`      | Create production build                           |
| `pnpm start`      | Start the production server                       |
| `pnpm typecheck`  | Run Next.js type generation and TypeScript checks |
| `pnpm test`       | Run Vitest                                        |
| `pnpm test:watch` | Run Vitest in watch mode                          |

Linting and formatting are performed from the repository root:

```bash
pnpm lint
pnpm format
```

21.1 After any Admin change, run the relevant checks in this order:

1. `pnpm lint` from the repository root.
2. `pnpm typecheck` for the Admin application.
3. `pnpm test` for the Admin application.

21.2 Fix every error and failing test introduced by your changes.

21.3 Run `pnpm build` when changing:

- Route structure.
- Layouts.
- Authentication guards.
- `error.tsx`.
- `not-found.tsx`.
- `Suspense` boundaries.
- Metadata.
- Next.js configuration.
- Caching configuration.

Also run it whenever requested.

21.4 Never run `dev`, `start`, or `test:watch` unless explicitly asked, because they are long-running commands.

21.5 Add packages using the repository's package management conventions:

```bash
pnpm add <package> --filter ./apps/admin
```

21.6 Do not install a dependency that already exists in the workspace or can be imported from an approved shared package.

21.7 Do not change root scripts or workspace configuration without a clear reason.

---

## 22. Security and Data Integrity

22.1 Treat the Admin application as a privileged interface.

22.2 The frontend is never the authority for authentication, authorization, payment status, order ownership, or user permissions.

22.3 Every sensitive operation must be authorized by the backend.

22.4 Never expose secrets, credentials, tokens, or internal configuration in client-side code.

22.5 Never trust user IDs, roles, permission lists, order statuses, or financial values supplied by the browser.

22.6 Never use a client-side role check as the only security mechanism.

22.7 Do not bypass backend validation to make an administrative form work.

22.8 Do not allow unauthorized users to retrieve private customer or financial information.

22.9 Do not display sensitive information in logs or error messages.

22.10 Confirm destructive actions before submitting them.

22.11 Use the existing API security, session, cookie, and authorization conventions.

22.12 Handle expired authentication sessions and revoked permissions correctly.

22.13 Avoid exposing internal database IDs unnecessarily when the application has appropriate public identifiers.

22.14 Keep payment data and payment status read-only unless a specifically authorized backend operation exists.

22.15 Never allow the Admin UI to simulate successful payment confirmation.

22.16 Any financial, inventory, or order status change must follow the backend's actual business rules.

---

## 23. Self-Check Before Reporting a Task as Done

Before marking any Admin task complete, verify all of the following.

23.1 **Architecture:** Are features organized correctly inside `app/`? Are shared components and utilities in the appropriate root-level folders?

23.2 **Files:** Does every request, store, hook, and component follow the one-unit-per-file rule?

23.3 **Forms:** Does every form use React Hook Form and `zodResolver` with a schema from `@workspace/validation`?

23.4 **Validation:** Are both frontend and backend validation implemented correctly?

23.5 **Requests:** Are all API and Better Auth calls inside `requests/` functions? Is there no direct `fetch`, `lib/api.ts`, or `authClient` usage outside those functions?

23.6 **Data flow:** Do pages compose sections? Do data-fetching sections use async Server Components and `Suspense` with skeletons?

23.7 **Error handling:** Do routes have appropriate `error.tsx` and `not-found.tsx` boundaries?

23.8 **Authentication:** Are all protected routes inaccessible to unauthenticated users?

23.9 **Authorization:** Are all privileged actions enforced by backend RBAC, not just hidden in the frontend?

23.10 **Permissions:** Does the UI reflect actual backend permissions without treating client-side checks as security?

23.11 **Dashboard:** Is every displayed statistic and record retrieved from a real backend endpoint?

23.12 **Orders:** Are guest and authenticated customer orders handled correctly?

23.13 **Users:** Are user management, role assignment, and account status operations properly protected?

23.14 **State:** Is all client-owned shared state managed through Zustand with Immer? Is API-owned data kept out of stores?

23.15 **Caching:** Is private Admin data isolated from other users and sessions?

23.16 **Types:** Are all types explicit and shared contracts imported from `@workspace/types`?

23.17 **UI:** Are shared shadcn components imported from `@workspace/ui` and based on Base UI?

23.18 **Accessibility:** Are forms, tables, dialogs, and navigation accessible?

23.19 **Tests:** Have tests been added or updated for the changed functionality?

23.20 **Verification:** Do the relevant root lint, Admin typecheck, and Admin tests pass?

23.21 **Build:** Has the production build been verified when required?

23.22 **Security:** Have unauthorized and forbidden scenarios been checked?

23.23 **Quality:** Is the code modular, readable, typed, and free from unnecessary duplication or spaghetti logic?

---

## 24. Final Engineering Rules

1. Read the root `AGENTS.md` before working.
2. Follow the root `AGENTS.md` and this file strictly.
3. Preserve the existing application architecture and conventions.
4. Do not rebuild the Admin application from scratch.
5. Do not introduce a second authentication or RBAC system.
6. Do not use mock data to hide broken backend integrations.
7. Do not implement large components or services containing unrelated logic.
8. Every meaningful operation must be encapsulated in a clearly named function with appropriate TypeScript types.
9. Keep controllers, services, queries, requests, components, and utilities separated according to their responsibilities.
10. Do not put business logic directly inside pages, sections, or components.
11. Never bypass backend authorization.
12. Never trust client-side roles or permissions.
13. Never expose private customer data to unauthorized administrators.
14. Never mark payments as successful through frontend actions.
15. Do not use `any`.
16. Do not use raw `fetch`.
17. Do not use Radix UI.
18. Do not create shadcn components inside `apps/admin`.
19. Do not introduce unnecessary dependencies or abstractions.
20. Do not delete tests or weaken existing validation to make checks pass.
21. Do not report a task as complete without running the relevant verification.
22. If an instruction conflicts with the root `AGENTS.md`, follow the root-level rules and notify the owner about the conflict instead of silently choosing a different convention.
23. If a required architecture or security decision cannot be determined from the existing implementation, investigate the backend and existing documentation before making assumptions.

**The Admin application must remain secure, maintainable, fully typed, and consistent with the rest of the monorepo. Correctness and authorization take priority over convenience or visual functionality.**
