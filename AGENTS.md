# Repository Guidelines

## Project Structure & Module Organization
- Root plugin entry: `elayne-blocks.php`.
- Block packages live in `blocks/<block-name>/`.
- Source files live in `blocks/<block-name>/src/` (edit, save, styles, block.json).
- Compiled assets live in `blocks/<block-name>/build/` and are committed for distribution.
- Third-party assets for the carousel are vendored in `blocks/carousel/slick/`.

## Build, Test, and Development Commands
Run commands from each block directory (they are isolated):
- `npm install`: install block dependencies.
- `npm run build`: production build to `build/`.
- `npm start`: dev build with watch mode.
- `npm run lint:js`: JS linting via `@wordpress/scripts`.
- `npm run lint:css`: style linting via `@wordpress/scripts`.
- `npm run format`: format code via `@wordpress/scripts`.

Note: `blocks/mega-menu` uses `--experimental-modules` in its build/start scripts.

## Coding Style & Naming Conventions
- Follow WordPress block conventions and existing patterns in `blocks/*/src/`.
- Keep block metadata in `blocks/*/src/block.json` as the source of truth.
- Naming: block names use `elayne/<block-name>`; directory names are kebab-case.
- Formatting and linting should be done with `npm run format` and lint scripts above.

## Testing Guidelines
- No automated test runner is configured in this repository.
- Validate changes manually in WordPress (editor and frontend).
- Run linting commands before opening a PR.

## Commit & Pull Request Guidelines
- Commits are short, descriptive summaries (e.g., "FAQ Tabbed Questions").
- PRs should include:
  - A clear description of the block change and motivation.
  - Screenshots or screen recordings for UI changes.
  - Notes on any updated `build/` assets and how they were generated.

## Architecture Notes
- Blocks are auto-discovered at runtime by scanning `blocks/*/build/block.json`.
- Carousel only allows Slide children; Slide is constrained to Carousel.
- Mega Menu uses the WordPress Interactivity API for frontend state.
