# Phase 2D: Content Block Ecosystem

**Status:** ⚠️ DEPRECATED - See Revised Plan
**Started:** 2026-01-16
**Dependencies:** Phase 2C Complete ✅ (Layout Modes & Styling System)

---

## ⚠️ DEPRECATION NOTICE

**This plan has been deprecated and replaced.**

**Date Deprecated:** 2026-01-17

**Reason:** After implementation review, the hybrid content system (Template Parts + Custom InnerBlocks with modal editing) creates UX issues:
- Modal editing breaks natural WordPress workflow
- Users must insert blocks before seeing content
- Navigation bar positioning is problematic with InnerBlocks
- Site Editor provides better editing experience for Template Parts

**New Approach:** See [PHASE-2D-REVISED-PLAN.md](PHASE-2D-REVISED-PLAN.md)

**What Changed:**
- ❌ Removed: Custom content blocks (mega-menu-column, mega-menu-section, mega-menu-item)
- ❌ Removed: Hybrid content source system (template vs custom)
- ❌ Removed: Modal editing for InnerBlocks
- ✅ Keeping: Template Parts only (natural WordPress workflow)
- ✅ Adding: Rich library of 5-6 ready-to-use Template Part patterns

This document is preserved for historical reference only.

---

## Overview

Phase 2D focuses on building **custom inner blocks** that provide structure and flexibility for mega menu content. These blocks enable users to create rich, organized mega menus without relying solely on template parts.

**What we're building:**
- `elayne/mega-menu-column` - Column container for grid layouts
- `elayne/mega-menu-section` - Heading + content grouping
- `elayne/mega-menu-item` - Individual menu item with icon/description/badge

**Why these blocks matter:**
- Provide structure for mega menu content
- Enable icon + label + description patterns
- Support badge/tag system ("New", "Sale", etc.)
- Work alongside template parts (not replacing them)
- Give users full control without custom coding

---

## Goals

1. Create three new custom blocks for mega menu content
2. Establish parent-child block relationships
3. Implement icon support in menu items
4. Add badge/tag system for highlighting items
5. Ensure blocks work in all 4 layout modes
6. Maintain accessibility standards
7. Provide intuitive editor experience

---

## Architecture

### Block Hierarchy

```
elayne/mega-menu (parent block)
└─ InnerBlocks (accepts any blocks)
   ├─ elayne/mega-menu-column (optional, for grid layouts)
   │  └─ elayne/mega-menu-section (optional, for grouping)
   │     └─ elayne/mega-menu-item (leaf block)
   │        OR core blocks (paragraph, image, etc.)
   │        OR template parts
   ├─ elayne/mega-menu-section (can be used directly)
   │  └─ elayne/mega-menu-item
   └─ core blocks / template parts (still supported)
```

### Block Relationships

| Block | Parent Constraint | Allowed Children | Purpose |
|-------|------------------|------------------|---------|
| **mega-menu-column** | mega-menu | Any blocks | Column container for grid layouts |
| **mega-menu-section** | mega-menu, mega-menu-column | Any blocks | Heading + content grouping |
| **mega-menu-item** | mega-menu-section, mega-menu, mega-menu-column | None (leaf block) | Individual menu item |

**Note:** These blocks are **optional** - users can still use core blocks and template parts directly in mega-menu.

---

## Implementation Plan

### Block 1: Mega Menu Column ⭐ HIGH PRIORITY

**Purpose:** Container for grid layouts, enables multi-column mega menus

**File Structure:**
```
blocks/mega-menu-column/
├── src/
│   ├── block.json
│   ├── index.js
│   ├── edit.js
│   ├── save.jsx
│   ├── style.scss
│   └── editor.scss
├── build/ (auto-generated)
└── package.json
```

#### Attributes

```json
{
  "attributes": {
    "width": {
      "type": "string",
      "default": "auto",
      "enum": ["auto", "1/2", "1/3", "1/4", "2/3", "3/4"]
    },
    "verticalAlignment": {
      "type": "string",
      "default": "top",
      "enum": ["top", "center", "bottom"]
    },
    "backgroundColor": {
      "type": "string",
      "default": ""
    },
    "textColor": {
      "type": "string",
      "default": ""
    }
  }
}
```

#### Editor Component (edit.js)

```jsx
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, PanelColorSettings } from '@wordpress/components';
import classnames from 'classnames';

export default function Edit({ attributes, setAttributes }) {
  const { width, verticalAlignment, backgroundColor, textColor } = attributes;

  const blockProps = useBlockProps({
    className: classnames(
      `width-${width.replace('/', '-')}`,
      `align-${verticalAlignment}`
    ),
    style: {
      backgroundColor: backgroundColor || undefined,
      color: textColor || undefined,
    },
  });

  return (
    <>
      <InspectorControls>
        <PanelBody title="Column Settings" initialOpen={true}>
          <SelectControl
            label="Column Width"
            value={width}
            options={[
              { label: 'Auto', value: 'auto' },
              { label: '1/2 (50%)', value: '1/2' },
              { label: '1/3 (33%)', value: '1/3' },
              { label: '2/3 (66%)', value: '2/3' },
              { label: '1/4 (25%)', value: '1/4' },
              { label: '3/4 (75%)', value: '3/4' },
            ]}
            onChange={(val) => setAttributes({ width: val })}
          />

          <SelectControl
            label="Vertical Alignment"
            value={verticalAlignment}
            options={[
              { label: 'Top', value: 'top' },
              { label: 'Center', value: 'center' },
              { label: 'Bottom', value: 'bottom' },
            ]}
            onChange={(val) => setAttributes({ verticalAlignment: val })}
          />
        </PanelBody>

        <PanelColorSettings
          title="Color Settings"
          colorSettings={[
            {
              value: backgroundColor,
              onChange: (color) => setAttributes({ backgroundColor: color }),
              label: 'Background Color',
            },
            {
              value: textColor,
              onChange: (color) => setAttributes({ textColor: color }),
              label: 'Text Color',
            },
          ]}
        />
      </InspectorControls>

      <div {...blockProps}>
        <InnerBlocks
          allowedBlocks={[
            'elayne/mega-menu-section',
            'elayne/mega-menu-item',
            'core/paragraph',
            'core/heading',
            'core/image',
            'core/list',
            'core/template-part',
          ]}
        />
      </div>
    </>
  );
}
```

#### Frontend Output (save.jsx)

```jsx
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import classnames from 'classnames';

export default function Save({ attributes }) {
  const { width, verticalAlignment, backgroundColor, textColor } = attributes;

  const blockProps = useBlockProps.save({
    className: classnames(
      'wp-block-elayne-mega-menu-column',
      `width-${width.replace('/', '-')}`,
      `align-${verticalAlignment}`
    ),
    style: {
      backgroundColor: backgroundColor || undefined,
      color: textColor || undefined,
    },
  });

  return (
    <div {...blockProps}>
      <InnerBlocks.Content />
    </div>
  );
}
```

#### Styles (style.scss)

```scss
.wp-block-elayne-mega-menu-column {
  // Width variants
  &.width-auto {
    flex: 1 1 auto;
  }

  &.width-1-2 {
    flex: 0 0 50%;
    max-width: 50%;
  }

  &.width-1-3 {
    flex: 0 0 33.333%;
    max-width: 33.333%;
  }

  &.width-2-3 {
    flex: 0 0 66.666%;
    max-width: 66.666%;
  }

  &.width-1-4 {
    flex: 0 0 25%;
    max-width: 25%;
  }

  &.width-3-4 {
    flex: 0 0 75%;
    max-width: 75%;
  }

  // Vertical alignment
  &.align-top {
    align-self: flex-start;
  }

  &.align-center {
    align-self: center;
  }

  &.align-bottom {
    align-self: flex-end;
  }

  // Responsive: stack on mobile
  @media (max-width: 768px) {
    &[class*="width-"] {
      flex: 1 1 100%;
      max-width: 100%;
    }
  }
}
```

**Estimated time:** 2-3 hours

---

### Block 2: Mega Menu Section ⭐ HIGH PRIORITY

**Purpose:** Heading + content grouping, collapsible on mobile

**File Structure:** Same as Column block

#### Attributes

```json
{
  "attributes": {
    "heading": {
      "type": "string",
      "default": "Section Heading"
    },
    "iconName": {
      "type": "string",
      "default": ""
    },
    "customSVG": {
      "type": "string",
      "default": ""
    },
    "isLinkWrapper": {
      "type": "boolean",
      "default": false
    },
    "linkUrl": {
      "type": "string",
      "default": ""
    },
    "collapsibleMobile": {
      "type": "boolean",
      "default": false
    },
    "headingLevel": {
      "type": "string",
      "default": "h3",
      "enum": ["h2", "h3", "h4", "h5", "h6"]
    }
  }
}
```

#### Editor Component (edit.js)

```jsx
import { useBlockProps, InnerBlocks, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, SelectControl, TextControl } from '@wordpress/components';
import IconPicker from '../../mega-menu/src/components/IconPicker';

export default function Edit({ attributes, setAttributes }) {
  const {
    heading,
    iconName,
    customSVG,
    isLinkWrapper,
    linkUrl,
    collapsibleMobile,
    headingLevel,
  } = attributes;

  const blockProps = useBlockProps({
    className: 'wp-block-elayne-mega-menu-section',
  });

  const HeadingTag = headingLevel;

  return (
    <>
      <InspectorControls>
        <PanelBody title="Section Settings" initialOpen={true}>
          <SelectControl
            label="Heading Level"
            value={headingLevel}
            options={[
              { label: 'H2', value: 'h2' },
              { label: 'H3', value: 'h3' },
              { label: 'H4', value: 'h4' },
              { label: 'H5', value: 'h5' },
              { label: 'H6', value: 'h6' },
            ]}
            onChange={(val) => setAttributes({ headingLevel: val })}
          />

          <ToggleControl
            label="Collapsible on Mobile"
            help="Allow users to expand/collapse section on mobile"
            checked={collapsibleMobile}
            onChange={(val) => setAttributes({ collapsibleMobile: val })}
          />
        </PanelBody>

        <PanelBody title="Icon" initialOpen={false}>
          <IconPicker
            value={iconName}
            customSVG={customSVG}
            onChange={(icon, svg) => {
              setAttributes({ iconName: icon, customSVG: svg });
            }}
          />
        </PanelBody>

        <PanelBody title="Link Settings" initialOpen={false}>
          <ToggleControl
            label="Make Entire Section Clickable"
            help="Wrap section in a link"
            checked={isLinkWrapper}
            onChange={(val) => setAttributes({ isLinkWrapper: val })}
          />

          {isLinkWrapper && (
            <TextControl
              label="Link URL"
              value={linkUrl}
              onChange={(val) => setAttributes({ linkUrl: val })}
              type="url"
              placeholder="https://example.com"
            />
          )}
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <div className="wp-block-elayne-mega-menu-section__header">
          {iconName && !customSVG && (
            <span className={`dashicons dashicons-${iconName}`} />
          )}
          {customSVG && (
            <span
              className="custom-icon"
              dangerouslySetInnerHTML={{ __html: customSVG }}
            />
          )}
          <RichText
            tagName={HeadingTag}
            value={heading}
            onChange={(val) => setAttributes({ heading: val })}
            placeholder="Section heading..."
            className="wp-block-elayne-mega-menu-section__heading"
          />
        </div>

        <div className="wp-block-elayne-mega-menu-section__content">
          <InnerBlocks
            allowedBlocks={[
              'elayne/mega-menu-item',
              'core/paragraph',
              'core/heading',
              'core/image',
              'core/list',
            ]}
          />
        </div>
      </div>
    </>
  );
}
```

#### Frontend Output (save.jsx)

```jsx
import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';
import classnames from 'classnames';

export default function Save({ attributes }) {
  const {
    heading,
    iconName,
    customSVG,
    isLinkWrapper,
    linkUrl,
    collapsibleMobile,
    headingLevel,
  } = attributes;

  const blockProps = useBlockProps.save({
    className: classnames('wp-block-elayne-mega-menu-section', {
      'is-collapsible-mobile': collapsibleMobile,
    }),
  });

  const HeadingTag = headingLevel;

  const headerContent = (
    <>
      {iconName && !customSVG && (
        <span className={`dashicons dashicons-${iconName}`} />
      )}
      {customSVG && (
        <span
          className="custom-icon"
          dangerouslySetInnerHTML={{ __html: customSVG }}
        />
      )}
      <RichText.Content
        tagName={HeadingTag}
        value={heading}
        className="wp-block-elayne-mega-menu-section__heading"
      />
    </>
  );

  const sectionContent = (
    <>
      <div className="wp-block-elayne-mega-menu-section__header">
        {isLinkWrapper && linkUrl ? (
          <a href={linkUrl}>{headerContent}</a>
        ) : (
          headerContent
        )}
      </div>
      <div className="wp-block-elayne-mega-menu-section__content">
        <InnerBlocks.Content />
      </div>
    </>
  );

  return <div {...blockProps}>{sectionContent}</div>;
}
```

#### Styles (style.scss)

```scss
.wp-block-elayne-mega-menu-section {
  margin-bottom: 24px;

  &__header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;

    .dashicons,
    .custom-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;

      svg {
        width: 100%;
        height: 100%;
      }
    }

    a {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      color: inherit;
      transition: color 0.2s ease;

      &:hover {
        color: #007cba;
      }
    }
  }

  &__heading {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.4;
  }

  &__content {
    padding-left: 0;
  }

  // Collapsible mobile behavior
  &.is-collapsible-mobile {
    @media (max-width: 768px) {
      &__header {
        cursor: pointer;
        position: relative;
        padding-right: 30px;

        &::after {
          content: '';
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 6px solid currentColor;
          transition: transform 0.2s ease;
        }

        &.is-expanded::after {
          transform: translateY(-50%) rotate(180deg);
        }
      }

      &__content {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;

        &.is-expanded {
          max-height: 1000px; // Large enough for content
        }
      }
    }
  }
}
```

**Estimated time:** 2-3 hours

---

### Block 3: Mega Menu Item ⭐ CRITICAL

**Purpose:** Individual menu item with icon, label, description, and badge

**File Structure:** Same as other blocks

#### Attributes

```json
{
  "attributes": {
    "label": {
      "type": "string",
      "default": "Menu Item"
    },
    "description": {
      "type": "string",
      "default": ""
    },
    "iconName": {
      "type": "string",
      "default": ""
    },
    "customSVG": {
      "type": "string",
      "default": ""
    },
    "linkUrl": {
      "type": "string",
      "default": ""
    },
    "linkTarget": {
      "type": "string",
      "default": "_self",
      "enum": ["_self", "_blank"]
    },
    "badgeText": {
      "type": "string",
      "default": ""
    },
    "badgeStyle": {
      "type": "string",
      "default": "default",
      "enum": ["default", "success", "warning", "danger", "info"]
    }
  }
}
```

#### Editor Component (edit.js)

```jsx
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, ToggleControl } from '@wordpress/components';
import IconPicker from '../../mega-menu/src/components/IconPicker';
import classnames from 'classnames';

export default function Edit({ attributes, setAttributes }) {
  const {
    label,
    description,
    iconName,
    customSVG,
    linkUrl,
    linkTarget,
    badgeText,
    badgeStyle,
  } = attributes;

  const blockProps = useBlockProps({
    className: 'wp-block-elayne-mega-menu-item',
  });

  return (
    <>
      <InspectorControls>
        <PanelBody title="Link Settings" initialOpen={true}>
          <TextControl
            label="Link URL"
            value={linkUrl}
            onChange={(val) => setAttributes({ linkUrl: val })}
            type="url"
            placeholder="https://example.com"
          />

          <ToggleControl
            label="Open in New Tab"
            checked={linkTarget === '_blank'}
            onChange={(val) =>
              setAttributes({ linkTarget: val ? '_blank' : '_self' })
            }
          />
        </PanelBody>

        <PanelBody title="Icon" initialOpen={false}>
          <IconPicker
            value={iconName}
            customSVG={customSVG}
            onChange={(icon, svg) => {
              setAttributes({ iconName: icon, customSVG: svg });
            }}
          />
        </PanelBody>

        <PanelBody title="Badge" initialOpen={false}>
          <TextControl
            label="Badge Text"
            value={badgeText}
            onChange={(val) => setAttributes({ badgeText: val })}
            placeholder="New, Sale, Hot, etc."
          />

          {badgeText && (
            <SelectControl
              label="Badge Style"
              value={badgeStyle}
              options={[
                { label: 'Default (Gray)', value: 'default' },
                { label: 'Success (Green)', value: 'success' },
                { label: 'Warning (Yellow)', value: 'warning' },
                { label: 'Danger (Red)', value: 'danger' },
                { label: 'Info (Blue)', value: 'info' },
              ]}
              onChange={(val) => setAttributes({ badgeStyle: val })}
            />
          )}
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <a
          className="wp-block-elayne-mega-menu-item__link"
          href={linkUrl || '#'}
          target={linkTarget}
        >
          {iconName && !customSVG && (
            <span className={`dashicons dashicons-${iconName}`} />
          )}
          {customSVG && (
            <span
              className="custom-icon"
              dangerouslySetInnerHTML={{ __html: customSVG }}
            />
          )}

          <div className="wp-block-elayne-mega-menu-item__content">
            <div className="wp-block-elayne-mega-menu-item__header">
              <RichText
                tagName="span"
                value={label}
                onChange={(val) => setAttributes({ label: val })}
                placeholder="Item label..."
                className="wp-block-elayne-mega-menu-item__label"
              />
              {badgeText && (
                <span
                  className={classnames(
                    'wp-block-elayne-mega-menu-item__badge',
                    `badge-${badgeStyle}`
                  )}
                >
                  {badgeText}
                </span>
              )}
            </div>

            {description && (
              <RichText
                tagName="span"
                value={description}
                onChange={(val) => setAttributes({ description: val })}
                placeholder="Optional description..."
                className="wp-block-elayne-mega-menu-item__description"
              />
            )}
          </div>
        </a>
      </div>
    </>
  );
}
```

#### Frontend Output (save.jsx)

```jsx
import { useBlockProps, RichText } from '@wordpress/block-editor';
import classnames from 'classnames';

export default function Save({ attributes }) {
  const {
    label,
    description,
    iconName,
    customSVG,
    linkUrl,
    linkTarget,
    badgeText,
    badgeStyle,
  } = attributes;

  const blockProps = useBlockProps.save({
    className: 'wp-block-elayne-mega-menu-item',
  });

  return (
    <div {...blockProps}>
      <a
        className="wp-block-elayne-mega-menu-item__link"
        href={linkUrl || '#'}
        target={linkTarget}
        rel={linkTarget === '_blank' ? 'noopener noreferrer' : undefined}
      >
        {iconName && !customSVG && (
          <span className={`dashicons dashicons-${iconName}`} />
        )}
        {customSVG && (
          <span
            className="custom-icon"
            dangerouslySetInnerHTML={{ __html: customSVG }}
          />
        )}

        <div className="wp-block-elayne-mega-menu-item__content">
          <div className="wp-block-elayne-mega-menu-item__header">
            <RichText.Content
              tagName="span"
              value={label}
              className="wp-block-elayne-mega-menu-item__label"
            />
            {badgeText && (
              <span
                className={classnames(
                  'wp-block-elayne-mega-menu-item__badge',
                  `badge-${badgeStyle}`
                )}
              >
                {badgeText}
              </span>
            )}
          </div>

          {description && (
            <RichText.Content
              tagName="span"
              value={description}
              className="wp-block-elayne-mega-menu-item__description"
            />
          )}
        </div>
      </a>
    </div>
  );
}
```

#### Styles (style.scss)

```scss
.wp-block-elayne-mega-menu-item {
  margin-bottom: 8px;

  &__link {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 8px 12px;
    text-decoration: none;
    color: inherit;
    border-radius: 4px;
    transition: all 0.2s ease;

    &:hover {
      background: #f5f5f5;
      color: #007cba;
    }

    .dashicons,
    .custom-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      margin-top: 2px;

      svg {
        width: 100%;
        height: 100%;
      }
    }
  }

  &__content {
    flex: 1;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  &__label {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
  }

  &__description {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    line-height: 1.4;
    color: #666;
  }

  &__badge {
    display: inline-block;
    padding: 2px 8px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-radius: 10px;
    line-height: 1.4;

    &.badge-default {
      background: #e0e0e0;
      color: #333;
    }

    &.badge-success {
      background: #d4edda;
      color: #155724;
    }

    &.badge-warning {
      background: #fff3cd;
      color: #856404;
    }

    &.badge-danger {
      background: #f8d7da;
      color: #721c24;
    }

    &.badge-info {
      background: #d1ecf1;
      color: #0c5460;
    }
  }
}
```

**Estimated time:** 2-3 hours

---

## Integration with Mega Menu

### Update Mega Menu InnerBlocks

**File:** `blocks/mega-menu/src/edit.js`

Add the new blocks to allowed blocks:

```jsx
<InnerBlocks
  allowedBlocks={[
    'elayne/mega-menu-column',
    'elayne/mega-menu-section',
    'elayne/mega-menu-item',
    'core/paragraph',
    'core/heading',
    'core/image',
    'core/list',
    'core/template-part',
  ]}
  template={[
    ['elayne/mega-menu-section', {
      heading: 'Products',
    }, [
      ['elayne/mega-menu-item', { label: 'All Products', linkUrl: '/products' }],
      ['elayne/mega-menu-item', { label: 'Featured', linkUrl: '/featured', badgeText: 'New', badgeStyle: 'info' }],
    ]],
  ]}
/>
```

**Estimated time:** 30 minutes

---

## Block Patterns

Create ready-to-use mega menu patterns:

### Pattern 1: Three Column Layout

```php
register_block_pattern(
  'elayne-blocks/mega-menu-three-column',
  array(
    'title' => __('Mega Menu - Three Column Layout', 'elayne-blocks'),
    'description' => __('Three column mega menu with sections and items', 'elayne-blocks'),
    'categories' => array('elayne-blocks'),
    'content' => '<!-- wp:elayne/mega-menu -->
      <!-- wp:elayne/mega-menu-column {"width":"1/3"} -->
        <!-- wp:elayne/mega-menu-section {"heading":"Products"} -->
          <!-- wp:elayne/mega-menu-item {"label":"All Products","linkUrl":"/products"} /-->
          <!-- wp:elayne/mega-menu-item {"label":"New Arrivals","linkUrl":"/new","badgeText":"New","badgeStyle":"info"} /-->
          <!-- wp:elayne/mega-menu-item {"label":"Best Sellers","linkUrl":"/bestsellers"} /-->
        <!-- /wp:elayne/mega-menu-section -->
      <!-- /wp:elayne/mega-menu-column -->

      <!-- wp:elayne/mega-menu-column {"width":"1/3"} -->
        <!-- wp:elayne/mega-menu-section {"heading":"Categories"} -->
          <!-- wp:elayne/mega-menu-item {"label":"Electronics","linkUrl":"/electronics"} /-->
          <!-- wp:elayne/mega-menu-item {"label":"Clothing","linkUrl":"/clothing"} /-->
          <!-- wp:elayne/mega-menu-item {"label":"Home & Garden","linkUrl":"/home"} /-->
        <!-- /wp:elayne/mega-menu-section -->
      <!-- /wp:elayne/mega-menu-column -->

      <!-- wp:elayne/mega-menu-column {"width":"1/3"} -->
        <!-- wp:elayne/mega-menu-section {"heading":"Support"} -->
          <!-- wp:elayne/mega-menu-item {"label":"Help Center","linkUrl":"/help"} /-->
          <!-- wp:elayne/mega-menu-item {"label":"Contact Us","linkUrl":"/contact"} /-->
          <!-- wp:elayne/mega-menu-item {"label":"FAQ","linkUrl":"/faq"} /-->
        <!-- /wp:elayne/mega-menu-section -->
      <!-- /wp:elayne/mega-menu-column -->
    <!-- /wp:elayne/mega-menu -->',
  )
);
```

### Pattern 2: Featured Product Layout

```php
register_block_pattern(
  'elayne-blocks/mega-menu-featured',
  array(
    'title' => __('Mega Menu - Featured Product', 'elayne-blocks'),
    'description' => __('Two column layout with featured product image', 'elayne-blocks'),
    'categories' => array('elayne-blocks'),
    'content' => '<!-- wp:elayne/mega-menu -->
      <!-- wp:elayne/mega-menu-column {"width":"2/3"} -->
        <!-- wp:elayne/mega-menu-section {"heading":"Shop by Category"} -->
          <!-- wp:elayne/mega-menu-item {"label":"Women\'s Fashion","iconName":"admin-users","linkUrl":"/womens"} /-->
          <!-- wp:elayne/mega-menu-item {"label":"Men\'s Fashion","iconName":"admin-users","linkUrl":"/mens"} /-->
          <!-- wp:elayne/mega-menu-item {"label":"Accessories","iconName":"star-filled","linkUrl":"/accessories","badgeText":"Sale","badgeStyle":"danger"} /-->
        <!-- /wp:elayne/mega-menu-section -->
      <!-- /wp:elayne/mega-menu-column -->

      <!-- wp:elayne/mega-menu-column {"width":"1/3","backgroundColor":"#f5f5f5"} -->
        <!-- wp:heading {"level":4} -->
        <h4>Featured This Week</h4>
        <!-- /wp:heading -->

        <!-- wp:image -->
        <figure class="wp-block-image"><img src="/path/to/featured-product.jpg" alt="Featured Product"/></figure>
        <!-- /wp:image -->

        <!-- wp:buttons -->
        <div class="wp-block-buttons">
          <!-- wp:button -->
          <div class="wp-block-button"><a class="wp-block-button__link">Shop Now</a></div>
          <!-- /wp:button -->
        </div>
        <!-- /wp:buttons -->
      <!-- /wp:elayne/mega-menu-column -->
    <!-- /wp:elayne/mega-menu -->',
  )
);
```

**Estimated time:** 1 hour

---

## Testing Checklist

### Editor Testing
- [ ] All three blocks appear in block inserter
- [ ] Blocks can be inserted into mega-menu
- [ ] Column width controls work (auto, 1/2, 1/3, etc.)
- [ ] Section heading editable inline
- [ ] Item label and description editable inline
- [ ] IconPicker works in section and item blocks
- [ ] Badge text and style controls work
- [ ] InnerBlocks work correctly in all blocks
- [ ] Block patterns insert correctly
- [ ] Parent-child relationships enforced

### Frontend Testing
- [ ] Columns render with correct widths
- [ ] Columns stack on mobile
- [ ] Section headings display correctly
- [ ] Section icons display (Dashicons and custom SVG)
- [ ] Section as link works when enabled
- [ ] Items display icon, label, description, badge
- [ ] Item links work correctly
- [ ] Item hover states work
- [ ] Badge styles render correctly
- [ ] Mobile collapsible sections work (if enabled)

### Layout Mode Testing
- [ ] Content blocks work in Dropdown mode
- [ ] Content blocks work in Overlay mode
- [ ] Content blocks work in Sidebar mode
- [ ] Content blocks work in Grid mode
- [ ] Grid columns setting respected with content blocks

### Accessibility Testing
- [ ] All links keyboard accessible
- [ ] Proper heading hierarchy (h2-h6)
- [ ] Focus states visible
- [ ] Badge text readable (color contrast)
- [ ] External links have rel="noopener noreferrer"
- [ ] Mobile collapsible sections keyboard accessible

### Cross-Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (desktop)
- [ ] Safari (iOS)
- [ ] Chrome (Android)

---

## Success Criteria

Phase 2D is complete when:

1. ✅ All three blocks created and functional
2. ✅ Block hierarchy and relationships working
3. ✅ Icon support implemented in section and item blocks
4. ✅ Badge system working with 5 styles
5. ✅ Blocks work in all 4 layout modes
6. ✅ Block patterns created and tested
7. ✅ Mobile responsive behavior working
8. ✅ Accessibility standards met
9. ✅ All tests passing
10. ✅ Build completes without errors
11. ✅ Documentation updated

---

## Files to Create

**New block directories:**
- `blocks/mega-menu-column/` (complete block structure)
- `blocks/mega-menu-section/` (complete block structure)
- `blocks/mega-menu-item/` (complete block structure)

**Each block needs:**
- `src/block.json`
- `src/index.js`
- `src/edit.js`
- `src/save.jsx`
- `src/style.scss`
- `src/editor.scss` (optional)
- `package.json`
- `build/` (auto-generated)

**Modified files:**
- `blocks/mega-menu/src/edit.js` (update allowedBlocks)
- `elayne-blocks.php` (register 2 new block patterns)

---

## Estimated Time

| Task | Time Estimate |
|------|--------------|
| Mega Menu Column Block | 2-3 hours |
| Mega Menu Section Block | 2-3 hours |
| Mega Menu Item Block | 2-3 hours |
| Mega Menu Integration | 30 minutes |
| Block Patterns | 1 hour |
| Testing & Debugging | 2-3 hours |
| **Total** | **10-14 hours** |

---

## Dependencies

**Required before starting:**
- ✅ Phase 2C complete (Layout Modes)
- ✅ IconPicker component available (Phase 2B)
- Node.js and npm installed
- wp-scripts build tooling

**Shared components:**
- IconPicker (reuse from mega-menu block)

---

## Next Phase

After Phase 2D completion:
- **Phase 2E:** Advanced Styling Controls
- **Phase 2F:** Mobile-First Enhancements

---

## Notes & Considerations

### Design Decisions

1. **Optional Blocks:** Content blocks are optional - users can still use core blocks and template parts
2. **Flexible Hierarchy:** Blocks can be nested flexibly (section in column, or section directly in menu)
3. **Badge System:** Pre-defined badge styles for consistency (users can add custom styles via CSS)
4. **Mobile Collapsible:** Section collapsibility is opt-in (default: always expanded)
5. **Icon Reuse:** Leverages existing IconPicker component from Phase 2B

### Performance Considerations

1. **No JavaScript:** Content blocks are static HTML (no frontend JS needed)
2. **CSS-only animations:** Collapsible sections use CSS transitions
3. **Minimal markup:** Clean, semantic HTML structure
4. **Mobile-first CSS:** Base styles for mobile, enhance for desktop

### Accessibility Priorities

1. **Semantic HTML:** Proper heading hierarchy, landmark roles
2. **Keyboard navigation:** All interactive elements focusable
3. **Color contrast:** Badge styles meet WCAG AA standards
4. **External links:** Proper rel attributes for security
5. **Focus management:** Visible focus states on all links

---

**Document Version:** 1.0
**Created:** 2026-01-16
**Status:** Ready to Begin 🎯
