# Repository Guidelines

## Project Structure & Module Organization
- `index.html` is the shell page; it stays minimal because all logic runs through the script module.
- `script.js` houses the Open-Meteo client. Keep new helpers near the data-parsing block and export them when needed.
- `package.json` defines the `openmeteo` dependency and npm scripts. Generated assets (`node_modules`, lockfile artifacts) should never be edited manually.
- Place new assets (icons, mock data) inside an `assets/` directory at the repo root, and mirror test fixtures under `tests/fixtures/` for clarity.

## Build, Test, and Development Commands
- `npm install` — install dependencies before running anything else.
- `node script.js` — execute the forecast fetcher locally; supports top-level await because the project uses ES modules.
- `npm test` — placeholder today; update this script when real tests land so CI can reuse it.

## Coding Style & Naming Conventions
- Use modern ES modules, `const`/`let`, and 4-space indentation to match `script.js`.
- Name functions and files after the data they process (`formatHourlyPrecip`, `minutely-view.js`). Keep async helpers suffixed with `Async` for readability.
- Favor descriptive object keys over abbreviations, and keep logging concise (`console.log("minutely15 data", data)`).
- Run `node --check script.js` when touching syntax-heavy sections to fail fast.

## Testing Guidelines
- Add unit tests under `tests/` using your preferred runner (Vitest or Jest are good fits); mirror runtime module names (`tests/script.test.js`).
- Target ≥80% coverage for the parsing utilities, especially transformations that touch Open-Meteo timestamps.
- Stub network calls by snapshotting small JSON payloads in `tests/fixtures/` so tests stay deterministic.
- Once real tests exist, wire them to `npm test` and gate pull requests on a green run.

## Commit & Pull Request Guidelines
- Write imperative, scope-aware commits (`Add hourly aggregation helper`). Keep related changes together instead of large mixed commits.
- Reference issues in commit bodies or PR descriptions when applicable (`Refs #12`).
- Pull requests should describe the user impact, testing performed (`node script.js`, `npm test`), and include screenshots or logs when UI or console output changes.
- Request review before merging; at least one approval is required for API-affecting changes.

## Environment & API Notes
- API credentials are not needed, but respect the documented rate limits; batch queries locally when exploring.
- Keep secrets out of the repo. If you must store keys for other services, rely on `.env` (ignored by git) and document required variables in the PR description.
