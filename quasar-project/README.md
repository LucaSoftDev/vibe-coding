# Quasar App (quasar-project)

Modern Quasar/Vue 3 playground showcasing a dynamic form-builder with Pinia stores, class-transformer/class-validator DTOs, and a JSON Server-powered edit workflow.

## Stack

- [Quasar 2](https://quasar.dev/) + Vue 3 + Vite
- TypeScript, Pinia, Vue Router
- Form builder abstractions (`src/core/FormBuilder.ts` + `src/forms/*`)
- Axios boot file (`src/boot/axios.ts`) plus a dedicated workflow client (`src/services/workflowApi.ts`)
- `json-server` mock backend for the Products edit flow
- Node’s built-in test runner (`node:test`) + TypeScript for unit tests

## Getting Started

```bash
npm install
# or
yarn
```

### Development servers

Run Quasar in SPA mode with hot reload:

```bash
npm run dev
```

### JSON Server edit workflow example

Use the bundled [json-server](https://github.com/typicode/json-server) instance to simulate a back-office edit workflow for the product form page.

1. (Optional) Copy `.env.example` to `.env` if you need to customize `VITE_JSON_SERVER_URL`.
2. Start the fake API: `npm run dev:api`. This watches `json-server/db.json` and exposes it at `http://localhost:3333`.
3. In another terminal, run `npm run dev` and open the Products page (`/#/products`).
4. When you hit **Salvar**, the form issues a `PUT /products/1` request against the JSON Server and persists the edited data back to `json-server/db.json`.

You can tweak the seed payload directly in `json-server/db.json` to create alternative scenarios (out-of-stock item, inactive product, etc.).

### Code Quality

```bash
npm run lint     # ESLint over src/**
npm run format   # Prettier over supported extensions
```

### Tests

`npm run test` compiles the relevant TS sources with `tsc -p tsconfig.test.json`, generates lightweight stubs in `.test-dist/`, and executes the product store suite with Node’s test runner.

### Build

```bash
npm run build
```

## Project Structure Highlights

- `src/forms/*` FormBuilder definitions (Product, Workshop, Customer, etc.)
- `src/components/form-builder/*` generic renderers (tabs, tables, custom components)
- `src/stores/*` Pinia stores for forms, products, suppliers
- `json-server/db.json` seed payload for the edit workflow
- `src/domain/product/*` domain DTO/model/mapper, isolating API serialization concerns
- `src/forms/productForm.adapter.ts` converts domain entities to/from form values
- `src/stores/productStore.ts` Pinia API store that exposes domain entities
- `src/domain/workshop/*`, `src/services/workshopService.ts` and `src/pages/WorkshopEditPage.vue` show the Service → Domain → Form DTO flow for the Workshop feature
- `scripts/setup-test-stubs.cjs` helper used by `npm run test`

### Workshop domain workflow example

1. Start JSON Server (`npm run dev:api`) – it now seeds a `workshops` collection with `id: ws-1`.
2. Visit `/#/workshops/ws-1` while running `npm run dev`.
3. `WorkshopEditPage.vue` loads the workshop via `workshopService`, which validates the payload using the domain `Workshop` class, converts it to a `WorkshopFormDto`, and seeds the generic `formStore`.
4. When you submit, the page converts the form values back into a `Workshop` instance and persists using the same service (`toApiDto()`), keeping the form renderer and store free of API details.

## Configuration

See [Configuring quasar.config.ts](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js) for advanced customization and refer to `.env.example` for the JSON Server base URL override.
