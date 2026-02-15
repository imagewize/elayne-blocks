# Creating Language Files for Elayne Blocks

## Overview
This guide explains how to create and maintain language files for the Elayne Blocks plugin to support internationalization.

## Current State
- ✅ Plugin header has `Text Domain: elayne-blocks`
- ✅ Plugin header has `Domain Path: /languages`
- ✅ All blocks use consistent text domain `elayne-blocks`
- ❌ No language files exist yet
- ❌ No translation strings extracted

## Step 1: Extract Translation Strings

Run this command to extract all translatable strings from your PHP and JavaScript files:

```bash
# Install wp-cli if you don't have it
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
chmod +x wp-cli.phar
sudo mv wp-cli.phar /usr/local/bin/wp

# Extract translation strings
wp i18n make-pot . --domain=elayne-blocks --exclude="node_modules,build,vendor,tests" --dest-file=languages/elayne-blocks.pot
```

Alternatively, you can use the `@wordpress/scripts` package that's already in your project:

```bash
cd blocks/carousel && npm run make-pot
cd blocks/mega-menu && npm run make-pot
cd blocks/faq-tabs && npm run make-pot
cd blocks/faq-tab-answer && npm run make-pot
cd blocks/search-overlay-trigger && npm run make-pot
cd blocks/slide && npm run make-pot
```

## Step 2: Create Language Files

After extracting strings, you'll have a `.pot` file. To create actual translations:

### Option A: Use Poedit (Recommended)
1. Download Poedit: https://poedit.net/
2. Open the `.pot` file
3. Save as `.po` file (e.g., `elayne-blocks-nl_NL.po` for Dutch)
4. Poedit will automatically create a `.mo` file

### Option B: Manual Creation
Create files in `languages/` directory:

```
elayne-blocks.pot          # Template file (generated)
elayne-blocks-nl_NL.po      # Dutch translation
elayne-blocks-nl_NL.mo      # Compiled Dutch translation
elayne-blocks-de_DE.po      # German translation
elayne-blocks-de_DE.mo      # Compiled German translation
```

## Step 3: Load Language Files

The plugin already has the correct header to load language files. WordPress will automatically load them when:
1. The site's language matches the language code
2. The files are in the correct location (`/languages/`)

## Step 4: Translate Strings

Here are the key strings that need translation:

### Common Strings
- "Mega Menu" (block title)
- "Carousel" (block title)
- "Slide" (block title)
- "FAQ Tabs" (block title)
- "Search Overlay Trigger" (block title)
- "Close menu" (aria-label)
- "Enable Animations" (toggle label)
- "Enable Icon" (toggle label)
- And many more editor labels and descriptions

## Step 5: Testing Translations

To test your translations:

1. Install the Loco Translate plugin
2. Go to Loco Translate → Plugins → Elayne Blocks
3. Create or edit translations
4. Switch WordPress language to test

## Best Practices

1. **Keep text domain consistent**: Always use `elayne-blocks`
2. **Use context when needed**: Use `_x()` instead of `__()` when words have multiple meanings
3. **Escape variables**: Never translate strings with variables directly - use placeholders
4. **Update translations**: Re-run `make-pot` after adding new strings

## Automating with GitHub Actions

Add this to your `.github/workflows/i18n.yml`:

```yaml
name: i18n

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  extract-strings:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Node
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm install
      - name: Extract strings
        run: npm run make-pot
      - name: Commit changes
        run: |
          git config --global user.name "GitHub Actions"
          git config --global user.email "actions@github.com"
          git add languages/elayne-blocks.pot
          git commit -m "Update translation template" || echo "No changes"
```

## WordPress.org Translation Directory

Once your plugin is on WordPress.org, translations will be managed through:
https://translate.wordpress.org/projects/wp-plugins/elayne-blocks

You don't need to manually create translations - the community will contribute them!

## Current Action Items

To get started with language files:

1. ✅ Plugin header is correctly set up
2. ✅ Text domain is consistent across all blocks
3. ❌ Extract translation strings (run `wp i18n make-pot`)
4. ❌ Create initial `.pot` template file
5. ❌ Optionally create some initial translations (e.g., Dutch or German)
6. ❌ Test translations on a test site

Would you like me to help you generate the initial `.pot` file automatically? I can create a script that extracts all the translatable strings from your codebase.
