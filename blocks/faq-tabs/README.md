# FAQ Tabs Block

An interactive FAQ block with vertical tab navigation and dynamic content display.

## Features

- **Vertical Tab Navigation**: Questions displayed as clickable tabs on the left
- **Dynamic Content**: Answer content updates smoothly when clicking tabs
- **Fully Customizable**: Edit questions, answers, and button text in the block inspector
- **Responsive Design**: Mobile-friendly layout that stacks on small screens
- **Theme Integration**: Uses WordPress color presets for seamless theme matching
- **Smooth Animations**: Fade transitions when switching between answers

## Usage

1. Add the "FAQ Tabs" block to your page/post
2. Configure questions and answers in the block inspector sidebar
3. Customize the button text and URL
4. Adjust colors using WordPress theme color presets

## Block Attributes

- **questions** (array): FAQ questions with title and description
  - question: Short question text shown in tab
  - title: Answer title
  - description: Full answer text
- **buttonText** (string): Call-to-action button text
- **buttonUrl** (string): Button destination URL

## Customization

### Adding/Removing Questions

Use the block inspector sidebar to:
- Add new questions with the "Add Question" button
- Remove questions (minimum 1 required)
- Edit question text, answer titles, and descriptions

### Styling

The block uses CSS custom properties from your theme:
- `--wp--preset--color--primary`: Active tab background
- `--wp--preset--color--contrast`: Tab hover background
- `--wp--preset--color--tertiary`: Inactive tab and content box background
- `--wp--preset--color--base`: Text color on colored backgrounds
- `--wp--preset--spacing--large`: Content padding
- `--wp--preset--spacing--medium`: Title margins

## Development

Build the block:
```bash
npm install
npm run build
```

Start development mode:
```bash
npm start
```

## Files

- `src/index.js` - Block registration
- `src/edit.js` - Editor component with Inspector controls
- `src/save.jsx` - Frontend HTML output
- `src/view.js` - Frontend JavaScript for tab interaction
- `src/style.scss` - Frontend and editor styles
- `src/editor.scss` - Editor-only styles
- `src/block.json` - Block metadata and attributes
