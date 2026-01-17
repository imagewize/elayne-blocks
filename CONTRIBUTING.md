# Contributing

Thanks for your interest in improving Elayne Blocks.

## Project Structure

- Root plugin entry: `elayne-blocks.php`.
- Blocks live in `blocks/<block-name>/`.
- Source files live in `blocks/<block-name>/src/`.
- Compiled assets live in `blocks/<block-name>/build/` and are committed.
- Mega menu template parts live in `parts/` and are registered via `get_block_templates` filter.

## Development Setup

Each block is isolated and has its own `package.json`.

```bash
cd blocks/carousel
npm install
```

## Build

```bash
npm run build
```

For watch mode:

```bash
npm start
```

Repeat for other blocks (`mega-menu`, `slide`, `faq-tabs`, `search-overlay-trigger`) as needed.

## Linting and Formatting

```bash
npm run lint:js
npm run lint:css
npm run format
```

## Testing

There is no automated test runner. Please validate changes manually in WordPress (editor and frontend).

## Theme Integration

The mega menu block requires the Elayne theme to register the 'menu' template part area for proper Site Editor integration. Without theme registration, template parts will still function but won't appear in the Site Editor's sidebar navigation.

See `CLAUDE.md` for the required theme code.

## Releases

See `CHANGELOG.md` for release notes and version history.
