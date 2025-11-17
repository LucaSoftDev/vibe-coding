# Quasar App (quasar-project)

A Quasar Project

## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### JSON Server edit workflow example

Use the bundled [json-server](https://github.com/typicode/json-server) instance to simulate a back-office edit workflow for the product form page.

1. (Optional) Copy `.env.example` to `.env` if you need to customize `VITE_JSON_SERVER_URL`.
2. Start the fake API: `npm run dev:api`. This watches `json-server/db.json` and exposes it at `http://localhost:3333`.
3. In another terminal, run `npm run dev` and open the Products page (`/#/products`).
4. When you hit **Salvar**, the form issues a `PUT /products/1` request against the JSON Server and persists the edited data back to `json-server/db.json`.

You can tweak the seed payload directly in `json-server/db.json` to create alternative scenarios (out-of-stock item, inactive product, and so on).

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
