/**
 * Mega Menu Item Block
 * Individual menu item with icon, description, and badge support
 */

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import Save from './save';
import './style.scss';
import './editor.scss';

registerBlockType(metadata.name, {
	...metadata,
	edit: Edit,
	save: Save,
});
